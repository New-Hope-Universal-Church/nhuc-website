import Link from 'next/link';
import { cacheLife } from 'next/cache';
import { getSchedule } from '@/lib/hopeserve';
import { Clock } from './ui';

/** "Last Friday of the month" is long for a strip: "Last Friday". */
const short = (when: string) => when.replace(/ of the month$/, '');

/** The regular services in one line ("Sunday Service, Sundays 6:00 AM ·
 *  ..."), for the strip under the menu on every page. */
export default async function ServiceTimes() {
  'use cache';
  cacheLife('minutes');
  const schedule = await getSchedule();
  if (!schedule.length) return null;
  return (
    <div className="flex items-center gap-4 overflow-x-auto px-4 py-2 text-[12px] scrollbar-none sm:px-5">
      <ul className="flex shrink-0 items-center gap-x-5">
        {schedule.map((s) => (
          <li key={s.id} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
            <Clock className="h-3.5 w-3.5 text-gold-300" />
            <span className="font-semibold text-white">{s.name}</span>
            <span className="text-white/60">{short(s.when)} {s.time}</span>
          </li>
        ))}
      </ul>
      <Link href="/watch" className="ml-auto shrink-0 whitespace-nowrap font-display text-[11px] font-bold uppercase tracking-[0.14em] text-gold-300 hover:text-gold-200">
        Watch online
      </Link>
    </div>
  );
}
