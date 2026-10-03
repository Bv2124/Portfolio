import { describe, expect, it } from 'vitest'
import { rawContent } from '@/content'
import { content } from './content'
import { ContentSchema } from './schema'

type Raw = typeof rawContent

// Deep clone so each case can break one thing without affecting the others.
const clone = (): Raw => structuredClone(rawContent)

// Returns the dotted paths of every issue the schema reports for a mutated copy.
function issuePaths(mutate: (c: Raw) => void): string[] {
  const c = clone()
  mutate(c)
  const result = ContentSchema.safeParse(c)
  return result.success ? [] : result.error.issues.map(i => i.path.join('.'))
}

describe('real content', () => {
  it('parses against the schema (this is what next build enforces)', () => {
    expect(ContentSchema.safeParse(rawContent).success).toBe(true)
  })

  it('is what the app imports', () => {
    expect(content.profile.personal.name).toBeTruthy()
    expect(content.projects.length).toBeGreaterThan(0)
  })
})

describe('schema rejects broken content, naming the path', () => {
  const cases: Array<{ name: string; mutate: (c: Raw) => void; path: string }> = [
    {
      name: 'a malformed experience date',
      mutate: c => { c.experience[0]!.start = 'Aug 2025' },
      path: 'experience.0.start',
    },
    {
      name: 'an impossible month',
      mutate: c => { c.experience[0]!.start = '2025-13' },
      path: 'experience.0.start',
    },
    {
      name: 'a job that ends before it starts',
      mutate: c => { c.experience[1]!.end = '2020-01' },
      path: 'experience.1.end',
    },
    {
      name: 'an unknown icon name',
      mutate: c => { c.profile.whyHireMe[0]!.iconName = 'NotAnIcon' },
      path: 'profile.whyHireMe.0.iconName',
    },
    {
      name: 'a Tailwind class where an accent token belongs',
      mutate: c => { (c.skills.skills[0] as { accent: string }).accent = 'text-orange-400' },
      path: 'skills.skills.0.accent',
    },
    {
      name: 'a skill in an unknown category',
      mutate: c => { c.skills.skills[0]!.category = 'Nonexistent' },
      path: 'skills.skills.0.category',
    },
    {
      name: 'a missing required field',
      mutate: c => { (c.projects[0] as { title: string }).title = '' },
      path: 'projects.0.title',
    },
    {
      name: 'a non-kebab-case slug',
      mutate: c => { c.projects[0]!.slug = 'Not A Slug' },
      path: 'projects.0.slug',
    },
    {
      name: 'a bad email address',
      mutate: c => { c.profile.personal.email = 'not-an-email' },
      path: 'profile.personal.email',
    },
    {
      name: 'a bad URL',
      mutate: c => { c.profile.personal.github = 'github.com/no-scheme' },
      path: 'profile.personal.github',
    },
  ]

  it.each(cases)('$name', ({ mutate, path }) => {
    expect(issuePaths(mutate)).toContain(path)
  })

  it('rejects duplicate project slugs', () => {
    const paths = issuePaths(c => { c.projects[1]!.slug = c.projects[0]!.slug })
    expect(paths).toContain('projects')
  })

  it('rejects duplicate project titles', () => {
    const paths = issuePaths(c => { c.projects[1]!.title = c.projects[0]!.title })
    expect(paths).toContain('projects')
  })
})
