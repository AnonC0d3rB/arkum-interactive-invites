import { html, esc, raw } from '../lib/dom.js';
import { asset } from '../lib/assets.js';
import { head } from './shared.js';

/**
 * The window positions of the four frames printed on the album artwork, as
 * percentages of the page (measured from the artwork).
 */
const SLOTS = {
  a: { left: 16.4, top: 15.5, width: 28.4, height: 35.8, rotate: 0 },
  b: { left: 48.0, top: 22.0, width: 28.7, height: 24.9, rotate: 8.5 },
  c: { left: 54.9, top: 52.6, width: 27.3, height: 33.4, rotate: 0 },
  d: { left: 16.4, top: 57.3, width: 34.4, height: 21.7, rotate: 0 },
};

const ART = {
  couple: () => asset('couple', { cls: 'slot__art slot__art--couple' }),
  venue: () => asset('venue', { cls: 'slot__art slot__art--venue' }),
  blossom: () => asset('sprite-blossom-brown', { cls: 'slot__sprite' }),
  seal: () => asset('sprite-seal', { cls: 'slot__sprite slot__sprite--seal' }),
};

function slotContent(frame) {
  if (frame.photo) {
    return raw(`<img class="slot__photo" src="${esc(frame.photo)}" alt="${esc(frame.alt)}" loading="lazy" decoding="async">`);
  }
  return html`
    <div class="slot__paper ${frame.note ? 'slot__paper--note' : ''}" ${frame.alt ? '' : raw('aria-hidden="true"')}>
      ${frame.note ? html`<span class="slot__note">${frame.note[0]}</span>` : ''}
      ${ART[frame.art] ? ART[frame.art]() : ''}
      ${frame.note ? html`<span class="slot__year">${frame.note[1]}</span>` : ''}
    </div>`;
}

export function memoriesSheet(w) {
  const m = w.memories;
  return html`
  <article class="sheet sheet--ivory" data-theme="light">
    <section class="chapter memories" id="memories" data-nav="memories" aria-labelledby="memories-title">
      ${head({ eyebrow: m.eyebrow, title: m.title, id: 'memories-title' })}
      <p class="intro" data-reveal="up">${m.intro}</p>

      <div class="album-layout">
       <div class="album-stack">
        <div class="album-layer" data-parallax="-0.04">
          <figure class="album" data-reveal="album">
            ${asset('album', { cls: 'album__page', alt: '' })}
            ${m.frames.map((f, i) => {
              const s = SLOTS[f.slot];
              return html`
              <div class="album__slot album__slot--${f.slot}" style="--i:${i};left:${s.left}%;top:${s.top}%;width:${s.width}%;height:${s.height}%;--rot:${s.rotate}deg">
                <div class="slot__inner" data-parallax="-0.03">${slotContent(f)}</div>
              </div>`;
            })}
          </figure>
        </div>

        <div class="print-layer" data-parallax="0.12">
          <figure class="print" data-reveal="print">
            <div class="print__paper paper">
              ${asset('sprite-garland-gold', { cls: 'print__garland' })}
              <p class="print__mono">${w.couple.monogram[0]}<span>&amp;</span>${w.couple.monogram[1]}</p>
            </div>
            <figcaption class="print__caption">${m.print.caption}</figcaption>
          </figure>
        </div>
       </div>

        <ol class="captions">
          ${m.captions.map(
            (c, i) => html`
            <li class="caption caption--${i + 1}" data-reveal="up" style="--d:${i * 0.12}s">
              <span class="caption__index" aria-hidden="true">${c.index}.</span>
              <h3 class="caption__title">${c.title}</h3>
              <p class="caption__text">${c.text}</p>
            </li>`,
          )}
        </ol>
        <span class="memories__twig" data-parallax="0.2" aria-hidden="true">${asset('sprite-twig-dark')}</span>
      </div>
    </section>
  </article>`;
}
