'use client'

import { useEffect, useRef } from 'react'
import { COUNT_UP_MS } from '@/lib/motion'

// "~14K" -> prefix "~", 14, suffix "K". Values with more than one number ("~30% → ~80%")
// or none ("Zero") don't match and are shown as-is.
const PATTERN = /^(\D*)(\d[\d,]*)(\D*)$/

// Counts up to `value` the first time it scrolls into view. The server HTML always contains the
// final value; counting only happens for numbers that start off screen (decided by the first
// IntersectionObserver callback, without forcing layout), so nothing visible ever flashes to 0.
// The width is reserved by an invisible copy, so the layout never shifts.
// Callers wrap this in aria-hidden and provide the accessible text themselves.
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const match = PATTERN.exec(value)
    if (!el || !match) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const [, prefix = '', digits = '0', suffix = ''] = match
    const target = Number(digits.replace(/,/g, ''))
    const grouped = digits.includes(',')
    const format = new Intl.NumberFormat('en-US')
    const render = (n: number) => `${prefix}${grouped ? format.format(n) : n}${suffix}`

    let frame = 0
    let armed = false
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return
      if (!armed) {
        // First callback: on screen already → leave the real value; otherwise arm at 0.
        if (entry.isIntersecting) {
          observer.disconnect()
          return
        }
        armed = true
        el.textContent = render(0)
        return
      }
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / COUNT_UP_MS)
        const eased = 1 - Math.pow(1 - t, 5) // ease-out
        el.textContent = render(Math.round(target * eased))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    })
    observer.observe(el)

    // Printing must show the real value, even for numbers that were never scrolled to.
    const restore = () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      el.textContent = value
    }
    window.addEventListener('beforeprint', restore)

    return () => {
      window.removeEventListener('beforeprint', restore)
      restore()
    }
  }, [value])

  return (
    <span className="inline-grid tabular-nums">
      <span aria-hidden="true" className="invisible [grid-area:1/1]">{value}</span>
      <span ref={ref} data-countup="" className="[grid-area:1/1]">{value}</span>
    </span>
  )
}
