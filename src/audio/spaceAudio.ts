/**
 * Procedural deep-space ambience — synthesized live in WebAudio, no files.
 *
 *   · three detuned sine drones forming an open fifth chord, breathing
 *     through a slow-LFO lowpass (the "hull hum")
 *   · a whisper of bandpassed noise (solar wind)
 *   · sparse pentatonic chimes echoing through a feedback delay
 *     (distant beacons)
 *
 * Everything hangs off one AudioContext created on the first user
 * gesture (the "Enter the void" click), which is when browsers allow it.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let running = false;

const MASTER_LEVEL = 0.16;

function noiseBuffer(context: AudioContext, seconds = 2): AudioBuffer {
  const buf = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function lfo(context: AudioContext, freq: number, depth: number, target: AudioParam): void {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.frequency.value = freq;
  gain.gain.value = depth;
  osc.connect(gain);
  gain.connect(target);
  osc.start();
}

function buildGraph(context: AudioContext, out: GainNode): void {
  // ── drones ── D2 / A2 / D3-ish open chord, each a detuned pair
  const droneBus = context.createGain();
  droneBus.gain.value = 0.5;
  const droneFilter = context.createBiquadFilter();
  droneFilter.type = 'lowpass';
  droneFilter.frequency.value = 620;
  droneFilter.Q.value = 0.4;
  lfo(context, 0.017, 260, droneFilter.frequency); // filter breathes ~once a minute
  droneBus.connect(droneFilter);
  droneFilter.connect(out);

  const voices: Array<[number, number, number]> = [
    // [freq, level, swell-rate]
    [73.42, 0.5, 0.021],
    [110.0, 0.34, 0.031],
    [146.83, 0.2, 0.043],
    [220.0, 0.09, 0.057],
  ];
  voices.forEach(([freq, level, rate], i) => {
    for (const detune of [-2.4, 2.4]) {
      const osc = context.createOscillator();
      osc.type = i > 1 ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      osc.detune.value = detune;
      const g = context.createGain();
      g.gain.value = level * 0.5;
      lfo(context, rate, level * 0.28, g.gain); // independent slow swells
      osc.connect(g);
      g.connect(droneBus);
      osc.start();
    }
  });

  // ── solar wind ── faint bandpassed noise, drifting
  const wind = context.createBufferSource();
  wind.buffer = noiseBuffer(context, 4);
  wind.loop = true;
  const windFilter = context.createBiquadFilter();
  windFilter.type = 'bandpass';
  windFilter.frequency.value = 1900;
  windFilter.Q.value = 1.6;
  lfo(context, 0.041, 700, windFilter.frequency);
  const windGain = context.createGain();
  windGain.gain.value = 0.012;
  lfo(context, 0.027, 0.006, windGain.gain);
  wind.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(out);
  wind.start();

  // ── beacon chimes ── sparse pentatonic pings into a feedback echo
  const delay = context.createDelay(3);
  delay.delayTime.value = 0.9;
  const feedback = context.createGain();
  feedback.gain.value = 0.42;
  const echoTone = context.createBiquadFilter();
  echoTone.type = 'lowpass';
  echoTone.frequency.value = 2200;
  delay.connect(feedback);
  feedback.connect(echoTone);
  echoTone.connect(delay);
  const echoOut = context.createGain();
  echoOut.gain.value = 0.55;
  delay.connect(echoOut);
  echoOut.connect(out);

  const SCALE = [293.66, 329.63, 392.0, 440.0, 587.33, 659.26]; // D pentatonic
  const chime = () => {
    if (!ctx) return;
    // keep the scheduler alive while muted — just skip the ping
    if (!running) {
      window.setTimeout(chime, 4000);
      return;
    }
    const t = context.currentTime;
    const osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = SCALE[Math.floor(Math.random() * SCALE.length)];
    const g = context.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.04, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
    osc.connect(g);
    g.connect(out);
    g.connect(delay);
    osc.start(t);
    osc.stop(t + 3);
    window.setTimeout(chime, 6000 + Math.random() * 9000);
  };
  window.setTimeout(chime, 2500);
}

/** Start the ambience (must be called from a user gesture). Safe to call twice. */
export function startSpaceAudio(): void {
  if (ctx) {
    resumeSpaceAudio();
    return;
  }
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  buildGraph(ctx, master);
  running = true;
  // fade in over 4s — the universe hums awake
  master.gain.linearRampToValueAtTime(MASTER_LEVEL, ctx.currentTime + 4);
}

export function pauseSpaceAudio(): void {
  if (!ctx || !master) return;
  running = false;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
}

export function resumeSpaceAudio(): void {
  if (!ctx || !master) return;
  void ctx.resume();
  running = true;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
  master.gain.linearRampToValueAtTime(MASTER_LEVEL, ctx.currentTime + 1.6);
}

/** One-shot rising whoosh for the wormhole opening. */
export function playWormholeWhoosh(): void {
  if (!ctx || !master) return;
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 3);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.Q.value = 2.2;
  filter.frequency.setValueAtTime(120, t);
  filter.frequency.exponentialRampToValueAtTime(3800, t + 1.3);
  filter.frequency.exponentialRampToValueAtTime(180, t + 2.4);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.34, t + 1.1);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);
  src.connect(filter);
  filter.connect(g);
  g.connect(master);
  src.start(t);
  src.stop(t + 2.6);
}
