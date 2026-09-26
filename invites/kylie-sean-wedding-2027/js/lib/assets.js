import { config } from '../config.js';
import { assetSizes } from '../generated/asset-sizes.js';
import { esc, raw } from './dom.js';

export const assetUrl = (name) => `${config.assets}${name}.webp`;

/**
 * <img> for a supplied artwork asset. Intrinsic dimensions come from the
 * generated manifest so the browser can reserve space before decode.
 */
export function asset(name, { alt = '', cls = '', eager = false, attrs = '' } = {}) {
  const [w, h] = assetSizes[name] || [];
  return raw(
    `<img class="${esc(cls)}" src="${esc(assetUrl(name))}" alt="${esc(alt)}"` +
      (w ? ` width="${w}" height="${h}"` : '') +
      ` decoding="async"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} draggable="false"` +
      (attrs ? ` ${attrs}` : '') +
      '>',
  );
}
