'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'

// A fixed example instant, so the output never depends on when or where this renders:
// 2026-06-15 00:00 UTC is 10:00 in Sydney (AEST, UTC+10) and 05:30 in India (IST, UTC+5:30).
const INSTANT = new Date('2026-06-15T00:00:00Z')
const SERVICE = { zone: 'Australia/Sydney', place: 'Sydney', abbr: 'AEST' }
const DEVICE = { zone: 'Asia/Kolkata', place: 'India', abbr: 'IST' }

// Built from numeric parts rather than a locale string, so the server and every browser agree.
function clock(zone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: zone, hour: 'numeric', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(INSTANT)
  const hour = Number(parts.find(p => p.type === 'hour')?.value)
  const minute = parts.find(p => p.type === 'minute')?.value ?? '00'
  return `${hour % 12 || 12}:${minute} ${hour < 12 ? 'AM' : 'PM'}`
}

const SERVICE_TIME = clock(SERVICE.zone)
const DEVICE_TIME = clock(DEVICE.zone)

const BOX = 'rounded-3xl bg-ground p-5'
const LABEL = 'text-[0.8125rem] font-semibold text-ink-soft'

export default function TimezoneShift() {
  const [fixed, setFixed] = useState(false)
  const shown = fixed ? SERVICE_TIME : DEVICE_TIME

  return (
    <figure className="rounded-3xl bg-surface p-5 sm:p-6">
      <div role="group" aria-label="Show the scheduling bug or the fix" className="mb-5 flex flex-wrap gap-1 self-start rounded-full bg-ground p-1 sm:inline-flex">
        {([['Before the fix', false], ['After the fix', true]] as const).map(([label, value]) => (
          <button
            key={label}
            type="button"
            aria-pressed={fixed === value}
            onClick={() => setFixed(value)}
            className={`min-h-11 rounded-full px-5 text-[0.9375rem] font-medium transition-colors ${
              fixed === value ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <dl className="grid gap-3 sm:grid-cols-3">
        <div className={BOX}>
          <dt className={LABEL}>Service time zone</dt>
          <dd className="mt-1 text-base text-ink">{SERVICE.place} ({SERVICE.abbr})</dd>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-ink">{SERVICE_TIME}</dd>
        </div>
        <div className={BOX}>
          <dt className={LABEL}>Viewer&apos;s device</dt>
          <dd className="mt-1 text-base text-ink">{DEVICE.place} ({DEVICE.abbr})</dd>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-ink">{DEVICE_TIME}</dd>
        </div>
        {/* The result differs by words and an icon as well as colour: "Wrong:" with a cross, "Correct:" with a tick. */}
        <div
          aria-live="polite"
          className={`rounded-3xl p-5 transition-colors duration-300 ${
            fixed ? 'bg-tint text-ink' : 'bg-chip-amber text-chip-amber-ink'
          }`}
        >
          <dt className="text-[0.8125rem] font-semibold">Shown to the viewer</dt>
          <dd className="mt-1 flex items-center gap-2 text-base font-semibold">
            {fixed ? <Check size={18} aria-hidden="true" /> : <X size={18} aria-hidden="true" />}
            {fixed ? 'Correct: service time zone' : 'Wrong: device time'}
          </dd>
          <dd className="mt-1 text-2xl font-bold tabular-nums">{shown}</dd>
        </div>
      </dl>

      <figcaption className="mt-4 text-center text-[0.8125rem] text-ink-soft">
        Example: a 10:00 AM appointment in Sydney, viewed on a device set to India time.
      </figcaption>
    </figure>
  )
}
