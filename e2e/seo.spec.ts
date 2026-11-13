import { expect, test, type APIRequestContext } from '@playwright/test'
import { rawContent } from '../src/content'

const SITE = rawContent.profile.personal.website.replace(/\/+$/, '')
const studies = rawContent.caseStudies

async function rawHtml(request: APIRequestContext, path: string) {
  const res = await request.get(path)
  expect(res.status(), path).toBe(200)
  return res.text()
}

// Scripts removed: this is what crawlers and ATS parsers read. Grepping the whole file would give
// false positives from the embedded RSC payload.
async function renderedMarkup(request: APIRequestContext, path: string) {
  return (await rawHtml(request, path)).replace(/<script[\s\S]*?<\/script>/g, '')
}

const meta = (html: string, attr: 'name' | 'property', key: string) =>
  new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`).exec(html)?.[1]

function jsonLd(html: string): Array<Record<string, unknown>> {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  return blocks.flatMap(m => {
    const parsed = JSON.parse(m[1]!) as { '@graph'?: Array<Record<string, unknown>> }
    return parsed['@graph'] ?? [parsed as Record<string, unknown>]
  })
}

test.describe('home page (server HTML)', () => {
  test('has the basics crawlers need', async ({ request }) => {
    const html = await renderedMarkup(request, '/')
    expect(html).toContain('<html lang="en"')
    expect(html).toMatch(/<title>[^<]*Vigneshwaran[^<]*<\/title>/)
    expect(html).toMatch(/<meta name="description" content="[^"]{40,160}"/)
    expect(html).toMatch(/<h1[^>]*>[\s\S]*Vigneshwaran[\s\S]*<\/h1>/)
  })

  test('renders content in the HTML, not only after hydration', async ({ request }) => {
    const html = await renderedMarkup(request, '/')
    expect(html).toContain('Intergy Consulting')
    expect(html).toContain('Nanosoft Engineers')
    expect(html).toContain('id="projects"')
    expect(html).toContain('id="case-studies"')
  })

  test('shows the key résumé facts in the rendered text', async ({ request }) => {
    const html = await renderedMarkup(request, '/')
    const text = html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ')
    for (const fact of [
      'bv2124.dev@gmail.com',
      'Full-Stack Engineer',
      '150+ production issues',
      '~14,000 to production',
      '300+ clinicians',
      'low-connectivity areas from ~30% to ~80%',
      'Australia (Remote)',
      'vaasi.vercel.app',
    ]) {
      expect(text, `missing "${fact}"`).toContain(fact)
    }
  })

  test('résumé download link carries a recruiter-friendly file name', async ({ request }) => {
    const html = await renderedMarkup(request, '/')
    expect(html).toContain('download="Vigneshwaran_B_Full-Stack_Engineer_Resume.pdf"')
  })

  test('does not hide any content with inline opacity:0', async ({ request }) => {
    const html = await renderedMarkup(request, '/')
    expect(html).not.toMatch(/style="[^"]*opacity:\s*0[;"]/)
  })

  test('declares a canonical URL, a large social card and a Person entity', async ({ request }) => {
    const html = await rawHtml(request, '/')
    expect(html).toContain(`<link rel="canonical" href="${SITE}/"/>`)
    expect(meta(html, 'name', 'twitter:card')).toBe('summary_large_image')
    expect(meta(html, 'property', 'og:image')).toBe(`${SITE}/og/default.png`)
    expect(meta(html, 'property', 'og:url')).toBe(`${SITE}/`)

    const person = jsonLd(html).find(n => n['@type'] === 'Person')
    expect(person).toMatchObject({
      '@id': `${SITE}/#person`,
      name: 'Vigneshwaran Balasubramanian',
      alternateName: 'Vigneshwaran B',
      jobTitle: 'Full-Stack Engineer',
    })
    expect(person?.sameAs).toEqual(expect.arrayContaining([expect.stringContaining('github.com/Bv2124')]))
  })
})

for (const study of studies) {
  const url = `${SITE}/case-studies/${study.slug}/`

  test.describe(`case study ${study.slug} (server HTML)`, () => {
    test('has its own canonical URL and social metadata, not the home page’s', async ({ request }) => {
      const html = await rawHtml(request, `/case-studies/${study.slug}/`)
      expect(html).toContain(`<link rel="canonical" href="${url}"/>`)
      expect(meta(html, 'property', 'og:title')).toBe(study.title)
      expect(meta(html, 'name', 'description')!.length).toBeLessThanOrEqual(160)
      expect(meta(html, 'property', 'og:url')).toBe(url)
      expect(meta(html, 'property', 'og:type')).toBe('article')
      expect(meta(html, 'name', 'twitter:title')).toBe(study.title)
      expect(meta(html, 'name', 'twitter:card')).toBe('summary_large_image')
      expect(meta(html, 'property', 'og:image')).toBe(`${SITE}/og/default.png`)
      expect(html).toMatch(/<title>[^<]*· Vigneshwaran B<\/title>/)
    })

    test('describes itself with TechArticle and breadcrumb structured data', async ({ request }) => {
      const nodes = jsonLd(await rawHtml(request, `/case-studies/${study.slug}/`))
      expect(nodes.find(n => n['@type'] === 'TechArticle')).toMatchObject({
        headline: study.title,
        url,
        author: { '@id': `${SITE}/#person` },
      })
      const crumbs = nodes.find(n => n['@type'] === 'BreadcrumbList') as { itemListElement: Array<{ item: string }> }
      expect(crumbs.itemListElement.map(c => c.item)).toEqual([`${SITE}/`, `${SITE}/#case-studies`, url])
    })

    test('renders its content in the HTML and hides nothing with opacity:0', async ({ request }) => {
      const html = await renderedMarkup(request, `/case-studies/${study.slug}/`)
      expect(html).toMatch(/<h1[^>]*>[\s\S]*<\/h1>/)
      // Compare as text: the markup escapes quotes and ampersands.
      const text = html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
      for (const step of study.approach) expect(text).toContain(step.title)
      expect(html).not.toMatch(/style="[^"]*opacity:\s*0[;"]/)
    })

    test('ships the data file client-side navigation needs', async ({ request }) => {
      const res = await request.get(`/case-studies/${study.slug}/index.txt`)
      expect(res.status()).toBe(200)
    })
  })
}

test.describe('crawler files', () => {
  test('sitemap lists the home page and every case study with trailing slashes', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text()
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
    expect(locs).toEqual([`${SITE}/`, ...studies.map(s => `${SITE}/case-studies/${s.slug}/`)])
  })

  test('robots.txt allows crawling and points at the sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt')
    expect(res.status()).toBe(200)
    const text = await res.text()
    expect(text).toMatch(/Allow:\s*\//)
    expect(text).toContain(`Sitemap: ${SITE}/sitemap.xml`)
  })

  test('the social preview image exists and is a PNG', async ({ request }) => {
    const res = await request.get('/og/default.png')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('image/png')
  })
})
