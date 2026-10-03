// Pure date helpers for the dynamic experience figures.
// All functions accept an optional `now` so they stay deterministic and
// testable — callers pass a client-side Date to avoid SSR hydration drift.

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

const MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/

// "YYYY-MM" -> Date at the first of that month (local time). Throws on anything else,
// so a malformed date fails the build instead of rendering "undefined NaN".
function parseMonth(value: string): Date {
  const match = MONTH_PATTERN.exec(value)
  if (!match) throw new Error(`Invalid month "${value}" (expected YYYY-MM)`)
  return new Date(Number(match[1]), Number(match[2]) - 1, 1)
}

function signedMonths(a: Date, b: Date): number {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
}

// Whole months between two "YYYY-MM" markers. A null end means "now".
export function monthsBetween(start: string, end: string | null, now: Date = new Date()): number {
  const a = parseMonth(start)
  const b = end ? parseMonth(end) : now
  return Math.max(0, signedMonths(a, b))
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

// "May 2023 – Aug 2025" / "Aug 2025 – Present"
export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`
}

// "2 yrs 4 mos" — human-readable duration. Counts both the first and last month
// (May 2023 – Aug 2025 is 28 months), which is how LinkedIn and most CVs count.
export function formatDuration(start: string, end: string | null, now: Date = new Date()): string {
  const raw = signedMonths(parseMonth(start), end ? parseMonth(end) : now)
  const total = raw < 0 ? 0 : raw + 1
  const years = Math.floor(total / 12)
  const months = total % 12
  const parts: string[] = []
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
  if (months) parts.push(`${months} mo${months > 1 ? 's' : ''}`)
  return parts.join(' ') || '0 mos'
}
