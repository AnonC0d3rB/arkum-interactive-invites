import { html } from '../lib/dom.js';
import { asset } from '../lib/assets.js';
import { longDate } from '../lib/format.js';
import { config } from '../config.js';
import { head, crease } from './shared.js';

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'];

const arrow = html`<svg class="btn__icon" viewBox="0 0 24 12" aria-hidden="true" focusable="false">
  <path d="M0 6h22M17 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1"/></svg>`;

/** Chapter Six — venue, then the practical information modules. */
export function venueSheet(w) {
  const v = w.venueSection;
  const items = w.details.items.filter((d) => d.enabled);
  return html`
  <article class="sheet sheet--ivory" data-theme="light">
    <section class="chapter venue" id="venue" data-nav="venue" aria-labelledby="venue-title">
      ${head({ eyebrow: v.eyebrow, title: v.title, id: 'venue-title' })}
      <p class="venue__name" data-reveal="up">${w.venue.name}</p>
      <p class="venue__city" data-reveal="up" style="--d:.1s">${w.venue.city}, ${w.venue.country}</p>
      <figure class="venue__art">
        <span class="venue__float venue__float--l" data-parallax="0.12" aria-hidden="true">${asset('sprite-branch-dark')}</span>
        <div class="venue__unveil" data-reveal="unveil">
          ${asset('venue', { alt: `An illustration of ${w.venue.name}` })}
        </div>
        <span class="venue__float venue__float--r" data-parallax="0.2" aria-hidden="true">${asset('sprite-gypsophila-gold')}</span>
      </figure>
      <a class="btn btn--line" href="${config.venue.mapUrl}" target="_blank" rel="noopener" data-reveal="up">
        <span>${v.cta}</span>${arrow}
      </a>
    </section>

    ${crease()}

    <section class="chapter details" id="details" aria-labelledby="details-title">
      ${head({ eyebrow: w.details.eyebrow, title: w.details.title, id: 'details-title' })}
      <div class="details__grid" style="--count:${items.length}">
        ${items.map(
          (d, i) => html`
          <article class="detail detail--${d.id}" data-reveal="detail" style="--d:${(i % 2) * 0.12}s">
            <span class="detail__orn" aria-hidden="true">${asset(d.ornament)}</span>
            <p class="detail__num" aria-hidden="true">${ROMAN[i]}.</p>
            <h3 class="detail__title">${d.title}</h3>
            <p class="detail__lead">${d.lead}</p>
            <p class="detail__text">${d.text}</p>
          </article>`,
        )}
      </div>
    </section>
  </article>`;
}

/** Chapter Seven — live countdown on a warmer paper stock. */
export function countdownSheet(w) {
  const c = w.countdown;
  const units = ['days', 'hours', 'minutes', 'seconds'];
  return html`
  <article class="sheet sheet--beige" data-theme="light">
    <section class="chapter countdown" id="countdown" data-nav="countdown" aria-labelledby="countdown-title">
      <span class="countdown__fern countdown__fern--l" data-parallax="0.1" aria-hidden="true">${asset('sprite-fern-gold')}</span>
      <span class="countdown__fern countdown__fern--r" data-parallax="0.18" aria-hidden="true">${asset('sprite-fern-gold')}</span>
      ${head({ eyebrow: c.eyebrow, title: c.title, id: 'countdown-title' })}
      <div class="clock" data-countdown data-reveal="clock">
        ${units.map(
          (u, i) => html`
          <div class="clock__unit" style="--i:${i}">
            <p class="clock__num" data-unit="${u}" aria-hidden="true"></p>
            <p class="clock__label">${c.units[u]}</p>
          </div>`,
        )}
      </div>
      <p class="sr-only" data-countdown-text aria-live="polite"></p>
      <p class="countdown__caption" data-reveal="up">${c.caption}</p>
      <p class="countdown__date" data-reveal="up" style="--d:.1s">${longDate(w.event)}</p>
    </section>
  </article>`;
}
