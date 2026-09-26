/**
 * Scroll-driven motion.
 *
 *   [data-reveal]            one-shot reveal (adds .is-in) when entering view
 *   [data-parallax="0.1"]    depth: positive = nearer (moves faster), negative = further
 *   [data-progress="line"]   sets --p as the element passes the reading line
 *   [data-progress="through"] sets --p from entering (0) to leaving (1) the viewport
 *   [data-scene]             pinned scene; children [data-at="in,out"] receive --v (0..1)
 *   [data-nav]               section tracked by the navigation
 *
 * All reads happen before all writes within a single rAF tick.
 */

import { clamp, range } from '../lib/animate.js';

const SCENE_MIN_HEIGHT = 500; // below this viewport height scenes play unpinned

export function createScrollMotion({ root, reducedMotion, onNav, onProgress }) {
  let vh = window.innerHeight;
  let vw = window.innerWidth;
  let depth = 1; // parallax intensity, eased back on small screens
  let ticking = false;
  let started = false;

  // ------------------------------------------------------------ reveals ----
  const revealIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        revealIO.unobserve(e.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0 },
  );

  // ----------------------------------------------------------- parallax ----
  const parallax = Array.from(root.querySelectorAll('[data-parallax]')).map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax) || 0,
    visible: false,
    y: 0,
  }));
  const visibilityIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const item = e.target.__motion;
        if (item) item.visible = e.isIntersecting;
      });
      requestTick();
    },
    { rootMargin: '25% 0px 25% 0px' },
  );
  parallax.forEach((p) => {
    p.el.__motion = p;
    visibilityIO.observe(p.el);
  });

  // ----------------------------------------------------------- progress ----
  const progress = Array.from(root.querySelectorAll('[data-progress]')).map((el) => ({
    el,
    mode: el.dataset.progress,
    last: -1,
  }));

  // ------------------------------------------------------------- scenes ----
  const scenes = Array.from(root.querySelectorAll('[data-scene]')).map((el) => ({
    el,
    items: Array.from(el.querySelectorAll('[data-at]')).map((item) => {
      const [a, b] = item.dataset.at.split(',').map(Number);
      const rise = item.hasAttribute('data-rise');
      return { el: item, in: a, out: Number.isFinite(b) ? b : null, rise, last: -1, settled: false };
    }),
    pinned: true,
  }));

  function sceneMode() {
    const pinned = !reducedMotion() && vh >= SCENE_MIN_HEIGHT;
    scenes.forEach((s) => {
      s.pinned = pinned;
      s.el.classList.toggle('scene--static', !pinned);
      if (!pinned) {
        // unpinned: every beat is simply revealed as it scrolls into view
        s.items.forEach((it) => {
          it.el.style.setProperty('--v', '1');
          it.last = 1;
          if (reducedMotion()) it.el.classList.add('is-in', 'is-settled');
          else revealIO.observe(it.el);
        });
      }
    });
  }

  // ---------------------------------------------------------------- nav ----
  const navSections = Array.from(root.querySelectorAll('[data-nav]'));
  let activeNav = null;

  // --------------------------------------------------------------- tick ----
  function requestTick() {
    if (!ticking && started) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function update() {
    ticking = false;
    const reduced = reducedMotion();

    // READ
    const pReads = reduced ? [] : parallax.filter((p) => p.visible).map((p) => [p, p.el.getBoundingClientRect()]);
    const progReads = progress.map((p) => [p, p.el.getBoundingClientRect()]);
    const sceneReads = scenes.filter((s) => s.pinned).map((s) => [s, s.el.getBoundingClientRect()]);
    let nav = null;
    for (const el of navSections) {
      const r = el.getBoundingClientRect();
      if (r.top <= vh * 0.45) nav = el;
      else break;
    }
    const docH = document.documentElement.scrollHeight - vh;
    const scrolled = docH > 0 ? clamp(window.scrollY / docH) : 0;

    // WRITE
    for (const [p, r] of pReads) {
      const layoutCenter = r.top - p.y + r.height / 2;
      const y = (layoutCenter - vh / 2) * p.speed * depth;
      if (Math.abs(y - p.y) > 0.1) {
        p.y = y;
        p.el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      }
    }

    for (const [p, r] of progReads) {
      let v;
      if (p.mode === 'line') v = clamp((vh * 0.62 - r.top) / r.height);
      else v = clamp((vh - r.top) / (vh + r.height));
      if (reduced && p.mode === 'line') v = 1;
      if (Math.abs(v - p.last) > 0.001) {
        p.last = v;
        p.el.style.setProperty('--p', v.toFixed(4));
      }
    }

    for (const [s, r] of sceneReads) {
      const span = r.height - vh;
      const p = span > 0 ? clamp(-r.top / span) : 1;
      for (const it of s.items) {
        const fadeIn = it.rise ? 0.26 : 0.07;
        const fadeOut = 0.06;
        let v = range(p, it.in, it.in + fadeIn);
        if (it.out !== null) v *= 1 - range(p, it.out - fadeOut, it.out);
        if (Math.abs(v - it.last) > 0.001) {
          it.last = v;
          it.el.style.setProperty('--v', v.toFixed(4));
        }
        const settled = v > 0.985;
        if (settled !== it.settled) {
          it.settled = settled;
          it.el.classList.toggle('is-settled', settled);
        }
      }
    }

    if (nav !== activeNav) {
      activeNav = nav;
      onNav?.(nav);
    }
    onProgress?.(scrolled);

    // At the very end of the page the last elements can never rise past the
    // reveal line — show whatever is on screen so nothing stays invisible.
    if (docH > 0 && window.scrollY >= docH - 2) {
      root.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
        if (el.getBoundingClientRect().top < vh) {
          el.classList.add('is-in');
          revealIO.unobserve(el);
        }
      });
    }
  }

  function measure() {
    vh = window.innerHeight;
    vw = window.innerWidth;
    depth = vw < 600 ? 0.6 : vw < 1000 ? 0.8 : 1;
    sceneMode();
    requestTick();
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', () => {
    // mobile browsers resize the viewport while the toolbar hides — only
    // re-measure on meaningful changes to avoid jumps
    if (Math.abs(window.innerHeight - vh) > 120 || window.innerWidth !== vw) measure();
    else requestTick();
  });

  return {
    start() {
      started = true;
      const els = root.querySelectorAll('[data-reveal]');
      if (reducedMotion()) els.forEach((el) => el.classList.add('is-in'));
      else els.forEach((el) => revealIO.observe(el));
      measure();
      update();
    },
    refresh: measure,
    /** Scroll position that shows a section at its best (scenes: card settled). */
    targetFor(el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const scene = scenes.find((s) => s.el === el);
      if (scene && scene.pinned) {
        const rise = scene.items.find((it) => it.rise);
        const at = rise ? Math.min(1, rise.in + 0.3) : 0;
        return top + (el.offsetHeight - vh) * at;
      }
      return top;
    },
  };
}
