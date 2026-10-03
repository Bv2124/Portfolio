import type { ComponentType } from 'react'
import type { CaseStudyVisual } from '@/lib/schema'
import MigrationPipeline from './MigrationPipeline'
import SyncRateChart from './SyncRateChart'
import TimezoneShift from './TimezoneShift'

// Typed against the schema's visual list, so adding a visual without a component is a compile error.
export const VISUALS: Record<CaseStudyVisual, ComponentType> = {
  pipeline: MigrationPipeline,
  sync: SyncRateChart,
  timezone: TimezoneShift,
}
