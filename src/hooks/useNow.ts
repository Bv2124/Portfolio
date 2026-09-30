'use client'

import { useEffect, useState } from 'react'

// Returns `null` on the server and the first client render, then the real
// Date after mount. Components fall back to a static value until it resolves,
// which keeps time-dependent output free of hydration mismatches.
export default function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => { setNow(new Date()) }, [])
  return now
}
