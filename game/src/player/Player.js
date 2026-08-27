/**
 * Player — a cute astronaut with momentum-based movement, coyote-time
 * jumps, procedural walk/idle/air animation (the GLB is a static mesh,
 * so all motion is code-driven), landing squash and a soft contact
 * shadow that grounds it visually. Physics is still a sphere.
 */
import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SETTINGS } from '../config/settings.js';
import { clamp, damp, dampAngle } from '../utils/math.js';
import { PlayerStats } from '../gameplay/Stats.js';

const P = SETTINGS.player;
const J = SETTINGS.jetpack;

const ASTRONAUT_URL = new URL('../../assets/cute_astronaut.glb', import.meta.url).href;
const MODEL_HEIGHT = P.radius * 2.3; // a touch taller than the collider sphere

const _dir = new THREE.Vector3();
const _down = new THREE.Vector3(0, -1, 0);
const _forward3D = new THREE.Vector3();
const _right3D = new THREE.Vector3();
const _leftNozzle = new THREE.Vector3();
const _rightNozzle = new THREE.Vector3();
const _exhaustVel = new THREE.Vector3();

// Jetpack Flame Colors: Warm Orange for Normal Flight, Electric Blue for After Boost
const _normalFlameColor = new THREE.Color(SETTINGS.jetpack.normalColor ?? 0xff6600);
const _boostFlameColor = new THREE.Color(SETTINGS.jetpack.boostColor ?? 0x00d4ff);

export class Player {
  /**
   * @param {object} deps { scene, physics, input, materials, thrusters }
   * Events (assign externally): onLand(speed), onJump(), onFall(), onJetpack(active, power)
   */
  constructor({ scene, physics, input, materials, thrusters }) {
    this.physics = physics;
    this.input = input;
    this.thrusters = thrusters ?? null;
    this.stats = new PlayerStats();

    this.body = {
      position: new THREE.Vector3(0, 3, 0),
      velocity: new THREE.Vector3(),
      radius: P.radius,
      grounded: false,
      groundCollider: null,
      groundNormal: null,
    };

    this.spawn = new THREE.Vector3(0, 3, 0);
    this.cameraYaw = 0;      // fed by CameraRig each frame
    this.cameraPitch = 0.42; // fed by CameraRig each frame
    this.frozen = true;      // no control during menus/cinematics
    this.paused = false;     // full physics freeze (pause menu)
    this.sprintAllowed = true; // gated by the energy system
    this.onLand = null;
    this.onJump = null;
    this.onFall = null;
    this.onJetpack = null;

    // Jetpack & Speed of Light Hyperdrive state
    this.jetpackActive = false;
    this.jetpackPower = 0;   // 0 to 1 smoothed
    this.warpIntensity = 0;  // 0 to 1 speed-of-light intensity
    this.isLightSpeed = false;

    this._wasGrounded = false;
    this._coyote = 0;
    this._jumpBuffer = 0;
    this._fallSpeed = 0;

    // --- visuals -----------------------------------------------------
    // mesh: anchor group at the physics position (Game.js tweens its scale)
    // visual: child group carrying facing yaw + walk bob/lean/waddle
    this.mesh = new THREE.Group();
    scene.add(this.mesh);
    this.visual = new THREE.Group();
    this.visual.rotation.order = 'YXZ'; // yaw first, then lean/waddle in the facing frame
    this.mesh.add(this.visual);

    // Dynamic thruster point light: warm orange for normal, electric blue for boost
    this.thrusterLight = new THREE.PointLight(0xff6600, 0, 12, 2);
    this.thrusterLight.position.set(0, 0.2, -0.4);
    this.mesh.add(this.thrusterLight);
    this._facing = 0;
    this._prevFacing = 0;
    this._walkPhase = 0;
    this._time = 0;
    this._bankRoll = 0;
    this._pitchAngle = 0;
    
    // Rigged limb & bone references
    this.bones = {
      head: null,
      spine: null,
      torso: null,
      leftArm: null,
      rightArm: null,
      leftHand: null,
      rightHand: null,
      leftLeg: null,
      rightLeg: null,
      leftFoot: null,
      rightFoot: null,
      backpack: null,
    };
    this.mixer = null;

    // chrome sphere stands in until the astronaut finishes loading
    this._placeholder = new THREE.Mesh(
      new THREE.SphereGeometry(P.radius, 48, 32),
      materials.chrome(),
    );
    this._placeholder.castShadow = true;
    this.visual.add(this._placeholder);

    new GLTFLoader().load(ASTRONAUT_URL, (gltf) => this._setupModel(gltf.scene, gltf.animations));

    this.shadowBlob = new THREE.Mesh(
      new THREE.PlaneGeometry(P.radius * 4.4, P.radius * 4.4),
      materials.contactShadow(),
    );
    this.shadowBlob.rotation.x = -Math.PI / 2;
    this.shadowBlob.renderOrder = 1;
    scene.add(this.shadowBlob);

    this._raycaster = new THREE.Raycaster();
    this._raycaster.far = 40;

    input.on('jump', () => { this._jumpBuffer = P.jumpBuffer; });
  }

