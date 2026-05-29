// Pure date helpers for the dynamic experience figures.
// All functions accept an optional `now` so they stay deterministic and
// testable — callers pass a client-side Date to avoid SSR hydration drift.

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

// "YYYY-MM" -> Date at the first of that month (local time).
function parseMonth(value) {
  const [year, month] = String(value).split('-').map(Number)
  return new Date(year, (month || 1) - 1, 1)
}

// Whole months between two "YYYY-MM" markers. A null end means "now".
export function monthsBetween(start, end, now = new Date()) {
  const a = parseMonth(start)
  const b = end ? parseMonth(end) : now
  const months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
  return Math.max(0, months)
}

// Completed years since a start marker (floored).
export function yearsSince(start, now = new Date()) {
  return Math.floor(monthsBetween(start, null, now) / 12)
}

// "May 2023"
export function formatMonth(value) {
  const d = parseMonth(value)
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

// "May 2023 — Aug 2025" / "Aug 2025 — Present"
export function formatRange(start, end) {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`
}

// "2 yrs 3 mos" — human-readable duration.
export function formatDuration(start, end, now = new Date()) {
  const total = monthsBetween(start, end, now)
  const years = Math.floor(total / 12)
  const months = total % 12
  const parts = []
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
  if (months) parts.push(`${months} mo${months > 1 ? 's' : ''}`)
  return parts.join(' ') || '0 mos'
}
