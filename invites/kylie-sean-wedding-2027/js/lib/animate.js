/** Minimal animation primitives: easing, tweens and a damped spring. */

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a, b, t) => a + (b - a) * t;
/** Map v from [a, b] to [0, 1], clamped. */
export const range = (v, a, b) => clamp((v - a) / (b - a));

export const ease = {
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outQuint: (t) => 1 - Math.pow(1 - t, 5),
  inOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
  outExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function tween({ duration = 600, easing = ease.outCubic, onUpdate, signal }) {
  return new Promise((resolve) => {
    const start = performance.now();
    const frame = (now) => {
      const t = signal?.fast ? 1 : clamp((now - start) / duration);
      onUpdate(easing(t), t);
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
}

/**
 * Semi-implicit Euler spring from `from` to `to`. Reports value and velocity
 * each frame so callers can derive secondary motion (skew, shadow, tilt).
 */
export function spring({ from = 0, to = 1, stiffness = 120, damping = 14, mass = 1, velocity = 0, onUpdate, signal }) {
  return new Promise((resolve) => {
    let x = from;
    let v = velocity;
    let last = performance.now();
    const frame = (now) => {
      let dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      // integrate in small steps for stability
      const steps = 4;
      dt /= steps;
      for (let i = 0; i < steps; i++) {
        const force = -stiffness * (x - to) - damping * v;
        v += (force / mass) * dt;
        x += v * dt;
      }
      const settled = Math.abs(x - to) < 0.0008 * Math.max(1, Math.abs(to - from)) && Math.abs(v) < 0.01;
      if (settled || signal?.fast) {
        onUpdate(to, 0);
        resolve();
        return;
      }
      onUpdate(x, v);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
}
