/**
 * RSVP state machine, independent of the DOM.
 *
 *   idle ──choose──▶ editing ──submit──▶ submitting ──▶ submitted
 *                      ▲                     │
 *                      └──────── error ◀─────┘
 *   submitted ──edit──▶ editing
 */

import { validate, toPayload } from './validation.js';

const emptyFields = () => ({
  name: '',
  contact: '',
  attending: null,
  guests: 1,
  diet: [],
  dietNote: '',
  message: '',
});

export function createRsvpStore({ adapter, maxGuests }) {
  let state = { status: 'idle', fields: emptyFields(), errors: {}, record: null, touched: false };
  const listeners = new Set();

  const set = (patch) => {
    state = { ...state, ...patch };
    listeners.forEach((fn) => fn(state));
  };

  const revalidate = (fields) => (state.touched ? validate(fields, { maxGuests }) : {});

  return {
    get: () => state,
    subscribe(fn) {
      listeners.add(fn);
      fn(state);
      return () => listeners.delete(fn);
    },

    async restore() {
      const record = await adapter.load();
      if (!record) return;
      set({
        status: 'submitted',
        record,
        fields: {
          ...emptyFields(),
          ...record,
          guests: record.guests || 1,
          diet: record.diet?.length ? record.diet : [],
        },
      });
    },

    choose(attending) {
      const fields = { ...state.fields, attending };
      set({ fields, status: state.status === 'idle' ? 'editing' : state.status, errors: revalidate(fields) });
    },

    update(key, value) {
      const fields = { ...state.fields, [key]: value };
      set({ fields, errors: revalidate(fields) });
    },

    stepGuests(delta) {
      const guests = Math.min(maxGuests, Math.max(1, state.fields.guests + delta));
      this.update('guests', guests);
    },

    toggleDiet(option, checked) {
      let diet = state.fields.diet.filter((d) => d !== option);
      if (checked) {
        diet = option === 'None' ? ['None'] : [...diet.filter((d) => d !== 'None'), option];
      }
      this.update('diet', diet);
    },

    async submit() {
      const errors = validate(state.fields, { maxGuests });
      if (Object.keys(errors).length) {
        set({ errors, touched: true, status: 'editing' });
        return false;
      }
      set({ status: 'submitting', errors: {}, touched: true });
      try {
        const record = await adapter.submit(toPayload(state.fields));
        set({ status: 'submitted', record });
        return true;
      } catch (err) {
        set({ status: 'error', errorMessage: err.message });
        return false;
      }
    },

    edit() {
      set({ status: 'editing' });
    },
  };
}
