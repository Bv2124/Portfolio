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
  const linksRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)

  // The export serves pages with a trailing slash, so "/" and "/case-studies/x/" are what we see.
  const isHome = (pathname.replace(/\/+$/, '') || '/') === '/'
  const onCaseStudy = pathname.startsWith('/case-studies/')
  const currentId = onCaseStudy ? 'case-studies' : active

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

  // The active-section highlight is one element that slides between links (CSS transition on
  // transform/width). It is measured, so it follows real link sizes, including after web fonts
  // load or the window is resized. The first placement is instant; later moves animate.
  useEffect(() => {
    const container = linksRef.current
    const pill = pillRef.current
    if (!container || !pill) return undefined

    const place = () => {
      const link = currentId
        ? container.querySelector<HTMLElement>(`[data-nav-id="${currentId}"]`)
        : null
      if (!link || link.offsetWidth === 0) {
        pill.style.opacity = '0'
        return
      }
      pill.style.width = `${link.offsetWidth}px`
      pill.style.height = `${link.offsetHeight}px`
      pill.style.transform = `translate3d(${link.offsetLeft}px, ${link.offsetTop}px, 0)`
      pill.style.opacity = '1'
    }

    place()
    const frame = requestAnimationFrame(() => { pill.dataset.ready = 'true' })
    document.fonts?.ready.then(place).catch(() => {})
    window.addEventListener('resize', place)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', place)
    }
  }, [currentId])

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

  const headerStyle = scrolled
    ? 'bg-slate-950/80 backdrop-blur-md border-slate-800/80 shadow-xl shadow-slate-950/60'
    : 'bg-transparent border-transparent'

  return (
    <header className={`fixed top-0 w-full z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${headerStyle}`}>
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
          <div ref={linksRef} className="relative hidden xl:flex items-center gap-1">
            {/* Empty, decorative, and hidden by its class until the script has measured where it goes. */}
            <span
              ref={pillRef}
              aria-hidden="true"
              className="nav-pill pointer-events-none absolute left-0 top-0 rounded-lg bg-blue-400/10 opacity-0"
            />
            {SECTIONS.map(link => {
              const current = currentFor(link.id)
              return (
                <Link
                  key={link.id}
                  href={`/#${link.id}`}
                  data-nav-id={link.id}
                  aria-current={current}
                  className={`relative px-3 py-2 rounded-lg text-sm font-mono whitespace-nowrap transition-colors duration-200 ${
                    current ? 'text-blue-400' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
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

      {/* Mobile drawer: fades and drops in (CSS keyframes; none with reduced motion). */}
      {menuOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={() => closeMenu()}
            className="fade-in xl:hidden fixed inset-x-0 top-16 bottom-0 bg-slate-950/60"
          />
          <div
            id={DRAWER_ID}
            ref={drawerRef}
            className="drawer-in xl:hidden relative max-h-[calc(100svh-4rem)] overflow-y-auto overscroll-contain bg-slate-900/95 border-b border-slate-800 px-6 pb-6"
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
