/**
 * Integration & behaviour configuration.
 *
 * Content (names, copy, dates) lives in ./content/wedding.js — this file holds
 * the switches a developer changes when deploying for a real client.
 */

export const config = {
  /** Asset base path (relative to index.html). */
  assets: 'assets/img/',

  venue: {
    /**
     * Link for the "View location" button. Replace with the client's Google
     * Maps / Apple Maps share URL. For the showcase this opens Johannesburg.
     */
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Johannesburg%2C+South+Africa',
  },

  rsvp: {
    /**
     * 'local' keeps responses in the guest's browser (showcase mode — no
     * network). Switch to 'http' and set `endpoint` to post to a real API;
     * see js/rsvp/adapters.js for the expected contract.
     */
    adapter: 'local',
    endpoint: null,
  },

  opening: {
    /** Skip the opening sequence when the URL has a hash or ?open is present. */
    skipOnDeepLink: true,
  },

  calendar: {
    /** Reminder offset for the downloadable .ics event, in minutes. */
    reminderMinutes: 24 * 60,
  },
};
