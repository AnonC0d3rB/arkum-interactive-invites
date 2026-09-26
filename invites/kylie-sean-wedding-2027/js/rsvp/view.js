/**
 * Binds the reply card DOM to the RSVP store. The store owns all state; this
 * module only reflects it and forwards guest input.
 */

import { createRsvpStore } from './store.js';
import { createAdapter } from './adapters.js';

function summary(record) {
  const first = record.name.split(/\s+/)[0];
  if (record.attending) {
    const seats = record.guests === 1 ? 'a seat' : `${record.guests} seats`;
    return `We’ve saved ${seats} for you, ${first}. We can’t wait to celebrate together.`;
  }
  return `We’ll miss you dearly, ${first} — thank you for letting us know.`;
}

/** Animate the card's height while swapping between the form and the thank-you view. */
function swapViews(paper, hide, show, { reduced, onShown }) {
  const from = paper.offsetHeight;
  hide.hidden = true;
  show.hidden = false;
  if (reduced) {
    onShown?.();
    return;
  }
  const to = paper.offsetHeight;
  paper.style.height = `${from}px`;
  paper.style.overflow = 'hidden';
  void paper.offsetHeight;
  paper.classList.add('is-resizing');
  paper.style.height = `${to}px`;
  show.classList.add('is-entering');
  const done = () => {
    paper.classList.remove('is-resizing');
    paper.style.height = '';
    paper.style.overflow = '';
    show.classList.remove('is-entering');
  };
  paper.addEventListener('transitionend', done, { once: true });
  setTimeout(done, 900);
  requestAnimationFrame(() => onShown?.());
}

export function initRsvp(root, w, { rsvpConfig, reducedMotion }) {
  const card = root.querySelector('[data-rsvp]');
  if (!card) return;
  const paper = card.querySelector('.reply__paper');
  const form = card.querySelector('[data-form]');
  const formView = card.querySelector('[data-view="form"]');
  const doneView = card.querySelector('[data-view="done"]');
  const formWrap = card.querySelector('[data-form-wrap]');
  const attendingWrap = card.querySelector('[data-attending-only]');
  const guestsOut = card.querySelector('[data-guests]');
  const submitBtn = card.querySelector('[data-submit]');
  const statusEl = card.querySelector('[data-status]');
  const summaryEl = card.querySelector('[data-summary]');
  const choiceBtns = Array.from(card.querySelectorAll('[data-choice]'));
  const attendRadios = Array.from(form.querySelectorAll('input[name="attending"]'));
  const dietBoxes = Array.from(form.querySelectorAll('input[name="diet"]'));
  const stepBtns = Array.from(form.querySelectorAll('[data-step]'));

  const store = createRsvpStore({
    adapter: createAdapter(rsvpConfig, `arkum-rsvp:${w.slug}`),
    maxGuests: w.rsvp.maxGuests,
  });

  // ---- input → store
  choiceBtns.forEach((btn) =>
    btn.addEventListener('click', () => {
      const wasIdle = store.get().status === 'idle';
      store.choose(btn.dataset.choice === 'yes');
      if (wasIdle) setTimeout(() => form.elements.name.focus({ preventScroll: true }), 450);
    }),
  );
  // arrow-key support for the radiogroup
  card.querySelector('.choice').addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const idx = choiceBtns.indexOf(document.activeElement);
    const next = choiceBtns[(idx + 1) % choiceBtns.length];
    next.focus();
    next.click();
  });
  attendRadios.forEach((r) => r.addEventListener('change', () => store.choose(r.value === 'yes')));
  ['name', 'contact', 'dietNote', 'message'].forEach((key) =>
    form.elements[key].addEventListener('input', (e) => store.update(key, e.target.value)),
  );
  stepBtns.forEach((b) => b.addEventListener('click', () => store.stepGuests(Number(b.dataset.step))));
  dietBoxes.forEach((box) => box.addEventListener('change', () => store.toggleDiet(box.value, box.checked)));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ok = await store.submit();
    if (!ok) {
      const firstInvalid = form.querySelector('[aria-invalid="true"], .segmented.is-invalid input');
      firstInvalid?.focus();
    }
  });
  card.querySelector('[data-edit]').addEventListener('click', () => store.edit());

  // ---- store → DOM
  let shownStatus = null;
  let restoring = true;
  const render = (s) => {
    const { fields, errors } = s;
    card.dataset.state = s.status;

    choiceBtns.forEach((b) => b.setAttribute('aria-checked', String((b.dataset.choice === 'yes') === fields.attending && fields.attending !== null)));
    attendRadios.forEach((r) => (r.checked = fields.attending !== null && (r.value === 'yes') === fields.attending));
    formWrap.classList.toggle('is-open', s.status !== 'idle');
    formWrap.inert = s.status === 'idle';
    attendingWrap.classList.toggle('is-open', fields.attending === true);
    attendingWrap.inert = fields.attending !== true;

    guestsOut.textContent = fields.guests;
    stepBtns[0].disabled = fields.guests <= 1;
    stepBtns[1].disabled = fields.guests >= w.rsvp.maxGuests;
    dietBoxes.forEach((box) => (box.checked = fields.diet.includes(box.value)));

    ['name', 'contact', 'dietNote', 'message'].forEach((key) => {
      const el = form.elements[key];
      if (document.activeElement !== el && el.value !== fields[key]) el.value = fields[key] ?? '';
    });

    card.querySelectorAll('[data-error]').forEach((el) => {
      const key = el.dataset.error;
      el.textContent = errors[key] || '';
      const input = form.elements[key];
      if (input && input.setAttribute) input.setAttribute('aria-invalid', String(Boolean(errors[key])));
    });
    form.querySelector('.segmented').classList.toggle('is-invalid', Boolean(errors.attending));

    submitBtn.disabled = s.status === 'submitting';
    statusEl.textContent = s.status === 'error' ? 'We couldn’t send your reply just now — please try again.' : '';

    // view swap
    if (s.status === 'submitted' && shownStatus !== 'submitted') {
      summaryEl.textContent = summary(s.record);
      shownStatus = 'submitted';
      if (restoring) {
        formView.hidden = true;
        doneView.hidden = false;
        doneView.classList.add('is-sealed');
      } else {
        swapViews(paper, formView, doneView, {
          reduced: reducedMotion(),
          onShown: () => {
            doneView.classList.remove('is-sealed');
            void doneView.offsetWidth;
            doneView.classList.add('is-sealed');
            doneView.focus({ preventScroll: true });
          },
        });
      }
    } else if (s.status !== 'submitted' && shownStatus === 'submitted') {
      shownStatus = s.status;
      swapViews(paper, doneView, formView, {
        reduced: reducedMotion(),
        onShown: () => form.elements.name.focus({ preventScroll: true }),
      });
    } else if (shownStatus !== 'submitted') {
      shownStatus = s.status;
    }
  };

  store.subscribe(render);
  store.restore().finally(() => {
    restoring = false;
  });
}
