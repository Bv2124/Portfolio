import 'server-only'
import { rawContent } from '@/content'
import { ContentSchema, type CaseStudy, type Job, type Project } from './schema'

// Validated once at build time (and on every dev reload). A bad content file
// fails `next build` with the exact path of the problem, and visitors pay nothing.
export const content = ContentSchema.parse(rawContent)

export const SITE_URL = content.profile.personal.website.replace(/\/+$/, '')

export const getProfile = () => content.profile
export const getExperience = () => content.experience
export const getSkillGroups = () => content.skills.groups
export const getEducation = () => content.education

// Unique skill names, used for the <meta keywords> tag.
export const getSkillKeywords = () => [...new Set(content.skills.groups.flatMap(g => g.items.map(i => i.name)))]

// ── Case studies ────────────────────────────────────────────────────────────
export const getCaseStudies = () => content.caseStudies

export const getCaseStudy = (slug: string): CaseStudy | null =>
  content.caseStudies.find(c => c.slug === slug) ?? null

// The experience entry a case study belongs to (validated to exist by the schema).
export function getJobForCaseStudy(study: CaseStudy): Job {
  const job = content.experience.find(j => j.company === study.employer)
  if (!job) throw new Error(`No experience entry for "${study.employer}"`)
  return job
}

export function getCaseStudyNeighbors(slug: string) {
  const list = content.caseStudies
  const i = list.findIndex(c => c.slug === slug)
  return { prev: list[i - 1] ?? null, next: list[i + 1] ?? null }
}

// Canonical URL of a case study: absolute, with the trailing slash the static export serves.
export const caseStudyUrl = (slug: string) => `${SITE_URL}/case-studies/${slug}/`

// ── Projects (with their case-study links resolved) ─────────────────────────
export type ProjectWithLinks = Omit<Project, 'caseStudies'> & {
  caseStudies: Array<{ slug: string; title: string }>
}

export function getProjects(): ProjectWithLinks[] {
  return content.projects.map(({ caseStudies = [], ...project }) => ({
    ...project,
    caseStudies: caseStudies.flatMap(slug => {
      const study = getCaseStudy(slug)
      return study ? [{ slug: study.slug, title: study.title }] : []
    }),
  }))
}

// ── Shared metadata ─────────────────────────────────────────────────────────
const { personal } = content.profile

// Child pages that set `openGraph` replace this object entirely, so they spread it.
export const siteOpenGraph = {
  siteName: personal.name,
  locale: 'en_US',
  type: 'website' as const,
  images: [{
    url: '/og/default.png',
    width: 1200,
    height: 630,
    alt: `${personal.name} — ${personal.title}`,
  }],
}
