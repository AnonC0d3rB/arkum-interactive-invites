import { html, raw, esc } from '../lib/dom.js';
import { asset } from '../lib/assets.js';

/**
 * Script display text with curly quotes set in the serif face — the script
 * font's own quote marks crowd the neighbouring capitals.
 */
export function script(text) {
  return raw(esc(text).replace(/[“”]/g, (q) => `<span class="q">${q}</span>`));
}

/** Chapter heading: tracked small-caps eyebrow + script title that writes on. */
export function head({ eyebrow, title, tone = '', level = 2, id = '' }) {
  const tag = level === 3 ? 'h3' : 'h2';
  const idAttr = id ? ` id="${id}"` : '';
  return html`
    <header class="head ${tone}">
      <p class="eyebrow" data-reveal="rule"><span>${eyebrow}</span></p>
      ${raw(`<${tag} class="script-title" data-reveal="write"${idAttr}>`)}${script(title)}${raw(`</${tag}>`)}
    </header>`;
}

/** A fold line in the paper, with a small centred fleuron. */
export function crease({ dark = false } = {}) {
  return html`
    <div class="crease ${dark ? 'crease--dark' : ''}" data-reveal="crease" aria-hidden="true">
      <span class="crease__line"></span>
      ${asset('sprite-fleur', { cls: 'crease__orn' })}
    </div>`;
}

/** Numerical date with middle dots (a glyph the script face doesn't carry). */
export function dotDate(parts) {
  return html`${parts.map(
    (p, i) => html`${i ? html`<span class="dot" aria-hidden="true">·</span>` : ''}<span>${p}</span>`,
  )}`;
}
