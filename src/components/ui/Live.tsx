'use client'

import useNow from '@/hooks/useNow'
import { formatDuration, yearsSince } from '@/lib/experience'

// Each component renders the build-time value first (identical on server and on the
// first client render, so no hydration mismatch), then the live value after mount.

export function LiveYears({ start, fallback }: { start: string; fallback: number }) {
  const now = useNow()
  return <>{now ? yearsSince(start, now) : fallback}</>
}

export function LiveDuration({ start, end, fallback }: { start: string; end: string | null; fallback: string }) {
  const now = useNow()
  return <>{now ? formatDuration(start, end, now) : fallback}</>
}

export function CurrentYear({ fallback }: { fallback: number }) {
  const now = useNow()
  return <>{now ? now.getFullYear() : fallback}</>
}
