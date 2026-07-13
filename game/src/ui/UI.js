/**
 * UI — DOM overlays (start, HUD, pause, level complete, finale),
 * all animated with GSAP. Typography only: no images, no icons.
 *
 * Layout follows the GRAVITY art direction:
 *   top-left  ENERGY bar + TIME      top-right  LEVEL number
 *   bottom-right  km/h gauge         bottom-left  key hints
 */
import gsap from 'gsap';
import { formatTime } from '../utils/math.js';

export class UI {
  constructor(root) {
    this.root = root;
    root.innerHTML = /* html */ `
      <div class="vignette"></div>


      <section class="screen screen--start" data-el="start">
        <h1 class="title">DEEPSPACE</h1>
        <div class="rule"></div>
        <button class="prompt glass" data-el="begin">Press <span class="key">Enter</span> to begin</button>
        <div class="controls-hint">
          <span><b>WASD</b> move</span><span><b>Mouse</b> camera</span>
          <span><b>Space</b> jump</span><span><b>Shift</b> sprint</span>
          <span><b>Esc</b> pause</span>
        </div>
        <div class="foot">
          <button class="foot__fullscreen" data-el="fullscreen">Fullscreen ⛶</button>
        </div>
      </section>

      <div class="hud" data-el="hud" style="visibility:hidden">
        <div class="hud__stats">
          <span class="label">Energy</span>
          <span class="value" data-el="energyVal">100/100</span>
          <span class="hud__bar"><i data-el="energyBar"></i></span>
          <span class="label">Time</span>
          <span class="value" data-el="timer">00:00.00</span>
        </div>
        <div class="hud__level">
          <span class="label">Level</span>
          <span class="num" data-el="levelNum">01</span>
          <span class="name" data-el="levelName"></span>
        </div>
        <div class="hud__speed">
          <span class="ring" data-el="speedRing"></span>
          <span class="readout">
            <span class="kmh" data-el="speedVal">0</span>
            <span class="unit">km/h</span>
          </span>
        </div>
        <div class="hud__keys">shift sprint · space jump · r restart · esc pause</div>
        <div class="hud__toast glass" data-el="toast"></div>
      </div>

      <section class="screen screen--overlay" data-el="pause">
        <div class="panel">
          <div class="panel__title">Paused</div>
          <div class="panel__rows"><div class="row"><span class="k" data-el="pauseMeta"></span></div></div>
          <nav class="menu">
            <button class="is-primary" data-el="resume">Resume</button>
            <button data-el="restartLevel">Restart</button>
            <button data-el="settingsAudio">Audio — On</button>
            <button data-el="mainMenu">Main Menu</button>
            <a href="/" data-el="exitSite">Exit</a>
          </nav>
        </div>
        <div class="esc-hint"><b>ESC</b> Back</div>
      </section>

      <section class="screen screen--overlay" data-el="complete">
        <div class="panel glass">
          <div class="kicker" data-el="completeKicker"></div>
          <div class="panel__title">Level Complete</div>
          <div class="panel__rows">
            <div class="row"><span class="k">Time</span><span class="v" data-el="completeTime"></span></div>
            <div class="row"><span class="k">Energy</span><span class="v" data-el="completeEnergy"></span></div>
          </div>
          <button class="btn btn--primary" data-el="continue">Continue →</button>
        </div>
      </section>

      <section class="screen screen--overlay" data-el="end">
        <div class="panel glass">
          <div class="kicker">All levels traversed</div>
          <div class="panel__title">The End</div>
          <div class="panel__rows">
            <div class="row"><span class="k">Total time</span><span class="v" data-el="endMeta"></span></div>
          </div>
          <div class="menu">
            <button class="is-primary" data-el="again">Play Again</button>
          </div>
        </div>
      </section>

      <div class="bar bar--top"></div>
      <div class="bar bar--bottom"></div>
      <div class="veil" data-el="veil"></div>
    `;

    this.el = {};
    for (const node of root.querySelectorAll('[data-el]')) {
      this.el[node.dataset.el] = node;
    }
    this.bars = root.querySelectorAll('.bar');
  }

  /* ---------------- back-to-portfolio link --------------------------- */

  /** Shown on menu-like screens, hidden during play so the HUD stays clean. */
  _setBack(visible) {
    gsap.to(this.el.back, {
      autoAlpha: visible ? 1 : 0, y: visible ? 0 : -10,
      duration: 0.5, ease: 'power2.out', overwrite: 'auto',
    });
  }

  /* ---------------- start screen ------------------------------------ */

