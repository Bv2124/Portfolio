import './globals.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { getProfile, getSkillKeywords } from '@/lib/content'

const inter = Inter({ subsets: ['latin'] })

// SEO metadata derived from the same validated content as the page.
const { personal } = getProfile()
const pageTitle = `${personal.name} — ${personal.title}`
// Longer, keyword-rich <title> for search ranking; OG/Twitter cards keep the clean pageTitle.
const seoTitle = `${pageTitle} | React, Next.js, React Native & Python/Django`

export const metadata: Metadata = {
  title:       seoTitle,
  description: personal.heroBio,
  keywords:    [...getSkillKeywords(), personal.title, personal.location].join(', '),
  authors:     [{ name: personal.name }],
  openGraph: {
    title:       pageTitle,
    description: personal.heroBio,
    type:        'website',
  },
  twitter: {
    card:        'summary',
    title:       pageTitle,
    description: personal.heroBio,
  },
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
