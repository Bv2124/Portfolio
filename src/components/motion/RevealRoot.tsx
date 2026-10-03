'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Arms scroll reveals after hydration. Each element's first IntersectionObserver callback says
// whether it is on screen right now: if it is, it is left alone (never hidden); if not, it is
// armed and revealed when it scrolls in. IntersectionObserver is computed by the browser off the
// critical path, so this never forces a synchronous layout during start-up.
// Without JavaScript, or with reduced motion, nothing is ever armed: all content stays visible.
export default function RevealRoot() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const seen = new WeakSet<Element>()
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        const first = !seen.has(el)
        seen.add(el)

        if (entry.isIntersecting) {
          if (el.dataset.reveal === 'armed') el.dataset.reveal = 'in'
          if (el.dataset.reveal === 'in' || first) observer.unobserve(el)
        } else if (first) {
          el.dataset.reveal = 'armed'
        }
      }
    })

    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
      if (el.dataset.reveal !== 'in') observer.observe(el)
    })

    return () => observer.disconnect()
  }, [pathname])

  return null
}