  showStart() {
    const s = this.el.start;
    gsap.set(s, { autoAlpha: 1 });
    gsap.from(s.querySelectorAll('.kicker, .title, .subtitle, .rule, .prompt, .controls-hint, .foot'), {
      y: 34, autoAlpha: 0, duration: 1.1, stagger: 0.09, ease: 'expo.out', delay: 0.15,
    });
    this._setBack(true);
  }

  hideStart() {
    this._setBack(false);
    return gsap.to(this.el.start, { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' });
  }

  /* ---------------- HUD ---------------------------------------------- */

  showHUD(levelIndex, total, name) {
    this.el.levelNum.textContent = String(levelIndex + 1).padStart(2, '0');
    this.el.levelName.textContent = name;
    gsap.set(this.el.hud, { visibility: 'visible' });
    gsap.fromTo(
      this.el.hud.querySelectorAll('.hud__stats, .hud__level, .hud__speed, .hud__keys'),
      { y: -14, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1, ease: 'expo.out' },
    );
  }

  hideHUD() {
    gsap.to(this.el.hud, {
      autoAlpha: 0, duration: 0.4,
      onComplete: () => gsap.set(this.el.hud, { visibility: 'hidden', opacity: 1 }),
    });
  }

  setTimer(seconds) { this.el.timer.textContent = formatTime(seconds); }

  setEnergy(value, max = 100) {
    const v = Math.max(0, Math.round(value));
    this.el.energyVal.textContent = `${v}/${max}`;
    this.el.energyBar.style.transform = `scaleX(${Math.max(0, value / max)})`;
  }

  setSpeed(kmh) {
    this.el.speedVal.textContent = String(Math.round(kmh));
    const pct = Math.min(1, kmh / 50);
    this.el.speedRing.style.setProperty('--deg', `${Math.round(pct * 280)}deg`);
  }

  toast(text, hold = 1.6) {
    const t = this.el.toast;
    t.textContent = text;
    gsap.timeline()
      .fromTo(t, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'expo.out' })
      .to(t, { autoAlpha: 0, y: -10, duration: 0.5, ease: 'power2.in' }, `+=${hold}`);
  }

  /* ---------------- pause -------------------------------------------- */

  showPause(levelName) {
    this.el.pauseMeta.textContent = levelName;
    gsap.fromTo(this.el.pause, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 });
    gsap.fromTo(this.el.pause.querySelectorAll('.panel__title, .panel__rows, .menu > *'),
      { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: 'expo.out' });
    this._setBack(true);
  }

  hidePause() {
    this._setBack(false);
    return gsap.to(this.el.pause, { autoAlpha: 0, duration: 0.3 });
  }

  setAudioLabel(muted) {
    this.el.settingsAudio.textContent = muted ? 'Audio — Off' : 'Audio — On';
  }

  /* ---------------- level complete / finale --------------------------- */

  showComplete(levelName, time, energy) {
    this.el.completeKicker.textContent = levelName;
    this.el.completeTime.textContent = formatTime(time);
    this.el.completeEnergy.textContent = `${Math.max(0, Math.round(energy))}/100`;
    gsap.fromTo(this.el.complete, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, delay: 0.7 });
    gsap.fromTo(this.el.complete.querySelector('.panel'),
      { scale: 0.92, y: 24 }, { scale: 1, y: 0, duration: 0.9, delay: 0.7, ease: 'expo.out' });
    this._setBack(true);
  }

  hideComplete() {
    this._setBack(false);
    return gsap.to(this.el.complete, { autoAlpha: 0, duration: 0.4 });
  }

  showEnd(totalTime) {
    this.el.endMeta.textContent = formatTime(totalTime);
    gsap.fromTo(this.el.end, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, delay: 0.6 });
    this._setBack(true);
  }

  hideEnd() {
    this._setBack(false);
    return gsap.to(this.el.end, { autoAlpha: 0, duration: 0.4 });
  }

  /* ---------------- cinematic dressing -------------------------------- */

  letterbox(show) {
    gsap.to(this.bars, {
      height: show ? '7vh' : 0, duration: 0.9, ease: 'power3.inOut',
    });
  }

  /** Fade to black and back. Runs `between` at full black. */
  async veilTransition(between) {
    await gsap.to(this.el.veil, { autoAlpha: 1, duration: 0.55, ease: 'power2.in' });
    await between?.();
    await gsap.to(this.el.veil, { autoAlpha: 0, duration: 0.8, ease: 'power2.out' });
  }

  onClick(elName, fn) {
    this.el[elName].addEventListener('click', fn);
  }
}
