// Content schema. Types are inferred from it, so validation and TypeScript can't drift apart.
import { z } from 'zod'
import { ICONS, type IconName } from './icons'

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected YYYY-MM')
const iconName = z.enum(Object.keys(ICONS) as [IconName, ...IconName[]])
const nonEmpty = z.string().trim().min(1)

const AchievementSchema = z.strictObject({
  text: nonEmpty,
})

// A hero stat is either a fixed value or the live "years of experience" figure.
const HeroStatSchema = z.union([
  z.strictObject({ computed: z.literal('years'), label: nonEmpty }),
  z.strictObject({ value: nonEmpty, label: nonEmpty, srText: nonEmpty.optional() }),
])

export const PersonalSchema = z.strictObject({
  name: nonEmpty,
  // Short form used in page titles, structured data and the résumé download file name.
  shortName: nonEmpty,
  firstName: nonEmpty,
  lastName: nonEmpty,
  title: nonEmpty,
  location: nonEmpty,
  // Structured form of `location`, for the Person structured data.
  address: z.strictObject({
    locality: nonEmpty,
    region: nonEmpty,
    countryCode: z.string().regex(/^[A-Z]{2}$/, 'Expected an ISO 3166-1 alpha-2 country code'),
  }),
  email: z.email(),
  phones: z.array(nonEmpty).min(1),
  github: z.url(),
  linkedin: z.url(),
  website: z.url(),
  // Set once the repository is public; enables "View source" links.
  sourceRepo: z.url().nullable(),
  resume: z.string().startsWith('/'),
  heroBio: nonEmpty,
  seoDescription: nonEmpty.max(160),
  footerBio: nonEmpty,
  contactIntro: nonEmpty,
  careerStart: month,
  openToWork: z.boolean(),
  availability: nonEmpty,
  heroStats: z.array(HeroStatSchema).min(1),
  quickFacts: z.array(z.strictObject({ label: nonEmpty, value: nonEmpty })).min(1),
})

export const AboutSchema = z.strictObject({
  paragraphs: z.array(nonEmpty).min(1),
  achievements: z.array(AchievementSchema).min(1),
})

export const WhyItemSchema = z.strictObject({
  iconName,
  title: nonEmpty,
  description: nonEmpty,
})

// The one personal note on the page: what the owner does away from work. The photo is optional.
export const OutsideWorkSchema = z.strictObject({
  text: nonEmpty,
  interests: z.array(nonEmpty).min(1),
  photo: z.strictObject({ src: z.string().startsWith('/'), alt: nonEmpty }).optional(),
})

export const ProfileSchema = z.strictObject({
  personal: PersonalSchema,
  roles: z.array(nonEmpty).min(1),
  about: AboutSchema,
  whyHireMe: z.array(WhyItemSchema).min(1),
  outsideWork: OutsideWorkSchema.optional(),
})

export const JobSchema = z.strictObject({
  company: nonEmpty,
  companyUrl: z.url(),
  role: nonEmpty,
  location: nonEmpty,
  start: month,
  end: month.nullable(),
  summary: nonEmpty,
  tech: z.array(nonEmpty).min(1),
  highlights: z.array(nonEmpty).min(1),
})

// Skills mirror the resume's categories. `note` keeps its qualifiers (e.g. "schema design,
// query optimization, migrations"); `core` marks the headline stack.
export const SkillItemSchema = z.strictObject({
  name: nonEmpty,
  note: nonEmpty.optional(),
  core: z.boolean().optional(),
})

export const SkillGroupSchema = z.strictObject({
  name: nonEmpty,
  iconName,
  items: z.array(SkillItemSchema).min(1),
})

export const SkillsFileSchema = z.strictObject({
  groups: z.array(SkillGroupSchema).min(1),
})

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Expected a kebab-case slug')

export const PROJECT_TYPES = ['Web Platforms', 'Mobile Apps', 'Personal Projects'] as const

