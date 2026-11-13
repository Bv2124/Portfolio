'use client'

import { useEffect, useRef, useState } from 'react'
import useTypewriter from '@/hooks/useTypewriter'

// Leaf component: only this re-renders while typing, not the whole hero.
// The animated text is aria-hidden; screen readers get the full list of roles once.
export default function RoleTypewriter({ roles }: { roles: readonly string[] }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [inView, setInView] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? true))
    observer.observe(el)

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMedia = () => setReduceMotion(media.matches)
    const onVisibility = () => setPageVisible(!document.hidden)
    onMedia()
    media.addEventListener('change', onMedia)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      observer.disconnect()
      media.removeEventListener('change', onMedia)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const text = useTypewriter(roles, { enabled: inView && pageVisible && !reduceMotion })

  return (
    <p ref={ref} className="font-mono text-xs sm:text-sm mt-2 min-h-[20px] whitespace-nowrap">
      <span className="sr-only">Roles: {roles.join(', ')}</span>
      <span aria-hidden="true">
        <span className="text-emerald-300">{text}</span>
        <span className="inline-block w-[9px] h-[15px] bg-emerald-400 ml-px align-middle motion-safe:animate-pulse" />
      </span>
    </p>
  )
}