  get position() { return this.body.position; }
  get velocity() { return this.body.velocity; }

  setSpawn(v) {
    if (Array.isArray(v)) {
      this.spawn.set(v[0] ?? 0, v[1] ?? 3, v[2] ?? 0);
    } else if (v && typeof v.x === 'number') {
      this.spawn.copy(v);
    }
  }

  /** Normalize the loaded astronaut (Y-up, facing +Z) and discover all skeletal nodes. */
  _setupModel(model, animations = []) {
    const wrapper = new THREE.Group();
    wrapper.add(model);
    wrapper.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(wrapper);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = MODEL_HEIGHT / size.y;
    wrapper.scale.setScalar(s);
    wrapper.position.set(-center.x * s, -box.min.y * s - P.radius, -center.z * s);

    // Setup animation mixer if embedded clips exist
    if (animations && animations.length > 0) {
      this.mixer = new THREE.AnimationMixer(model);
      const idleClip = animations.find((a) => a.name.toLowerCase().includes('idle')) || animations[0];
      if (idleClip) {
        this.mixer.clipAction(idleClip).play();
      }
    }

    // Traverse and identify bones & limb nodes
    model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = false;
      }
      
      const name = o.name.toLowerCase();
      if (name.includes('head') || name.includes('helmet')) {
        this.bones.head = o;
      } else if (name.includes('spine') || name.includes('chest') || name.includes('torso') || name.includes('body')) {
        if (!this.bones.spine) this.bones.spine = o;
      } else if (name.includes('arm') || name.includes('shoulder')) {
        if (name.includes('left') || name.includes('.l') || name.includes('_l')) {
          this.bones.leftArm = o;
        } else if (name.includes('right') || name.includes('.r') || name.includes('_r')) {
          this.bones.rightArm = o;
        }
      } else if (name.includes('hand') || name.includes('wrist')) {
        if (name.includes('left') || name.includes('.l')) this.bones.leftHand = o;
        else if (name.includes('right') || name.includes('.r')) this.bones.rightHand = o;
      } else if (name.includes('leg') || name.includes('thigh') || name.includes('calf')) {
        if (name.includes('left') || name.includes('.l') || name.includes('_l')) {
          this.bones.leftLeg = o;
        } else if (name.includes('right') || name.includes('.r') || name.includes('_r')) {
          this.bones.rightLeg = o;
        }
      } else if (name.includes('foot') || name.includes('boot')) {
        if (name.includes('left') || name.includes('.l')) this.bones.leftFoot = o;
        else if (name.includes('right') || name.includes('.r')) this.bones.rightFoot = o;
      } else if (name.includes('backpack') || name.includes('tank') || name.includes('jetpack')) {
        this.bones.backpack = o;
      }
    });

    this.visual.remove(this._placeholder);
    this._placeholder?.geometry?.dispose();
    this._placeholder = null;
    this.visual.add(wrapper);
  }

  respawn() {
    this.stats.replenishAll();
    this.body.position.copy(this.spawn);
    this.body.velocity.set(0, 0, 0);
    this.body.grounded = false;
    this.body.groundCollider = null;
    this.jetpackActive = false;
    this.jetpackPower = 0;
    this.warpIntensity = 0;
    this.isLightSpeed = false;
    this.frozen = false;
    this.paused = false;
    this.mesh.position.copy(this.spawn);
    this.mesh.scale.set(1, 1, 1);
    this.visual.rotation.set(0, 0, 0);
  }

  /** @param {THREE.Object3D} solids world group used for the shadow raycast */
  update(dt, solids) {
    const b = this.body;
    this._time += dt;
    if (this.mixer) this.mixer.update(dt);

    // ---------------- steering & flight -------------------------------
    if (!this.frozen) {
      const move = this.input.moveVector();
      const sprint = this.input.sprinting && this.sprintAllowed && !this.stats.isJetpackOffline;
      const isAscending = this.input.jumpHeld;
      const isDescending = this.input.descendHeld;
      const isBraking = this.input.brakeHeld;
      const isBackBraking = move.z < 0; // S key or Down Arrow
      const shouldBrake = isBraking || isBackBraking;
      
      // Open-World 3D Zero-G Flight vs Grounded EVA Walking
      const isThrusting = isAscending || isDescending || (move.z !== 0 || move.x !== 0);
      const isFlying = !b.grounded || isAscending || isDescending;

      this.stats.update(dt, isFlying ? isThrusting : false, sprint);

      if (isFlying) {
        this.jetpackActive = isThrusting && !this.stats.isJetpackOffline;
        this.jetpackPower = this.jetpackActive
          ? Math.min(1, this.jetpackPower + dt * 5)
          : Math.max(0, this.jetpackPower - dt * 3);

        if (sprint && this.jetpackActive) {
          this.warpIntensity = Math.min(1, this.warpIntensity + dt * 2.5);
          this.isLightSpeed = this.warpIntensity > 0.35;
        } else {
          this.warpIntensity = 0;
          this.isLightSpeed = false;
        }

        const thrustScale = this.stats.isJetpackOffline ? 0.22 : 1.0;

        // Vertical lift (Ascend [Space] / Descend [X / Ctrl]) in zero-g
        if (isAscending && !this.stats.isJetpackOffline) {
          b.velocity.y += J.upThrust * thrustScale * dt;
          b.grounded = false;
          b.groundCollider = null;
        } else if (isDescending && !this.stats.isJetpackOffline) {
          b.velocity.y -= J.upThrust * thrustScale * dt;
        } else if (!b.grounded) {
          // Zero-G ambient gentle glide in deep space
          b.velocity.y *= Math.max(0, 1 - 0.7 * dt);
        }

        // Active Retro-thruster Emergency Braking (B key)
        if (isBraking) {
          b.velocity.multiplyScalar(Math.max(0, 1 - 6.0 * dt));
        }

        // Full 3D camera-oriented flight direction (pitch + yaw)
        const sinY = Math.sin(this.cameraYaw);
        const cosY = Math.cos(this.cameraYaw);
        const sinP = Math.sin(this.cameraPitch);
        const cosP = Math.cos(this.cameraPitch);

        // 3D forward and right unit vectors (looking into scene)
        _forward3D.set(-sinY * cosP, -sinP, -cosY * cosP).normalize();
        _right3D.set(cosY, 0, -sinY).normalize();

        _dir.set(0, 0, 0);
        // Forward/Strafe directional steering
        if (move.z > 0 || move.x !== 0) {
          _dir.addScaledVector(_forward3D, move.z).addScaledVector(_right3D, move.x);
          if (_dir.lengthSq() > 0.001) _dir.normalize();
        }

        if (this.jetpackActive && _dir.lengthSq() > 0.001) {
          const thrustMult = sprint ? (1.6 + this.warpIntensity * 1.2) : 1.0;
          b.velocity.addScaledVector(_dir, J.forwardThrust * thrustMult * thrustScale * dt);
          if (isAscending) b.grounded = false;
        }

        // Speed of light warp speed limits
        const maxFlight = sprint
          ? J.maxBoostSpeed + this.warpIntensity * (J.speedOfLight - J.maxBoostSpeed)
          : J.maxFlightSpeed;
        const curSpeed = b.velocity.length();
        if (curSpeed > maxFlight) {
          b.velocity.multiplyScalar(maxFlight / curSpeed);
        }

        // Smooth zero-g inertia drift: gentle dampening so drifting is pleasant and natural
        const dragF = Math.max(0, 1 - J.flightDrag * dt * (sprint ? 0.08 : (isThrusting ? 0.25 : 0.45)));
        b.velocity.x *= dragF;
        b.velocity.z *= dragF;

        // Emit Dual Jetpack Thruster Exhaust Particles
        if (this.thrusters && this.jetpackActive && isThrusting) {
          const sinF = Math.sin(this._facing);
          const cosF = Math.cos(this._facing);

          // Backpack nozzles relative to astronaut orientation
          const backDist = 0.28;
          const nozzleSpread = 0.16;
          const nozzleHeight = 0.32;

          const cx = b.position.x - sinF * backDist;
          const cy = b.position.y + nozzleHeight;
          const cz = b.position.z - cosF * backDist;

          _leftNozzle.set(cx + cosF * nozzleSpread, cy, cz - sinF * nozzleSpread);
          _rightNozzle.set(cx - cosF * nozzleSpread, cy, cz + sinF * nozzleSpread);

          const plumeSpeed = sprint ? (24 + this.warpIntensity * 14) : 15;
          _exhaustVel.set(
            -sinF * plumeSpeed - b.velocity.x * 0.4,
            -plumeSpeed * 0.85 - b.velocity.y * 0.4,
            -cosF * plumeSpeed - b.velocity.z * 0.4,
          );

          const activeColor = sprint ? _boostFlameColor : _normalFlameColor;
          const particleCount = sprint ? 4 : 3;
          const particleSize = sprint ? (2.6 + this.warpIntensity * 1.0) : 2.0;
          const trailLife = sprint ? 0.95 : 0.75;

          this.thrusters.emit(_leftNozzle, _exhaustVel, activeColor, particleCount, particleSize, trailLife);
          this.thrusters.emit(_rightNozzle, _exhaustVel, activeColor, particleCount, particleSize, trailLife);
        }

        // Dynamic Thruster light flare (warm orange vs electric blue)
        if (this.jetpackActive && isThrusting) {
          const targetLightColor = sprint ? _boostFlameColor : _normalFlameColor;
          this.thrusterLight.color.lerp(targetLightColor, 0.2);
          this.thrusterLight.intensity = damp(
            this.thrusterLight.intensity,
            sprint ? (3.5 + this.warpIntensity * 2.5 + Math.random() * 0.5) : (2.2 + Math.random() * 0.4),
            18,
            dt,
          );
        } else {
          this.thrusterLight.intensity = damp(this.thrusterLight.intensity, 0, 14, dt);
        }

        this.onJetpack?.(this.jetpackActive, sprint ? (1.5 + this.warpIntensity * 0.8) : 1.0);
      } else {
        this.jetpackActive = false;
        this.jetpackPower = Math.max(0, this.jetpackPower - dt * 3);
        this.warpIntensity = Math.max(0, this.warpIntensity - dt * 2.5);
        this.isLightSpeed = false;
        this.thrusterLight.intensity = damp(this.thrusterLight.intensity, 0, 12, dt);
        this.onJetpack?.(false, 0);

        // Ground EVA Walking Movement
        const maxSpeed = sprint ? P.sprintSpeed : P.maxSpeed;

        const sin = Math.sin(this.cameraYaw);
        const cos = Math.cos(this.cameraYaw);
        _dir.set(move.x * cos - move.z * sin, 0, -move.z * cos - move.x * sin);

        b.velocity.addScaledVector(_dir, P.accel * dt);

        // clamp horizontal speed
        const vh = Math.hypot(b.velocity.x, b.velocity.z);
        if (vh > maxSpeed) {
          const k = maxSpeed / vh;
          b.velocity.x *= k;
          b.velocity.z *= k;
        }

        // ground friction
        const drag = _dir.lengthSq() > 0 ? 0.8 : P.groundFriction;
        const f = Math.max(0, 1 - drag * dt);
        b.velocity.x *= f;
        b.velocity.z *= f;
        if (b.velocity.y < 0) b.velocity.y = 0;

        // ---------------- jumping (buffer + coyote) --------------------
        this._coyote = b.grounded ? P.coyoteTime : Math.max(0, this._coyote - dt);
        this._jumpBuffer = Math.max(0, this._jumpBuffer - dt);

        if (this._jumpBuffer > 0 && this._coyote > 0) {
          this._jumpBuffer = 0;
          this._coyote = 0;
          b.velocity.y = P.jumpVelocity;
          b.grounded = false;
          b.groundCollider = null;
          this.onJump?.();
        }
      }
    } else if (b.grounded) {
      // menus / cinematics: bleed off momentum so the astronaut settles
      const f = Math.max(0, 1 - P.groundFriction * dt);
      b.velocity.x *= f;
      b.velocity.z *= f;
      this.thrusterLight.intensity = 0;
      this.onJetpack?.(false, 0);
    }

    // ---------------- physics ----------------------------------------
    if (!b.grounded) this._fallSpeed = -b.velocity.y;
    const fell = this.physics.step(b, this.paused ? 0 : dt);

    // landing feedback
    if (b.grounded && !this._wasGrounded && this._fallSpeed > SETTINGS.fx.landDustMin) {
      this.onLand?.(this._fallSpeed);
    }
    this._wasGrounded = b.grounded;

    // ---------------- visuals ----------------------------------------
    this.mesh.position.copy(b.position);
    this._animate(dt);

    this._updateShadow(solids);
    if (fell && !this.frozen) this.onFall?.();
  }

  /** AAA Procedural character animation: facing, walk cycle, aerodynamic EVA flight posture, and limb kinematics. */
  _animate(dt) {
    const b = this.body;
    const speed = Math.hypot(b.velocity.x, b.velocity.z);
    const totalSpeed = b.velocity.length();
    const run = clamp(speed / P.maxSpeed, 0, 1.4);
    const move = this.input.moveVector();

    // Store previous facing for dynamic turn rate / bank calculation
    this._prevFacing = this._facing;

    // Turn toward movement direction or camera heading
    if (speed > 0.35) {
      this._facing = dampAngle(this._facing, Math.atan2(b.velocity.x, b.velocity.z), 12, dt);
    } else if (this.jetpackActive) {
      this._facing = dampAngle(this._facing, this.cameraYaw + Math.PI, 8, dt);
    }
    this.visual.rotation.y = this._facing;

    let bobY = 0;
    let targetPitch = 0;
    let targetRoll = 0;

    if (this.jetpackActive || (!b.grounded && totalSpeed > 10)) {
      // 3D Zero-G Flight Kinematics:
      // 1. Aerodynamic pitch aligned with 3D flight velocity
      const isSprinting = this.input.sprinting && this.sprintAllowed;
      const fwdPitch = clamp(-b.velocity.y * 0.04 - (speed / J.maxFlightSpeed) * 0.75, -1.05, 0.85);
      targetPitch = isSprinting ? Math.min(fwdPitch, -0.65) : fwdPitch;

      // 2. Realistic banking into turns and strafes
      const turnDelta = (this._facing - this._prevFacing) / Math.max(0.001, dt);
      const strafeRoll = -move.x * 0.28;
      targetRoll = clamp(-turnDelta * 0.35 + strafeRoll, -0.6, 0.6);

      // 3. Subtle micro-thruster vibration
      bobY = Math.sin(this._time * 12.0) * (isSprinting ? 0.022 : 0.012);
      this._walkPhase = 0;
    } else if (b.grounded && speed > 0.35) {
      // Ground Locomotion: Natural weighted stride, hip bob, pelvic roll & forward lean
      this._walkPhase += dt * (5.5 + speed * 2.2);
      bobY = Math.abs(Math.sin(this._walkPhase)) * 0.058 * run;
      targetRoll = Math.sin(this._walkPhase) * 0.082 * run;
      targetPitch = 0.14 * run;
    } else if (!b.grounded) {
      // Free fall / jump air posture: dynamic hang & landing preparation
      targetPitch = clamp(-b.velocity.y * 0.025, -0.32, 0.38);
      this._walkPhase = 0;
    } else {
      // Idle Breathing heave
      bobY = Math.sin(this._time * 2.4) * 0.015;
      targetPitch = Math.sin(this._time * 1.8) * 0.025;
      this._walkPhase = 0;
    }

    const k = damp(11, dt);
    this.visual.position.y += (bobY - this.visual.position.y) * k;
    this._pitchAngle += (targetPitch - this._pitchAngle) * k;
    this._bankRoll += (targetRoll - this._bankRoll) * k;
    this.visual.rotation.x = this._pitchAngle;
    this.visual.rotation.z = this._bankRoll;
    
    // Animate procedural skeleton & limbs
    this._animateRig(run, dt);
  }

  /** Advanced Procedural Skeletal Rigging: legs, arms, spine, and head kinematics. */
  _animateRig(run, dt) {
    const { head, spine, leftArm, rightArm, leftLeg, rightLeg } = this.bones;
    const isFlying = this.jetpackActive || (!this.body.grounded && this.body.velocity.length() > 8);
    const sprint = this.input.sprinting && this.sprintAllowed;

    if (isFlying) {
      // Zero-G EVA Spaceflight Limb Posture:
      // Legs trail behind with microgravity swaying
      const legTrailAngle = -0.42 + Math.sin(this._time * 2.4) * 0.06;
      const legSpread = sprint ? 0.08 : 0.16;

      if (leftLeg) {
        leftLeg.rotation.x = damp(leftLeg.rotation.x, legTrailAngle, 8, dt);
        leftLeg.rotation.z = damp(leftLeg.rotation.z, legSpread, 8, dt);
      }
      if (rightLeg) {
        rightLeg.rotation.x = damp(rightLeg.rotation.x, legTrailAngle + 0.05, 8, dt);
        rightLeg.rotation.z = damp(rightLeg.rotation.z, -legSpread, 8, dt);
      }

      // Arms extend for zero-g balance / flight control
      const armExtend = sprint ? -0.25 : -0.65;
      if (leftArm) {
        leftArm.rotation.x = damp(leftArm.rotation.x, armExtend + Math.sin(this._time * 2.8) * 0.08, 8, dt);
        leftArm.rotation.y = damp(leftArm.rotation.y, 0.32, 8, dt);
      }
      if (rightArm) {
        rightArm.rotation.x = damp(rightArm.rotation.x, armExtend + Math.sin(this._time * 2.8 + 0.5) * 0.08, 8, dt);
        rightArm.rotation.y = damp(rightArm.rotation.y, -0.32, 8, dt);
      }

      // Torso & head streamline
      if (spine) spine.rotation.y = damp(spine.rotation.y, 0, 10, dt);
      if (head) head.rotation.x = damp(head.rotation.x, -0.15, 8, dt);
      return;
    }

    if (this.body.grounded && run > 0.05) {
      // Ground Locomotion: Natural double-pendulum stride with opposing arm counter-balance
      const legSwing = Math.sin(this._walkPhase) * 0.52 * run;
      const armSwing = Math.sin(this._walkPhase) * 0.48 * run;

      // Legs alternate forward/backward stride
      if (leftLeg) leftLeg.rotation.x = legSwing;
      if (rightLeg) rightLeg.rotation.x = -legSwing;

      // Arms counter-swing opposite to legs
      if (leftArm) {
        leftArm.rotation.x = -armSwing;
        leftArm.rotation.z = 0.15 * run;
      }
      if (rightArm) {
        rightArm.rotation.x = armSwing;
        rightArm.rotation.z = -0.15 * run;
      }

      // Spine counter-twists with stride
      if (spine) {
        spine.rotation.y = Math.sin(this._walkPhase) * 0.10 * run;
      }
      if (head) {
        head.rotation.y = -Math.sin(this._walkPhase) * 0.06 * run;
      }
    } else {
      // Idle Pose: Relaxed standing with breathing sway
      const idleBreathe = Math.sin(this._time * 2.4) * 0.04;
      if (leftLeg) {
        leftLeg.rotation.x = damp(leftLeg.rotation.x, 0, 10, dt);
        leftLeg.rotation.z = damp(leftLeg.rotation.z, 0, 10, dt);
      }
      if (rightLeg) {
        rightLeg.rotation.x = damp(rightLeg.rotation.x, 0, 10, dt);
        rightLeg.rotation.z = damp(rightLeg.rotation.z, 0, 10, dt);
      }
      if (leftArm) {
        leftArm.rotation.x = damp(leftArm.rotation.x, idleBreathe, 8, dt);
        leftArm.rotation.z = damp(leftArm.rotation.z, 0.08, 8, dt);
      }
      if (rightArm) {
        rightArm.rotation.x = damp(rightArm.rotation.x, idleBreathe, 8, dt);
        rightArm.rotation.z = damp(rightArm.rotation.z, -0.08, 8, dt);
      }
      if (spine) spine.rotation.y = damp(spine.rotation.y, 0, 10, dt);
      if (head) head.rotation.y = damp(head.rotation.y, 0, 10, dt);
    }
  }

  /** Project the contact-shadow blob onto whatever is below. */
  _updateShadow(solids) {
    this._raycaster.set(this.body.position, _down);
    const hits = solids ? this._raycaster.intersectObject(solids, true) : [];
    if (hits.length) {
      const h = hits[0];
      this.shadowBlob.visible = true;
      this.shadowBlob.position.set(this.body.position.x, h.point.y + 0.02, this.body.position.z);
      const dist = h.distance - P.radius;
      const k = Math.max(0, 1 - dist / 7);
      this.shadowBlob.material.uniforms.uStrength.value = 0.55 * k;
      const s = 1 + dist * 0.12;
      this.shadowBlob.scale.set(s, s, 1);
    } else {
      this.shadowBlob.visible = false;
    }
  }
}
