import Image from 'next/image';
import type { Sermon } from '@/lib/hopeserve';
import { youtubeId } from '@/lib/youtube';

/** Stands in for a video thumbnail: the church green with the series (or
 *  "Sermon") and the title set large, so a sermon without a video still
 *  looks designed. */
export function SermonPoster({ sermon, large = false }: { sermon: Sermon; large?: boolean }) {
  return (
    <div className={`bg-church absolute inset-0 flex flex-col justify-end overflow-hidden ${large ? 'p-8 sm:p-12' : 'p-5'}`}>
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '18px 18px', color: '#fff' }} />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(90%_70%_at_85%_10%,rgba(233,183,48,0.22),transparent_60%)]" />
      <p className="relative font-display text-[10px] font-bold uppercase tracking-[0.22em] text-gold-300">{sermon.series ?? 'Sermon'}</p>
      <p className={`relative mt-1.5 font-heading font-semibold leading-[1.05] tracking-tight text-ivory ${large ? 'text-4xl sm:text-5xl' : 'text-xl sm:text-2xl'}`}>{sermon.title}</p>
      <p className={`relative mt-2 text-white/70 ${large ? 'text-base' : 'text-xs'}`}>{sermon.preacher}</p>
    </div>
  );
}

/** A 16:9 thumbnail: the YouTube one, or the designed poster. */
export function SermonThumb({ sermon, sizes, className = '' }: { sermon: Sermon; sizes: string; className?: string }) {
  const id = youtubeId(sermon.youtubeUrl);
  return (
    <div className={`relative aspect-video overflow-hidden rounded-md bg-brand-950 ${className}`}>
      {id ? (
        <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes={sizes} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      ) : (
        <SermonPoster sermon={sermon} />
      )}
    </div>
  );
}

/** The sermon's video, playing right on the page when it's on YouTube;
 *  otherwise the poster. */
export function SermonVideo({ sermon }: { sermon: Sermon }) {
  const id = youtubeId(sermon.youtubeUrl);
  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-brand-950 shadow-[0_24px_60px_-24px_rgba(6,34,20,0.5)]">
      {id ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
          title={sermon.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <SermonPoster sermon={sermon} large />
      )}
    </div>
  );
}

/** Buttons to watch or listen elsewhere (Facebook, or another link); and
 *  YouTube too when `withYoutube` (where the video isn't on the page). */
export function WatchLinks({ sermon, withYoutube = false, className = '' }: { sermon: Sermon; withYoutube?: boolean; className?: string }) {
  const links = [
    withYoutube && sermon.youtubeUrl && { href: sermon.youtubeUrl, label: 'Watch on YouTube', cls: 'bg-crimson-600 hover:bg-crimson-700 text-white' },
    sermon.facebookUrl && { href: sermon.facebookUrl, label: 'Watch on Facebook', cls: 'bg-[#1d5fbf] hover:bg-[#184f9f] text-white' },
    sermon.otherUrl && { href: sermon.otherUrl, label: 'Listen / more', cls: 'bg-brand-950 hover:bg-brand-900 text-white' },
  ].filter(Boolean) as { href: string; label: string; cls: string }[];
  if (!links.length) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {links.map((l) => (
        <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={`inline-flex h-11 items-center rounded-md px-5 font-display text-[12px] font-bold uppercase tracking-[0.14em] transition-colors ${l.cls}`}>
          {l.label}
        </a>
      ))}
    </div>
  );
}
