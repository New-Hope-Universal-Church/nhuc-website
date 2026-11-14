import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, Merriweather, Montserrat } from 'next/font/google';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { site } from '@/lib/site';
import './globals.css';

// Fraunces is the heading face. It has no Twi letters (ɛ, ɔ), so anything in
// Twi uses Montserrat (labels, buttons, the call and response), which does,
// as do Inter and Merriweather.
const fraunces = Fraunces({ variable: '--font-fraunces', subsets: ['latin', 'latin-ext'], axes: ['opsz', 'SOFT'], display: 'swap' });
const inter = Inter({ variable: '--font-inter', subsets: ['latin', 'latin-ext'], display: 'swap' });
const montserrat = Montserrat({ variable: '--font-montserrat', subsets: ['latin', 'latin-ext'], weight: ['500', '600', '700', '800'], display: 'swap' });
const merriweather = Merriweather({ variable: '--font-merriweather', subsets: ['latin', 'latin-ext'], style: ['italic'], weight: ['400'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.motto}`, template: `%s | ${site.shortName}` },
  description: `${site.name} in ${site.address.line1}, ${site.address.city}. Join us for Sunday Service, prayer and fellowship. ${site.motto}`,
  icons: { icon: '/images/logo.png', apple: '/images/logo.png' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_GH',
    images: [{ url: '/images/logo.png', width: 1024, height: 1024, alt: site.name }],
  },
};

export const viewport: Viewport = {
  themeColor: '#062214',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${montserrat.variable} ${merriweather.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-950">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
