let _ctx = null;
let _enabled = true;

function ctx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  return _ctx;
}

function beep(freq, dur, type = 'sine', vol = 0.25) {
  if (!_enabled) return;
  try {
    const c = ctx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + dur);
  } catch {}
}

export const sounds = {
  click:    () => beep(900, 0.04, 'square', 0.08),
  question: () => beep(620, 0.07, 'sine', 0.2),
  answer:   () => { beep(520, 0.05); setTimeout(() => beep(720, 0.08), 60); },
  eliminate:() => beep(280, 0.06, 'square', 0.12),
  restore:  () => beep(480, 0.06, 'square', 0.1),
  guess:    () => beep(800, 0.1, 'sine', 0.2),
  win:      () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.18, 'sine', 0.28), i * 110)),
  lose:     () => [380, 320, 260].forEach((f, i) => setTimeout(() => beep(f, 0.18, 'sine', 0.28), i * 110)),
  roundWin: () => [523, 659, 784].forEach((f, i) => setTimeout(() => beep(f, 0.14, 'sine', 0.25), i * 100)),
  roundLose:() => [380, 340, 300].forEach((f, i) => setTimeout(() => beep(f, 0.14, 'sine', 0.25), i * 90)),
};

export function setSoundEnabled(v) { _enabled = v; }
export function isSoundEnabled() { return _enabled; }
