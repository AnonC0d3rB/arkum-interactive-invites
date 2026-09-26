/**
 * Fine gold frames with inverted stationery corners. The outline is drawn as
 * two mirrored halves that start at the top centre and meet at the bottom, so
 * the line appears to trace itself around the content. Paths are rebuilt in
 * pixel space whenever the frame resizes, keeping the stroke crisp.
 */

function halves(w, h, r) {
  const x = w / 2;
  const right =
    `M${x},0.5 H${w - r} A${r},${r} 0 0 0 ${w - 0.5},${r} V${h - r} ` +
    `A${r},${r} 0 0 0 ${w - r},${h - 0.5} H${x}`;
  const left =
    `M${x},0.5 H${r} A${r},${r} 0 0 1 0.5,${r} V${h - r} ` +
    `A${r},${r} 0 0 1 ${r},${h - 0.5} H${x}`;
  return [left, right];
}

export function initFrames(root) {
  const frames = root.querySelectorAll('.frame');
  const ro = new ResizeObserver((entries) => {
    entries.forEach(({ target }) => {
      const svg = target.querySelector('.frame__svg');
      const w = target.offsetWidth;
      const h = target.offsetHeight;
      const r = Math.min(18, w * 0.05);
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svg.setAttribute('width', w);
      svg.setAttribute('height', h);
      const [l, rt] = halves(w, h, r);
      let paths = svg.querySelectorAll('.frame__path');
      if (paths.length < 2) {
        const second = paths[0].cloneNode();
        svg.appendChild(second);
        paths = svg.querySelectorAll('.frame__path');
      }
      paths[0].setAttribute('d', l);
      paths[1].setAttribute('d', rt);
    });
  });
  frames.forEach((f) => ro.observe(f));
}
