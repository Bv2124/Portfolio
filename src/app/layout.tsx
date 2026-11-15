import './globals.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { DM_Sans } from 'next/font/google'
import { SITE_URL, getProfile, getSkillKeywords, siteOpenGraph, siteTitle } from '@/lib/content'
import RevealRoot from '@/components/motion/RevealRoot'

// Self-hosted at build time by next/font, so the page never loads a font from another origin
// (the Content-Security-Policy in vercel.json would block it).
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' })

const { personal } = getProfile()
const pageTitle = siteTitle

export const metadata: Metadata = {
  // A URL object (not a string) so relative URLs resolve with the site's trailing-slash rules.
  metadataBase: new URL(SITE_URL),
  title: { default: pageTitle, template: `%s · ${personal.shortName}` },
  description: personal.seoDescription,
  keywords: [...getSkillKeywords(), personal.title, personal.location].join(', '),
  authors: [{ name: personal.name }],
  // Static files in public/. (favicon.ico in this folder is picked up by Next on its own.)
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
  // Pages that set their own `openGraph` replace this object, so they spread siteOpenGraph.
  openGraph: { ...siteOpenGraph, title: pageTitle, description: personal.seoDescription },
  // No title here: each page's Twitter card fills in its own from its Open Graph data.
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  colorScheme:  'light',
  themeColor:   '#EEF3F0',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={dmSans.className}>
      <body className="bg-ground text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <RevealRoot />
        {/* Vercel Web Analytics (no cookies). Off unless NEXT_PUBLIC_VERCEL_ANALYTICS=1 is set
            for the build, because the script only exists once analytics is enabled in Vercel. */}
        {process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === '1' && (
          <script defer src="/_vercel/insights/script.js" />
        )}
      </body>
    </html>
  )
}
