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
    <div className="min-h-screen bg-ground text-ink">
      <Navbar personal={navPersonal} notFound />
      <main id="main" tabIndex={-1} className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <p className="text-sm font-semibold text-accent-ink">404</p>
        <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-tight tracking-[-0.025em]">Page not found</h1>
        <p className="lead mx-auto mt-4">
          That page doesn&apos;t exist. The case studies and everything else live on the home page.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          <ArrowLeft size={18} aria-hidden="true" /> Back to the home page
        </Link>
      </main>
      <Footer personal={personal} />
    </div>
  )
}
