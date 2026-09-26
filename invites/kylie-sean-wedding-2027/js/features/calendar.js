/**
 * Calendar integrations: a Google Calendar template link and a client-side
 * .ics file (used for Apple Calendar, Outlook and everything else).
 */

import { eventInstant } from '../lib/format.js';
import { config } from '../config.js';

const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

function eventData(w) {
  const start = eventInstant(w.event, w.event.ceremonyTime);
  const end = eventInstant(w.event, w.event.endTime);
  return {
    title: `${w.couple.first} & ${w.couple.second} — Wedding`,
    description: w.saveTheDate.eventDescription,
    location: `${w.venue.name}, ${w.venue.city}, ${w.venue.country}`,
    start,
    end,
  };
}

export function googleCalendarUrl(w) {
  const e = eventData(w);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.title,
    dates: `${stamp(e.start)}/${stamp(e.end)}`,
    details: e.description,
    location: e.location,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

const icsEscape = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/** Fold lines to 75 octets as RFC 5545 requires (approximated by characters). */
const fold = (line) => line.match(/.{1,73}/g).join('\r\n ');

export function buildIcs(w) {
  const e = eventData(w);
  const minutes = config.calendar.reminderMinutes;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Arkum Interactive//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${w.slug}@arkum-interactive`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(e.start)}`,
    `DTEND:${stamp(e.end)}`,
    `SUMMARY:${icsEscape(e.title)}`,
    `DESCRIPTION:${icsEscape(e.description)}`,
    `LOCATION:${icsEscape(e.location)}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${icsEscape(e.title)}`,
    `TRIGGER:-PT${minutes}M`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

export function downloadIcs(w) {
  const blob = new Blob([buildIcs(w)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${w.slug}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function initCalendar(root, w) {
  const status = root.querySelector('[data-ics-status]');
  root.querySelectorAll('[data-ics]').forEach((btn) => {
    btn.addEventListener('click', () => {
      downloadIcs(w);
      if (status) {
        status.textContent =
          btn.dataset.ics === 'apple'
            ? 'Event file saved — open it to add to Apple Calendar.'
            : 'Event file saved — open it with your calendar app.';
        status.classList.remove('is-shown');
        void status.offsetWidth;
        status.classList.add('is-shown');
      }
    });
  });
}
