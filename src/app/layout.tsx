import './globals.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { SITE_URL, getProfile, getSkillKeywords, siteOpenGraph } from '@/lib/content'

const inter = Inter({ subsets: ['latin'] })

const { personal } = getProfile()
const pageTitle = `${personal.name} — ${personal.title}`

export const metadata: Metadata = {
  // A URL object (not a string) so relative URLs resolve with the site's trailing-slash rules.
  metadataBase: new URL(SITE_URL),
  title: { default: pageTitle, template: `%s · ${personal.firstName} B` },
  description: personal.seoDescription,
  keywords: [...getSkillKeywords(), personal.title, personal.location].join(', '),
  authors: [{ name: personal.name }],
  // Pages that set their own `openGraph` replace this object, so they spread siteOpenGraph.
  openGraph: { ...siteOpenGraph, title: pageTitle, description: personal.seoDescription },
  // No title here: each page's Twitter card fills in its own from its Open Graph data.
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  colorScheme:  'dark',
  themeColor:   '#020617',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={inter.className}>
      <body className="bg-slate-950">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
