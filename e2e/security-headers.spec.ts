import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'

// The response headers in vercel.json only exist on Vercel, so the local preview server can't
// prove they are safe. These tests add them to every page response and use the site for real:
// a policy that blocked a script, style or font would fail here instead of in production.

interface VercelConfig {
  headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>
}

const config = JSON.parse(readFileSync('vercel.json', 'utf8')) as VercelConfig
const siteHeaders = Object.fromEntries(
  config.headers.flatMap(rule => rule.headers).map(h => [h.key.toLowerCase(), h.value])
)

async function withSiteHeaders(page: Page) {
  const problems: string[] = []
  page.on('pageerror', e => problems.push(`pageerror: ${e.message}`))
  page.on('console', m => { if (m.type() === 'error') problems.push(`console: ${m.text()}`) })
  await page.exposeFunction('__reportCspViolation', (detail: string) => { problems.push(`csp: ${detail}`) })
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', e => {
      void (window as unknown as { __reportCspViolation: (d: string) => void })
        .__reportCspViolation(`${e.violatedDirective} blocked ${e.blockedURI || 'inline code'}`)
    })
  })
  await page.route('**/*', async route => {
    try {
      const response = await route.fetch()
      await route.fulfill({ response, headers: { ...response.headers(), ...siteHeaders } })
    } catch {
      // The test ended while a background request (a Next.js router prefetch) was still in
      // flight. That is not a problem with the page, so it must not fail the run.
      await route.abort().catch(() => {})
    }
  })
  return problems
}

// Stops intercepting and lets any request still in flight finish quietly.
const release = (page: Page) => page.unrouteAll({ behavior: 'ignoreErrors' })

test('vercel.json sets the headers the site relies on', () => {
  expect(Object.keys(siteHeaders).sort()).toEqual([
    'content-security-policy',
    'permissions-policy',
    'referrer-policy',
    'x-content-type-options',
    'x-frame-options',
  ])
  const csp = siteHeaders['content-security-policy']!
  for (const directive of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'"]) {
    expect(csp).toContain(directive)
  }
  // Nothing may be loaded from another origin.
  expect(csp).not.toMatch(/https?:|\*/)
})

test('the home page works under the Content-Security-Policy', async ({ page }) => {
  const problems = await withSiteHeaders(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Vigneshwaran')

  // Hydration ran (the filter is interactive) and the web font loaded.
  const group = page.getByRole('group', { name: 'Filter projects' })
  await group.getByRole('button', { name: 'Mobile Apps' }).click()
  await expect(group.getByRole('button', { name: 'Mobile Apps' })).toHaveAttribute('aria-pressed', 'true')
  expect(await page.evaluate(() => document.fonts.ready.then(fonts => [...fonts].some(f => f.status === 'loaded')))).toBe(true)

  expect(problems).toEqual([])
  await release(page)
})

test('a case study works under the Content-Security-Policy, including client-side navigation', async ({ page }) => {
  const problems = await withSiteHeaders(page)
  await page.goto('/case-studies/production-ownership/')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'After the fix' }).click()
  await expect(page.getByText('Correct: service time zone')).toBeVisible()

  await page.getByRole('link', { name: /All case studies/ }).click()
  await expect(page).toHaveURL(/\/#case-studies$/)
  await expect(page.locator('section#case-studies')).toBeInViewport({ ratio: 0.1 })

  expect(problems).toEqual([])
  await release(page)
})
