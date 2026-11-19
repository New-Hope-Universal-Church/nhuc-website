/** The video id from a YouTube link (watch, youtu.be, live or shorts). */
export function youtubeId(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|[?&]v=|\/(?:live|shorts|embed)\/)([\w-]{11})/);
  return m ? m[1] : null;
}
