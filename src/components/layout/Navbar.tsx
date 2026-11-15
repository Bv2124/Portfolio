'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Download, Menu, X } from 'lucide-react'
import useScrolled from '@/hooks/useScrolled'
import useActiveSection from '@/hooks/useActiveSection'
import { SECTIONS, SECTION_IDS } from '@/lib/sections'

const DRAWER_ID = 'mobile-menu'

// Only what the navbar shows. This is a client component, so everything passed in here is
// serialised into the page: never hand it the whole `personal` object.
interface NavbarProps {
  personal: { name: string; firstName: string; resume: string; resumeDownloadName: string }
  // Set by the 404 page, where the URL says nothing about which page this is.
  notFound?: boolean
}

export default function Navbar({ personal, notFound = false }: NavbarProps) {
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
  const onCaseStudy = !notFound && pathname.startsWith('/case-studies/')
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
    // Web fonts can finish loading after the section has changed; ignore that stale callback.
    let cancelled = false
    document.fonts?.ready.then(() => { if (!cancelled) place() }).catch(() => {})
    window.addEventListener('resize', place)
    return () => {
      cancelled = true
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
    // Back at the top, a leftover "#projects" in the address bar would be wrong.
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname)
  }

  const currentFor = (id: string) => {
    if (id === 'case-studies' && onCaseStudy) return 'page'
    return active === id ? 'true' : undefined
  }

  const headerStyle = scrolled
    ? 'bg-ground/85 backdrop-blur-md border-line'
    : 'bg-transparent border-transparent'

  // "Vigneshwaran Balasubramanian" -> "VB"
  const initials = personal.name.split(/\s+/).map(word => word[0]).join('').slice(0, 2).toUpperCase()

  return (
    <>
    <header className={`site-header fixed top-0 z-50 w-full border-b transition-[background-color,border-color] duration-300 ${headerStyle}`}>
      <nav aria-label="Primary" className="container-page">
        <div className="flex h-16 items-center justify-between">

          {/* Logo: an initials avatar and the first name */}
          <Link
            href="/"
            onClick={onLogoClick}
            aria-label={`${personal.name}, home`}
            className="flex min-h-11 items-center gap-3 font-semibold text-ink"
          >
            <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
              {initials}
            </span>
            <span aria-hidden="true">{personal.firstName}</span>
          </Link>

          {/* Desktop links, in a white track */}
          <div className="hidden items-center gap-3 xl:flex">
            <div ref={linksRef} className="relative flex items-center gap-0.5 rounded-full bg-surface p-1">
              {/* Empty, decorative, and hidden by its class until the script has measured where it goes. */}
              <span
                ref={pillRef}
                aria-hidden="true"
                className="nav-pill pointer-events-none absolute left-0 top-0 rounded-full bg-tint opacity-0"
              />
              {SECTIONS.map(link => {
                const current = currentFor(link.id)
                return (
                  <Link
                    key={link.id}
                    href={`/#${link.id}`}
                    data-nav-id={link.id}
                    aria-current={current}
                    className={`relative flex min-h-11 items-center whitespace-nowrap rounded-full px-3.5 text-[0.9375rem] font-medium transition-colors duration-200 ${
                      current ? 'text-ink' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
            <a
              href={personal.resume}
              download={personal.resumeDownloadName}
              className="btn btn-primary min-h-11 whitespace-nowrap px-5 text-[0.9375rem]"
            >
              <Download size={15} aria-hidden="true" />
              Résumé
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={buttonRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink transition-colors hover:bg-tint xl:hidden"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls={DRAWER_ID}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>
    </header>

      {/* Mobile drawer: fades and drops in (CSS keyframes; none with reduced motion).
          It sits outside <header> on purpose: the scrolled header's backdrop-filter would become
          the containing block of these fixed layers and shrink the backdrop to the header's box. */}
      {menuOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={() => closeMenu()}
            className="fade-in fixed inset-x-0 bottom-0 top-16 z-40 bg-ink/40 xl:hidden"
          />
          <div
            id={DRAWER_ID}
            ref={drawerRef}
            className="drawer-in fixed inset-x-0 top-16 z-50 max-h-[calc(100svh-4rem)] overflow-y-auto overscroll-contain rounded-b-3xl bg-surface px-5 pb-6 sm:px-8 xl:hidden"
          >
            {SECTIONS.map(link => {
              const current = currentFor(link.id)
              return (
                <Link
                  key={link.id}
                  href={`/#${link.id}`}
                  aria-current={current}
                  onClick={() => closeMenu()}
                  className={`flex min-h-14 items-center border-b border-line text-lg last:border-0 ${
                    current ? 'font-semibold text-accent-ink' : 'font-medium text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <a
              href={personal.resume}
              download={personal.resumeDownloadName}
              className="btn btn-primary mt-4 w-full"
            >
              <Download size={16} aria-hidden="true" />
              Download résumé
            </a>
          </div>
        </>
      )}
    </>
  )
}
