/**
 * Tiny templating helpers.
 *
 * `html` is a tagged template that escapes interpolated strings and flattens
 * arrays, while letting nested `html` fragments pass through untouched.
 */

const RAW = Symbol('raw');

export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toFragment(value) {
  if (value == null || value === false) return '';
  if (Array.isArray(value)) return value.map(toFragment).join('');
  if (value[RAW]) return value.value;
  return esc(value);
}

export function html(strings, ...values) {
  let out = '';
  strings.forEach((str, i) => {
    out += str + (i < values.length ? toFragment(values[i]) : '');
  });
  return { [RAW]: true, value: out, toString: () => out };
}

/** Mark a trusted string as raw HTML. */
export const raw = (value) => ({ [RAW]: true, value: String(value) });

export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Wrap each word of a plain-text string in reveal spans (keeps spaces). */
export function words(text, startIndex = 0) {
  return raw(
    String(text)
      .split(/(\s+)/)
      .map((part) => {
        if (/^\s+$/.test(part)) return ' ';
        const i = startIndex++;
        return `<span class="w"><span class="w__i" style="--i:${i}">${esc(part)}</span></span>`;
      })
      .join(''),
  );
}
