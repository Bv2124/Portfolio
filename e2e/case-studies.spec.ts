import { expect, test, type Page } from '@playwright/test'
import { rawContent } from '../src/content'

const studies = rawContent.caseStudies

function trackErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`))
  page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`) })
  return errors
}

test.describe('home page case studies', () => {
  test('lists every case study as a link to its page', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('section#case-studies')
    await expect(section.getByRole('heading', { level: 2 })).toHaveText('Case Studies')
    for (const study of studies) {
      await expect(section.locator(`a[href="/case-studies/${study.slug}/"]`)).toHaveText(study.title)
    }
  })

  test('the hero call to action jumps to the case studies', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /View Case Studies/ }).click()
    await expect(page.locator('section#case-studies')).toBeInViewport({ ratio: 0.1 })
  })

  test('clicking a card opens that case study', async ({ page }) => {
    await page.goto('/')
    const target = studies[0]!
    await page.locator('section#case-studies').getByRole('link', { name: target.title }).click()
    await expect(page).toHaveURL(new RegExp(`/case-studies/${target.slug}/$`))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(target.title)
  })

  test('projects link to their case studies', async ({ page }) => {
    await page.goto('/')
    const link = page.locator('section#projects').getByRole('link', { name: /Case study: .*Salesforce/ })
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/\/case-studies\/salesforce-to-django-migration\/$/)
  })
})

for (const study of studies) {
  test.describe(`case study: ${study.slug}`, () => {
    test('renders with the expected structure and no console errors', async ({ page }) => {
      const errors = trackErrors(page)
      await page.goto(`/case-studies/${study.slug}/`)
      await page.waitForLoadState('networkidle')

      await expect(page.getByRole('heading', { level: 1 })).toHaveText(study.title)
      await expect(page.getByRole('heading', { level: 2, name: 'The challenge' })).toBeVisible()
      await expect(page.getByRole('heading', { level: 2, name: 'The approach' })).toBeVisible()
      await expect(page.getByRole('heading', { level: 2, name: 'The outcome' })).toBeVisible()
      await expect(page.locator('article h3')).toHaveCount(study.approach.length)
      await expect(page.locator('figure')).toHaveCount(1)
      expect(errors).toEqual([])
    })

    test('has no horizontal overflow', async ({ page }) => {
      await page.goto(`/case-studies/${study.slug}/`)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow).toBeLessThanOrEqual(0)
    })

    test('links back to the home page sections', async ({ page }, testInfo) => {
      await page.goto(`/case-studies/${study.slug}/`)
      if (testInfo.project.name === 'mobile') {
        await page.getByRole('button', { name: 'Toggle menu' }).click()
        await page.locator('#mobile-menu a[href="/#projects"]').click()
      } else {
        await page.getByRole('navigation', { name: 'Primary' }).locator('a[href="/#projects"]').click()
      }
      await expect(page).toHaveURL(/\/#projects$/)
      await expect(page.locator('section#projects')).toBeInViewport({ ratio: 0.1 })
    })

    test('the back link returns to the case studies section', async ({ page }) => {
      await page.goto(`/case-studies/${study.slug}/`)
      await page.getByRole('link', { name: /All case studies/ }).click()
      await expect(page).toHaveURL(/\/#case-studies$/)
      await expect(page.locator('section#case-studies')).toBeInViewport({ ratio: 0.1 })
    })

    test('marks Case Studies as the current page in the navigation', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'desktop nav only')
      await page.goto(`/case-studies/${study.slug}/`)
      await expect(
        page.getByRole('navigation', { name: 'Primary' }).locator('a[href="/#case-studies"]')
      ).toHaveAttribute('aria-current', 'page')
    })
  })
}

