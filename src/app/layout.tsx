import './globals.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { getProfile, getSkillKeywords } from '@/lib/content'

const inter = Inter({ subsets: ['latin'] })

// SEO metadata derived from the same validated content as the page.
const { personal } = getProfile()
const pageTitle = `${personal.name} — ${personal.title}`

export const metadata: Metadata = {
  title:       pageTitle,
  description: personal.seoDescription,
  keywords:    [...getSkillKeywords(), personal.title, personal.location].join(', '),
  authors:     [{ name: personal.name }],
  openGraph: {
    title:       pageTitle,
    description: personal.seoDescription,
    type:        'website',
  },
  twitter: {
    card:        'summary',
    title:       pageTitle,
    description: personal.seoDescription,
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
