// Content schema. Types are inferred from it, so validation and TypeScript can't drift apart.
import { z } from 'zod'
import { ICONS, type IconName } from './icons'

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected YYYY-MM')
const iconName = z.enum(Object.keys(ICONS) as [IconName, ...IconName[]])
const nonEmpty = z.string().trim().min(1)

const AchievementSchema = z.object({
  text: nonEmpty,
  color: z.enum(['blue', 'purple', 'green', 'orange']),
})

// A hero stat is either a fixed value or the live "years of experience" figure.
const HeroStatSchema = z.union([
  z.object({ computed: z.literal('years'), label: nonEmpty }),
  z.object({ value: nonEmpty, label: nonEmpty, srText: nonEmpty.optional() }),
])

export const PersonalSchema = z.object({
  name: nonEmpty,
  firstName: nonEmpty,
  lastName: nonEmpty,
  title: nonEmpty,
  location: nonEmpty,
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
  quickFacts: z.array(z.object({ label: nonEmpty, value: nonEmpty })).min(1),
})

export const AboutSchema = z.object({
  paragraphs: z.array(nonEmpty).min(1),
  achievements: z.array(AchievementSchema).min(1),
})

export const SpecialtySchema = z.object({ title: nonEmpty, text: nonEmpty })

export const WhyItemSchema = z.object({
  iconName,
  title: nonEmpty,
  description: nonEmpty,
})

export const ProfileSchema = z.object({
  personal: PersonalSchema,
  roles: z.array(nonEmpty).min(1),
  about: AboutSchema,
  specialty: SpecialtySchema,
  whyHireMe: z.array(WhyItemSchema).min(1),
})

export const JobSchema = z.object({
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
export const SkillItemSchema = z.object({
  name: nonEmpty,
  note: nonEmpty.optional(),
  core: z.boolean().optional(),
})

export const SkillGroupSchema = z.object({
  name: nonEmpty,
  iconName,
  items: z.array(SkillItemSchema).min(1),
})

export const SkillsFileSchema = z.object({
  groups: z.array(SkillGroupSchema).min(1),
})

export const PROJECT_TYPES = ['Web Platforms', 'Mobile Apps', 'Personal Projects'] as const

export const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Expected a kebab-case slug'),
  title: nonEmpty,
  type: z.enum(PROJECT_TYPES),
  description: nonEmpty,
  tech: z.array(nonEmpty).min(1),
  highlights: z.array(nonEmpty).min(1),
  github: z.url().nullable(),
  live: z.url().nullable(),
})

export const EducationItemSchema = z.object({
  type: z.enum(['Degree', 'Certification']),
  qualification: nonEmpty,
  institution: nonEmpty,
  period: nonEmpty,
  note: z.string().nullable(),
})

export const ContentSchema = z
  .object({
    profile: ProfileSchema,
    experience: z.array(JobSchema).min(1),
    skills: SkillsFileSchema,
    projects: z.array(ProjectSchema).min(1),
    education: z.array(EducationItemSchema).min(1),
  })
  .superRefine((c, ctx) => {
    const dupes = (values: string[]) => values.filter((v, i) => values.indexOf(v) !== i)

    for (const slug of dupes(c.projects.map(p => p.slug))) {
      ctx.addIssue({ code: 'custom', path: ['projects'], message: `Duplicate project slug "${slug}"` })
    }
    for (const title of dupes(c.projects.map(p => p.title))) {
      ctx.addIssue({ code: 'custom', path: ['projects'], message: `Duplicate project title "${title}"` })
    }
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
export type Specialty = z.infer<typeof SpecialtySchema>
export type WhyItem = z.infer<typeof WhyItemSchema>
export type Job = z.infer<typeof JobSchema>
export type SkillItem = z.infer<typeof SkillItemSchema>
export type SkillGroup = z.infer<typeof SkillGroupSchema>
export type Project = z.infer<typeof ProjectSchema>
export type EducationItem = z.infer<typeof EducationItemSchema>
