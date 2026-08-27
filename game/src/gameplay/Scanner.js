/**
 * Scanner — 3D Holographic Sonar Pulse & Target Identification
 * Activated with Q.
 */
import * as THREE from 'three';

const SCAN_VERT = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const SCAN_FRAG = /* glsl */ `
  uniform vec3 uCenter;
  uniform float uRadius;
  uniform float uThickness;
  uniform vec3 uColor;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  void main() {
    float d = distance(vWorldPos, uCenter);
    float diff = abs(d - uRadius);
    float ring = smoothstep(uThickness, 0.0, diff);
    
    // Fresnel glow edge
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 2.5);

    float alpha = (ring * 0.85 + fresnel * 0.2) * smoothstep(180.0, 10.0, uRadius);
    if (alpha <= 0.01) discard;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

export class Scanner {
  constructor(scene, audio) {
    this.scene = scene;
    this.audio = audio;
    this.range = 160;
    this.pulseActive = false;
    this.pulseRadius = 0;
    this.pulseSpeed = 85; // meters per sec
    this.center = new THREE.Vector3();
    this.cooldown = 0;
    this.lastDetected = [];

    // 3D Pulse Sphere Mesh
    const geo = new THREE.SphereGeometry(1, 32, 24);
    this.material = new THREE.ShaderMaterial({
      vertexShader: SCAN_VERT,
      fragmentShader: SCAN_FRAG,
      uniforms: {
        uCenter: { value: new THREE.Vector3() },
        uRadius: { value: 0 },
        uThickness: { value: 6.0 },
        uColor: { value: new THREE.Color(0x00e5ff) },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.visible = false;
    this.mesh.frustumCulled = false;
    scene.add(this.mesh);
  }

  trigger(playerPos, targets = [], onScanComplete = null) {
    if (this.cooldown > 0) return false;

    this.cooldown = 2.4;
    this.pulseActive = true;
    this.pulseRadius = 1.0;
    this.center.copy(playerPos);
    this.material.uniforms.uCenter.value.copy(playerPos);
    this.material.uniforms.uRadius.value = 0;
    this.mesh.position.copy(playerPos);
    this.mesh.scale.setScalar(1);
    this.mesh.visible = true;
    this.onScanComplete = onScanComplete;

    this.audio?.scanner?.();

    // Query scan results
    this.lastDetected = this.scanTargets(playerPos, targets);
    return true;
  }

  scanTargets(playerPos, targets) {
    const results = [];
    for (const t of targets) {
      if (!t.position) continue;
      const d = playerPos.distanceTo(t.position);
      if (d <= this.range) {
        // Calculate bearing angle
        const dx = t.position.x - playerPos.x;
        const dz = t.position.z - playerPos.z;
        let bearing = Math.round((Math.atan2(dx, -dz) * 180 / Math.PI + 360) % 360);

        const strength = Math.round(Math.max(10, 100 - (d / this.range) * 90));
        results.push({
          id: t.id ?? 'UNKNOWN',
          type: t.type ?? 'ANOMALY',
          name: t.name ?? 'Unknown Signature',
          distance: Math.round(d),
          bearing: String(bearing).padStart(3, '0') + '°',
          strength: `${strength}%`,
          position: t.position.clone(),
          target: t,
        });
      }
    }

    results.sort((a, b) => a.distance - b.distance);
    return results;
  }

  update(dt) {
    if (this.cooldown > 0) {
      this.cooldown -= dt;
    }

    if (this.pulseActive) {
      this.pulseRadius += this.pulseSpeed * dt;
      this.material.uniforms.uRadius.value = this.pulseRadius;
      this.mesh.scale.setScalar(this.pulseRadius);

      if (this.pulseRadius >= this.range) {
        this.pulseActive = false;
        this.mesh.visible = false;
        if (this.onScanComplete) {
          this.onScanComplete(this.lastDetected);
          this.onScanComplete = null;
        }
      }
    }
  }
}
