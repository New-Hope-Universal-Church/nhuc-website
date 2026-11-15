/**
 * Facts about the church that rarely change. Anything left empty is hidden
 * on the site until it is filled in.
 */
export const site = {
  name: 'New Hope Universal Church',
  shortName: 'NHUC',
  motto: 'Christ in you, the Hope of Glory.',
  mottoReference: 'Colossians 1:27',
  /** The verse on the banner behind the pulpit, the church's anchor scripture. */
  anchorVerse: {
    text: 'The Spirit of the Sovereign Lord is upon me, for the Lord has anointed me to bring good news to the poor. He has sent me to comfort the brokenhearted and to proclaim that captives will be released and prisoners will be freed.',
    reference: 'Isaiah 61:1',
    translation: 'NLT',
  },
  /**
   * The church's call and response: the man of God calls "New Hope!" and the
   * church answers. Twi, with English. Other languages are welcome too.
   */
  call: 'New Hope!',
  responses: [
    { twi: 'Abusua kɛseɛ', english: 'A big family' },
    { twi: 'Abusua kentinka', english: 'A great family' },
    { twi: 'Yɛ de Nyame dɔ bɛ tina daa', english: 'We will live together in the love of God, always' },
  ],
  url: 'https://www.newhopeuniversalchurch.org',

  address: {
    line1: 'Otojor, Dansoman',
    city: 'Accra',
    country: 'Ghana',
    /** A Google Maps link to the church, for "Get directions". */
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=New+Hope+Universal+Church+Otojor+Dansoman+Accra',
  },

  // TODO: fill in from the church office.
  phone: '' as string,
  email: '' as string,
  /** Mobile money / bank details for giving, shown on the Give page. */
  giving: {
    momoNumber: '' as string,
    momoName: '' as string,
    bankName: '' as string,
    accountName: '' as string,
    accountNumber: '' as string,
  },
  social: {
    facebook: '' as string,
    youtube: '' as string,
    instagram: '' as string,
    tiktok: '' as string,
    whatsapp: '' as string,
  },
} as const;

export interface NavLink {
  href: string;
  label: string;
  /** One line under the label in a menu group. */
  blurb?: string;
}
export type NavItem = NavLink | { label: string; items: NavLink[] };

/** The main menu. "The Word" groups the daily devotional and the preaching;
 *  "Join Us" groups signing up and following online. */
export const nav: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/visit', label: 'Visit' },
  {
    label: 'The Word',
    items: [
      { href: '/hope', label: 'Hope for Today', blurb: 'A word for each day' },
      { href: '/watch', label: 'Watch', blurb: 'Sermons and live streams' },
    ],
  },
  { href: '/events', label: 'Events' },
  {
    label: 'Join Us',
    items: [
      { href: '/join', label: 'Become part of the family', blurb: 'Become a member, plan a visit, or tell us you are new to faith' },
      { href: '/online', label: 'Online family', blurb: 'Worship with us from anywhere' },
    ],
  },
  { href: '/contact', label: 'Contact' },
];

/** Every page in the menu, groups opened up (for the footer). */
export const navLinks: NavLink[] = nav.flatMap((i) => ('items' in i ? i.items : [i]));
