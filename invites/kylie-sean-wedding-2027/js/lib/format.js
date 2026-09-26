/**
 * Date helpers derived from the event config, so weekday names, long dates and
 * countdown targets never drift out of sync with the single source of truth.
 */

export function eventInstant(event, time = event.ceremonyTime) {
  return new Date(`${event.date}T${time}:00${event.utcOffset}`);
}

function fmt(event, options, time) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: event.timeZone, ...options }).format(
    eventInstant(event, time),
  );
}

export function eventParts(event) {
  return {
    weekday: fmt(event, { weekday: 'long' }),
    day: fmt(event, { day: 'numeric' }),
    dayPadded: fmt(event, { day: '2-digit' }),
    month: fmt(event, { month: 'long' }),
    monthNum: fmt(event, { month: '2-digit' }),
    year: fmt(event, { year: 'numeric' }),
  };
}

/** "Sunday, 26 September 2027" */
export function longDate(event) {
  const p = eventParts(event);
  return `${p.weekday}, ${p.day} ${p.month} ${p.year}`;
}

/** ["26", "09", "2027"] */
export function numericDate(event) {
  const p = eventParts(event);
  return [p.dayPadded, p.monthNum, p.year];
}

/** "16:30" → { hm: "4:30", meridiem: "pm" } */
export function twelveHour(time) {
  const [h, m] = time.split(':').map(Number);
  return { hm: `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')}`, meridiem: h < 12 ? 'am' : 'pm' };
}

export function formatDeadline(dateString) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${dateString}T00:00:00Z`),
  );
}