test('previous/next navigation walks the case studies in order', async ({ page }) => {
  const [first, second, third] = studies
  await page.goto(`/case-studies/${first!.slug}/`)
  const nav = page.getByRole('navigation', { name: 'More case studies' })
  await expect(nav.getByRole('link', { name: /Previous/ })).toHaveCount(0)
  await nav.getByRole('link', { name: /Next/ }).click()
  await expect(page).toHaveURL(new RegExp(`/${second!.slug}/$`))
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(second!.title)

  await page.getByRole('navigation', { name: 'More case studies' }).getByRole('link', { name: /Next/ }).click()
  await expect(page).toHaveURL(new RegExp(`/${third!.slug}/$`))
  await expect(page.getByRole('navigation', { name: 'More case studies' }).getByRole('link', { name: /Next/ })).toHaveCount(0)
})

test('the two Intergy case studies link to each other', async ({ page }) => {
  await page.goto('/case-studies/salesforce-to-django-migration/')
  await page.getByText('Same platform:').getByRole('link').click()
  await expect(page).toHaveURL(/\/case-studies\/production-ownership\/$/)
})

test.describe('visuals', () => {
  test('migration pipeline states both runs separately and the duplicate gate', async ({ page }) => {
    await page.goto('/case-studies/salesforce-to-django-migration/')
    const figure = page.locator('figure')
    await expect(figure.getByRole('img')).toHaveAttribute('aria-label', /about 8,000 records to staging and about 14,000 to production/)
    await expect(figure.getByText('~8,000 records')).toBeVisible()
    await expect(figure.getByText('~14,000 records')).toBeVisible()
    await expect(figure.getByText('Duplicates blocked')).toBeVisible()
  })

  test('sync chart shows exactly the two résumé figures', async ({ page }) => {
    await page.goto('/case-studies/offline-first-field-sync/')
    const figure = page.locator('figure')
    await expect(figure.getByText('~30%')).toBeVisible()
    await expect(figure.getByText('~80%')).toBeVisible()
    await expect(figure.getByText('Sync success in low-connectivity areas')).toBeVisible()
  })

  test('time-zone example toggles between the bug and the fix', async ({ page }) => {
    await page.goto('/case-studies/production-ownership/')
    const figure = page.locator('figure')
    const before = figure.getByRole('button', { name: 'Before the fix' })
    const after = figure.getByRole('button', { name: 'After the fix' })

    await expect(before).toHaveAttribute('aria-pressed', 'true')
    await expect(figure.getByText('Wrong: device time')).toBeVisible()

    await after.click()
    await expect(after).toHaveAttribute('aria-pressed', 'true')
    await expect(figure.getByText('Correct: service time zone')).toBeVisible()
  })

  test('time-zone example uses correct, deterministic times', async ({ page }) => {
    await page.goto('/case-studies/production-ownership/')
    const figure = page.locator('figure')
    // 10:00 in Sydney (AEST, UTC+10) is 5:30 in India (IST, UTC+5:30).
    // Before the fix the viewer is shown the device time, so 5:30 appears twice (device + shown).
    await expect(figure.getByText('10:00 AM', { exact: true })).toHaveCount(1)
    await expect(figure.getByText('5:30 AM', { exact: true })).toHaveCount(2)

    // After the fix the viewer is shown the service time, so 10:00 appears twice instead.
    await figure.getByRole('button', { name: 'After the fix' }).click()
    await expect(figure.getByText('10:00 AM', { exact: true })).toHaveCount(2)
    await expect(figure.getByText('5:30 AM', { exact: true })).toHaveCount(1)
  })
})

test.describe('404 page', () => {
  test('unknown URLs get the styled not-found page with a way home', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist/')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
    await expect(page).toHaveTitle(/^Page not found/)
    await page.getByRole('link', { name: /Back to the home page/ }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Vigneshwaran')
  })

  test('an unknown case study slug is also a 404', async ({ page }) => {
    const response = await page.goto('/case-studies/not-a-real-study/')
    expect(response?.status()).toBe(404)
  })

  test('an unknown case study does not mark Case Studies as the current page', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'desktop nav only')
    await page.goto('/case-studies/not-a-real-study/')
    await expect(page.getByRole('navigation', { name: 'Primary' }).locator('a[aria-current]')).toHaveCount(0)
  })
})