export const ProjectSchema = z.strictObject({
  slug,
  title: nonEmpty,
  type: z.enum(PROJECT_TYPES),
  description: nonEmpty,
  tech: z.array(nonEmpty).min(1),
  highlights: z.array(nonEmpty).min(1),
  github: z.url().nullable(),
  live: z.url().nullable(),
  // Slugs of the case studies that go deeper on this project.
  caseStudies: z.array(slug).optional(),
})

// Every visual has a component registered for it (see components/case-study/visuals/index.tsx).
export const CASE_STUDY_VISUALS = ['pipeline', 'sync', 'timezone'] as const

// Case studies only state what the résumé supports. `team`, `tradeoffs` and `learnings` are
// optional extras that render only when filled in; nothing is shown as a placeholder.
export const CaseStudySchema = z.strictObject({
  slug,
  title: nonEmpty,
  tagline: nonEmpty,
  // The page's meta description: short enough for a search snippet.
  seoDescription: nonEmpty.max(160),
  // Must match an experience entry's company; role and dates are derived from it.
  employer: nonEmpty,
  context: nonEmpty,
  stack: z.array(nonEmpty).min(1),
  metrics: z
    .array(z.strictObject({ value: nonEmpty, label: nonEmpty, srText: nonEmpty.optional() }))
    .min(2)
    .max(4),
  challenge: z.array(nonEmpty).min(1),
  approach: z.array(z.strictObject({ title: nonEmpty, text: nonEmpty })).min(2),
  outcome: z.array(nonEmpty).min(1),
  // Related wins that are not outcomes of this work, with the heading to show above them.
  alsoShipped: z.strictObject({ title: nonEmpty, items: z.array(nonEmpty).min(1) }).optional(),
  related: z.array(slug).optional(),
  visual: z.enum(CASE_STUDY_VISUALS),
  team: nonEmpty.optional(),
  tradeoffs: z.array(nonEmpty).optional(),
  learnings: z.array(nonEmpty).optional(),
})

export const EducationItemSchema = z.strictObject({
  type: z.enum(['Degree', 'Certification']),
  qualification: nonEmpty,
  institution: nonEmpty,
  period: nonEmpty,
  note: nonEmpty.nullable(),
})

