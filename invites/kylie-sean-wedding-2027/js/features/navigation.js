/**
 * Minimal fixed navigation: monogram, current chapter, RSVP shortcut and a
 * hairline reading-progress rule. Each item samples the surface beneath it so
 * it stays legible over ivory paper, black stationery and the dark table alike.
 */

export function initNavigation({ root, w, reducedMotion }) {
  const bar = root.querySelector('[data-topbar]');
  const num = bar.querySelector('[data-nav-num]');
  const label = bar.querySelector('[data-nav-label]');
  const chapter = bar.querySelector('.topbar__chapter');
  const progressBar = bar.querySelector('[data-progress-bar]');
  const toned = [bar.querySelector('.topbar__mono'), chapter, bar.querySelector('.topbar__rsvp'), progressBar.parentElement];
  let motion = null;
  let lastSample = 0;

  function sampleTones() {
    toned.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const under = document.elementsFromPoint(x, y).find((n) => !bar.contains(n));
      const theme = under?.closest('[data-theme]')?.dataset.theme || 'dark';
      if (el.dataset.tone !== theme) el.dataset.tone = theme;
    });
  }

  function setChapter(section) {
    const key = section?.dataset.nav;
    const entry = key && w.navigation[key];
    if (!entry) {
      chapter.classList.remove('is-shown');
      return;
    }
    chapter.classList.remove('is-shown');
    // let the old label fade before swapping text
    setTimeout(() => {
      num.textContent = entry.num;
      label.textContent = entry.label;
      chapter.classList.add('is-shown');
    }, reducedMotion() ? 0 : 180);
  }

  function setProgress(p) {
    progressBar.style.transform = `scaleX(${p.toFixed(4)})`;
    const now = performance.now();
    if (now - lastSample > 90) {
      lastSample = now;
      sampleTones();
    }
  }

  function goto(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = motion ? motion.targetFor(el) : el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, top - 8), behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  root.addEventListener('click', (e) => {
    const link = e.target.closest('[data-goto]');
    if (!link) return;
    e.preventDefault();
    goto(link.dataset.goto);
  });

  return {
    attach(m) {
      motion = m;
    },
    show() {
      bar.classList.add('is-visible');
      sampleTones();
    },
    onNav: setChapter,
    onProgress: setProgress,
    goto,
  };
}
