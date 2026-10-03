import { expect, test, type Page } from '@playwright/test'
import { rawContent } from '../src/content'

const SECTION_IDS = ['about', 'experience', 'case-studies', 'skills', 'projects', 'education', 'contact']

// Collects anything the browser would show as an error (this also catches React hydration warnings).
function trackErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`))
  page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`) })
  return errors
}

test('home page renders with no console errors', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Vigneshwaran')
  await page.waitForLoadState('networkidle')
  expect(errors).toEqual([])
})

test('every section is present with a heading', async ({ page }) => {
  await page.goto('/')
  for (const id of SECTION_IDS) {
    await expect(page.locator(`section#${id}`)).toBeAttached()
    await expect(page.locator(`section#${id} h2`)).toHaveCount(1)
  }
})

test('has no horizontal overflow', async ({ page }) => {
  await page.goto('/')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('resume PDF is served', async ({ request }) => {
  const res = await request.get('/VIGNESHWARAN.pdf')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('application/pdf')
})

test('skip link jumps to main content', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
})

test('all content is visible with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('section#about h2')).toBeVisible()
  const opacity = await page.locator('h1').evaluate(el => getComputedStyle(el).opacity)
  expect(opacity).toBe('1')
})

test('typewriter renders a real role in the HTML and exposes roles to screen readers', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(/^Roles:/)).toHaveCount(1)
})

test.describe('desktop navigation', () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'desktop nav only')
  })

  test('nav links scroll their section into view and mark it current', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Primary' })
    for (const id of ['experience', 'case-studies', 'projects', 'contact']) {
      await nav.locator(`a[href="/#${id}"]`).click()
      await expect(page.locator(`section#${id}`)).toBeInViewport({ ratio: 0.1 })
      await expect(nav.locator(`a[href="/#${id}"]`)).toHaveAttribute('aria-current', 'true')
    }
  })

  test('the current-section highlight clears back at the top', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Primary' })
    await nav.locator('a[href="/#about"]').click()
    await expect(nav.locator('a[aria-current="true"]')).toHaveCount(1)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await expect(nav.locator('a[aria-current="true"]')).toHaveCount(0)
  })

  // Seven links plus the résumé button need ~1280px; below that the hamburger menu takes over.
  for (const width of [1280, 1366, 1440]) {
    test(`all nav links fit on one row at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto('/')
      const nav = page.getByRole('navigation', { name: 'Primary' })
      const boxes = await nav.locator('a:visible').evaluateAll(els =>
        els.map(el => { const r = el.getBoundingClientRect(); return { height: Math.round(r.height), right: r.right } })
      )
      expect(boxes.length).toBeGreaterThan(8) // logo + 7 links + résumé
      expect(Math.max(...boxes.map(b => b.height))).toBeLessThanOrEqual(44)
      expect(Math.max(...boxes.map(b => b.right))).toBeLessThanOrEqual(width)
    })
  }

  test('uses the hamburger menu below 1280px instead of cramming the links', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 })
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Toggle menu' })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Primary' }).locator('a[href="/#about"]')).toBeHidden()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
})

test.describe('mobile drawer', () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile drawer only')
  })

  test('opens, traps the page behind it, and returns focus on Escape', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Toggle menu' })
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#mobile-menu a').first()).toBeFocused()
    await expect(page.locator('main')).toHaveAttribute('inert', '')

    await page.keyboard.press('Escape')
    await expect(page.locator('#mobile-menu')).toHaveCount(0)
    await expect(toggle).toBeFocused()
    await expect(page.locator('main')).not.toHaveAttribute('inert', '')
  })

  test('a drawer link navigates and closes the drawer', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Toggle menu' }).click()
    await page.locator('#mobile-menu a[href="/#projects"]').click()
    await expect(page.locator('#mobile-menu')).toHaveCount(0)
    await expect(page.locator('section#projects')).toBeInViewport({ ratio: 0.1 })
  })
})

test.describe('projects filter', () => {
  const projects = rawContent.projects
  const mobileApps = projects.filter(p => p.type === 'Mobile Apps')

  // Cards animate out when filtered away, so assertions retry until the exit has finished.
  test('filters cards and reports the pressed state', async ({ page }) => {
    await page.goto('/')
    const group = page.getByRole('group', { name: 'Filter projects' })
    const cards = page.locator('section#projects h3')
    await expect(cards).toHaveCount(projects.length)

    const mobile = group.getByRole('button', { name: 'Mobile Apps' })
    await mobile.click()
    await expect(mobile).toHaveAttribute('aria-pressed', 'true')
    await expect(group.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
    await expect(cards).toHaveCount(mobileApps.length)
    await expect(cards).toHaveText(mobileApps.map(p => p.title))

    await group.getByRole('button', { name: 'All' }).click()
    await expect(cards).toHaveCount(projects.length)
  })

  test('project numbers stay stable when filtering', async ({ page }) => {
    await page.goto('/')
    const group = page.getByRole('group', { name: 'Filter projects' })
    await group.getByRole('button', { name: 'Mobile Apps' }).click()
    const numbers = page.locator('section#projects [data-index]')
    await expect(numbers).toHaveCount(mobileApps.length)

    // Each card keeps its number from the full list (e.g. the first mobile app is not "01").
    const expected = mobileApps.map(p => String(projects.indexOf(p) + 1).padStart(2, '0'))
    const actual = await numbers.evaluateAll(els => els.map(el => el.getAttribute('data-index')))
    expect(actual).toEqual(expected)
  })
})
