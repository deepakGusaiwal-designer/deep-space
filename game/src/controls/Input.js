/**
 * Input — keyboard state + pointer-lock mouse deltas.
 * Emits semantic events (jump, restart, pause) so gameplay code never
 * reads raw key codes.
 */
export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.enabled = false;
    this._listeners = new Map(); // event name -> Set<fn>

    addEventListener('keydown', (e) => {
      // arrows shouldn't scroll the page while steering the sphere
      if (e.code.startsWith('Arrow')) e.preventDefault();
      if (e.repeat) return;
      this.keys.add(e.code);
      if (e.code === 'Space') { e.preventDefault(); this._emit('jump'); }
      if (e.code === 'KeyR') this._emit('restart');
      if (e.code === 'Escape') this._emit('pause');
      if (e.code === 'Enter') this._emit('confirm');
      if (e.code === 'KeyM') this._emit('mute');
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => this.keys.clear());

    addEventListener('mousemove', (e) => {
      if (!this.pointerLocked) return;
      this.mouseDX += e.movementX;
      this.mouseDY += e.movementY;
    });

    document.addEventListener('pointerlockchange', () => {
      if (!this.pointerLocked) this._emit('unlock');
    });
  }

  get pointerLocked() { return document.pointerLockElement === this.canvas; }

  lockPointer() {
    if (!this.pointerLocked) this.canvas.requestPointerLock?.();
  }

  unlockPointer() {
    if (this.pointerLocked) document.exitPointerLock?.();
  }

  /** Camera-relative move intent: x = strafe, z = forward, in [-1, 1].
   *  WASD and the arrow keys both steer. */
  moveVector() {
    if (!this.enabled) return { x: 0, z: 0 };
    const k = this.keys;
    const x = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0)
            - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
    const z = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0)
            - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0);
    const len = Math.hypot(x, z) || 1;
    return { x: x / len, z: z / len };
  }

  get sprinting() {
    return this.enabled && (this.keys.has('ShiftLeft') || this.keys.has('ShiftRight'));
  }

  get jumpHeld() { return this.enabled && this.keys.has('Space'); }

  /** Consume accumulated mouse motion for this frame. */
  consumeMouse() {
    const d = { x: this.mouseDX, y: this.mouseDY };
    this.mouseDX = 0;
    this.mouseDY = 0;
    return d;
  }

  on(event, fn) {
    if (!this._listeners.has(event)) this._listeners.set(event, new Set());
    this._listeners.get(event).add(fn);
    return () => this._listeners.get(event).delete(fn);
  }

  _emit(event) {
    this._listeners.get(event)?.forEach((fn) => fn());
  }
}
