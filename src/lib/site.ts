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

/** The main menu. "Outreach" mirrors HopeServe's Outreach section. Visit
 *  holds contact details, What's on holds announcements, and Sermons holds
 *  the online family (their old addresses redirect, see next.config.ts). */
export const nav: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/visit', label: 'Visit' },
  {
    label: 'Outreach',
    items: [
      { href: '/hope', label: 'Daily Devotional', blurb: 'A word for each day' },
      { href: '/watch', label: 'Sermons', blurb: 'Sermons, live streams and our online family' },
      { href: '/counselling', label: 'Counselling', blurb: 'Book a session to talk and pray with us' },
    ],
  },
  { href: '/events', label: "What's on" },
  { href: '/join', label: 'Join us' },
];

/** Every page in the menu but Home, groups opened up (for the footer). */
export const navLinks: NavLink[] = nav.flatMap((i) => ('items' in i ? i.items : [i])).filter((l) => l.href !== '/');
