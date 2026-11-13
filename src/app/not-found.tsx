import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getProfile, navPersonal } from '@/lib/content'

export const metadata: Metadata = { title: 'Page not found' }

export default function NotFound() {
  const { personal } = getProfile()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar personal={navPersonal} notFound />
      <main id="main" tabIndex={-1} className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <p className="font-mono text-sm text-blue-400">404</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold">Page not found</h1>
        <p className="mt-4 max-w-md text-slate-400">
          That page doesn&apos;t exist. The case studies and everything else live on the home page.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <ArrowLeft size={15} aria-hidden="true" /> Back to the home page
        </Link>
      </main>
      <Footer personal={personal} />
    </div>
  )
}
