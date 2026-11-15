'use client'

import { useEffect, useRef } from 'react'

// The experience timeline's line fills in as you scroll through it: empty when the timeline's
// top reaches 75% down the viewport, full when its bottom reaches the middle. Decorative: the
// grey track underneath is always there, and with reduced motion the fill is shown in full (CSS).
// Only listens to scroll while the timeline is on screen.
export default function TimelineProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fill = ref.current
    const track = fill?.parentElement
    if (!fill || !track) return undefined

    let frame = 0
    const update = () => {
      frame = 0
      // Measure the timeline container, not the fill: the fill's own scaleY transform would
      // shrink its measured height and feed back into the result.
      const rect = track.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = (0.75 * vh - rect.top) / (rect.height + 0.25 * vh)
      fill.style.transform = `scaleY(${Math.min(1, Math.max(0, progress))})`
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        window.addEventListener('scroll', schedule, { passive: true })
        schedule()
      } else {
        window.removeEventListener('scroll', schedule)
        update() // settle at 0 or 1 when leaving
      }
    })
    // Observe the track, not the fill: at scaleY(0) the fill has no height, so it would only be
    // reported once the very top of the timeline is on screen. Nothing is measured here; the
    // first measurement runs in the observer's callback, after the browser has laid the page out.
    observer.observe(track)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="timeline-fill pointer-events-none absolute -left-px top-0 bottom-0 w-0.5 origin-top bg-accent"
      style={{ transform: 'scaleY(0)' }}
    />
  )
}
