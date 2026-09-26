import { html } from '../lib/dom.js';
import { asset } from '../lib/assets.js';
import { eventParts, longDate, twelveHour } from '../lib/format.js';
import { head, crease } from './shared.js';

/** Chapter Three — a pinned scene: the line, then the printed card rising. */
export function nextChapterScene(w) {
  const n = w.nextChapter;
  const p = eventParts(w.event);
  return html`
  <section class="scene scene--next" id="next-chapter" data-scene data-nav="next-chapter" data-theme="dark"
    aria-labelledby="wedding-card-title">
    <div class="scene__pin">
      <p class="eyebrow eyebrow--light scene__eyebrow" data-at="0,0.34"><span>${n.eyebrow}</span></p>
      <p class="scene__lead">
        <span data-at="0.01,0.34">${n.lead[0]}</span>
        <span data-at="0.09,0.34">${n.lead[1]}</span>
      </p>
      <div class="scene__card" data-at="0.36" data-rise>
        <article class="wcard paper">
          <span class="wcard__rule" aria-hidden="true"></span>
          <span class="wcard__corner wcard__corner--tl" aria-hidden="true">${asset('ornament-corner')}</span>
          <span class="wcard__corner wcard__corner--br" aria-hidden="true">${asset('ornament-corner')}</span>
          <div class="wcard__content">
            <p class="wcard__eyebrow">${w.couple.first} &amp; ${w.couple.second}</p>
            <h2 class="wcard__title" id="wedding-card-title">${n.cardTitle}</h2>
            <p class="wcard__date">
              <span class="wcard__side">${p.weekday}</span>
              <span class="wcard__day">${p.day}</span>
              <span class="wcard__side">${p.month}</span>
            </p>
            <p class="wcard__year">${p.year}</p>
            <p class="wcard__time"><em>${n.timePhrase}</em><span>${w.event.ceremonyTime}</span></p>
            ${asset('divider-fleuron', { cls: 'wcard__divider' })}
            <p class="wcard__venue">${w.venue.name}</p>
            <p class="wcard__city">${w.venue.city}, ${w.venue.country}</p>
          </div>
        </article>
      </div>
    </div>
  </section>`;
}

/** Chapter Four — the ceremony, framed by a fine gold line that draws itself. */
export function ceremonySheet(w) {
  const c = w.ceremony;
  const t = twelveHour(w.event.ceremonyTime);
  return html`
  <article class="sheet sheet--ivory" data-theme="light">
    <section class="chapter ceremony" id="ceremony" data-nav="ceremony" aria-labelledby="ceremony-title">
      ${head({ eyebrow: c.eyebrow, title: c.title, id: 'ceremony-title' })}
      <p class="bigtime" data-reveal="up">
        <span class="bigtime__hm">${t.hm}</span><span class="bigtime__m">${t.meridiem}</span>
      </p>
      <p class="ceremony__line" data-reveal="up" style="--d:.15s">${c.invitation}</p>

      <div class="frame" data-reveal="frame">
        <svg class="frame__svg" aria-hidden="true" focusable="false"><path class="frame__path" pathLength="1"></path></svg>
        <span class="frame__gem frame__gem--top" aria-hidden="true"></span>
        <span class="frame__gem frame__gem--bottom" aria-hidden="true"></span>
        <dl class="frame__list">
          <div class="frame__row">
            <dt>When</dt>
            <dd>${longDate(w.event)} <span class="frame__sep">·</span> ${w.event.ceremonyTime}</dd>
          </div>
          ${c.details.map(
            (d) => html`<div class="frame__row"><dt>${d.label}</dt><dd>${d.value}</dd></div>`,
          )}
        </dl>
        <p class="frame__note">${c.note}</p>
        <span class="frame__sprig" data-parallax="0.12" aria-hidden="true">${asset('sprite-sprig-leaf')}</span>
      </div>
    </section>
  </article>`;
}

/** The table between ceremony and celebration: the light changes. */
export function duskInterlude(w) {
  return html`
  <div class="dusk" data-progress="through" data-theme="dark">
    <span class="dusk__glow" aria-hidden="true"></span>
    <p class="dusk__line">${w.celebration.transition}</p>
  </div>`;
}

/** Chapter Five — the evening, on black stationery. Includes the dress code. */
export function celebrationSheet(w) {
  const c = w.celebration;
  const d = w.dressCode;
  const t = twelveHour(w.event.receptionTime);
  return html`
  <article class="sheet sheet--noir" data-theme="dark">
    <div class="glow" aria-hidden="true"><span></span><span></span><span></span></div>
    <section class="chapter celebration" id="celebration" data-nav="celebration" aria-labelledby="celebration-title">
      <span class="celebration__garland" data-reveal="draw" aria-hidden="true">${asset('sprite-garland-gold')}</span>
      ${head({ eyebrow: c.eyebrow, title: c.title, tone: 'head--light', id: 'celebration-title' })}
      <p class="triad" data-reveal="up">
        ${c.subtitle.map((s, i) => html`${i ? html`<i aria-hidden="true">•</i>` : ''}<span>${s}</span>`)}
      </p>
      <p class="bigtime bigtime--light" data-reveal="glow">
        <span class="bigtime__hm">${t.hm}</span><span class="bigtime__m">${t.meridiem}</span>
      </p>
      <ol class="programme">
        ${c.programme.map(
          (p, i) => html`
          <li class="programme__item" data-reveal="up" style="--d:${0.12 * i}s">
            <span class="programme__time">${p.time}</span>
            <span class="programme__leader" aria-hidden="true"></span>
            <div class="programme__body">
              <h3 class="programme__title">${p.title}</h3>
              <p class="programme__text">${p.text}</p>
            </div>
          </li>`,
        )}
      </ol>
    </section>

    ${crease({ dark: true })}

    <section class="chapter dress" id="dress-code" aria-labelledby="dress-title">
      ${head({ eyebrow: d.eyebrow, title: d.title, tone: 'head--light', id: 'dress-title' })}
      <p class="dress__style" data-reveal="up">${d.style}</p>
      <div class="dress__groups">
        ${d.groups.map(
          (g, i) => html`
          <div class="dress__group" data-reveal="up" style="--d:${0.15 + i * 0.18}s">
            <p class="dress__label">${g.label}</p>
            <p class="dress__value">${g.value}</p>
            <p class="dress__text">${g.text}</p>
          </div>`,
        )}
        <span class="dress__divider" data-reveal="fade" style="--d:.2s" aria-hidden="true"></span>
      </div>
      <p class="eyebrow eyebrow--light palette__label" data-reveal="rule"><span>${d.paletteLabel}</span></p>
      <ul class="palette">
        ${d.palette.map(
          (p, i) => html`
          <li class="palette__item" data-reveal="deal" style="--i:${i}">
            <span class="swatch swatch--${p.swatch}" aria-hidden="true"></span>
            <span class="palette__name">${p.name}</span>
          </li>`,
        )}
      </ul>
      <p class="dress__note" data-reveal="up">${d.note}</p>
    </section>
  </article>`;
}
