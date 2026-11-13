'use client'

import { useEffect, useRef } from 'react'

// A soft glow that follows the mouse inside the nearest [data-spotlight-host] (or the parent).
// Desktop mouse only; one leaf element moved with translate3d at most once per frame.
// It follows the user's own pointer and never moves content, so it stays on with reduced motion.
export default function Spotlight({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const spot = ref.current
    const host = spot?.closest<HTMLElement>('[data-spotlight-host]') ?? spot?.parentElement
    if (!spot || !host) return undefined
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    let frame = 0
    let x = 0
    let y = 0

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const origin = (spot.offsetParent as HTMLElement | null) ?? host
        const rect = origin.getBoundingClientRect()
        spot.style.transform = `translate3d(${x - rect.left}px, ${y - rect.top}px, 0)`
        spot.dataset.on = 'true'
      })
    }
    const onLeave = () => {
      // Drop any queued frame, or it would switch the glow back on after the pointer has left.
      cancelAnimationFrame(frame)
      frame = 0
      spot.dataset.on = 'false'
    }

    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <div ref={ref} aria-hidden="true" className={`spotlight ${size === 'sm' ? 'spotlight-sm' : ''}`} />
}
