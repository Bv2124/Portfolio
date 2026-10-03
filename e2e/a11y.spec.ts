import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

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

async function expectNoBlockingViolations(page: Page) {
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
