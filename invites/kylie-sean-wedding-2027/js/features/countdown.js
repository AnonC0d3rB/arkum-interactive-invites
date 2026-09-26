/**
 * Live countdown with per-digit roll transitions. Updates once a second and
 * pauses while the clock is off-screen.
 */

import { eventInstant } from '../lib/format.js';

function split(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

function renderDigits(el, value, reduced) {
  const text = String(value).padStart(2, '0');
  let slots = Array.from(el.children);
  // (re)build slots when the number of digits changes
  if (slots.length !== text.length) {
    el.textContent = '';
    for (let i = 0; i < text.length; i++) {
      const slot = document.createElement('span');
      slot.className = 'clock__slot';
      const d = document.createElement('span');
      d.className = 'clock__digit';
      d.textContent = text[i];
      slot.appendChild(d);
      el.appendChild(slot);
    }
    return;
  }
  slots.forEach((slot, i) => {
    const current = slot.lastElementChild;
    if (current.textContent === text[i]) return;
    if (reduced) {
      current.textContent = text[i];
      return;
    }
    const next = document.createElement('span');
    next.className = 'clock__digit clock__digit--in';
    next.textContent = text[i];
    current.classList.add('clock__digit--out');
    slot.appendChild(next);
    current.addEventListener('animationend', () => current.remove(), { once: true });
    setTimeout(() => current.isConnected && current.remove(), 900);
  });
}

export function initCountdown(root, w, { reducedMotion }) {
  const clock = root.querySelector('[data-countdown]');
  if (!clock) return;
  const target = eventInstant(w.event, w.event.ceremonyTime).getTime();
  if (!Number.isFinite(target)) {
    // a malformed date in the content file should never render NaN
    console.warn('Countdown: invalid event date/time in content.');
    clock.hidden = true;
    return;
  }
  const els = Object.fromEntries(
    Array.from(clock.querySelectorAll('[data-unit]')).map((el) => [el.dataset.unit, el]),
  );
  const srText = root.querySelector('[data-countdown-text]');
  let timer = null;
  let lastMinute = null;

  const tick = () => {
    const remaining = target - Date.now();
    const parts = split(remaining);
    Object.entries(parts).forEach(([k, v]) => renderDigits(els[k], v, reducedMotion()));
    if (remaining <= 0) {
      clock.classList.add('is-complete');
      if (srText) srText.textContent = w.countdown.complete;
      stop();
      return;
    }
    if (srText && parts.minutes !== lastMinute) {
      lastMinute = parts.minutes;
      srText.textContent = `${parts.days} days, ${parts.hours} hours and ${parts.minutes} minutes to go.`;
    }
  };

  const start = () => {
    if (timer) return;
    tick();
    // align to the next whole second so digits change together
    timer = setTimeout(function loop() {
      tick();
      timer = setTimeout(loop, 1000 - (Date.now() % 1000));
    }, 1000 - (Date.now() % 1000));
  };
  const stop = () => {
    clearTimeout(timer);
    timer = null;
  };

  tick();
  new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
    rootMargin: '200px 0px',
  }).observe(clock);
}
