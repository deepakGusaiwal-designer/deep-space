/**
 * Universe — Master Deep-Space Open World Orchestrator
 *
 * Implements:
 *  1. Solid Celestial Bodies: Gas Giants, Volcanic Planets, Ocean Worlds, Moons
 *  2. Atmospheric Boundaries: Atmospheric entry, aerodynamic drag, planetary gravity
 *  3. Orbital Space Stations: Modular docking bays, habitat rings, solar arrays
 *  4. Wrecked Starships & Physical Space Debris
 *  5. Navigational Satellites & Quantum Arrays
 *  6. Sparse Vast Asteroid Belts & Planetary Rings
 *  7. Gravitational Black Hole Singularities
 *  8. Molecular Nebula Volumes & Cosmic Relics
 *  9. Hyperspace Stargates & Wormholes
 */
import * as THREE from 'three';
import {
  COLLISION_LAYERS,
  BoxCollider,
  SphereCollider,
  AtmosphereZone,
  GravityWell,
  InteractionTrigger,
} from '../core/Physics.js';

export class Universe {
  constructor({ scene, physics, materials, bursts, audio }) {
    this.scene = scene;
    this.physics = physics;
    this.materials = materials;
    this.bursts = bursts;
    this.audio = audio;

    this.group = new THREE.Group();
    scene.add(this.group);

    // Tracked Entities
    this.planets = [];
    this.stations = [];
    this.wrecks = [];
    this.asteroids = [];
    this.satellites = [];
    this.relics = [];
    this.resources = [];
    this.stargates = [];
    this.wormholes = [];
    this.platforms = [];
    this.spaceships = [];
    this.dynamicRotators = [];

    this._initSharedMaterials();
    this._buildCosmicUniverse();
  }

