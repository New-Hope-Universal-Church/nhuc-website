import { site } from '@/lib/site';

type Network = keyof typeof site.social;

export const NETWORKS: { key: Network; label: string; path: string }[] = [
  {
    key: 'facebook',
    label: 'Facebook',
    path: 'M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4a21.5 21.5 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    path: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    path: 'M16.6 3c.4 2.2 1.8 3.6 4 3.8v3.1a7.1 7.1 0 0 1-4-1.3v6.3a5.6 5.6 0 1 1-5.6-5.6l.9.1v3.2a2.5 2.5 0 1 0 1.6 2.3V3z',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    path: 'M12 7.3A4.7 4.7 0 1 0 16.7 12 4.7 4.7 0 0 0 12 7.3zm0 7.7a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm4.9-8.9a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1zM21 7.8a5.4 5.4 0 0 0-1.5-3.3A5.4 5.4 0 0 0 16.2 3C14.9 3 9.1 3 7.8 3a5.4 5.4 0 0 0-3.3 1.5A5.4 5.4 0 0 0 3 7.8c-.1 1.3-.1 7.1 0 8.4a5.4 5.4 0 0 0 1.5 3.3A5.4 5.4 0 0 0 7.8 21c1.3.1 7.1.1 8.4 0a5.4 5.4 0 0 0 3.3-1.5 5.4 5.4 0 0 0 1.5-3.3c.1-1.3.1-7.1 0-8.4z',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    path: 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2s-1 .3-3.4-.7a11.4 11.4 0 0 1-4.6-4 5.2 5.2 0 0 1-1.1-2.8 3 3 0 0 1 1-2.2 1 1 0 0 1 .7-.3h.5c.2 0 .4 0 .6.5l.8 2a.6.6 0 0 1 0 .5 2.2 2.2 0 0 1-.3.5l-.5.5c-.1.2-.3.3-.1.6a8.5 8.5 0 0 0 1.6 2 7.7 7.7 0 0 0 2.3 1.4c.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3a2.4 2.4 0 0 1-.3 1.4z',
  },
];

/** The church's social accounts that have a link set in lib/site.ts. */
export function hasSocials() {
  return NETWORKS.some((n) => site.social[n.key]);
}

export default function SocialLinks({ light = false, className = '' }: { light?: boolean; className?: string }) {
  const links = NETWORKS.filter((n) => site.social[n.key]);
  if (!links.length) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {links.map((n) => (
        <li key={n.key}>
          <a
            href={site.social[n.key]}
            target="_blank"
            rel="noreferrer"
            aria-label={`${site.shortName} on ${n.label}`}
            className={`flex h-11 w-11 items-center justify-center rounded-md transition-colors ${
              light ? 'bg-white/10 text-white hover:bg-gold-400 hover:text-brand-950' : 'bg-brand-950 text-white hover:bg-crimson-600'
            }`}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={n.path} /></svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
