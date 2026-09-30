'use client'

import { useEffect, useState } from 'react'

// Tracks which section id is currently centered in the viewport, used to
// highlight the matching nav link. `ids` should be a stable reference.
export default function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState('')

  useEffect(() => {
    const observers = ids.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry?.isIntersecting) setActive(id) },
        { rootMargin: '-40% 0px -40% 0px' }
      )
      observer.observe(el)
      return observer
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [ids])

  return active
}
