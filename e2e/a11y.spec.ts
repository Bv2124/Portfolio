import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { rawContent } from '../src/content'

const analyze = (page: Page) =>
  new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()

type Violations = Awaited<ReturnType<typeof analyze>>['violations']

// Only serious and critical violations fail the build.
const blocking = (violations: Violations) =>
  violations.filter(v => v.impact === 'serious' || v.impact === 'critical')

// One readable line per violation: rule, impact, first few targets, and why.
const describe = (violations: Violations) =>
  violations
    .map(v => {
      const targets = v.nodes.slice(0, 4).map(n => n.target.join(' ')).join(' | ')
      const reason = v.nodes[0]?.failureSummary?.split('\n').slice(1).join(' ').trim() ?? ''
      return `${v.id} [${v.impact}] x${v.nodes.length}: ${targets}\n    ${reason}`
    })
    .join('\n')

// Waits for every finite animation (e.g. the hero entrance) to finish, so axe never measures
// contrast on text that is still fading in. Looping animations (status pulse) are ignored.
async function waitForAnimations(page: Page) {
  await page.waitForFunction(() =>
    document.getAnimations().every(a => {
      const timing = a.effect?.getComputedTiming()
      return timing?.iterations === Infinity || a.playState === 'finished'
    })
  )
}

// Below-the-fold content waits (at opacity 0) for its scroll reveal, and axe skips invisible
// elements. Put every reveal into its final state first so the whole page is actually audited.
async function revealAll(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => { el.dataset.reveal = 'in' })
  })
}

async function expectNoBlockingViolations(page: Page) {
  await revealAll(page)
  await waitForAnimations(page)
  const { violations } = await analyze(page)
  const found = blocking(violations)
  expect(found, `\n${describe(found)}\n`).toEqual([])
}

test('home page has no serious or critical accessibility violations', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expectNoBlockingViolations(page)
})

test('home page with reduced motion has no serious or critical violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expectNoBlockingViolations(page)
})

test('mobile drawer has no serious or critical violations when open', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile drawer only')
  await page.goto('/')
  await page.getByRole('button', { name: 'Toggle menu' }).click()
  await expectNoBlockingViolations(page)
})

for (const study of rawContent.caseStudies) {
  test(`case study ${study.slug} has no serious or critical violations`, async ({ page }) => {
    await page.goto(`/case-studies/${study.slug}/`)
    await page.waitForLoadState('networkidle')
    await expectNoBlockingViolations(page)
  })
}

test('time-zone example has no violations in its fixed state', async ({ page }) => {
  await page.goto('/case-studies/production-ownership/')
  await page.getByRole('button', { name: 'After the fix' }).click()
  await expectNoBlockingViolations(page)
})

test('404 page has no serious or critical violations', async ({ page }) => {
  await page.goto('/this-page-does-not-exist/')
  await expectNoBlockingViolations(page)
})
