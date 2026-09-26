/**
 * Wedding content — everything a guest reads lives here.
 *
 * To re-use this template for a real client, replace the values in this file
 * (and the integration settings in ../config.js). Components never hard-code
 * names, dates or copy; they read from this object.
 *
 * NOTE: Kylie & Sean are a fictional showcase couple.
 */

export const wedding = {
  slug: 'kylie-and-sean-2027',

  couple: {
    first: 'Kylie',
    second: 'Sean',
    monogram: ['K', 'S'],
  },

  /** Local wall-clock times at the venue. Weekday names are derived, never typed. */
  event: {
    date: '2027-09-26',
    utcOffset: '+02:00', // SAST
    timeZone: 'Africa/Johannesburg',
    ceremonyTime: '16:30',
    receptionTime: '18:30',
    endTime: '23:30',
  },

  venue: {
    name: 'The Ivory Estate',
    city: 'Johannesburg',
    country: 'South Africa',
    ceremonySpace: 'The Rose Garden',
    receptionSpace: 'The Oak Terrace',
  },

  opening: {
    hosts: 'Together with their families',
    cta: 'Tap to begin',
    hint: 'or scroll',
    insideTitle: 'A Story Worth Unfolding',
  },

  beginning: {
    eyebrow: 'Chapter One',
    title: 'The Beginning',
    statement: 'Every great story begins with two people.',
    lede: 'And somehow, somewhere between a thousand ordinary moments, their story became something extraordinary.',
    announcement: 'are getting married.',
    scrollCue: 'Scroll to unfold',
  },

  story: {
    eyebrow: 'Chapter Two',
    title: 'Their Story',
    intro: 'Some stories are written in years. Theirs was written in moments.',
    milestones: [
      {
        year: '2019',
        title: 'The first hello.',
        text: 'A borrowed umbrella outside a bookshop in Parkhurst, and a conversation neither of them wanted to end.',
        ornament: 'sprite-sprig-dark',
      },
      {
        year: '2021',
        title: 'The first adventure.',
        text: 'A road trip along the Garden Route, one wrong turn, and the quiet discovery that getting lost was better together.',
        ornament: 'sprite-leaf-gold',
      },
      {
        year: '2023',
        title: 'The moment everything changed.',
        text: 'A small apartment, one set of keys, and the certainty that home was no longer a place, but a person.',
        ornament: 'sprite-blossom',
      },
      {
        year: '2026',
        title: 'Forever begins here.',
        text: 'A winter evening in the Cape Winelands, a question asked softly — and a yes before it was finished.',
        ornament: 'sprite-blossom-brown',
      },
    ],
  },

  nextChapter: {
    eyebrow: 'Chapter Three',
    lead: ['And now,', 'the next chapter…'],
    cardTitle: 'The Wedding',
    timePhrase: 'at half past four in the afternoon',
  },

  ceremony: {
    eyebrow: 'Chapter Four',
    title: 'The Ceremony',
    invitation: 'Please join us as we say “I do.”',
    details: [
      { label: 'Where', value: 'The Rose Garden, The Ivory Estate' },
      { label: 'Arrival', value: 'Kindly be seated by 16:15' },
    ],
    note: 'The ceremony is held outdoors beneath the old oaks. We invite you to be fully present with us — an unplugged ceremony.',
  },

  celebration: {
    transition: 'And as the sun sets over the estate…',
    eyebrow: 'Chapter Five',
    title: 'After “I do”',
    subtitle: ['Dinner', 'Dancing', 'Celebration'],
    programme: [
      { time: '18:30', title: 'Dinner beneath the oaks', text: 'A long-table supper on The Oak Terrace, lit by festoons and candlelight.' },
      { time: '20:30', title: 'The first dance', text: 'The music begins, and so does the rest of our lives.' },
      { time: '21:00', title: 'Until the stars go out', text: 'Dancing, toasts and celebration until late.' },
    ],
  },

  dressCode: {
    eyebrow: 'The Attire',
    title: 'Dress Code',
    style: 'Elegant Evening',
    groups: [
      { label: 'Ladies', value: 'Formal / Evening Attire', text: 'Floor-length gowns or elegant cocktail dresses.' },
      { label: 'Gentlemen', value: 'Suit / Formal Attire', text: 'Dark suits or black tie; a tie is warmly encouraged.' },
    ],
    paletteLabel: 'The palette',
    palette: [
      { name: 'Ivory', swatch: 'ivory' },
      { name: 'Black', swatch: 'black' },
      { name: 'Champagne', swatch: 'champagne' },
      { name: 'Earth Tones', swatch: 'earth' },
    ],
    note: 'The ceremony is on the lawn — block heels are kindly recommended.',
  },

  venueSection: {
    eyebrow: 'Chapter Six',
    title: 'Where we begin forever',
    cta: 'View location',
  },

  /**
   * Information modules. Toggle `enabled` or reorder freely — the layout adapts
   * to however many are enabled.
   */
  details: {
    eyebrow: 'Good to know',
    title: 'The Details',
    items: [
      {
        id: 'parking',
        enabled: true,
        title: 'Parking',
        lead: 'Complimentary parking is available on-site.',
        text: 'Attendants will guide you from the estate gates to the parking lawn.',
        ornament: 'sprite-sprig-leaf',
      },
      {
        id: 'accommodation',
        enabled: true,
        title: 'Accommodation',
        lead: 'For guests travelling from outside Johannesburg.',
        text: 'A small number of rooms are held at the estate guest house — mention Kylie & Sean when booking.',
        ornament: 'sprite-florals-dark',
      },
      {
        id: 'children',
        enabled: true,
        title: 'Children',
        lead: 'Adults-only celebration.',
        text: 'We love your little ones dearly, and hope this evening can be a night off for everyone.',
        ornament: 'sprite-bush-dark',
      },
      {
        id: 'gifts',
        enabled: true,
        title: 'Gifts',
        lead: 'Your presence is the greatest gift.',
        text: 'Should you wish to honour us further, a contribution towards our honeymoon would be warmly received.',
        ornament: 'sprite-twig-dark',
      },
    ],
  },

  countdown: {
    eyebrow: 'Chapter Seven',
    title: 'The Countdown',
    units: { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' },
    caption: 'until we say “I do”',
    complete: 'The celebration has begun.',
  },

  memories: {
    eyebrow: 'Chapter Eight',
    title: 'Before the Forever',
    intro: 'A few moments from the story that brought us here.',
    /**
     * Album frames (positions are fixed by the album artwork).
     * Set `photo` to an image path to replace the illustrated placeholder.
     */
    frames: [
      { slot: 'a', photo: null, art: 'couple', alt: 'Kylie and Sean, illustrated' },
      { slot: 'b', photo: null, note: ['Parkhurst', '2019'], art: 'blossom', alt: '' },
      { slot: 'c', photo: null, note: ['Yes', '2026'], art: 'seal', alt: '' },
      { slot: 'd', photo: null, art: 'venue', alt: 'The Ivory Estate, illustrated' },
    ],
    print: { monogram: true, caption: 'Kept for always' },
    captions: [
      { index: 'i', title: 'The first hello', text: 'A rainy afternoon in Parkhurst, and a borrowed umbrella that was never quite returned.' },
      { index: 'ii', title: 'The yes', text: 'The Cape Winelands, winter 2026. He barely finished the question.' },
      { index: 'iii', title: 'The place', text: 'The Ivory Estate — where the next chapter will be written, with you.' },
    ],
  },

  rsvp: {
    eyebrow: 'Chapter Nine',
    title: 'Will you join us?',
    intro: 'We would love to celebrate with you.',
    deadline: '2027-07-26',
    accept: 'Joyfully accept',
    decline: 'Regretfully decline',
    maxGuests: 4,
    dietaryOptions: ['None', 'Vegetarian', 'Vegan', 'Halal', 'Gluten-free', 'Other'],
    submit: 'Send RSVP',
    thanks: 'Thank you.',
    received: 'Your response has been received.',
    change: 'Change my response',
  },

  saveTheDate: {
    title: 'Save the Date',
    actions: {
      google: 'Google Calendar',
      apple: 'Apple Calendar',
      ics: 'Calendar Event',
    },
    eventDescription: 'Ceremony at 16:30 in The Rose Garden, followed by dinner and dancing on The Oak Terrace. Dress code: Elegant Evening.',
  },

  finale: {
    lines: [
      'One last thing…',
      'We have chosen each other.',
      'Now we’d love to share the beginning of forever with you.',
    ],
  },

  farewell: {
    title: 'We can’t wait to celebrate with you',
    rsvp: 'RSVP',
    details: 'View details',
    signature: 'An invitation by Arkum Interactive',
  },

  /** Labels for the minimal fixed navigation, keyed by section id. */
  navigation: {
    beginning: { num: 'I', label: 'The Beginning' },
    story: { num: 'II', label: 'Their Story' },
    'next-chapter': { num: 'III', label: 'The Wedding' },
    ceremony: { num: 'IV', label: 'The Ceremony' },
    celebration: { num: 'V', label: 'The Celebration' },
    venue: { num: 'VI', label: 'The Venue' },
    countdown: { num: 'VII', label: 'The Countdown' },
    memories: { num: 'VIII', label: 'Memories' },
    rsvp: { num: 'IX', label: 'RSVP' },
    finale: { num: 'X', label: 'Forever' },
  },
};
