const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s()-]{7,}$/;

/** Returns a map of field → message for every invalid field. */
export function validate(fields, { maxGuests }) {
  const errors = {};
  const name = fields.name.trim();
  const contact = fields.contact.trim();

  if (name.length < 2) errors.name = 'Please tell us your name.';
  if (!contact) errors.contact = 'An email address or phone number, so we can reach you.';
  else if (!EMAIL.test(contact) && !(PHONE.test(contact) && contact.replace(/\D/g, '').length >= 7)) {
    errors.contact = 'That doesn’t look like an email address or phone number.';
  }
  if (fields.attending !== true && fields.attending !== false) {
    errors.attending = 'Please let us know whether you can join us.';
  }
  if (fields.attending && (fields.guests < 1 || fields.guests > maxGuests)) {
    errors.guests = `Between 1 and ${maxGuests} guests, please.`;
  }
  return errors;
}

/** The payload an adapter receives — only what's relevant to the answer. */
export function toPayload(fields) {
  const attending = fields.attending === true;
  return {
    name: fields.name.trim(),
    contact: fields.contact.trim(),
    attending,
    guests: attending ? fields.guests : 0,
    diet: attending ? fields.diet.filter((d) => d !== 'None') : [],
    dietNote: attending ? fields.dietNote.trim() : '',
    message: fields.message.trim(),
  };
}
