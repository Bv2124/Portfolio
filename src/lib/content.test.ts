import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { rawContent } from '@/content'
import {
  SITE_URL,
  caseStudyUrl,
  content,
  getCaseStudy,
  getCaseStudyNeighbors,
  getJobForCaseStudy,
  getProjects,
  navPersonal,
  resumeDownloadName,
} from './content'
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
    {
      name: 'a case study whose employer has no experience entry',
      mutate: c => { c.caseStudies[0]!.employer = 'Nowhere Inc' },
      path: 'caseStudies.0.employer',
    },
    {
      name: 'a case study that relates to a slug that does not exist',
      mutate: c => { (c.caseStudies[0] as { related?: string[] }).related = ['no-such-study'] },
      path: 'caseStudies.0.related.0',
    },
    {
      name: 'a case study that relates to itself',
      mutate: c => { (c.caseStudies[0] as { related?: string[] }).related = [c.caseStudies[0]!.slug] },
      path: 'caseStudies.0.related.0',
    },
    {
      name: 'a project that links to a case study that does not exist',
      mutate: c => { c.projects[0]!.caseStudies = ['no-such-study'] },
      path: 'projects.0.caseStudies.0',
    },
    {
      name: 'a case study visual with no component',
      mutate: c => { (c.caseStudies[0] as { visual: string }).visual = 'hologram' },
      path: 'caseStudies.0.visual',
    },
    {
      name: 'a case study with a single metric',
      mutate: c => { c.caseStudies[0]!.metrics = c.caseStudies[0]!.metrics.slice(0, 1) },
      path: 'caseStudies.0.metrics',
    },
    {
      name: 'a case-study meta description too long for a search snippet',
      mutate: c => { c.caseStudies[0]!.seoDescription = 'x'.repeat(161) },
      path: 'caseStudies.0.seoDescription',
    },
    {
      name: 'a misspelled field (unknown keys are rejected, not silently dropped)',
      mutate: c => { (c.caseStudies[0] as Record<string, unknown>).relatd = ['production-ownership'] },
      path: 'caseStudies.0',
    },
    {
      name: 'an empty education note (use null instead)',
      mutate: c => { c.education[0]!.note = '' },
      path: 'education.0.note',
    },
    {
      name: 'the same technology listed twice on a project',
      mutate: c => { c.projects[0]!.tech.push(c.projects[0]!.tech[0]!) },
      path: 'projects.0.tech',
    },
    {
      name: 'two metrics with the same label',
      mutate: c => { c.caseStudies[0]!.metrics[1]!.label = c.caseStudies[0]!.metrics[0]!.label },
      path: 'caseStudies.0.metrics',
    },
    {
      name: 'the same skill twice in a group',
      mutate: c => { c.skills.groups[0]!.items.push({ name: c.skills.groups[0]!.items[0]!.name }) },
      path: 'skills.groups.0.items',
    },
    {
      name: 'the same interest listed twice under outside work',
      mutate: c => { c.profile.outsideWork!.interests = ['Cycling', 'Cycling'] },
      path: 'profile.outsideWork.interests',
    },
    {
      name: 'an outside-work photo that is not a site path',
      mutate: c => { c.profile.outsideWork!.photo!.src = 'cycling.jpg' },
      path: 'profile.outsideWork.photo.src',
    },
    {
      name: 'a project screenshot that is not a /projects/<slug>.jpg path',
      mutate: c => {
        const withShot = c.projects.find(p => 'screenshot' in p)!
        ;(withShot as { screenshot: { src: string } }).screenshot.src = '/img/shot.png'
      },
      path: 'projects.0.screenshot.src',
    },
    {
      name: 'a screenshot on a project with no live site',
      mutate: c => { (c.projects[0] as { live: string | null }).live = null },
      path: 'projects.0.screenshot',
    },
    {
      name: 'a case study with no approach steps',
      mutate: c => { c.caseStudies[0]!.approach = [] },
      path: 'caseStudies.0.approach',
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

  it('rejects duplicate case study slugs', () => {
    expect(issuePaths(c => { c.caseStudies[1]!.slug = c.caseStudies[0]!.slug })).toContain('caseStudies')
  })
})

// Images are referenced by path from content and components, so a typo would ship a broken image.
describe('images referenced by the content exist under public/', () => {
  const exists = (src: string) => existsSync(join(process.cwd(), 'public', src))

  it('has the portrait used in the hero and the structured data', () => {
    expect(exists('/profile.jpg')).toBe(true)
  })

  it('has a screenshot for every project that has one, and every live project has one', () => {
    for (const project of content.projects) {
      if (project.screenshot) expect(exists(project.screenshot.src), project.screenshot.src).toBe(true)
      if (project.live) expect(project.screenshot, `${project.slug} has a live site but no screenshot`).toBeDefined()
    }
  })

  it('has the outside-work photo', () => {
    const photo = content.profile.outsideWork?.photo
    if (photo) expect(exists(photo.src), photo.src).toBe(true)
  })
})