export const ContentSchema = z
  .strictObject({
    profile: ProfileSchema,
    experience: z.array(JobSchema).min(1),
    skills: SkillsFileSchema,
    projects: z.array(ProjectSchema).min(1),
    caseStudies: z.array(CaseStudySchema).min(1),
    education: z.array(EducationItemSchema).min(1),
  })
  .superRefine((c, ctx) => {
    const dupes = (values: string[]) => values.filter((v, i) => values.indexOf(v) !== i)
    const studySlugs = c.caseStudies.map(s => s.slug)

    for (const dup of dupes(studySlugs)) {
      ctx.addIssue({ code: 'custom', path: ['caseStudies'], message: `Duplicate case study slug "${dup}"` })
    }
    for (const dup of dupes(c.caseStudies.map(s => s.title))) {
      ctx.addIssue({ code: 'custom', path: ['caseStudies'], message: `Duplicate case study title "${dup}"` })
    }
    c.caseStudies.forEach((study, i) => {
      if (!c.experience.some(job => job.company === study.employer)) {
        ctx.addIssue({
          code: 'custom',
          path: ['caseStudies', i, 'employer'],
          message: `No experience entry for "${study.employer}"`,
        })
      }
      study.related?.forEach((rel, j) => {
        if (rel === study.slug || !studySlugs.includes(rel)) {
          ctx.addIssue({
            code: 'custom',
            path: ['caseStudies', i, 'related', j],
            message: `"${rel}" is not another case study`,
          })
        }
      })
    })
    c.projects.forEach((project, i) => {
      project.caseStudies?.forEach((ref, j) => {
        if (!studySlugs.includes(ref)) {
          ctx.addIssue({
            code: 'custom',
            path: ['projects', i, 'caseStudies', j],
            message: `Unknown case study "${ref}"`,
          })
        }
      })
    })

    for (const slug of dupes(c.projects.map(p => p.slug))) {
      ctx.addIssue({ code: 'custom', path: ['projects'], message: `Duplicate project slug "${slug}"` })
    }
    for (const title of dupes(c.projects.map(p => p.title))) {
      ctx.addIssue({ code: 'custom', path: ['projects'], message: `Duplicate project title "${title}"` })
    }
    // These values are used as React keys (and read as lists), so each list must be free of repeats.
    const unique = (values: string[], path: Array<string | number>, what: string) => {
      for (const dup of new Set(dupes(values))) {
        ctx.addIssue({ code: 'custom', path, message: `Duplicate ${what} "${dup}"` })
      }
    }
    const { personal, about, whyHireMe, outsideWork } = c.profile
    unique(personal.heroStats.map(s => s.label), ['profile', 'personal', 'heroStats'], 'hero stat label')
    unique(personal.quickFacts.map(f => f.label), ['profile', 'personal', 'quickFacts'], 'quick fact label')
    unique(personal.phones, ['profile', 'personal', 'phones'], 'phone number')
    unique(about.achievements.map(a => a.text), ['profile', 'about', 'achievements'], 'achievement')
    unique(whyHireMe.map(w => w.title), ['profile', 'whyHireMe'], 'title')
    unique(outsideWork?.interests ?? [], ['profile', 'outsideWork', 'interests'], 'interest')
    unique(c.experience.map(j => j.company), ['experience'], 'company')
    c.experience.forEach((job, i) => {
      unique(job.tech, ['experience', i, 'tech'], 'tech')
      unique(job.highlights, ['experience', i, 'highlights'], 'highlight')
    })
    c.skills.groups.forEach((group, i) => {
      unique(group.items.map(item => item.name), ['skills', 'groups', i, 'items'], 'skill')
    })
    c.projects.forEach((project, i) => {
      unique(project.tech, ['projects', i, 'tech'], 'tech')
      unique(project.highlights, ['projects', i, 'highlights'], 'highlight')
    })
    c.caseStudies.forEach((study, i) => {
      unique(study.stack, ['caseStudies', i, 'stack'], 'stack item')
      unique(study.metrics.map(m => m.label), ['caseStudies', i, 'metrics'], 'metric label')
      unique(study.approach.map(a => a.title), ['caseStudies', i, 'approach'], 'approach title')
    })
    unique(c.education.map(e => e.qualification), ['education'], 'qualification')

    for (const group of dupes(c.skills.groups.map(g => g.name))) {
      ctx.addIssue({ code: 'custom', path: ['skills', 'groups'], message: `Duplicate skill group "${group}"` })
    }
    c.experience.forEach((job, i) => {
      if (job.end && job.end < job.start) {
        ctx.addIssue({ code: 'custom', path: ['experience', i, 'end'], message: 'end is before start' })
      }
    })
  })

export type Content = z.infer<typeof ContentSchema>
export type Personal = z.infer<typeof PersonalSchema>
export type HeroStat = z.infer<typeof HeroStatSchema>
export type About = z.infer<typeof AboutSchema>
export type WhyItem = z.infer<typeof WhyItemSchema>
export type OutsideWork = z.infer<typeof OutsideWorkSchema>
export type Job = z.infer<typeof JobSchema>
export type SkillItem = z.infer<typeof SkillItemSchema>
export type SkillGroup = z.infer<typeof SkillGroupSchema>
export type Project = z.infer<typeof ProjectSchema>
export type CaseStudy = z.infer<typeof CaseStudySchema>
export type CaseStudyVisual = (typeof CASE_STUDY_VISUALS)[number]
export type EducationItem = z.infer<typeof EducationItemSchema>
