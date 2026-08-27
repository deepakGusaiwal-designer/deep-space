/**
 * Input — keyboard state + smooth mouse camera orbit & pointer handling.
 * Emits semantic events (jump, restart, pause) so gameplay code never
 * reads raw key codes.
 *
 * Supports:
 *  - Continuous mouse camera look (with or without pointer lock)
 *  - WASD + Arrow flight steering
 *  - Space (Ascend), X / Ctrl / C (Descend), Shift (Boost), B (Brake)
 *  - Q (Scanner), M (Map), E (Interact), U (Upgrades)
 */
export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.enabled = false;
    this.isMouseDown = false;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this._listeners = new Map(); // event name -> Set<fn>

    this._bindKeyboard();
    this._bindMouse();
  }

  _bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Prevent default scrolling for arrows and space
      if (
        e.code.startsWith('Arrow') ||
        e.key?.startsWith('Arrow') ||
        e.code === 'Space'
      ) {
        e.preventDefault();
      }

      this.keys.add(e.code);
      if (e.key) this.keys.add(e.key.toLowerCase());
      if (e.repeat) return;

      if (e.code === 'Space' || e.key === ' ') this._emit('jump');
      if (e.code === 'KeyQ' || e.key === 'q' || e.key === 'Q') this._emit('scanner');
      if (e.code === 'KeyM' || e.key === 'm' || e.key === 'M') this._emit('map');
      if (e.code === 'KeyE' || e.key === 'e' || e.key === 'E') this._emit('interact');
      if (e.code === 'KeyU' || e.key === 'u' || e.key === 'U') this._emit('upgrades');
      if (e.code === 'KeyR' || e.key === 'r' || e.key === 'R') this._emit('restart');
      if (e.code === 'Escape' || e.key === 'Escape') this._emit('pause');
      if (e.code === 'Enter' || e.key === 'Enter') this._emit('confirm');
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
      if (e.key) this.keys.delete(e.key.toLowerCase());
    });

    window.addEventListener('blur', () => {
      this.keys.clear();
      this.isMouseDown = false;
    });
  }

  _bindMouse() {
    // 1. Canvas click locks pointer if enabled
    this.canvas.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
      if (this.enabled && !this.pointerLocked) {
        this.lockPointer();
      }
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    // 2. Continuous mouse tracking (works both with pointer lock and direct mouse motion)
    window.addEventListener('mousemove', (e) => {
      if (!this.enabled) return;

      if (this.pointerLocked) {
        // Pointer locked: use hardware movement deltas
        this.mouseDX += e.movementX || 0;
        this.mouseDY += e.movementY || 0;
      } else {
        // Pointer not locked: track client delta for smooth drag / orbit
        if (this.prevMouseX !== 0 || this.prevMouseY !== 0) {
          const dx = e.clientX - this.prevMouseX;
          const dy = e.clientY - this.prevMouseY;
          // Only track if reasonable delta (prevents big jump on first click)
          if (Math.abs(dx) < 200 && Math.abs(dy) < 200) {
            this.mouseDX += dx;
            this.mouseDY += dy;
          }
        }
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
      }
    });

    document.addEventListener('pointerlockchange', () => {
      if (!this.pointerLocked) {
        this._emit('unlock');
        this.prevMouseX = 0;
        this.prevMouseY = 0;
      }
    });
  }

  get pointerLocked() {
    return document.pointerLockElement === this.canvas;
  }

  lockPointer() {
    if (!this.pointerLocked && this.canvas) {
      try {
        const p = this.canvas.requestPointerLock?.();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch (_) {}
    }
  }

  unlockPointer() {
    if (this.pointerLocked) {
      try {
        document.exitPointerLock?.();
      } catch (_) {}
    }
  }

  /** Camera-relative move intent: x = strafe, z = forward, in [-1, 1].
   *  WASD and the arrow keys both steer. */
  moveVector() {
    if (!this.enabled) return { x: 0, z: 0 };
    const k = this.keys;
    const right = k.has('KeyD') || k.has('ArrowRight') || k.has('arrowright') || k.has('d');
    const left = k.has('KeyA') || k.has('ArrowLeft') || k.has('arrowleft') || k.has('a');
    const fwd = k.has('KeyW') || k.has('ArrowUp') || k.has('arrowup') || k.has('w');
    const back = k.has('KeyS') || k.has('ArrowDown') || k.has('arrowdown') || k.has('s');

    const x = (right ? 1 : 0) - (left ? 1 : 0);
    const z = (fwd ? 1 : 0) - (back ? 1 : 0);
    const len = Math.hypot(x, z) || 1;
    return { x: x / len, z: z / len };
  }

  get sprinting() {
    return this.enabled && (this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') || this.keys.has('shift'));
  }

  get jumpHeld() {
    return this.enabled && (this.keys.has('Space') || this.keys.has(' '));
  }

  get descendHeld() {
    return this.enabled && (
      this.keys.has('KeyX') || this.keys.has('x') || this.keys.has('X') ||
      this.keys.has('ControlLeft') || this.keys.has('ControlRight') ||
      this.keys.has('control') || this.keys.has('KeyC') || this.keys.has('c')
    );
  }

  get brakeHeld() {
    return this.enabled && (this.keys.has('KeyB') || this.keys.has('b') || this.keys.has('B'));
  }

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
