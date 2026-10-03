'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'

type PlayState = 'done' | 'ready' | 'play' | 'pulse'

// Plays a CSS-driven sequence once when the visual scrolls into view, with a Replay button.
// Server HTML is "done" (final state). A visual that is already on screen at load is never
// hidden: it gets a highlight pass instead. Reduced motion: final state, no Replay button.
// Visibility comes from IntersectionObserver callbacks, so nothing forces a synchronous layout.
export default function PlayOnView({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<PlayState>('done')
  const [canReplay, setCanReplay] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    setCanReplay(true)

    let first = true
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return
      if (first) {
        first = false
        if (entry.isIntersecting) {
          setState('pulse')
          observer.disconnect()
        } else {
          setState('ready')
        }
        return
      }
      if (entry.isIntersecting) {
        setState('play')
        observer.disconnect()
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const replay = () => {
    setState('ready')
    // Two frames so the browser commits the reset before the sequence starts again.
    requestAnimationFrame(() => requestAnimationFrame(() => setState('play')))
  }

  return (
    <div ref={ref} data-play={state}>
      {children}
      {canReplay && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={replay}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-slate-800 px-3 text-xs font-mono text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200"
          >
            <RotateCcw size={12} aria-hidden="true" /> Replay animation
          </button>
        </div>
      )}
    </div>
  )
}
