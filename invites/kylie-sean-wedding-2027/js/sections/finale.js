import { html } from '../lib/dom.js';
import { asset } from '../lib/assets.js';
import { numericDate } from '../lib/format.js';
import { dotDate } from './shared.js';

/** Chapter Ten — a slow, quiet pinned scene, ending on the final card. */
export function finaleScene(w) {
  const [first, second, third] = w.finale.lines;
  return html`
  <section class="scene scene--finale" id="finale" data-scene data-nav="finale" data-theme="dark" aria-label="${first}">
    <div class="scene__pin">
      <p class="finale__line finale__line--first" data-at="0.02,0.24">${first}</p>
      <div class="finale__pair">
        <p class="finale__line finale__line--strong" data-at="0.27,0.6">${second}</p>
        <p class="finale__line" data-at="0.36,0.6">${third}</p>
      </div>
      <div class="scene__card" data-at="0.64" data-rise>
        <div class="fcard paper">
          <span class="fcard__rule" aria-hidden="true"></span>
          <span class="fcard__wreath" aria-hidden="true">${asset('wreath')}</span>
          <p class="fcard__names">${w.couple.first} <span>&amp;</span> ${w.couple.second}</p>
          <p class="fcard__date">${dotDate(numericDate(w.event))}</p>
        </div>
      </div>
    </div>
  </section>`;
}

export function farewell(w) {
  const f = w.farewell;
  return html`
  <footer class="farewell" id="farewell" data-theme="dark">
    <span class="farewell__orn" data-reveal="draw" aria-hidden="true">${asset('divider-scroll')}</span>
    <h2 class="script-title farewell__title" data-reveal="write">${f.title}</h2>
    <div class="farewell__actions" data-reveal="up" style="--d:.4s">
      <a class="btn btn--solid btn--on-dark" href="#rsvp" data-goto="rsvp"><span>${f.rsvp}</span></a>
      <a class="btn btn--ghost" href="#next-chapter" data-goto="next-chapter"><span>${f.details}</span></a>
    </div>
    <p class="signature" data-reveal="fade" style="--d:.8s">${f.signature}</p>
  </footer>`;
}

export function topbar(w) {
  const [a, b] = w.couple.monogram;
  return html`
  <header class="topbar" data-topbar data-tone="dark">
    <a class="topbar__mono" href="#beginning" data-goto="beginning" aria-label="Back to the beginning">${a}<span>&amp;</span>${b}</a>
    <p class="topbar__chapter" aria-hidden="true">
      <span class="topbar__num" data-nav-num></span><span class="topbar__label" data-nav-label></span>
    </p>
    <a class="topbar__rsvp" href="#rsvp" data-goto="rsvp">RSVP</a>
    <span class="topbar__progress" aria-hidden="true"><i data-progress-bar></i></span>
  </header>`;
}
