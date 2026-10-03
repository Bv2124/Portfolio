'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Download, Menu, X } from 'lucide-react'
import useScrolled from '@/hooks/useScrolled'
import useActiveSection from '@/hooks/useActiveSection'
import { SECTIONS, SECTION_IDS } from '@/lib/sections'
import { RESUME_DOWNLOAD_NAME } from '@/lib/site'
import type { Personal } from '@/lib/schema'

const DRAWER_ID = 'mobile-menu'

export default function Navbar({ personal }: { personal: Pick<Personal, 'name' | 'firstName' | 'resume'> }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled = useScrolled(20)
  const active = useActiveSection(SECTION_IDS)
  const pathname = usePathname()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  // The export serves pages with a trailing slash, so "/" and "/case-studies/x/" are what we see.
  const isHome = (pathname.replace(/\/+$/, '') || '/') === '/'
  const onCaseStudy = pathname.startsWith('/case-studies/')

  const closeMenu = (returnFocus = false) => {
    setMenuOpen(false)
    if (returnFocus) buttonRef.current?.focus()
  }

  // While the drawer is open: Escape closes it (and returns focus to the button), the page
  // behind it can't scroll or be reached with the keyboard, and focus moves into the drawer.
  useEffect(() => {
    if (!menuOpen) return undefined

    const behind = Array.from(document.querySelectorAll('main, footer'))
    behind.forEach(el => el.setAttribute('inert', ''))
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    drawerRef.current?.querySelector('a')?.focus()

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu(true) }
    const desktop = window.matchMedia('(min-width: 1280px)')
    const onResize = () => { if (desktop.matches) setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)

    return () => {
      behind.forEach(el => el.removeAttribute('inert'))
      document.documentElement.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
    }
  }, [menuOpen])

  // On the home page the logo scrolls to the top; elsewhere it is an ordinary link home.
  const onLogoClick = (e: React.MouseEvent) => {
    if (!isHome) return
    e.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  const currentFor = (id: string) => {
    if (id === 'case-studies' && onCaseStudy) return 'page'
    return active === id ? 'true' : undefined
  }

  return (
    <header className={`fixed top-0 w-full z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
      scrolled
        ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 shadow-xl shadow-slate-950/60'
        : 'bg-transparent'
    }`}>
      <nav aria-label="Primary" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            href="/"
            onClick={onLogoClick}
            aria-label={`${personal.name}, home`}
            className="flex items-center gap-1 group"
          >
            <span aria-hidden="true" className="text-muted font-mono text-sm group-hover:text-slate-300 transition-colors">~/</span>
            <span aria-hidden="true" className="font-bold text-slate-100 font-mono group-hover:text-white transition-colors">
              {personal.firstName.toLowerCase()}
            </span>
            <span aria-hidden="true" className="text-blue-400 font-mono font-bold">.dev</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden xl:flex items-center gap-1">
            {SECTIONS.map(link => {
              const current = currentFor(link.id)
              return (
                <Link
                  key={link.id}
                  href={`/#${link.id}`}
                  aria-current={current}
                  className={`px-3 py-2 rounded-lg text-sm font-mono whitespace-nowrap transition-colors duration-200 ${
                    current
                      ? 'text-blue-400 bg-blue-400/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <a
              href={personal.resume}
              download={RESUME_DOWNLOAD_NAME}
              className="ml-3 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-500/40 text-blue-400 hover:bg-blue-400/10 hover:border-blue-400/60 transition-colors duration-200"
            >
              <Download size={13} aria-hidden="true" />
              Resume
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={buttonRef}
            type="button"
            className="xl:hidden h-11 w-11 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls={DRAWER_ID}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={() => closeMenu()}
            className="xl:hidden fixed inset-x-0 top-16 bottom-0 bg-slate-950/60"
          />
          <div
            id={DRAWER_ID}
            ref={drawerRef}
            className="xl:hidden relative max-h-[calc(100svh-4rem)] overflow-y-auto overscroll-contain bg-slate-900/95 border-b border-slate-800 px-6 pb-6"
          >
            {SECTIONS.map(link => (
              <Link
                key={link.id}
                href={`/#${link.id}`}
                aria-current={currentFor(link.id)}
                onClick={() => closeMenu()}
                className="flex items-center min-h-12 text-slate-300 hover:text-blue-400 transition-colors font-mono text-sm border-b border-slate-800/50 last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={personal.resume}
              download={RESUME_DOWNLOAD_NAME}
              className="mt-4 flex items-center gap-2 min-h-11 text-blue-400 font-mono text-sm"
            >
              <Download size={14} aria-hidden="true" />
              Download Resume
            </a>
          </div>
        </>
      )}
    </header>
  )
}
