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

  test('does not hide any content with inline opacity:0', async ({ request }) => {
    const html = await renderedMarkup(request, '/')
    expect(html).not.toMatch(/style="[^"]*opacity:\s*0[;"]/)
  })
})
