import type { ReactNode } from 'react';

/**
 * The little Markdown HopeServe devotionals use: paragraphs (blank line),
 * line breaks, **bold** and _italic_ (or *italic*). Built as React elements,
 * never raw HTML, so nothing in the text can inject markup.
 */
function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|_(.+?)_|\*(.+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(<strong key={`${key}-${i++}`} className="font-semibold text-brand-950">{m[1]}</strong>);
    else out.push(<em key={`${key}-${i++}`}>{m[2] ?? m[3]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function Markdown({ text, className = '' }: { text: string; className?: string }) {
  const paragraphs = text.replace(/\r\n/g, '\n').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className={className}>
      {paragraphs.map((p, pi) => (
        <p key={pi}>
          {p.split('\n').map((line, li, lines) => (
            <span key={li}>
              {inline(line, `${pi}-${li}`)}
              {li < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
