import raw from '@/app/data/portfolio.json'
import type { Portfolio } from './types'

// Interim typed view of the content file; replaced by a validated zod parse.
const data = raw as Portfolio

export default data
