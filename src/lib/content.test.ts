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
      name: 'an unknown icon name on a skill group',
      mutate: c => { c.skills.groups[0]!.iconName = 'NotAnIcon' },
      path: 'skills.groups.0.iconName',
    },
    {
      name: 'a skill group with no items',
      mutate: c => { c.skills.groups[0]!.items = [] },
      path: 'skills.groups.0.items',
    },
    {
      name: 'an unknown project type',
      mutate: c => { (c.projects[0] as { type: string }).type = 'Freelance' },
      path: 'projects.0.type',
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
    {
      name: 'an SEO description too long for a search snippet',
      mutate: c => { c.profile.personal.seoDescription = 'x'.repeat(161) },
      path: 'profile.personal.seoDescription',
    },
  ]

  it.each(cases)('$name', ({ mutate, path }) => {
    expect(issuePaths(mutate)).toContain(path)
  })

  it('rejects duplicate project slugs', () => {
    expect(issuePaths(c => { c.projects[1]!.slug = c.projects[0]!.slug })).toContain('projects')
  })

  it('rejects duplicate project titles', () => {
    expect(issuePaths(c => { c.projects[1]!.title = c.projects[0]!.title })).toContain('projects')
  })

  it('rejects duplicate skill groups', () => {
    expect(issuePaths(c => { c.skills.groups[1]!.name = c.skills.groups[0]!.name })).toContain('skills.groups')
  })
})

// Everything the site publishes must trace back to the résumé. These claims were on the
// previous version of the site (or crept in while drafting) and the résumé does not support them.
describe('retired and unsupported claims stay out of the content', () => {
  const text = JSON.stringify(rawContent)

  const denied: Array<[string, RegExp]> = [
    ['old email address', /bvjamalian/i],
    ['typo in an old address', /Buisness/i],
    ['unsupported user count', /3,000\+/],
    ['Azure Functions (not on the résumé)', /Azure Functions/i],
    ['self-rated skill percentages', /levelPercent/],
    ['aged-care wording (sector is "healthcare and care-sector")', /\baged\b|aged-care|aged care/i],
    ['elderly', /elderly/i],
    ['worldwide', /worldwide/i],
    ['mental-health wording', /mental-health/i],
    ['geofencing', /geofenc/i],
    ['barcode scanning', /barcode/i],
    ['AES encryption claim', /\bAES\b/],
    ['session notes', /session notes/i],
    ['service-escalation workflows', /escalation/i],
    ['Mobile CRM', /Mobile CRM/i],
    ['optimized rendering claim', /optimized rendering/i],
    ['native device integration claim', /native device integration/i],
    ['"14K+" (the résumé says about 14,000)', /14K\+/],
    ['old Nanosoft address', /Rs puram/i],
    ['JWT (not on the résumé)', /JWT/],
    ['"trained in care"', /trained in care/i],
    ['"Node.js APIs" (only bug fixes and one feature are described)', /Node\.js APIs/],
    ['the old 45% sync figure', /\b45%/],
    ['NDA (not confirmed)', /\bNDA\b/],
  ]

  it.each(denied)('%s', (_label, pattern) => {
    expect(text).not.toMatch(pattern)
  })
})

describe('key résumé facts are present, with their qualifiers', () => {
  const text = JSON.stringify(rawContent)

  const required: Array<[string, RegExp]> = [
    ['email', /bv2124\.dev@gmail\.com/],
    ['headline title', /Full-Stack Engineer/],
    ['150+ production issues', /150\+ production issues/],
    ['~14,000 production records', /~14,000/],
    ['~8,000 staging records', /~8,000/],
    ['zero data loss', /zero data loss/],
    ['sync figure keeps its low-connectivity qualifier', /low-connectivity areas from ~30% to ~80%/],
    ['image payloads (not generic payloads)', /image payloads/],
    ['300+ clinicians', /300\+ clinicians/],
    ['50+ organizations', /50\+ organizations/],
    ['one-month handover', /one-month handover/],
    ['Australian stakeholders', /Australian stakeholders/],
    ['mentoring 2 junior developers', /2 junior developers/],
    ['MCA end year', /2024 – 2027/],
    ['Vaasi live site', /vaasi\.vercel\.app/],
    ['Akam live site', /akam-2124\.vercel\.app/],
    ['Computer Park live site', /computerpark\.vercel\.app/],
  ]

  it.each(required)('%s', (_label, pattern) => {
    expect(text).toMatch(pattern)
  })

  it('keeps the employer job titles as written on the résumé', () => {
    expect(content.experience.map(j => j.role)).toEqual(['Full-Stack Developer', 'React Native Developer'])
  })

  it('covers all nine résumé skill categories', () => {
    expect(content.skills.groups.map(g => g.name)).toEqual([
      'Languages', 'Frontend', 'Backend', 'Databases', 'Testing & QA',
      'Cloud & CI/CD', 'Mobile', 'Integrations', 'Tools & Practices',
    ])
  })
})
