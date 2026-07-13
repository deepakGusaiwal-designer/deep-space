/**
 * Procedural audio — everything is synthesized with the Web Audio API.
 * No samples, no files. A soft ambient pad plus short UI/gameplay cues.
 */
export class GameAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    this._padNodes = [];
  }

  /** Must be called from a user gesture (browser autoplay policy). */
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.6;
    this.master.connect(this.ctx.destination);
    this._startAmbient();
  }

  toggleMute() {
    if (!this.ctx) return;
    this.muted = !this.muted;
    this.master.gain.linearRampToValueAtTime(
      this.muted ? 0 : 0.6, this.ctx.currentTime + 0.2,
    );
    return this.muted;
  }

  /** Two detuned triangles through a slow-breathing lowpass. */
  _startAmbient() {
    const t = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 4);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 320;

    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 140;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    for (const [freq, detune] of [[55, 0], [55, 6], [110, -4]]) {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      osc.detune.value = detune;
      osc.connect(filter);
      osc.start();
      this._padNodes.push(osc);
    }
    filter.connect(gain).connect(this.master);
  }

  _blip(freq, { type = 'sine', dur = 0.18, vol = 0.25, slide = 0 } = {}) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  /** Filtered noise burst — thuds and dust. */
  _noise({ dur = 0.22, vol = 0.3, freq = 400 } = {}) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filter).connect(g).connect(this.master);
    src.start(t);
  }

  jump() { this._blip(320, { type: 'sine', dur: 0.16, vol: 0.12, slide: 260 }); }
  land(intensity = 1) { this._noise({ dur: 0.18, vol: 0.12 * intensity, freq: 300 }); }
  checkpoint() {
    this._blip(523, { dur: 0.3, vol: 0.1 });
    setTimeout(() => this._blip(784, { dur: 0.45, vol: 0.1 }), 110);
  }
  pad() { this._blip(392, { type: 'triangle', dur: 0.35, vol: 0.14, slide: 120 }); }
  gate() { this._noise({ dur: 0.6, vol: 0.1, freq: 900 }); this._blip(196, { dur: 0.6, vol: 0.08, slide: 160 }); }
  portal() {
    this._blip(262, { dur: 1.2, vol: 0.12, slide: 520 });
    this._noise({ dur: 1.0, vol: 0.08, freq: 1400 });
  }
  fall() { this._blip(240, { type: 'sawtooth', dur: 0.5, vol: 0.06, slide: -180 }); }
  warp() {
    this._blip(180, { type: 'sine', dur: 0.45, vol: 0.14, slide: 700 });
    this._noise({ dur: 0.5, vol: 0.09, freq: 1800 });
  }
  click() { this._blip(660, { dur: 0.08, vol: 0.08 }); }
}
