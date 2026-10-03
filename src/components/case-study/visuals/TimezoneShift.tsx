'use client'

import { useState } from 'react'

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

export default function TimezoneShift() {
  const [fixed, setFixed] = useState(false)
  const shown = fixed ? SERVICE_TIME : DEVICE_TIME

  return (
    <figure className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6">
      <div role="group" aria-label="Show the scheduling bug or the fix" className="mb-5 flex gap-2">
        {([['Before the fix', false], ['After the fix', true]] as const).map(([label, value]) => (
          <button
            key={label}
            type="button"
            aria-pressed={fixed === value}
            onClick={() => setFixed(value)}
            className={`min-h-10 rounded-full border px-4 text-sm font-mono transition-colors ${
              fixed === value
                ? 'border-blue-500/40 bg-blue-500/15 text-blue-300'
                : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <dl className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <dt className="font-mono text-[10px] uppercase tracking-widest text-muted">Service time zone</dt>
          <dd className="mt-1 text-sm text-slate-200">{SERVICE.place} ({SERVICE.abbr})</dd>
          <dd className="mt-1 font-mono text-lg font-semibold text-slate-100">{SERVICE_TIME}</dd>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <dt className="font-mono text-[10px] uppercase tracking-widest text-muted">Viewer&apos;s device</dt>
          <dd className="mt-1 text-sm text-slate-200">{DEVICE.place} ({DEVICE.abbr})</dd>
          <dd className="mt-1 font-mono text-lg font-semibold text-slate-100">{DEVICE_TIME}</dd>
        </div>
        <div
          aria-live="polite"
          className={`rounded-xl border p-4 transition-colors duration-300 ${
            fixed ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-red-400/40 bg-red-500/10'
          }`}
        >
          <dt className="font-mono text-[10px] uppercase tracking-widest text-muted">Shown to the viewer</dt>
          <dd className={`mt-1 text-sm ${fixed ? 'text-emerald-200' : 'text-red-200'}`}>
            {fixed ? 'Correct: service time zone' : 'Wrong: device time'}
          </dd>
          <dd className="mt-1 font-mono text-lg font-semibold text-slate-100">{shown}</dd>
        </div>
      </dl>

      <figcaption className="mt-4 text-center text-xs text-slate-400">
        Example: a 10:00 AM appointment in Sydney, viewed on a device set to India time.
      </figcaption>
    </figure>
  )
}
