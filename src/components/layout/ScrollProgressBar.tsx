'use client'

import { useEffect, useRef } from 'react'

// Thin reading-progress bar pinned to the top of the viewport. Updates at most once per frame
// by writing a compositor-only transform directly, so scrolling never re-renders React.
// A short CSS transition smooths it; with reduced motion it tracks the scroll position exactly.
export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return undefined

    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
      bar.style.transform = `scaleX(${progress})`
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed top-0 left-0 w-full z-[100] h-[3px] bg-line/60">
      <div
        ref={barRef}
        className="h-full origin-left bg-accent transition-transform duration-150 ease-out motion-reduce:transition-none"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
