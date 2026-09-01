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
    this._jetGain = null;
    this._jetFilter = null;
    this._jetOsc = null;
    this._jetNoise = null;
  }

  /** Must be called from a user gesture (browser autoplay policy). */
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.6;
    this.master.connect(this.ctx.destination);
    this._startAmbient();
    this._initJetpackSynth();
  }

  _initJetpackSynth() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    // Continuous looping white noise buffer for thruster exhaust
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this._jetNoise = this.ctx.createBufferSource();
    this._jetNoise.buffer = noiseBuffer;
    this._jetNoise.loop = true;

    this._jetFilter = this.ctx.createBiquadFilter();
    this._jetFilter.type = 'bandpass';
    this._jetFilter.frequency.setValueAtTime(450, t);
    this._jetFilter.Q.setValueAtTime(2.2, t);

    // Deep sub-harmonic turbine oscillator
    this._jetOsc = this.ctx.createOscillator();
    this._jetOsc.type = 'sawtooth';
    this._jetOsc.frequency.setValueAtTime(65, t);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.25, t);
    this._jetOsc.connect(oscGain);

    this._jetGain = this.ctx.createGain();
    this._jetGain.gain.setValueAtTime(0, t);

    this._jetNoise.connect(this._jetFilter);
    this._jetFilter.connect(this._jetGain);
    oscGain.connect(this._jetGain);
    this._jetGain.connect(this.master);

    this._jetNoise.start(t);
    this._jetOsc.start(t);
  }

  updateJetpack(active, intensity = 1.0) {
    if (!this.ctx || !this._jetGain || this.muted) return;
    const t = this.ctx.currentTime;
    const targetGain = active ? Math.min(0.28, 0.08 + intensity * 0.2) : 0;
    const targetFreq = 400 + intensity * 600;
    const targetOsc = 60 + intensity * 50;

    this._jetGain.gain.setTargetAtTime(targetGain, t, 0.08);
    this._jetFilter.frequency.setTargetAtTime(targetFreq, t, 0.08);
    this._jetOsc.frequency.setTargetAtTime(targetOsc, t, 0.08);
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
  coin() {
    this._blip(987, { type: 'sine', dur: 0.08, vol: 0.12, slide: 300 });
    setTimeout(() => this._blip(1318, { type: 'triangle', dur: 0.1, vol: 0.14 }), 35);
  }

  whoosh() {
    this._noise({ dur: 0.14, vol: 0.12, freq: 800 });
    this._blip(340, { type: 'sine', dur: 0.15, vol: 0.08, slide: 120 });
  }

  slide() {
    this._noise({ dur: 0.35, vol: 0.16, freq: 450 });
  }

  powerup() {
    this._blip(440, { type: 'triangle', dur: 0.12, vol: 0.14 });
    setTimeout(() => this._blip(554, { type: 'triangle', dur: 0.12, vol: 0.14 }), 60);
    setTimeout(() => this._blip(659, { type: 'triangle', dur: 0.14, vol: 0.16 }), 120);
    setTimeout(() => this._blip(880, { type: 'sine', dur: 0.3, vol: 0.18 }), 180);
  }

  relic() {
    this._blip(659, { type: 'triangle', dur: 0.25, vol: 0.12 });
    setTimeout(() => this._blip(880, { type: 'sine', dur: 0.35, vol: 0.14 }), 80);
    setTimeout(() => this._blip(1318, { type: 'sine', dur: 0.45, vol: 0.16 }), 160);
  }

  scanner() {
    this._blip(980, { type: 'sine', dur: 0.35, vol: 0.12, slide: 400 });
    setTimeout(() => this._blip(1480, { type: 'triangle', dur: 0.25, vol: 0.08 }), 120);
  }

  resource() {
    this._blip(523, { type: 'sine', dur: 0.15, vol: 0.12 });
    setTimeout(() => this._blip(1046, { type: 'triangle', dur: 0.22, vol: 0.14 }), 70);
  }

  alarm() {
    this._blip(880, { type: 'sawtooth', dur: 0.3, vol: 0.16, slide: -220 });
    setTimeout(() => this._blip(880, { type: 'sawtooth', dur: 0.3, vol: 0.16, slide: -220 }), 280);
  }

  laser() {
    this._blip(1200, { type: 'sawtooth', dur: 0.14, vol: 0.14, slide: -800 });
  }

  impact() {
    this._noise({ dur: 0.25, vol: 0.25, freq: 220 });
    this._blip(120, { type: 'sine', dur: 0.3, vol: 0.2, slide: -60 });
  }

  explosion() {
    this._noise({ dur: 0.8, vol: 0.35, freq: 160 });
    this._blip(80, { type: 'triangle', dur: 0.9, vol: 0.3, slide: -40 });
  }

  warpEngage() {
    this._blip(220, { type: 'sine', dur: 0.45, vol: 0.22, slide: 880 });
    setTimeout(() => this._blip(440, { type: 'sawtooth', dur: 0.35, vol: 0.18, slide: 1200 }), 80);
    this._noise({ dur: 0.7, vol: 0.28, freq: 1200 });
  }

  warpExit() {
    this._noise({ dur: 0.6, vol: 0.3, freq: 300 });
    this._blip(600, { type: 'triangle', dur: 0.5, vol: 0.22, slide: -450 });
  }

  click() { this._blip(660, { dur: 0.08, vol: 0.08 }); }
}
