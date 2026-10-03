'use client'

import { useEffect, useState } from 'react'

// Tracks which section id is currently centered in the viewport, used to
// highlight the matching nav link. One observer for all sections; the highlight
// clears when none is in the band (e.g. back at the hero). `ids` must be stable.
export default function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState('')

  useEffect(() => {
    const inBand = new Set<string>()
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id)
          else inBand.delete(entry.target.id)
        }
        setActive(ids.find(id => inBand.has(id)) ?? '')
      },
      { rootMargin: '-40% 0px -40% 0px' }
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [ids])

  return active
}