  _initSharedMaterials() {
    this.asteroidMat = this.materials?.basalt ? this.materials.basalt() : new THREE.MeshStandardMaterial({
      color: 0x242a32,
      roughness: 0.9,
      metalness: 0.1,
    });

    this.metalMat = new THREE.MeshStandardMaterial({
      color: 0x3a424e,
      metalness: 0.88,
      roughness: 0.22,
    });

    this.hullMat = new THREE.MeshStandardMaterial({
      color: 0x1a2028,
      metalness: 0.92,
      roughness: 0.35,
    });

    this.goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x443000,
      emissiveIntensity: 0.4,
    });

    this.relicMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00a0cc,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9,
    });

    this.engineGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
    });

    this.beaconLightMat = new THREE.MeshBasicMaterial({
      color: 0xff3344,
    });

    // --- Glowing Platform & Realistic Starship Materials ---
    this.neonCyanMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
    });

    this.neonBlueMat = new THREE.MeshBasicMaterial({
      color: 0x0088ff,
    });

    this.neonAmberMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
    });

    this.neonMagentaMat = new THREE.MeshBasicMaterial({
      color: 0xff00cc,
    });

    this.shuttleWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xededed,
      roughness: 0.32,
      metalness: 0.18,
    });

    this.shuttleBlackTilesMat = new THREE.MeshStandardMaterial({
      color: 0x12151a,
      roughness: 0.85,
      metalness: 0.15,
    });

    this.cockpitGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0a2233,
      roughness: 0.08,
      metalness: 0.95,
      emissive: 0x002c44,
      emissiveIntensity: 0.6,
    });

    this.fighterHullMat = new THREE.MeshStandardMaterial({
      color: 0x222832,
      metalness: 0.92,
      roughness: 0.25,
    });
  }

  _buildCosmicUniverse() {
    this._buildPlanetarySystem();
    this._buildGlowingPlatforms();
    this._buildSpaceShuttlesAndShips();
    this._buildSpaceStations();
    this._buildWreckedStarships();
    this._buildSatellites();
    this._buildAsteroidBelts();
    this._buildSingularity();
    this._buildStargatesAndWormholes();
    this._buildCosmicRelics();
  }

  // ====================================================================
  // 1. CELESTIAL PLANETARY SYSTEM & ATMOSPHERES
  // ====================================================================
  _buildPlanetarySystem() {
    // ------------------------------------------------------------------
    // Planet A: AURELIA (Giant Ringed Gas Giant)
    // ------------------------------------------------------------------
    const aureliaPos = new THREE.Vector3(950, 340, -1250);
    const aureliaRadius = 220;
    const aureliaGroup = new THREE.Group();
    aureliaGroup.position.copy(aureliaPos);
    this.group.add(aureliaGroup);

    const aureliaGeo = new THREE.SphereGeometry(aureliaRadius, 64, 48);
    const aureliaMat = new THREE.MeshStandardMaterial({
      color: 0x9b8874,
      roughness: 0.85,
      metalness: 0.05,
    });
    const aureliaMesh = new THREE.Mesh(aureliaGeo, aureliaMat);
    aureliaGroup.add(aureliaMesh);

    // Giant Concentric Asteroid Rings
    const ringGeo = new THREE.RingGeometry(260, 480, 128);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xb5a18a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      roughness: 0.92,
    });
    const rings = new THREE.Mesh(ringGeo, ringMat);
    rings.rotation.x = Math.PI * 0.42;
    rings.rotation.y = 0.28;
    aureliaGroup.add(rings);

    // Atmospheric Halo
    const aureliaHalo = new THREE.Mesh(
      new THREE.SphereGeometry(aureliaRadius + 8, 48, 32),
      new THREE.MeshBasicMaterial({
        color: 0xd4c2a5,
        transparent: true,
        opacity: 0.20,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    );
    aureliaGroup.add(aureliaHalo);

    // Colliders & Atmosphere
    const aureliaCol = new SphereCollider(aureliaRadius, {
      name: 'Planet Aurelia (Gas Giant)',
      position: aureliaPos,
    });
    this.physics.addCollider(aureliaCol);

    const aureliaAtmo = new AtmosphereZone(aureliaPos, aureliaRadius, aureliaRadius + 75, {
      name: 'Aurelia Atmosphere',
      gravityStrength: 18.0,
      color: 0xd4c2a5,
    });
    this.physics.addAtmosphere(aureliaAtmo);

    this.planets.push({
      mesh: aureliaMesh,
      rings,
      rotSpeed: 0.005,
      ringRotSpeed: 0.002,
      name: 'Aurelia',
      position: aureliaPos,
      radius: aureliaRadius,
    });

    // ------------------------------------------------------------------
    // Planet B: TARTARUS (Volcanic Magma Exoplanet)
    // ------------------------------------------------------------------
    const tartarusPos = new THREE.Vector3(-1050, -260, -880);
    const tartarusRadius = 130;
    const tartarusGroup = new THREE.Group();
    tartarusGroup.position.copy(tartarusPos);
    this.group.add(tartarusGroup);

    const tartarusMesh = new THREE.Mesh(
      new THREE.SphereGeometry(tartarusRadius, 48, 36),
      new THREE.MeshStandardMaterial({
        color: 0x1a1210,
        emissive: 0x902808,
        emissiveIntensity: 0.6,
        roughness: 0.95,
        metalness: 0.08,
      }),
    );
    tartarusGroup.add(tartarusMesh);

    const tartarusHalo = new THREE.Mesh(
      new THREE.SphereGeometry(tartarusRadius + 6, 36, 24),
      new THREE.MeshBasicMaterial({
        color: 0xff3b10,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    );
    tartarusGroup.add(tartarusHalo);

    const tartarusCol = new SphereCollider(tartarusRadius, {
      name: 'Planet Tartarus (Volcanic)',
      position: tartarusPos,
    });
    this.physics.addCollider(tartarusCol);

    const tartarusAtmo = new AtmosphereZone(tartarusPos, tartarusRadius, tartarusRadius + 50, {
      name: 'Tartarus Thermal Atmosphere',
      gravityStrength: 14.0,
      color: 0xff3b10,
    });
    this.physics.addAtmosphere(tartarusAtmo);

    this.planets.push({
      mesh: tartarusMesh,
      rotSpeed: 0.009,
      name: 'Tartarus',
      position: tartarusPos,
      radius: tartarusRadius,
    });

    // ------------------------------------------------------------------
    // Planet C: GLACIES (Ice & Ocean Giant)
    // ------------------------------------------------------------------
    const glaciesPos = new THREE.Vector3(-850, 480, 1050);
    const glaciesRadius = 150;
    const glaciesGroup = new THREE.Group();
    glaciesGroup.position.copy(glaciesPos);
    this.group.add(glaciesGroup);

    const glaciesMesh = new THREE.Mesh(
      new THREE.SphereGeometry(glaciesRadius, 48, 36),
      new THREE.MeshStandardMaterial({
        color: 0x12365e,
        roughness: 0.45,
        metalness: 0.25,
      }),
    );
    glaciesGroup.add(glaciesMesh);

    const glaciesClouds = new THREE.Mesh(
      new THREE.SphereGeometry(glaciesRadius + 3, 48, 36),
      new THREE.MeshStandardMaterial({
        color: 0xd8eeff,
        transparent: true,
        opacity: 0.5,
        roughness: 0.9,
      }),
    );
    glaciesGroup.add(glaciesClouds);

    const glaciesHalo = new THREE.Mesh(
      new THREE.SphereGeometry(glaciesRadius + 9, 36, 24),
      new THREE.MeshBasicMaterial({
        color: 0x60d4ff,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    );
    glaciesGroup.add(glaciesHalo);

    const glaciesCol = new SphereCollider(glaciesRadius, {
      name: 'Planet Glacies (Ocean Giant)',
      position: glaciesPos,
    });
    this.physics.addCollider(glaciesCol);

    const glaciesAtmo = new AtmosphereZone(glaciesPos, glaciesRadius, glaciesRadius + 60, {
      name: 'Glacies Cryo Atmosphere',
      gravityStrength: 15.0,
      color: 0x60d4ff,
    });
    this.physics.addAtmosphere(glaciesAtmo);

    this.planets.push({
      mesh: glaciesMesh,
      clouds: glaciesClouds,
      rotSpeed: 0.007,
      cloudRotSpeed: 0.014,
      name: 'Glacies',
      position: glaciesPos,
      radius: glaciesRadius,
    });

    // ------------------------------------------------------------------
    // Moon D: SELENE (Cratered Lunar Moon)
    // ------------------------------------------------------------------
    const selenePos = new THREE.Vector3(580, -320, 750);
    const seleneRadius = 75;
    const seleneGroup = new THREE.Group();
    seleneGroup.position.copy(selenePos);
    this.group.add(seleneGroup);

    const seleneMesh = new THREE.Mesh(
      new THREE.DodecahedronGeometry(seleneRadius, 2),
      new THREE.MeshStandardMaterial({
        color: 0x484e56,
        roughness: 0.95,
        metalness: 0.08,
      }),
    );
    seleneGroup.add(seleneMesh);

    const seleneCol = new SphereCollider(seleneRadius, {
      name: 'Moon Selene',
      position: selenePos,
    });
    this.physics.addCollider(seleneCol);

    this.planets.push({
      mesh: seleneMesh,
      rotSpeed: 0.004,
      name: 'Selene',
      position: selenePos,
      radius: seleneRadius,
    });
  }

  // ====================================================================
  // 1B. GLOWING SPACE PLATFORMS & HIGH-TECH LANDING DECKS
  // ====================================================================
  _buildGlowingPlatforms() {
    // ------------------------------------------------------------------
    // Platform A: Hyperion Primary Stardock Platform (Spawn Sector)
    // ------------------------------------------------------------------
    const p1Pos = new THREE.Vector3(0, -6, 0);
    const p1Group = new THREE.Group();
    p1Group.position.copy(p1Pos);
    this.group.add(p1Group);

    // Main Platform Solid Deck
    const deckGeo = new THREE.BoxGeometry(42, 1.4, 42);
    const deckMesh = new THREE.Mesh(deckGeo, this.materials?.marble ? this.materials.marble() : this.metalMat);
    deckMesh.castShadow = true;
    deckMesh.receiveShadow = true;
    p1Group.add(deckMesh);

    // Glowing Neon Cyan Perimeter Ribbon Trim
    const borderThickness = 0.5;
    const borderHeight = 0.4;
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(43, borderHeight, borderThickness), this.neonCyanMat);
    b1.position.set(0, 0.7, 21.2);
    p1Group.add(b1);

    const b2 = new THREE.Mesh(new THREE.BoxGeometry(43, borderHeight, borderThickness), this.neonCyanMat);
    b2.position.set(0, 0.7, -21.2);
    p1Group.add(b2);

    const b3 = new THREE.Mesh(new THREE.BoxGeometry(borderThickness, borderHeight, 43), this.neonCyanMat);
    b3.position.set(21.2, 0.7, 0);
    p1Group.add(b3);

    const b4 = new THREE.Mesh(new THREE.BoxGeometry(borderThickness, borderHeight, 43), this.neonCyanMat);
    b4.position.set(-21.2, 0.7, 0);
    p1Group.add(b4);

    // Glowing Runway Guidance Strip (Center Crosshair)
    const run1 = new THREE.Mesh(new THREE.BoxGeometry(34, 0.05, 1.6), this.neonBlueMat);
    run1.position.set(0, 0.72, 0);
    p1Group.add(run1);

    const run2 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 34), this.neonBlueMat);
    run2.position.set(0, 0.72, 0);
    p1Group.add(run2);

    // 4 Corner Navigation Beacon Pillars
    const cornerOffsets = [
      [19, 19], [-19, 19], [19, -19], [-19, -19],
    ];
    for (const [cx, cz] of cornerOffsets) {
      const pPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 5, 8), this.metalMat);
      pPillar.position.set(cx, 2.5, cz);
      p1Group.add(pPillar);

      const pBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 12), this.beaconLightMat);
      pBeacon.position.set(cx, 5.2, cz);
      p1Group.add(pBeacon);
    }

    const p1Col = new BoxCollider(new THREE.Vector3(21.5, 0.7, 21.5), {
      name: 'Hyperion Stardock Platform',
    });
    p1Col.setStatic(p1Pos);
    this.physics.addCollider(p1Col);

    this.platforms.push({
      group: p1Group,
      position: p1Pos,
      name: 'Hyperion Stardock Platform',
    });

    // ------------------------------------------------------------------
    // Platform B: Ares Sky Deck Platform
    // ------------------------------------------------------------------
    const p2Pos = new THREE.Vector3(190, 42, -210);
    const p2Group = new THREE.Group();
    p2Group.position.copy(p2Pos);
    this.group.add(p2Group);

    const p2Deck = new THREE.Mesh(new THREE.BoxGeometry(32, 1.2, 20), this.metalMat);
    p2Deck.castShadow = true;
    p2Group.add(p2Deck);

    const p2Trim = new THREE.Mesh(new THREE.BoxGeometry(32.8, 0.3, 20.8), this.neonCyanMat);
    p2Trim.position.set(0, 0.6, 0);
    p2Group.add(p2Trim);

    const p2Col = new BoxCollider(new THREE.Vector3(16, 0.6, 10), {
      name: 'Ares Sky Deck Promenade',
    });
    p2Col.setStatic(p2Pos);
    this.physics.addCollider(p2Col);

    this.platforms.push({
      group: p2Group,
      position: p2Pos,
      name: 'Ares Sky Deck Promenade',
    });

    // ------------------------------------------------------------------
    // Platform C: Titan Salvage Station Platform
    // ------------------------------------------------------------------
    const p3Pos = new THREE.Vector3(-250, -26, 150);
    const p3Group = new THREE.Group();
    p3Group.position.copy(p3Pos);
    p3Group.rotation.y = 0.35;
    this.group.add(p3Group);

    const p3Deck = new THREE.Mesh(new THREE.BoxGeometry(26, 1.4, 26), this.hullMat);
    p3Group.add(p3Deck);

    const p3Trim = new THREE.Mesh(new THREE.BoxGeometry(26.8, 0.4, 26.8), this.neonAmberMat);
    p3Trim.position.set(0, 0.7, 0);
    p3Group.add(p3Trim);

    const p3Col = new BoxCollider(new THREE.Vector3(13, 0.7, 13), {
      name: 'Titan Salvage Platform',
    });
    p3Col.setStatic(p3Pos, p3Group.quaternion);
    this.physics.addCollider(p3Col);

    this.platforms.push({
      group: p3Group,
      position: p3Pos,
      name: 'Titan Salvage Platform',
    });

    // ------------------------------------------------------------------
    // Platform D: Deep Space Observation Outpost Deck
    // ------------------------------------------------------------------
    const p4Pos = new THREE.Vector3(-90, 110, -320);
    const p4Group = new THREE.Group();
    p4Group.position.copy(p4Pos);
    this.group.add(p4Group);

    const p4Deck = new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 1.2, 16), this.metalMat);
    p4Group.add(p4Deck);

    const p4Ring = new THREE.Mesh(new THREE.TorusGeometry(14.2, 0.35, 8, 32), this.neonMagentaMat);
    p4Ring.rotation.x = Math.PI / 2;
    p4Ring.position.set(0, 0.6, 0);
    p4Group.add(p4Ring);

    const p4Col = new BoxCollider(new THREE.Vector3(12, 0.6, 12), {
      name: 'Observation Outpost Deck',
    });
    p4Col.setStatic(p4Pos);
    this.physics.addCollider(p4Col);

    this.platforms.push({
      group: p4Group,
      position: p4Pos,
      name: 'Observation Outpost Deck',
    });
  }

  // ====================================================================
  // 1C. REALISTIC SPACE SHUTTLES & ADVANCED SPACESHIPS
  // ====================================================================
  _buildSpaceShuttlesAndShips() {
    // ------------------------------------------------------------------
    // Space Shuttle 1: Discovery-IV Orbital Shuttle (Parked on Hyperion)
    // ------------------------------------------------------------------
    const shuttlePos = new THREE.Vector3(12, -4.6, 6);
    const shuttleGroup = new THREE.Group();
    shuttleGroup.position.copy(shuttlePos);
    shuttleGroup.rotation.y = -Math.PI * 0.25;
    this.group.add(shuttleGroup);

    // Fuselage Upper Body (White Thermal Ceramic)
    const fuseGeo = new THREE.BoxGeometry(4.4, 2.6, 16);
    const fuseMesh = new THREE.Mesh(fuseGeo, this.shuttleWhiteMat);
    fuseMesh.castShadow = true;
    shuttleGroup.add(fuseMesh);

    // Fuselage Lower Heatshield (Black Ceramic Tiles)
    const bellyGeo = new THREE.BoxGeometry(4.5, 0.8, 16.2);
    const bellyMesh = new THREE.Mesh(bellyGeo, this.shuttleBlackTilesMat);
    bellyMesh.position.set(0, -1.1, 0);
    shuttleGroup.add(bellyMesh);

    // Nose Cone
    const noseGeo = new THREE.ConeGeometry(2.2, 3.8, 16);
    const noseMesh = new THREE.Mesh(noseGeo, this.shuttleBlackTilesMat);
    noseMesh.rotation.x = -Math.PI / 2;
    noseMesh.position.set(0, -0.2, -9.5);
    shuttleGroup.add(noseMesh);

    // Cockpit Window Canopy (Dark Tinted Glass)
    const canopyGeo = new THREE.BoxGeometry(3.2, 1.2, 2.4);
    const canopyMesh = new THREE.Mesh(canopyGeo, this.cockpitGlassMat);
    canopyMesh.position.set(0, 1.2, -6.5);
    shuttleGroup.add(canopyMesh);

    // Swept Delta Wings (Left & Right)
    const wingGeo = new THREE.BoxGeometry(14, 0.35, 6.5);
    const wingMesh = new THREE.Mesh(wingGeo, this.shuttleWhiteMat);
    wingMesh.position.set(0, -0.5, 1.5);
    shuttleGroup.add(wingMesh);

    // Vertical Stabilizer Rudder Fin
    const finGeo = new THREE.BoxGeometry(0.35, 4.5, 3.8);
    const finMesh = new THREE.Mesh(finGeo, this.shuttleWhiteMat);
    finMesh.position.set(0, 3.0, 5.5);
    shuttleGroup.add(finMesh);

    // Triple Main Rocket Engines with Glowing Cyan Plasma
    const engineOffsets = [
      [0, 1.0, 8.2], [-1.2, -0.4, 8.2], [1.2, -0.4, 8.2],
    ];
    for (const [ex, ey, ez] of engineOffsets) {
      const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.1, 1.8, 12), this.metalMat);
      cone.rotation.x = Math.PI / 2;
      cone.position.set(ex, ey, ez);
      shuttleGroup.add(cone);

      const glow = new THREE.Mesh(new THREE.CircleGeometry(0.65, 12), this.engineGlowMat);
      glow.position.set(ex, ey, ez + 0.95);
      shuttleGroup.add(glow);
    }

    // Solid Physics Colliders for Shuttle
    const shuttleCol = new BoxCollider(new THREE.Vector3(2.6, 2.2, 8.5), {
      name: 'Discovery-IV Space Shuttle',
    });
    shuttleCol.setStatic(shuttlePos, shuttleGroup.quaternion);
    this.physics.addCollider(shuttleCol);

    const wingCol = new BoxCollider(new THREE.Vector3(7.2, 0.4, 3.5), {
      name: 'Discovery-IV Wings',
    });
    const wingWorld = shuttlePos.clone().add(new THREE.Vector3(0, -0.5, 1.5).applyQuaternion(shuttleGroup.quaternion));
    wingCol.setStatic(wingWorld, shuttleGroup.quaternion);
    this.physics.addCollider(wingCol);

    this.spaceships.push({
      group: shuttleGroup,
      position: shuttlePos,
      name: 'Discovery-IV Orbital Space Shuttle',
    });

    // ------------------------------------------------------------------
    // Spaceship 2: Valkyrie Heavy Interceptor Starship
    // ------------------------------------------------------------------
    const valkPos = new THREE.Vector3(235, 62, -295);
    const valkGroup = new THREE.Group();
    valkGroup.position.copy(valkPos);
    valkGroup.rotation.set(-0.15, 0.85, 0.1);
    this.group.add(valkGroup);

    const valkHull = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.2, 14), this.fighterHullMat);
    valkHull.castShadow = true;
    valkGroup.add(valkHull);

    const valkWings = new THREE.Mesh(new THREE.BoxGeometry(16, 0.3, 5), this.fighterHullMat);
    valkWings.position.set(0, 0, 1.5);
    valkGroup.add(valkWings);

    const valkCanopy = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.1, 4.5), this.cockpitGlassMat);
    valkCanopy.position.set(0, 1.2, -2.5);
    valkGroup.add(valkCanopy);

    // Dual Glowing Blue Ion Thrusters
    const valkEng1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 2.0, 10), this.engineGlowMat);
    valkEng1.rotation.x = Math.PI / 2;
    valkEng1.position.set(-1.4, 0, 7.5);
    valkGroup.add(valkEng1);

    const valkEng2 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 2.0, 10), this.engineGlowMat);
    valkEng2.rotation.x = Math.PI / 2;
    valkEng2.position.set(1.4, 0, 7.5);
    valkGroup.add(valkEng2);

    const valkCol = new BoxCollider(new THREE.Vector3(6.5, 2.0, 8.0), {
      name: 'Valkyrie Heavy Interceptor',
    });
    valkCol.setStatic(valkPos, valkGroup.quaternion);
    this.physics.addCollider(valkCol);

    this.spaceships.push({
      group: valkGroup,
      position: valkPos,
      name: 'Valkyrie Heavy Interceptor Starship',
    });

    // ------------------------------------------------------------------
    // Spaceship 3: Aurora Deep-Space Science Explorer
    // ------------------------------------------------------------------
    const aurPos = new THREE.Vector3(-150, 46, -175);
    const aurGroup = new THREE.Group();
    aurGroup.position.copy(aurPos);
    aurGroup.rotation.set(0.1, -0.4, 0.05);
    this.group.add(aurGroup);

    const aurHull = new THREE.Mesh(new THREE.BoxGeometry(7.0, 4.5, 24), this.metalMat);
    aurGroup.add(aurHull);

    const aurBridge = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.4, 6.0), this.cockpitGlassMat);
    aurBridge.position.set(0, 2.8, -7.0);
    aurGroup.add(aurBridge);

    // Twin Outboard Warp Nacelles with Glowing Cyan Rails
    const nacL = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.2, 26), this.metalMat);
    nacL.position.set(-8.5, 0, 2.0);
    aurGroup.add(nacL);

    const railL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 22), this.neonCyanMat);
    railL.position.set(-9.6, 0, 2.0);
    aurGroup.add(railL);

    const nacR = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.2, 26), this.metalMat);
    nacR.position.set(8.5, 0, 2.0);
    aurGroup.add(nacR);

    const railR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 22), this.neonCyanMat);
    railR.position.set(9.6, 0, 2.0);
    aurGroup.add(railR);

    const aurCol = new BoxCollider(new THREE.Vector3(9.5, 3.8, 14.5), {
      name: 'Aurora Science Explorer Vessel',
    });
    aurCol.setStatic(aurPos, aurGroup.quaternion);
    this.physics.addCollider(aurCol);

    this.spaceships.push({
      group: aurGroup,
      position: aurPos,
      name: 'Aurora Deep-Space Explorer',
    });

    // ------------------------------------------------------------------
    // Spaceship 4: Colossus Heavy Freight Hauler
    // ------------------------------------------------------------------
    const colPos = new THREE.Vector3(75, -22, -510);
    const colGroup = new THREE.Group();
    colGroup.position.copy(colPos);
    colGroup.rotation.set(-0.05, 0.2, 0);
    this.group.add(colGroup);

    const colFuselage = new THREE.Mesh(new THREE.BoxGeometry(10, 7.5, 32), this.hullMat);
    colGroup.add(colFuselage);

    // 4 Heavy Magnetic Freight Containers
    const containerColors = [0x994422, 0x225588, 0x887722, 0x336644];
    for (let c = 0; c < 4; c++) {
      const cMesh = new THREE.Mesh(
        new THREE.BoxGeometry(4.2, 4.2, 10),
        new THREE.MeshStandardMaterial({ color: containerColors[c], metalness: 0.8, roughness: 0.35 }),
      );
      const cSide = c % 2 === 0 ? -3.8 : 3.8;
      const cZ = c < 2 ? -6.0 : 6.0;
      cMesh.position.set(cSide, 0.5, cZ);
      colGroup.add(cMesh);
    }

    const colCol = new BoxCollider(new THREE.Vector3(11.0, 6.5, 20.0), {
      name: 'Colossus Heavy Freighter',
    });
    colCol.setStatic(colPos, colGroup.quaternion);
    this.physics.addCollider(colCol);

    this.spaceships.push({
      group: colGroup,
      position: colPos,
      name: 'Colossus Heavy Freight Starship',
    });
  }

  // ====================================================================
  // 2. ORBITAL SPACE STATIONS & DOCKING PORTS
  // ====================================================================
  _buildSpaceStations() {
    const stationPos = new THREE.Vector3(190, 50, -260);
    const stationGroup = new THREE.Group();
    stationGroup.position.copy(stationPos);
    this.group.add(stationGroup);

    // Central Hub Core
    const hubGeo = new THREE.CylinderGeometry(14, 14, 22, 16);
    const hub = new THREE.Mesh(hubGeo, this.metalMat);
    hub.castShadow = true;
    hub.receiveShadow = true;
    stationGroup.add(hub);

    const hubCol = new BoxCollider(new THREE.Vector3(14, 11, 14), {
      name: 'Ares Station - Central Core',
    });
    hubCol.setStatic(stationPos);
    this.physics.addCollider(hubCol);

    // Rotating Torus Habitat Ring
    const torusGeo = new THREE.TorusGeometry(38, 3.8, 12, 32);
    const habitatRing = new THREE.Mesh(torusGeo, this.materials?.marble ? this.materials.marble() : this.metalMat);
    habitatRing.rotation.x = Math.PI / 2;
    stationGroup.add(habitatRing);

    // 4 Connecting Spokes / Corridors
    for (let i = 0; i < 4; i++) {
      const spokeAngle = (i * Math.PI) / 2;
      const spokeMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 2.4, 38),
        this.metalMat,
      );
      spokeMesh.position.set(Math.sin(spokeAngle) * 19, 0, Math.cos(spokeAngle) * 19);
      spokeMesh.rotation.y = spokeAngle;
      stationGroup.add(spokeMesh);

      const spokeCol = new BoxCollider(new THREE.Vector3(1.4, 1.4, 19), {
        name: `Ares Station - Spoke ${i + 1}`,
      });
      const spokeWorld = stationPos.clone().add(spokeMesh.position);
      spokeCol.setStatic(spokeWorld, spokeMesh.quaternion);
      this.physics.addCollider(spokeCol);
    }

    // Solar Panel Array Wings (Left & Right)
    const solarWingGeo = new THREE.BoxGeometry(32, 0.4, 8);
    const leftSolar = new THREE.Mesh(solarWingGeo, this.metalMat);
    leftSolar.position.set(52, 0, 0);
    stationGroup.add(leftSolar);

    const leftCol = new BoxCollider(new THREE.Vector3(16, 0.3, 4), {
      name: 'Ares Station - Solar Wing Alpha',
    });
    leftCol.setStatic(stationPos.clone().add(leftSolar.position));
    this.physics.addCollider(leftCol);

    const rightSolar = new THREE.Mesh(solarWingGeo, this.metalMat);
    rightSolar.position.set(-52, 0, 0);
    stationGroup.add(rightSolar);

    const rightCol = new BoxCollider(new THREE.Vector3(16, 0.3, 4), {
      name: 'Ares Station - Solar Wing Beta',
    });
    rightCol.setStatic(stationPos.clone().add(rightSolar.position));
    this.physics.addCollider(rightCol);

    // Communication Spire Mast
    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 1.4, 34, 8),
      this.metalMat,
    );
    mast.position.set(0, 24, 0);
    stationGroup.add(mast);

    const mastCol = new BoxCollider(new THREE.Vector3(1.0, 17, 1.0), {
      name: 'Ares Station - Comm Mast',
    });
    mastCol.setStatic(stationPos.clone().add(mast.position));
    this.physics.addCollider(mastCol);

    // Blinking Navigation Beacon Lights
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 12, 12),
      this.beaconLightMat,
    );
    beacon.position.set(0, 42, 0);
    stationGroup.add(beacon);

    this.dynamicRotators.push({
      mesh: habitatRing,
      speed: 0.08,
      axis: 'z',
    });

    this.stations.push({
      group: stationGroup,
      position: stationPos,
      name: 'Ares Orbital Research Hub',
    });
  }

  // ====================================================================
  // 3. WRECKED STARSHIPS & DEBRIS CORRIDORS
  // ====================================================================
  _buildWreckedStarships() {
    const wreckPos = new THREE.Vector3(-280, -40, 210);
    const wreckGroup = new THREE.Group();
    wreckGroup.position.copy(wreckPos);
    wreckGroup.rotation.set(0.35, 0.8, -0.2);
    this.group.add(wreckGroup);

    // Fractured Titan Frigate Hull Section A (Main Fuselage)
    const hullA = new THREE.Mesh(
      new THREE.BoxGeometry(16, 12, 42),
      this.hullMat,
    );
    hullA.castShadow = true;
    wreckGroup.add(hullA);

    const hullACol = new BoxCollider(new THREE.Vector3(8.5, 6.5, 21.5), {
      name: 'Derelict Titan Hull - Fuselage',
    });
    hullACol.setStatic(wreckPos, wreckGroup.quaternion);
    this.physics.addCollider(hullACol);

    // Severed Engine Block (Floating 25m off)
    const engBlock = new THREE.Mesh(
      new THREE.BoxGeometry(22, 14, 18),
      this.hullMat,
    );
    engBlock.position.set(18, -12, 38);
    engBlock.rotation.set(0.2, 0.4, 0.1);
    wreckGroup.add(engBlock);

    const engWorld = wreckPos.clone().add(engBlock.position);
    const engCol = new BoxCollider(new THREE.Vector3(11.5, 7.5, 9.5), {
      name: 'Derelict Engine Block',
    });
    engCol.setStatic(engWorld);
    this.physics.addCollider(engCol);

    // Fractured Cargo Debris Plates
    const debrisSizes = [
      [8, 0.4, 14],
      [12, 0.5, 9],
      [6, 0.3, 6],
    ];
    const debrisOffsets = [
      [-22, 8, -14],
      [14, 16, -28],
      [-10, -18, 30],
    ];

    for (let i = 0; i < debrisSizes.length; i++) {
      const dMesh = new THREE.Mesh(
        new THREE.BoxGeometry(...debrisSizes[i]),
        this.hullMat,
      );
      dMesh.position.set(...debrisOffsets[i]);
      dMesh.rotation.set(i * 0.7, i * 1.2, i * 0.4);
      wreckGroup.add(dMesh);

      const dWorld = wreckPos.clone().add(dMesh.position);
      const dCol = new BoxCollider(new THREE.Vector3(debrisSizes[i][0] * 0.5, debrisSizes[i][1] * 0.5, debrisSizes[i][2] * 0.5), {
        name: `Hull Debris Fragment ${i + 1}`,
      });
      dCol.setStatic(dWorld, dMesh.quaternion);
      this.physics.addCollider(dCol);
    }

    this.wrecks.push({
      group: wreckGroup,
      position: wreckPos,
      name: 'Derelict Heavy Cruiser Titan-IV',
    });
  }

  // ====================================================================
  // 4. NAVIGATIONAL SATELLITES & QUANTUM TELESCOPES
  // ====================================================================
  _buildSatellites() {
    // Navigational Beacon Satellite Sol-4
    const satPos = new THREE.Vector3(85, 18, 110);
    const satGroup = new THREE.Group();
    satGroup.position.copy(satPos);
    this.group.add(satGroup);

    const satBody = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 3.2, 4.4),
      this.metalMat,
    );
    satGroup.add(satBody);

    const solarLeft = new THREE.Mesh(
      new THREE.BoxGeometry(9.0, 0.2, 2.8),
      this.metalMat,
    );
    solarLeft.position.set(6.2, 0, 0);
    satGroup.add(solarLeft);

    const solarRight = new THREE.Mesh(
      new THREE.BoxGeometry(9.0, 0.2, 2.8),
      this.metalMat,
    );
    solarRight.position.set(-6.2, 0, 0);
    satGroup.add(solarRight);

    const satDish = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 0.2, 0.8, 16),
      this.metalMat,
    );
    satDish.position.set(0, 2.6, 0);
    satDish.rotation.x = 0.4;
    satGroup.add(satDish);

    const satCol = new BoxCollider(new THREE.Vector3(5.5, 2.0, 2.5), {
      name: 'Nav Satellite Sol-4',
    });
    satCol.setStatic(satPos);
    this.physics.addCollider(satCol);

    this.satellites.push({
      group: satGroup,
      position: satPos,
      name: 'Navigation Relay Satellite Sol-4',
    });
  }

  // ====================================================================
  // 5. ASTEROID BELTS & SPHERICAL COLLISION PROXIES
  // ====================================================================
  _buildAsteroidBelts() {
    // Generate an authentic, expansive asteroid belt field
    const numAsteroids = 65;
    const baseBeltPos = new THREE.Vector3(0, 0, -600);

    const asteroidGeos = [
      new THREE.DodecahedronGeometry(6.5, 1),
      new THREE.DodecahedronGeometry(11.0, 1),
      new THREE.DodecahedronGeometry(16.5, 1),
    ];

    for (let i = 0; i < numAsteroids; i++) {
      const geoIdx = i % asteroidGeos.length;
      const geo = asteroidGeos[geoIdx];
      const mesh = new THREE.Mesh(geo, this.asteroidMat);

      // Vast, dispersed spatial distribution
      const u = i / numAsteroids;
      const angle = u * Math.PI * 2;
      const dist = 180 + Math.sin(i * 13) * 140;
      const ax = baseBeltPos.x + Math.cos(angle) * dist + (Math.sin(i * 7) * 45);
      const ay = baseBeltPos.y + Math.sin(i * 5) * 45;
      const az = baseBeltPos.z + Math.sin(angle) * dist + (Math.cos(i * 11) * 45);

      mesh.position.set(ax, ay, az);
      const s = 0.6 + Math.sin(i * 3) * 0.35;
      mesh.scale.setScalar(s);
      mesh.rotation.set(i * 0.5, i * 1.1, i * 0.3);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.group.add(mesh);

      const baseR = [6.5, 11.0, 16.5][geoIdx] * s;
      const col = new SphereCollider(baseR * 0.95, {
        name: `Asteroid Belt Rock #${i + 1}`,
        position: new THREE.Vector3(ax, ay, az),
        restitution: 0.25,
      });
      this.physics.addCollider(col);

      this.asteroids.push({
        mesh,
        collider: col,
        position: new THREE.Vector3(ax, ay, az),
        radius: baseR,
      });
    }
  }

  // ====================================================================
  // 6. BLACK HOLE (CYGNUS X-PRIME) SINGULARITY
  // ====================================================================
  _buildSingularity() {
    const holePos = new THREE.Vector3(-1400, 220, -1650);
    const holeGroup = new THREE.Group();
    holeGroup.position.copy(holePos);
    this.group.add(holeGroup);

    // Event Horizon Sphere (Pitch Black Void Core)
    const coreMesh = new THREE.Mesh(
      new THREE.SphereGeometry(28, 36, 36),
      new THREE.MeshBasicMaterial({ color: 0x000000 }),
    );
    holeGroup.add(coreMesh);

    // Luminous Swirling Accretion Disc
    const discMesh = new THREE.Mesh(
      new THREE.RingGeometry(35, 140, 64),
      new THREE.MeshBasicMaterial({
        color: 0xffaa40,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      }),
    );
    discMesh.rotation.x = Math.PI * 0.38;
    holeGroup.add(discMesh);

    // Gravitational Well (Inverse-distance pull + Event Horizon consumption)
    const gravityWell = new GravityWell(holePos, 450, 42.0, 30.0, {
      name: 'Black Hole Singularity Cygnus-X',
    });
    this.physics.addGravityWell(gravityWell);

    this.dynamicRotators.push({
      mesh: discMesh,
      speed: 0.12,
      axis: 'z',
    });
  }

  // ====================================================================
  // 7. HYPERSPACE STARGATES & WORMHOLES
  // ====================================================================
  _buildStargatesAndWormholes() {
    const gatePos = new THREE.Vector3(0, 0, -420);
    const gateGroup = new THREE.Group();
    gateGroup.position.copy(gatePos);
    this.group.add(gateGroup);

    const gateTorus = new THREE.Mesh(
      new THREE.TorusGeometry(18, 1.8, 16, 48),
      new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        wireframe: true,
      }),
    );
    gateGroup.add(gateTorus);

    // Event Horizon Trigger
    const trigger = new InteractionTrigger(gatePos, 16.0, {
      type: 'PORTAL',
      name: 'Kronos Hyperspace Stargate',
      prompt: '[E] ENGAGE HYPERSPACE WARP',
    });
    this.physics.addTrigger(trigger);

    this.stargates.push({
      group: gateGroup,
      position: gatePos,
      trigger,
      forward: new THREE.Vector3(0, 0, -1),
    });
  }

  // ====================================================================
  // 8. ANCIENT ALIEN RELICS & ENERGY NODES
  // ====================================================================
  _buildCosmicRelics() {
    const relicPositions = [
      new THREE.Vector3(120, 24, -140),
      new THREE.Vector3(-180, 15, 90),
      new THREE.Vector3(45, -30, -320),
      new THREE.Vector3(-240, 60, -450),
    ];

    for (let i = 0; i < relicPositions.length; i++) {
      const rPos = relicPositions[i];
      const rMesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(2.4, 0),
        this.relicMat,
      );
      rMesh.position.copy(rPos);
      this.group.add(rMesh);

      const trigger = new InteractionTrigger(rPos, 5.5, {
        type: 'RELIC',
        name: `Ancient Artifact #${i + 1}`,
        prompt: '[E] EXTRACT ALIEN RELIC',
      });
      this.physics.addTrigger(trigger);

      this.relics.push({
        mesh: rMesh,
        trigger,
        position: rPos,
        collected: false,
      });
    }
  }

  update(dt, playerPos) {
    // 1. Rotate Planetary Bodies & Rings
    for (const p of this.planets) {
      if (p.mesh) p.mesh.rotation.y += p.rotSpeed * dt;
      if (p.clouds) p.clouds.rotation.y += p.cloudRotSpeed * dt;
      if (p.rings) p.rings.rotation.z += p.ringRotSpeed * dt;
    }

    // 2. Rotate Dynamic Habitat Rings & Accretion Discs
    for (const rot of this.dynamicRotators) {
      if (rot.axis === 'z') rot.mesh.rotation.z += rot.speed * dt;
      else rot.mesh.rotation.y += rot.speed * dt;
    }

    // 3. Animate Floating Relics
    const time = performance.now() * 0.001;
    for (const r of this.relics) {
      if (!r.collected && r.mesh) {
        r.mesh.rotation.y = time * 1.5;
        r.mesh.rotation.x = Math.sin(time * 2.0) * 0.3;
      }
    }
  }

  clear() {
    this.group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
        else o.material.dispose();
      }
    });
    this.scene.remove(this.group);
  }
}
