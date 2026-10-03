import { describe, expect, it } from 'vitest'
import { formatDuration, formatMonth, formatRange, monthsBetween, yearsSince } from './experience'

// Local-time dates, matching how the helpers parse "YYYY-MM".
const at = (year: number, month: number, day = 15) => new Date(year, month - 1, day)

describe('monthsBetween', () => {
  it('counts whole months across a year boundary', () => {
    expect(monthsBetween('2023-11', '2024-02')).toBe(3)
  })

  it('uses the injected `now` when there is no end', () => {
    expect(monthsBetween('2025-08', null, at(2026, 9))).toBe(13)
  })

  it('never goes negative', () => {
    expect(monthsBetween('2026-01', '2025-01')).toBe(0)
  })

  it('rejects malformed months instead of returning NaN', () => {
    expect(() => monthsBetween('May 2023', null)).toThrow(/Invalid month/)
    expect(() => monthsBetween('2023-13', null)).toThrow(/Invalid month/)
    expect(() => monthsBetween('2023-00', null)).toThrow(/Invalid month/)
  })
})

describe('yearsSince', () => {
  it('floors to completed years', () => {
    expect(yearsSince('2023-05', at(2026, 4))).toBe(2) // 35 months
    expect(yearsSince('2023-05', at(2026, 5))).toBe(3) // 36 months
  })

  it('is 0 before the first anniversary', () => {
    expect(yearsSince('2026-01', at(2026, 9))).toBe(0)
  })
})

describe('formatMonth / formatRange', () => {
  it('formats a month', () => {
    expect(formatMonth('2023-05')).toBe('May 2023')
  })

  it('formats closed and open ranges with an en dash', () => {
    expect(formatRange('2023-05', '2025-08')).toBe('May 2023 – Aug 2025')
    expect(formatRange('2025-08', null)).toBe('Aug 2025 – Present')
  })
})

describe('formatDuration', () => {
  it('counts both the first and last month (LinkedIn style)', () => {
    expect(formatDuration('2023-05', '2025-08')).toBe('2 yrs 4 mos')
  })

  it('handles a current role using the injected `now`', () => {
    expect(formatDuration('2025-08', null, at(2026, 9))).toBe('1 yr 2 mos')
  })

  it('pluralises correctly', () => {
    expect(formatDuration('2025-01', '2025-01')).toBe('1 mo')
    expect(formatDuration('2025-01', '2025-02')).toBe('2 mos')
    expect(formatDuration('2024-01', '2024-12')).toBe('1 yr')
    expect(formatDuration('2023-01', '2024-12')).toBe('2 yrs')
  })

  it('shows a role that starts this month as 1 mo, not 0', () => {
    expect(formatDuration('2026-09', null, at(2026, 9))).toBe('1 mo')
  })

  it('shows 0 mos for a start in the future', () => {
    expect(formatDuration('2027-01', null, at(2026, 9))).toBe('0 mos')
  })
})
