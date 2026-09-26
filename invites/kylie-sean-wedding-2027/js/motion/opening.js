/**
 * The opening: a physical card on a dark table.
 *
 *   1. the room darkens and the card lifts slightly
 *   2. the lace ribbon is carried in from beyond the viewport on a damped
 *      spring — its velocity drives lift, shadow height, shear and flutter
 *   3. the ribbon settles, its ends wrap behind the card edges
 *   4. a wax seal presses down and the card gives under it
 *   5. the cover swings open on its hinge, revealing the inside page
 *   6. the inside page grows into the first sheet of the story
 *
 * A second tap fast-forwards. Reduced motion gets a quiet cross-fade.
 */

import { spring, clamp, lerp } from '../lib/animate.js';

export function initOpening({ root, reducedMotion, onOpened }) {
  const section = root.querySelector('.opening');
  const expand = root.querySelector('.opening-expand');
  const html = document.documentElement;
  const stage = section.querySelector('.opening__stage');
  const invite = section.querySelector('[data-invite]');
  const front = section.querySelector('.invite__front');
  const inside = section.querySelector('.invite__inside');
  const ribbon = section.querySelector('[data-ribbon]');
  const ribbonShadow = section.querySelector('[data-ribbon-shadow]');
  const clip = section.querySelector('.ribbon-clip');
  const seal = section.querySelector('[data-seal]');
  const cta = section.querySelector('[data-open]');

  let state = 'closed';
  const signal = { fast: false };

  html.classList.add('is-locked');

  /** A timed beat that resolves early when the sequence is fast-forwarded. */
  const pending = new Set();
  const pause = (ms) =>
    new Promise((resolve) => {
      if (signal.fast) ms = Math.min(ms, 120);
      const done = () => {
        clearTimeout(timer);
        pending.delete(done);
        resolve();
      };
      const timer = setTimeout(done, ms);
      pending.add(done);
    });
  const fastForward = () => {
    signal.fast = true;
    section.classList.add('is-fast');
    pending.forEach((done) => done());
  };

  // -------------------------------------------------- idle: pointer tilt --
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  section.addEventListener('pointermove', (e) => {
    if (state !== 'closed' || !finePointer.matches || reducedMotion()) return;
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    stage.style.setProperty('--tilt-x', `${(-y * 7).toFixed(2)}deg`);
    stage.style.setProperty('--tilt-y', `${(x * 9).toFixed(2)}deg`);
  });
  section.addEventListener('pointerleave', () => {
    stage.style.setProperty('--tilt-x', '0deg');
    stage.style.setProperty('--tilt-y', '0deg');
  });

  // ------------------------------------------------------------ triggers --
  const begin = () => state === 'closed' && run();
  const tapped = () => {
    if (state === 'closed') run();
    else if (state === 'opening') fastForward();
  };
  cta.addEventListener('click', tapped);
  invite.addEventListener('click', tapped);
  // scrolling also opens the invitation (but never fast-forwards it — trackpad
  // momentum would otherwise skip the whole sequence)
  section.addEventListener('wheel', (e) => e.deltaY > 4 && begin(), { passive: true });
  let touchY = null;
  section.addEventListener('touchstart', (e) => (touchY = e.touches[0].clientY), { passive: true });
  section.addEventListener(
    'touchmove',
    (e) => {
      // iOS Safari can still rubber-band the page behind a fixed overlay; the
      // card owns every touch until the story is open
      if (e.cancelable) e.preventDefault();
      if (touchY !== null && touchY - e.touches[0].clientY > 24) {
        touchY = null;
        begin();
      }
    },
    { passive: false },
  );
  const onKey = (e) => {
    if (state === 'done') return;
    if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key) && e.target !== cta) {
      e.preventDefault();
      tapped();
    }
  };
  window.addEventListener('keydown', onKey);

  // ------------------------------------------------------------ geometry --
  function layoutRibbon() {
    const W = front.offsetWidth;
    const H = front.offsetHeight;
    const T = clamp(W * 0.2, 42, 88); // ribbon width
    const L = W * 1.5; // length, overhanging both edges until it wraps
    const cx = W * 0.5;
    const cy = H * 0.785;
    [ribbon, ribbonShadow].forEach((el) => {
      el.style.width = `${L}px`;
      el.style.height = `${T}px`;
      el.style.left = `${cx - L / 2}px`;
      el.style.top = `${cy - T / 2}px`;
    });
    const sealSize = clamp(W * 0.19, 44, 78);
    seal.style.width = seal.style.height = `${sealSize}px`;
    seal.style.left = `${cx - sealSize / 2}px`;
    seal.style.top = `${cy - sealSize / 2}px`;
    return { W, H, T, L, cx, cy };
  }

  // ---------------------------------------------------------------- run ---
  async function run() {
    state = 'opening';
    cta.disabled = true;
    const reduced = reducedMotion();

    if (reduced) {
      section.classList.add('is-leaving');
      await pause(650);
      finish();
      return;
    }

    // 1 — the room darkens, the card lifts
    section.classList.add('is-opening');
    stage.style.setProperty('--tilt-x', '0deg');
    stage.style.setProperty('--tilt-y', '0deg');
    await pause(320);

    // 2 — the ribbon is carried in
    const g = layoutRibbon();
    const rect = front.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // travel direction: arriving from the upper right, heading down-left
    const dir = { x: 0.62, y: -0.785 };
    // far enough that the whole ribbon starts beyond the viewport
    const centre = { x: rect.left + g.cx, y: rect.top + g.cy };
    const toRight = vw - centre.x;
    const toTop = centre.y;
    const distance = Math.max(toRight / dir.x, toTop / -dir.y) + g.L * 0.6 + 40;

    const FINAL_ROT = -7;
    ribbon.style.opacity = ribbonShadow.style.opacity = '1';
    section.classList.add('is-ribbon');

    await spring({
      from: 1,
      to: 0,
      stiffness: 38,
      damping: 10.2,
      signal,
      onUpdate: (s, v) => {
        const lift = Math.pow(clamp(s, 0, 1), 0.75);
        const x = dir.x * distance * s;
        const y = dir.y * distance * s;
        const rot = FINAL_ROT - 32 * s;
        const scale = 1 + 0.22 * lift;
        const shear = clamp(v * 2.2, -7, 7); // trailing drag while moving
        const flutter = clamp(v * 9, -24, 24); // fabric catching the air
        ribbon.style.transform =
          `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) ` +
          `skewX(${shear.toFixed(2)}deg) rotateX(${flutter.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        const sx = x + lerp(3, 34, lift);
        const sy = y + lerp(5, 48, lift);
        ribbonShadow.style.transform =
          `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) ` +
          `skewX(${shear.toFixed(2)}deg) scale(${(scale * 1.02).toFixed(3)})`;
        ribbonShadow.style.opacity = lerp(0.5, 0.16, lift).toFixed(3);
      },
    });

    // 3 — the ends wrap behind the card (clip snaps to just outside the
    // overhang, then closes onto the card edges)
    section.classList.add('is-wrapping');
    void clip.offsetWidth;
    section.classList.replace('is-wrapping', 'is-wrapped');
    await pause(260);

    // 4 — the seal presses, the card gives
    section.classList.add('is-sealed');
    await pause(780);

    // 5 — the cover opens
    section.classList.add('is-open');
    await pause(2900);

    // 6 — the inside page becomes the first sheet
    await grow();
    finish();
  }

  async function grow() {
    const target = document.querySelector('.sheet--first');
    const from = inside.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    const to = {
      left: Math.max(t.left, 0),
      top: Math.max(t.top, 0),
      width: Math.min(t.right, window.innerWidth) - Math.max(t.left, 0),
      height: Math.min(t.bottom, window.innerHeight) - Math.max(t.top, 0),
    };
    Object.assign(expand.style, {
      left: `${to.left}px`,
      top: `${to.top}px`,
      width: `${to.width}px`,
      height: `${to.height}px`,
      transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
    });
    expand.classList.add('is-active');
    void expand.offsetWidth;
    section.classList.add('is-leaving');
    expand.classList.add('is-growing');
    expand.style.transform = 'none';
    await pause(signal.fast ? 250 : 1050);
  }

  function finish() {
    if (state === 'done') return;
    state = 'done';
    window.removeEventListener('keydown', onKey);
    html.classList.remove('is-locked');
    html.classList.add('is-opened');
    window.scrollTo(0, 0);
    onOpened();
    expand.classList.add('is-fading');
    setTimeout(() => {
      section.remove();
      expand.remove();
    }, 900);
  }

  return {
    /** Remove the opening immediately (deep links). */
    skip() {
      state = 'opening';
      finish();
    },
  };
}
