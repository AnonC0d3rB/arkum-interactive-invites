import { html } from '../lib/dom.js';
import { asset } from '../lib/assets.js';
import { numericDate } from '../lib/format.js';
import { dotDate } from './shared.js';

/**
 * The physical invitation card: a front cover hinged on its left edge over an
 * inside page. The lace ribbon and wax seal live on the cover so they travel
 * with it when it opens.
 */
export function opening(w) {
  const { couple, opening: o } = w;
  return html`
  <section class="opening" id="opening" aria-label="Invitation — ${couple.first} and ${couple.second}">
    <div class="opening__table" aria-hidden="true"></div>
    <div class="opening__shade" aria-hidden="true"></div>

    <div class="opening__stage">
      <div class="invite" data-invite>
       <div class="invite__press">
        <div class="invite__inside paper" aria-hidden="true">
          <div class="invite__inside-content">
            ${asset('ornament-corner', { cls: 'invite__inside-orn', eager: true })}
            <p class="invite__inside-title">${o.insideTitle}</p>
          </div>
          <span class="invite__inside-shadow"></span>
        </div>

        <div class="invite__cover">
          <div class="invite__face invite__front paper">
            <span class="invite__edge" aria-hidden="true"></span>
            <span class="invite__rule" aria-hidden="true"></span>
            <div class="invite__front-content">
              <p class="invite__names">
                <span class="invite__name">${couple.first}</span>
                <span class="invite__amp">&amp;</span>
                <span class="invite__name">${couple.second}</span>
              </p>
              ${asset('divider-vine', { cls: 'invite__divider', eager: true })}
              <p class="invite__hosts">${o.hosts}</p>
            </div>
            <p class="invite__date">${dotDate(numericDate(w.event))}</p>
            <div class="ribbon-clip" aria-hidden="true">
              <span class="ribbon ribbon--shadow" data-ribbon-shadow></span>
              <span class="ribbon" data-ribbon></span>
              <span class="seal" data-seal>
                <span class="seal__shadow"></span>
                ${asset('sprite-seal', { cls: 'seal__img', eager: true })}
              </span>
            </div>
            <span class="invite__sheen" aria-hidden="true"></span>
          </div>
          <div class="invite__face invite__back paper" aria-hidden="true">
            <span class="invite__back-mono">${couple.monogram[0]}<i>&amp;</i>${couple.monogram[1]}</span>
          </div>
        </div>
       </div>
      </div>
    </div>

    <div class="opening__controls">
      <button class="opening__cta" type="button" data-open>
        <span class="opening__cta-label">${o.cta}</span>
        <span class="opening__cta-ring" aria-hidden="true"></span>
      </button>
      <p class="opening__hint" aria-hidden="true"><span>${o.hint}</span><i></i></p>
    </div>
  </section>
  <div class="opening-expand paper" aria-hidden="true"></div>`;
}
