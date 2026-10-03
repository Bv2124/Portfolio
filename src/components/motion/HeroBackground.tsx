'use client'

import { useEffect, useRef } from 'react'
import Spotlight from './Spotlight'

// Drifting aurora + grid + cursor spotlight behind the hero. The drift is pure CSS
// (globals.css); this component only pauses it while the hero is off-screen.
export default function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      el.dataset.paused = String(!(entry?.isIntersecting ?? true))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className="hero-aurora pointer-events-none absolute inset-0 overflow-hidden">
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
      <div className="aurora-blob aurora-3" />
      <div className="absolute inset-0 grid-bg" />
      <Spotlight />
    </div>
  )
}
