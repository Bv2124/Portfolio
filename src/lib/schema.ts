// Content schema. Types are inferred from it, so validation and TypeScript can't drift apart.
import { z } from 'zod'
import { ICONS, type IconName } from './icons'

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected YYYY-MM')
const iconName = z.enum(Object.keys(ICONS) as [IconName, ...IconName[]])
const nonEmpty = z.string().trim().min(1)

// Tokens, never Tailwind classes: Tailwind can't see classes that only appear in JSON.
export const ACCENTS = [
  'orange', 'blue', 'cyan', 'slate', 'sky', 'purple',
  'yellow', 'emerald', 'violet', 'green', 'teal',
] as const

const AchievementSchema = z.object({
  text: nonEmpty,
  color: z.enum(['blue', 'purple', 'green', 'orange']),
})

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
  resume: z.string().startsWith('/'),
  heroBio: nonEmpty,
  footerBio: nonEmpty,
  usersServed: nonEmpty,
  careerStart: month,
  openToWork: z.boolean(),
  availability: nonEmpty,
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

export const SkillSchema = z.object({
  name: nonEmpty,
  iconName,
  accent: z.enum(ACCENTS),
  category: nonEmpty,
  level: z.enum(['Expert', 'Intermediate', 'Basic']),
  levelPercent: z.number().int().min(0).max(100),
})

export const SkillsFileSchema = z.object({
  categories: z.array(nonEmpty).min(1),
  skills: z.array(SkillSchema).min(1),
})

export const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Expected a kebab-case slug'),
  title: nonEmpty,
  type: nonEmpty,
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
    c.experience.forEach((job, i) => {
      if (job.end && job.end < job.start) {
        ctx.addIssue({ code: 'custom', path: ['experience', i, 'end'], message: 'end is before start' })
      }
    })
    c.skills.skills.forEach((skill, i) => {
      if (!c.skills.categories.includes(skill.category)) {
        ctx.addIssue({
          code: 'custom',
          path: ['skills', 'skills', i, 'category'],
          message: `Unknown category "${skill.category}"`,
        })
      }
    })
  })

export type Content = z.infer<typeof ContentSchema>
export type Personal = z.infer<typeof PersonalSchema>
export type About = z.infer<typeof AboutSchema>
export type Specialty = z.infer<typeof SpecialtySchema>
export type WhyItem = z.infer<typeof WhyItemSchema>
export type Job = z.infer<typeof JobSchema>
export type Skill = z.infer<typeof SkillSchema>
export type Project = z.infer<typeof ProjectSchema>
export type EducationItem = z.infer<typeof EducationItemSchema>
export type Accent = (typeof ACCENTS)[number]
