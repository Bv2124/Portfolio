// Pure date helpers for the dynamic experience figures.
// All functions accept an optional `now` so they stay deterministic and
// testable — callers pass a client-side Date to avoid SSR hydration drift.

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

// "YYYY-MM" -> Date at the first of that month (local time).
function parseMonth(value: string): Date {
  const [year = 0, month = 1] = String(value).split('-').map(Number)
  return new Date(year, (month || 1) - 1, 1)
}

// Whole months between two "YYYY-MM" markers. A null end means "now".
export function monthsBetween(start: string, end: string | null, now: Date = new Date()): number {
  const a = parseMonth(start)
  const b = end ? parseMonth(end) : now
  const months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
  return Math.max(0, months)
}

// Completed years since a start marker (floored).
export function yearsSince(start: string, now: Date = new Date()): number {
  return Math.floor(monthsBetween(start, null, now) / 12)
}

// "May 2023"
export function formatMonth(value: string): string {
  const d = parseMonth(value)
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

// "May 2023 — Aug 2025" / "Aug 2025 — Present"
export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`
}

// "2 yrs 3 mos" — human-readable duration.
export function formatDuration(start: string, end: string | null, now: Date = new Date()): string {
  const total = monthsBetween(start, end, now)
  const years = Math.floor(total / 12)
  const months = total % 12
  const parts: string[] = []
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
  if (months) parts.push(`${months} mo${months > 1 ? 's' : ''}`)
  return parts.join(' ') || '0 mos'
}
