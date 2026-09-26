/**
 * A Story Worth Unfolding — interactive wedding invitation.
 * Arkum Interactive Invite Division.
 *
 * Composition root: renders the sections from content, then wires motion,
 * features and the RSVP.
 */

import { wedding } from './content/wedding.js';
import { config } from './config.js';
import { wait } from './lib/animate.js';
import { esc } from './lib/dom.js';

import { opening } from './sections/opening.js';
import { beginningSheet } from './sections/beginning.js';
import { nextChapterScene, ceremonySheet, duskInterlude, celebrationSheet } from './sections/wedding.js';
import { venueSheet, countdownSheet } from './sections/details.js';
import { memoriesSheet } from './sections/memories.js';
import { rsvpSection } from './sections/rsvp.js';
import { finaleScene, farewell, topbar } from './sections/finale.js';

import { initOpening } from './motion/opening.js';
import { createScrollMotion } from './motion/scroll.js';
import { initFrames } from './motion/frames.js';
import { initNavigation } from './features/navigation.js';
import { initCountdown } from './features/countdown.js';
import { initCalendar } from './features/calendar.js';
import { initRsvp } from './rsvp/view.js';

const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
// `?reduced` previews the reduced-motion experience without changing OS settings
const forceReduced = new URLSearchParams(location.search).has('reduced');
const reducedMotion = () => forceReduced || reducedQuery.matches;

function render(root, w) {
  root.innerHTML = [
    topbar(w),
    opening(w),
    '<main class="invitation" id="invitation">',
    // the page's single top-level heading; the opening card is removed once opened
    `<h1 class="sr-only">${esc(w.couple.first)} &amp; ${esc(w.couple.second)} — wedding invitation</h1>`,
    beginningSheet(w),
    nextChapterScene(w),
    ceremonySheet(w),
    duskInterlude(w),
    celebrationSheet(w),
    venueSheet(w),
    countdownSheet(w),
    memoriesSheet(w),
    rsvpSection(w),
    finaleScene(w),
    farewell(w),
    '</main>',
  ].join('');
}

async function fontsReady() {
  if (!document.fonts) return;
  await Promise.race([
    Promise.all([document.fonts.load('400 1em Armelie'), document.fonts.load('400 1em "Cormorant Garamond"')]),
    wait(2500),
  ]);
}

async function boot() {
  const root = document.getElementById('app');
  const w = wedding;
  document.title = `${w.couple.first} & ${w.couple.second} — ${w.opening.insideTitle}`;

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  render(root, w);
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.toggle('is-reduced', forceReduced);

  const nav = initNavigation({ root, w, reducedMotion });
  const motion = createScrollMotion({
    root,
    reducedMotion,
    onNav: nav.onNav,
    onProgress: nav.onProgress,
  });
  nav.attach(motion);

  initFrames(root);
  initCountdown(root, w, { reducedMotion });
  initCalendar(root, w);
  initRsvp(root, w, { rsvpConfig: config.rsvp, reducedMotion });

  const hashTarget = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  const deepLink = config.opening.skipOnDeepLink && (hashTarget || new URLSearchParams(location.search).has('open'));

  const opened = () => {
    motion.start();
    nav.show();
    const heading = document.getElementById('beginning-title');
    if (heading && !hashTarget) {
      // hand keyboard / screen-reader users straight into the story
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
    if (hashTarget) requestAnimationFrame(() => nav.goto(hashTarget.id));
  };

  const openingCtl = initOpening({ root, reducedMotion, onOpened: opened });

  await fontsReady();
  document.documentElement.classList.add('is-ready');

  if (deepLink) openingCtl.skip();
  else window.scrollTo(0, 0);

  reducedQuery.addEventListener?.('change', () => motion.refresh());
}

boot();
