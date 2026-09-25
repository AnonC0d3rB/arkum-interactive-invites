/* Caylin & Cole · Baby Shower — interactive invitation */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const body = document.body;
  const opening = $("#opening");
  const envelope = $("#envelope");
  const story = $("#story");
  const hint = $("#hint");
  const bow = $("#bow");
  const flap = $("#flap");
  const card = $("#card");
  const cardInner = $(".card__inner", card);
  const ribbonTop = $("#ribbonTop");
  const ribbonBottom = $("#ribbonBottom");
  const envParts = [".envelope__back", ".envelope__front", ".envelope__shadow"].map((s) => $(s, envelope));
  const welcome = $("#welcome");
  const welcomeTitle = $("#welcome-title");
  const chapters = $$(".chapter");
  const progressDots = $$("#progress span");
  const progress = $("#progress");
  const replayBtn = $("#replay");

  story.inert = true;

  /* ------------------------------------------------------------
     Opening sequence: ribbon reacts → ribbon releases → flap opens
     → card slides out → card becomes the page
     ------------------------------------------------------------ */

  let running = [];
  let state = "closed"; // closed | opening | open

  const play = (el, keyframes, options) => {
    const anim = el.animate(keyframes, { fill: "forwards", easing: "cubic-bezier(.4,0,.2,1)", ...options });
    running.push(anim);
    return anim.finished;
  };
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function openInvitation() {
    if (state !== "closed") return;
    state = "opening";
    envelope.classList.add("is-opening");
    envelope.setAttribute("aria-disabled", "true");
    play(hint, [{ opacity: getComputedStyle(hint).opacity }, { opacity: 0 }], { duration: 300 });

    if (reducedMotion.matches) {
      revealWelcome();
      await play(opening, [{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: "ease" });
      return finishOpening();
    }

    // 1 — the bow reacts to the tap
    await play(bow, [
      { transform: "rotate(0deg) scale(1)" },
      { transform: "rotate(-5deg) scale(1.03)", offset: 0.3 },
      { transform: "rotate(4deg) scale(1.03)", offset: 0.62 },
      { transform: "rotate(-1deg) scale(1.04)" },
    ], { duration: 560, easing: "ease-in-out" });

    // 2 — ribbon loosens: the bow slips away while the band unwinds from the knot
    play(ribbonTop, [{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }],
      { duration: 700, delay: 140, easing: "cubic-bezier(.6,0,.35,1)" });
    play(ribbonBottom, [{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }],
      { duration: 700, delay: 140, easing: "cubic-bezier(.6,0,.35,1)" });
    await play(bow, [
      { transform: "rotate(-1deg) scale(1.04)", opacity: 1 },
      { transform: "translate(2%, -6%) rotate(-7deg) scale(1.05)", opacity: 1, offset: 0.22 },
      { transform: "translate(-4%, 70%) rotate(16deg) scale(.96)", opacity: 0 },
    ], { duration: 1000, easing: "cubic-bezier(.5,0,.75,.4)" });

    // 3 — the flap unfolds (it tucks behind the card once it passes upright)
    const flapDone = play(flap, [
      { transform: "perspective(1000px) rotateX(0deg)" },
      { transform: "perspective(1000px) rotateX(180deg)" },
    ], { duration: 950, easing: "cubic-bezier(.5,.05,.3,1)" });
    await wait(420);
    flap.style.zIndex = "1";
    await flapDone;

    // 4 — the invitation card slides out of the envelope
    await play(card, [{ transform: "translateY(0)" }, { transform: "translateY(-58%)" }],
      { duration: 900, easing: "cubic-bezier(.3,.7,.25,1)" });
    await wait(260);

    // 5 — the card comes forward and becomes the page
    const rect = card.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.max(vw / rect.width, vh / rect.height) * 1.08;
    const dx = vw / 2 - (rect.left + rect.width / 2);
    const dy = vh / 2 - (rect.top + rect.height / 2);

    card.style.zIndex = "7"; // lift the card clear of the pocket as it grows
    play(cardInner, [{ opacity: 1 }, { opacity: 0 }], { duration: 380 });
    [...envParts, flap].forEach((el) =>
      play(el, [{ opacity: 1, translate: "0 0" }, { opacity: 0, translate: "0 14%" }], { duration: 600, easing: "ease-in" }));
    play(card, [
      { transform: "translateY(-58%)" },
      { transform: `translate(${dx}px, ${dy}px) translateY(-58%) scale(${scale})` },
    ], { duration: 1000, easing: "cubic-bezier(.65,0,.35,1)" });

    await wait(720);
    revealWelcome();
    await play(opening, [{ opacity: 1 }, { opacity: 0 }], { duration: 600, easing: "ease" });
    finishOpening();
  }

  function finishOpening() {
    opening.hidden = true;
    body.classList.remove("is-locked");
    story.inert = false;
    progress.classList.add("is-on");
    state = "open";
    welcomeTitle.focus({ preventScroll: true });
    layout();
    update();
  }

  function revealWelcome() {
    welcome.classList.add("is-visible");
    $$("[data-reveal]", welcome).forEach((el) => el.classList.add("is-in"));
  }

  function replay() {
    if (state !== "open") return;
    running.forEach((a) => a.cancel());
    running = [];
    flap.style.zIndex = "";
    card.style.zIndex = "";
    envelope.classList.remove("is-opening");
    envelope.removeAttribute("aria-disabled");

    // reset the story so it unfolds again
    $$("[data-reveal].is-in").forEach((el) => el.classList.remove("is-in"));
    chapters.forEach((c) => c.classList.remove("is-visible"));
    progress.classList.remove("is-on");
    window.scrollTo(0, 0);
    observeReveals();

    body.classList.add("is-locked");
    story.inert = true;
    opening.hidden = false;
    state = "closed";
    play(opening, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: "ease" });
    envelope.focus({ preventScroll: true });
  }

  envelope.addEventListener("click", (e) => { e.stopPropagation(); openInvitation(); });
  opening.addEventListener("click", openInvitation); // forgiving: a tap anywhere opens it
  replayBtn.addEventListener("click", replay);

  /* ------------------------------------------------------------
     Scroll reveals + chapter visibility
     ------------------------------------------------------------ */

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });

  function observeReveals() {
    revealObserver.disconnect();
    $$("[data-reveal]", story)
      .filter((el) => !welcome.contains(el)) // the welcome is revealed by the opening itself
      .forEach((el) => revealObserver.observe(el));
  }

  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === welcome && state !== "open") return;
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, { rootMargin: "15% 0px" });

  observeReveals();
  chapters.forEach((c) => chapterObserver.observe(c));

  /* ------------------------------------------------------------
     Layout-dependent pieces: parallax, stitched thread, progress
     ------------------------------------------------------------ */

  const decos = $$(".deco", story).map((el) => ({
    el,
    speed: parseFloat(el.dataset.speed) || 0,
    chapter: el.closest(".chapter"),
    top: 0,
    h: 0,
  }));

  const thread = $("#thread");
  const threadPath = $("#threadPath");
  const threadReveal = $("#threadReveal");
  const threadMask = $("#threadMask");
  let threadLen = 0;
  let threadStart = 0;
  let threadEnd = 1;
  let chapterTops = [];

  const docTop = (el) => {
    let y = 0;
    for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
    return y;
  };

  function layout() {
    const storyTop = docTop(story);
    chapterTops = chapters.map((c) => docTop(c));
    decos.forEach((d) => {
      d.top = docTop(d.el);
      d.h = d.el.offsetHeight;
    });
    buildThread(storyTop);
  }

  function buildThread(storyTop) {
    const W = story.clientWidth;
    const H = story.scrollHeight;
    thread.setAttribute("viewBox", `0 0 ${W} ${H}`);
    thread.setAttribute("width", W);
    thread.setAttribute("height", H);
    thread.style.height = `${H}px`;
    ["x", "y"].forEach((k) => threadMask.setAttribute(k, 0));
    threadMask.setAttribute("width", W);
    threadMask.setAttribute("height", H);

    const mid = W / 2;
    const reach = Math.min(W / 2 - 11, 540);
    const side = (i) => (i % 2 ? mid - reach : mid + reach);
    const rel = (el) => docTop(el) - storyTop;

    const cue = $(".welcome__cue", welcome);
    const finale = $(".finale", story);
    const tops = chapters.map((c) => rel(c));
    const bottoms = chapters.map((c) => rel(c) + c.offsetHeight);

    let x = mid;
    let y = rel(cue) + cue.offsetHeight + 16;
    let d = `M${x} ${y}`;
    for (let i = 1; i < chapters.length; i++) {
      const sx = side(i);
      const y1 = tops[i] + 70;
      d += ` C${x} ${y + (y1 - y) * 0.55} ${sx} ${y1 - (y1 - y) * 0.45} ${sx} ${y1}`;
      x = sx;
      y = y1;
      const isLast = i === chapters.length - 1;
      const y2 = isLast ? rel(finale) - 80 : bottoms[i] - 70;
      const bowIn = i % 2 ? 14 : -14;
      d += ` C${x + bowIn} ${y + (y2 - y) * 0.33} ${x + bowIn} ${y + (y2 - y) * 0.66} ${x} ${y2}`;
      y = y2;
    }
    const endY = rel(finale) - 12;
    d += ` C${x} ${y + 50} ${mid} ${endY - 60} ${mid} ${endY}`;

    threadPath.setAttribute("d", d);
    threadReveal.setAttribute("d", d);
    threadLen = threadPath.getTotalLength();
    threadReveal.style.strokeDasharray = `${threadLen}`;
    threadStart = storyTop + rel(cue);
    threadEnd = storyTop + endY;
  }

  let ticking = false;
  function update() {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;

    if (!reducedMotion.matches) {
      for (const d of decos) {
        if (!d.chapter.classList.contains("is-visible")) continue;
        const offset = (d.top + d.h / 2 - y - vh / 2) * d.speed;
        d.el.style.setProperty("--py", `${offset.toFixed(1)}px`);
      }
    }

    const p = Math.min(1, Math.max(0, (y + vh * 0.72 - threadStart) / (threadEnd - threadStart)));
    threadReveal.style.strokeDashoffset = `${threadLen * (1 - p)}`;

    let active = 0;
    chapterTops.forEach((top, i) => { if (y + vh * 0.5 >= top) active = i; });
    progressDots.forEach((dot, i) => dot.classList.toggle("is-active", i === active));
  }

  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });

  let lastWidth = window.innerWidth;
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // ignore mobile toolbar show/hide (height-only) changes
      if (window.innerWidth === lastWidth && state === "open") return;
      lastWidth = window.innerWidth;
      layout();
      update();
    }, 150);
  });

  // fonts and late images can shift heights — re-measure once they settle
  document.fonts?.ready.then(() => { layout(); update(); });
  window.addEventListener("load", () => { layout(); update(); });
  if ("ResizeObserver" in window) {
    let roTimer;
    new ResizeObserver(() => {
      clearTimeout(roTimer);
      roTimer = setTimeout(() => { layout(); update(); }, 120);
    }).observe(story);
  }

  layout();
  update();
})();