describe('case study selectors', () => {
  const [first, second, third] = content.caseStudies

  it('finds a case study by slug and returns null for an unknown one', () => {
    expect(getCaseStudy(first!.slug)?.title).toBe(first!.title)
    expect(getCaseStudy('nope')).toBeNull()
  })

  it('links neighbours in the order they are listed, with no wrap-around', () => {
    expect(getCaseStudyNeighbors(first!.slug)).toEqual({ prev: null, next: second })
    expect(getCaseStudyNeighbors(second!.slug)).toEqual({ prev: first, next: third })
    expect(getCaseStudyNeighbors(third!.slug)).toEqual({ prev: second, next: null })
  })

  it('gives an unknown slug no neighbours', () => {
    expect(getCaseStudyNeighbors('nope')).toEqual({ prev: null, next: null })
  })

  it('derives the résumé download name from the profile', () => {
    expect(resumeDownloadName).toBe('Vigneshwaran_B_Full-Stack_Engineer_Resume.pdf')
    expect(Object.keys(navPersonal).sort()).toEqual(['firstName', 'name', 'resume', 'resumeDownloadName'])
  })

  it('builds canonical URLs that are absolute and end in a slash', () => {
    expect(SITE_URL).toBe('https://bv2124.vercel.app')
    expect(caseStudyUrl('production-ownership')).toBe('https://bv2124.vercel.app/case-studies/production-ownership/')
  })

  it('derives role and employer from the matching experience entry', () => {
    const study = getCaseStudy('offline-first-field-sync')!
    expect(getJobForCaseStudy(study).role).toBe('React Native Developer')
  })

  it('resolves project → case study links with titles', () => {
    const platform = getProjects().find(p => p.slug === 'support-worker-allocation-platform')!
    expect(platform.caseStudies.map(c => c.slug)).toEqual([
      'salesforce-to-django-migration',
      'production-ownership',
    ])
    expect(platform.caseStudies.every(c => c.title.length > 0)).toBe(true)
  })

  it('gives every case study a route-safe slug and at least two metrics', () => {
    for (const study of content.caseStudies) {
      expect(study.slug).toMatch(/^[a-z0-9-]+$/)
      expect(study.metrics.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('never ships empty placeholder text in the optional sections', () => {
    // team / tradeoffs / learnings are optional: absent is fine, but present must have real content.
    for (const study of content.caseStudies) {
      if (study.team !== undefined) expect(study.team.trim().length).toBeGreaterThan(0)
      for (const line of [...(study.tradeoffs ?? []), ...(study.learnings ?? [])]) {
        expect(line).not.toMatch(/todo|tbd|lorem|placeholder/i)
      }
    }
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

// The social-work degree is listed under Education and nowhere else: not in the bio, the
// banners or the "why work with me" list.
describe('the social-work degree appears only in Education', () => {
  const { education, projects, ...rest } = rawContent
  // "Akam Psychiatric Care Center" is the real name of one of the owner's own sites, so that
  // one project is exempt. Every other project, and all the rest of the content, is checked.
  const otherProjects = projects.filter(p => p.slug !== 'akam-psychiatric-care-center')

  it('is absent from everything except education', () => {
    expect(JSON.stringify({ ...rest, projects: otherProjects })).not.toMatch(/social work|\bMSW\b|psychiatr/i)
  })

  it('is not mentioned in the description of the exempt project either', () => {
    const akam = projects.find(p => p.slug === 'akam-psychiatric-care-center')!
    expect(akam.description).not.toMatch(/social work|\bMSW\b/i)
  })

  it('is still listed as a qualification', () => {
    expect(JSON.stringify(education)).toContain('Master of Social Work')
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
    ['migration case study keeps "5+ validation stages"', /5\+ validation stages/],
    ['migration runs are described as two separate counts', /~8,000 records to staging and ~14,000 to production/],
    ['sync case study keeps the low-connectivity qualifier', /Sync success in low-connectivity areas rose from ~30% to ~80%/],
    ['Vaasi live site', /vaasi\.vercel\.app/],
    ['Akam live site', /akam-2124\.vercel\.app/],
    ['Computer Park live site', /computerpark\.vercel\.app/],
    ['Write4U live site', /write4u\.vercel\.app/],
    ['Write4U keeps its "never uploaded" claim', /files are never uploaded/],
    ['Full-Stack Core Concepts live site', /fsccbybv2124\.vercel\.app/],
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
