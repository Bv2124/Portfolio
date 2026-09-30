import './globals.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import data from '@/lib/data'

const inter = Inter({ subsets: ['latin'] })

// SEO metadata derived from the same JSON source of truth.
const { personal, skills } = data
const pageTitle = `${personal.name} — ${personal.title}`
// Longer, keyword-rich <title> for search ranking; OG/Twitter cards keep the clean pageTitle.
const seoTitle = `${pageTitle} | React, Next.js, React Native & Python/Django`

export const metadata: Metadata = {
  title:       seoTitle,
  description: personal.heroBio,
  keywords:    [...new Set(skills.map(s => s.name)), personal.title, personal.location].join(', '),
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
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.className}`}>
      <body className="overflow-x-hidden bg-slate-950">
        {children}
      </body>
    </html>
  )
}
