import { html } from '../lib/dom.js';
import { asset } from '../lib/assets.js';
import { formatDeadline, longDate, numericDate } from '../lib/format.js';
import { googleCalendarUrl } from '../features/calendar.js';
import { dotDate } from './shared.js';

const tick = html`<svg class="tick__svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path class="tick__path" pathLength="1" d="M4 13.5c2.2 1.4 3.9 3.1 5.3 5.2C12 12.8 15.6 8 20.5 4.5"/></svg>`;

const icons = {
  google: html`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="5" width="17" height="15.5" rx="1"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M9.5 13.5h5M12 13.5v4"/></svg>`,
  apple: html`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="5" width="17" height="15.5" rx="1"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><circle cx="12" cy="15" r="2.2"/></svg>`,
  ics: html`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="5" width="17" height="15.5" rx="1"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M12 12v6M9.5 15.5 12 18l2.5-2.5"/></svg>`,
};

/** Chapter Nine — the reply card, followed by the save-the-date card. */
export function rsvpSection(w) {
  const r = w.rsvp;
  const diet = r.dietaryOptions;
  return html`
  <section class="interlude reply-section" id="rsvp" data-nav="rsvp" data-theme="dark" aria-labelledby="rsvp-title">
    <p class="eyebrow eyebrow--light" data-reveal="rule"><span>${r.eyebrow}</span></p>

    <div class="reply" data-reveal="card" data-rsvp data-state="idle">
      <div class="reply__paper paper">
        <span class="reply__rule" aria-hidden="true"></span>

        <div class="reply__view reply__view--form" data-view="form">
          <p class="reply__deadline">Kindly reply by ${formatDeadline(r.deadline)}</p>
          <h2 class="script-title reply__title" id="rsvp-title">${r.title}</h2>
          <p class="reply__intro">${r.intro}</p>

          <div class="choice" role="radiogroup" aria-label="Will you attend?">
            <button class="choice__opt" type="button" role="radio" aria-checked="false" data-choice="yes">
              <span class="tick">${tick}</span><span>${r.accept}</span>
            </button>
            <button class="choice__opt" type="button" role="radio" aria-checked="false" data-choice="no">
              <span class="tick">${tick}</span><span>${r.decline}</span>
            </button>
          </div>

          <div class="reveal-rows" data-form-wrap>
            <div class="reveal-rows__inner">
              <form class="reply__form" novalidate data-form>
                <div class="field">
                  <label class="field__label" for="rsvp-name">Full name</label>
                  <input class="field__input" id="rsvp-name" name="name" type="text" autocomplete="name"
                    aria-describedby="rsvp-name-error" required>
                  <p class="field__error" id="rsvp-name-error" data-error="name"></p>
                </div>

                <div class="field">
                  <label class="field__label" for="rsvp-contact">Email or phone</label>
                  <input class="field__input" id="rsvp-contact" name="contact" type="text" autocomplete="email"
                    inputmode="email" aria-describedby="rsvp-contact-error" required>
                  <p class="field__error" id="rsvp-contact-error" data-error="contact"></p>
                </div>

                <fieldset class="field field--attend">
                  <legend class="field__label">Attendance</legend>
                  <div class="segmented">
                    <label class="segmented__opt"><input type="radio" name="attending" value="yes"><span>${r.accept}</span></label>
                    <label class="segmented__opt"><input type="radio" name="attending" value="no"><span>${r.decline}</span></label>
                  </div>
                  <p class="field__error" data-error="attending"></p>
                </fieldset>

                <div class="reveal-rows" data-attending-only>
                  <div class="reveal-rows__inner">
                    <div class="field field--guests">
                      <p class="field__label" id="rsvp-guests-label">Number of guests</p>
                      <div class="stepper" role="group" aria-labelledby="rsvp-guests-label">
                        <button class="stepper__btn" type="button" data-step="-1" aria-label="Fewer guests">
                          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10"/></svg>
                        </button>
                        <output class="stepper__value" data-guests aria-live="polite">1</output>
                        <button class="stepper__btn" type="button" data-step="1" aria-label="More guests">
                          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M8 3v10"/></svg>
                        </button>
                      </div>
                      <p class="field__hint">Including yourself · up to ${r.maxGuests}</p>
                    </div>

                    <fieldset class="field field--diet">
                      <legend class="field__label">Dietary requirements</legend>
                      <div class="chips">
                        ${diet.map(
                          (d) => html`<label class="chip"><input type="checkbox" name="diet" value="${d}"><span>${d}</span></label>`,
                        )}
                      </div>
                      <label class="sr-only" for="rsvp-diet-note">Allergies or other dietary notes</label>
                      <input class="field__input field__input--quiet" id="rsvp-diet-note" name="dietNote" type="text"
                        placeholder="Allergies or other notes (optional)" maxlength="160">
                    </fieldset>
                  </div>
                </div>

                <div class="field">
                  <label class="field__label" for="rsvp-message">Message to the couple <em>(optional)</em></label>
                  <textarea class="field__input field__input--area" id="rsvp-message" name="message" rows="3"
                    maxlength="600"></textarea>
                </div>

                <div class="reply__submit">
                  <button class="btn btn--solid" type="submit" data-submit><span>${r.submit}</span></button>
                  <p class="reply__status" role="status" aria-live="polite" data-status></p>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="reply__view reply__view--done" data-view="done" hidden tabindex="-1">
          <span class="reply__seal" aria-hidden="true">${asset('sprite-seal', { cls: 'reply__seal-img' })}</span>
          <p class="script-title reply__thanks">${r.thanks}</p>
          <p class="reply__received">${r.received}</p>
          <p class="reply__summary" data-summary></p>
          <button class="btn btn--text" type="button" data-edit>${r.change}</button>
        </div>
      </div>
    </div>

    ${saveTheDate(w)}
  </section>`;
}

function saveTheDate(w) {
  const s = w.saveTheDate;
  return html`
  <aside class="std" data-reveal="card" style="--d:.1s" aria-labelledby="std-title">
    <div class="std__paper paper">
      <p class="std__date">${dotDate(numericDate(w.event))}</p>
      <h2 class="script-title std__title" id="std-title">${s.title}</h2>
      <p class="std__when">${longDate(w.event)} · ${w.venue.name}</p>
      <div class="std__actions">
        <a class="std__action" href="${googleCalendarUrl(w)}" target="_blank" rel="noopener">
          ${icons.google}<span>${s.actions.google}</span>
        </a>
        <button class="std__action" type="button" data-ics="apple">${icons.apple}<span>${s.actions.apple}</span></button>
        <button class="std__action" type="button" data-ics="event">${icons.ics}<span>${s.actions.ics}</span></button>
      </div>
      <p class="std__status" role="status" aria-live="polite" data-ics-status></p>
    </div>
  </aside>`;
}
