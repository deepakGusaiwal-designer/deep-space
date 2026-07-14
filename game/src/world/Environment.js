/**
 * Environment — the cyberpunk city backdrop that surrounds every level.
 * Loaded async so the game is playable immediately; purely visual
 * (no colliders, no shadows).
 *
 * The source asset is a Sketchfab diorama: the actual city detail sits
 * inside giant backdrop shells (a 700-unit box, a sky plane, an
 * oversized drone). We hide the shells, find the dominant cluster of
 * real buildings, fit THAT under the course — then surround the whole
 * world with a ring of rotated skyline clones so the city reads in
 * every direction.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ENV_URL = new URL('../../assets/cyberpunk_env.glb', import.meta.url).href;

const CITY_SPAN = 420;   // footprint of the main city below the course
const CITY_CENTER = { x: 15, z: -45 }; // middle of the play space
const STREET_Y = -125;   // main city street level — rooftops stay below the course

const SHELL_SIZE = 300;  // raw units — anything bigger is a backdrop shell
const CLUSTER_RANGE = 250; // raw units — max distance from the median height

// ring of distant skyline clones (big towers only, small props stripped).
// each clone is a whole city block ~460 units wide at scale 1.1, so the
// radius keeps its near edge ~100 units clear of the course.
const RING = [
  { angle: 0.7, radius: 330, scale: 1.1, y: -150 },
  { angle: 2.2, radius: 350, scale: 1.2, y: -165 },
  { angle: 3.8, radius: 335, scale: 1.05, y: -150 },
  { angle: 5.3, radius: 355, scale: 1.15, y: -160 },
];
const TOWER_MIN_SIZE = 40; // raw units — ring clones keep only real buildings
const FLAT_RATIO = 0.04;   // thinner than this vs. its width = billboard plane
const BILLBOARD_MAX = 100; // flat planes bigger than this are fake-sky panels — drop them

export class Environment {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);
    this.ready = false;

    new GLTFLoader().load(ENV_URL, (gltf) => this._setup(gltf.scene));
  }

  _setup(model) {
    model.updateWorldMatrix(true, true);

    // measure every mesh in raw asset space
    const entries = [];
    const _bb = new THREE.Box3();
    const _size = new THREE.Vector3();
    model.traverse((o) => {
      if (!o.isMesh) return;
      _bb.setFromObject(o);
      _bb.getSize(_size);
      const maxDim = Math.max(_size.x, _size.y, _size.z);
      entries.push({
        mesh: o,
        maxDim,
        flat: Math.min(_size.x, _size.y, _size.z) < maxDim * FLAT_RATIO,
        cy: (_bb.min.y + _bb.max.y) / 2,
      });
    });

    // 1. drop backdrop shells (giant box, sky plane, stretched drone)
    //    and photo-sky billboards — the game has its own sky
    const detail = entries.filter(
      (e) => e.maxDim <= SHELL_SIZE && !(e.flat && e.maxDim > BILLBOARD_MAX),
    );

    // 2. keep only the dominant height cluster (strays sit near y=0)
    const centers = detail.map((e) => e.cy).sort((a, b) => a - b);
    const median = centers[centers.length >> 1];
    const city = new Set();
    for (const e of detail) {
      if (Math.abs(e.cy - median) <= CLUSTER_RANGE) city.add(e.mesh);
    }
    const towers = new Set(); // subset worth repeating on the horizon
    const box = new THREE.Box3();
    for (const e of entries) {
      const keep = city.has(e.mesh);
      e.mesh.visible = keep;
      e.mesh.castShadow = false;
      e.mesh.receiveShadow = false;
      if (keep) {
        box.expandByObject(e.mesh);
        if (e.maxDim >= TOWER_MIN_SIZE && !e.flat) {
          towers.add(e.mesh);
          e.mesh.userData.isTower = true; // survives clone() for the ring copies
        }
      }
    }

    // 3. fit the main city under the course
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = CITY_SPAN / Math.max(size.x, size.z);
    model.scale.setScalar(s);
    model.position.set(
      CITY_CENTER.x - center.x * s,
      STREET_Y - box.min.y * s,
      CITY_CENTER.z - center.z * s,
    );
    this.group.add(model);

    // 4. surround the world: rotated tower-only clones on the horizon.
    //    Clones share geometry & materials, so this costs draw calls only.
    for (const spot of RING) {
      const clone = model.clone(true);
      clone.traverse((o) => {
        if (o.isMesh) o.visible = o.visible && !!o.userData.isTower;
      });
      const k = s * spot.scale;
      clone.scale.setScalar(k);
      // pivot group: city center at the pivot origin, street level at y=0
      clone.position.set(-center.x * k, -box.min.y * k, -center.z * k);
      const pivot = new THREE.Group();
      pivot.add(clone);
      pivot.rotation.y = spot.angle;
      pivot.position.set(
        CITY_CENTER.x + Math.sin(spot.angle) * spot.radius,
        spot.y,
        CITY_CENTER.z + Math.cos(spot.angle) * spot.radius,
      );
      this.group.add(pivot);
    }

    this.ready = true;
  }
}
