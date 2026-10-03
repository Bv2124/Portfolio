import { expect, test } from '@playwright/test'

// Works on the raw server HTML (scripts removed), i.e. what crawlers and ATS parsers see.
// Grepping the whole file would give false positives from the embedded RSC payload.
async function renderedMarkup(request: import('@playwright/test').APIRequestContext, path: string) {
  const res = await request.get(path)
  expect(res.status()).toBe(200)
  return (await res.text()).replace(/<script[\s\S]*?<\/script>/g, '')
}

test.describe('home page (server HTML)', () => {
  test('has the basics crawlers need', async ({ request }) => {
    const html = await renderedMarkup(request, '/')
    expect(html).toContain('<html lang="en"')
    expect(html).toMatch(/<title>[^<]*Vigneshwaran[^<]*<\/title>/)
    expect(html).toMatch(/<meta name="description" content="[^"]{40,}"/)
    expect(html).toMatch(/<h1[^>]*>[\s\S]*Vigneshwaran[\s\S]*<\/h1>/)
  })

  test('renders content in the HTML, not only after hydration', async ({ request }) => {
    const html = await renderedMarkup(request, '/')
    expect(html).toContain('Intergy Consulting')
    expect(html).toContain('Nanosoft Engineers')
    expect(html).toContain('id="projects"')
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
})
