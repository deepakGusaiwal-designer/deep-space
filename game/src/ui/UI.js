/**
 * UI — DOM overlays (start, HUD, pause, level complete, finale),
 * all animated with GSAP. Typography only: no images, no icons.
 */
import gsap from 'gsap';
import { formatTime } from '../utils/math.js';

export class UI {
  constructor(root) {
    this.root = root;
    root.innerHTML = /* html */ `
      <div class="vignette"></div>

      <section class="screen screen--start" data-el="start">
        <div class="kicker">Deepak Gusaiwal — Creative Development</div>
        <h1 class="title">DEEP<span class="thin">SPACE</span></h1>
        <button class="prompt glass" data-el="begin">Press <span class="key">Enter</span> to begin</button>
        <div class="controls-hint">
          <span><b>WASD</b> move</span><span><b>Mouse</b> camera</span>
          <span><b>Space</b> jump</span><span><b>Shift</b> sprint</span>
          <span><b>R</b> restart</span><span><b>Esc</b> pause</span>
        </div>
      </section>

      <div class="hud" data-el="hud" style="visibility:hidden">
        <div class="hud__level glass">
          <span class="num" data-el="levelNum"></span>
          <span class="name" data-el="levelName"></span>
        </div>
        <div class="hud__timer glass" data-el="timer">00:00.00</div>
        <div class="hud__keys">shift sprint&ensp;·&ensp;space jump&ensp;·&ensp;r restart&ensp;·&ensp;esc pause</div>
        <div class="hud__toast glass" data-el="toast"></div>
      </div>

      <section class="screen" data-el="pause">
        <div class="panel glass">
          <div class="panel__title">Paused</div>
          <div class="panel__meta" data-el="pauseMeta"></div>
          <div class="btn-row">
            <button class="btn btn--primary" data-el="resume">Resume</button>
            <button class="btn" data-el="restartLevel">Restart level</button>
             <a class="btn" data-el="back" href="/" aria-label="Back to the portfolio">
              ← Portfolio
             </a>
          </div>
        </div>
      </section>

      <section class="screen" data-el="complete">
        <div class="panel glass">
          <div class="kicker" data-el="completeKicker"></div>
          <div class="panel__title">Level Complete</div>
          <div class="panel__meta" data-el="completeMeta"></div>
          <div class="btn-row">
            <button class="btn btn--primary" data-el="continue">Continue →</button>
          </div>
        </div>
      </section>

      <section class="screen" data-el="end">
        <div class="panel glass">
          <div class="kicker">All monuments traversed</div>
          <div class="panel__title">The End</div>
          <div class="panel__meta" data-el="endMeta"></div>
          <div class="btn-row">
            <button class="btn btn--primary" data-el="again">Play again</button>
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
    const s = this.root.querySelector('[data-el="start"]');
    gsap.set(s, { autoAlpha: 1 });
    gsap.from(s.querySelectorAll('.kicker, .title, .subtitle, .prompt, .controls-hint'), {
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
    this.el.levelNum.textContent = `LEVEL ${String(levelIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    this.el.levelName.textContent = name;
    gsap.set(this.el.hud, { visibility: 'visible' });
    gsap.fromTo(
      [this.el.hud.querySelector('.hud__level'), this.el.hud.querySelector('.hud__timer'), this.el.hud.querySelector('.hud__keys')],
      { y: -18, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12, ease: 'expo.out' },
    );
  }

  hideHUD() {
    gsap.to(this.el.hud, {
      autoAlpha: 0, duration: 0.4,
      onComplete: () => gsap.set(this.el.hud, { visibility: 'hidden', opacity: 1 }),
    });
  }

  setTimer(seconds) { this.el.timer.textContent = formatTime(seconds); }

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
    gsap.fromTo(this.el.pause.querySelector('.panel'),
      { scale: 0.94, y: 16 }, { scale: 1, y: 0, duration: 0.5, ease: 'expo.out' });
    this._setBack(true);
  }

  hidePause() {
    this._setBack(false);
    return gsap.to(this.el.pause, { autoAlpha: 0, duration: 0.3 });
  }

  /* ---------------- level complete / finale --------------------------- */

  showComplete(levelName, time) {
    this.el.completeKicker.textContent = levelName;
    this.el.completeMeta.textContent = `Time — ${formatTime(time)}`;
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
    this.el.endMeta.textContent = `Total time — ${formatTime(totalTime)}`;
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
