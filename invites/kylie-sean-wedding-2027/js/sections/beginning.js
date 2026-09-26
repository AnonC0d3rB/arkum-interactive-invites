import { html, words } from '../lib/dom.js';
import { asset } from '../lib/assets.js';
import { head, crease } from './shared.js';

/** Sheet one: Chapter One (the beginning) and Chapter Two (their story). */
export function beginningSheet(w) {
  const b = w.beginning;
  const s = w.story;
  return html`
  <article class="sheet sheet--ivory sheet--first" data-theme="light">
    <section class="chapter beginning" id="beginning" data-nav="beginning" aria-labelledby="beginning-title">
      <div class="beginning__intro">
        ${head({ eyebrow: b.eyebrow, title: b.title, id: 'beginning-title' })}
        <p class="statement" data-reveal="words">${words(b.statement)}</p>
        <p class="lede" data-reveal="up" style="--d:.5s">${b.lede}</p>
        <p class="scroll-cue" data-reveal="fade" style="--d:1.1s" aria-hidden="true">
          <span>${b.scrollCue}</span><i></i>
        </p>
      </div>

      <div class="beginning__reveal">
        <div class="beginning__stage">
          <span class="beginning__float beginning__float--a" data-parallax="0.14">
            ${asset('sprite-branch-gold')}
          </span>
          <span class="beginning__float beginning__float--b" data-parallax="0.24">
            ${asset('sprite-sprig-dark')}
          </span>
          <figure class="arch" data-reveal="arch">
            <span class="arch__rule" aria-hidden="true"></span>
            <div class="arch__window">
              <div class="arch__img" data-parallax="-0.05">
                ${asset('couple', { alt: `An illustration of ${w.couple.first} and ${w.couple.second}` })}
              </div>
            </div>
          </figure>
          <span class="beginning__orn beginning__orn--tl" data-reveal="draw" aria-hidden="true">
            ${asset('ornament-corner')}
          </span>
          <span class="beginning__orn beginning__orn--br" data-reveal="draw" aria-hidden="true">
            ${asset('ornament-corner')}
          </span>
        </div>
        <div class="beginning__names">
          <p class="names" data-reveal="write">
            <span class="names__a">${w.couple.first}</span>
            <span class="names__b"><span class="names__amp">&amp;</span> ${w.couple.second}</span>
          </p>
          <p class="announce" data-reveal="up" style="--d:.7s">${b.announcement}</p>
        </div>
      </div>
    </section>

    ${crease()}

    <section class="chapter story" id="story" data-nav="story" aria-labelledby="story-title">
      ${head({ eyebrow: s.eyebrow, title: s.title, id: 'story-title' })}
      <p class="intro" data-reveal="up">${s.intro}</p>
      <div class="timeline" data-progress="line">
        <div class="timeline__rail" aria-hidden="true"><span class="timeline__ink"></span></div>
        <ol class="timeline__list">
          ${s.milestones.map(
            (m, i) => html`
            <li class="milestone ${i % 2 ? 'milestone--alt' : ''}" data-reveal="milestone">
              <span class="milestone__node" aria-hidden="true"></span>
              <p class="milestone__year"><span>${m.year}</span></p>
              <div class="milestone__body">
                <h3 class="milestone__title">${m.title}</h3>
                <p class="milestone__text">${m.text}</p>
              </div>
              ${m.ornament
                ? html`<span class="milestone__orn" data-parallax="0.1" aria-hidden="true">${asset(m.ornament)}</span>`
                : ''}
            </li>`,
          )}
        </ol>
      </div>
    </section>
  </article>`;
}
