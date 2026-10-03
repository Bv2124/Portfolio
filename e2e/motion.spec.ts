import { expect, test } from '@playwright/test'
import { rawContent } from '../src/content'

// The motion rules: nothing on screen is ever hidden, every animation ends in the real content,
// and reduced motion or no JavaScript shows everything immediately.

test.describe('scroll reveals', () => {
  test('content already on screen at load is never hidden', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const armedOnScreen = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-reveal="armed"]'))
        .filter(el => el.getBoundingClientRect().top < window.innerHeight).length
    )
    expect(armedOnScreen).toBe(0)
  })

  test('below-the-fold content waits, then reveals when scrolled to', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const heading = page.locator('section#education .heading-reveal')
    await expect(heading).toHaveAttribute('data-reveal', 'armed')

    await page.locator('section#education').scrollIntoViewIfNeeded()
    await expect(heading).toHaveAttribute('data-reveal', 'in')
    await expect(page.locator('section#education h2')).toBeVisible()
  })

  test('the experience timeline fills as you scroll through it', async ({ page }) => {
    await page.goto('/')
    const fill = page.locator('.timeline-fill')
    const scale = () => fill.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).d)
    // Puts the top of the timeline at `fraction` of the viewport height (negative = above it).
    const placeTimeline = (fraction: number) =>
      page.evaluate(f => {
        const track = document.querySelector('.timeline-fill')!.parentElement!
        const top = track.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: top - window.innerHeight * f, behavior: 'instant' })
      }, fraction)

    await placeTimeline(0.5)
    await expect.poll(scale).toBeGreaterThan(0)
    const early = await scale()

    await placeTimeline(-0.3)
    await expect.poll(scale).toBeGreaterThan(early)
    expect(await scale()).toBeLessThanOrEqual(1)
  })
})

test.describe('count-up metrics', () => {
  test('case-study headline numbers end on the real values', async ({ page }) => {
    await page.goto('/')
    await page.locator('section#case-studies').scrollIntoViewIfNeeded()
    const cards = page.locator('section#case-studies article')
    for (const [i, study] of rawContent.caseStudies.entries()) {
      // The animated number (an invisible copy alongside it only reserves the width).
      await expect(cards.nth(i).locator('[data-countup]')).toHaveText(study.metrics[0]!.value)
    }
  })

  test('screen readers get the full value, not the animating digits', async ({ page }) => {
    await page.goto('/')
    const first = rawContent.caseStudies[0]!.metrics[0] as { value: string; srText?: string }
    await expect(page.locator('section#case-studies article').first().locator('.sr-only')).toHaveText(
      first.srText ?? first.value
    )
  })
})

test.describe('case-study visuals', () => {
  test('replay restarts the sequence', async ({ page }) => {
    await page.goto('/case-studies/salesforce-to-django-migration/')
    const player = page.locator('[data-play]')
    const replay = page.getByRole('button', { name: /Replay animation/ })
    await expect(replay).toBeVisible()
    await replay.click()
    await expect(player).toHaveAttribute('data-play', 'play')
    // Once played, every node of the diagram is visible again.
    await expect(page.locator('figure').getByText('~14,000 records')).toBeVisible()
  })
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('nothing is ever armed for a reveal and visuals have no replay', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-reveal="armed"]')).toHaveCount(0)

    await page.goto('/case-studies/offline-first-field-sync/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-play]')).toHaveAttribute('data-play', 'done')
    await expect(page.getByRole('button', { name: /Replay animation/ })).toHaveCount(0)
  })

  test('the typewriter holds the first role instead of cycling', async ({ page }) => {
    await page.goto('/')
    const typed = page.locator('.terminal-body [aria-hidden="true"] .text-emerald-300')
    await expect(typed).toHaveText(rawContent.profile.roles[0]!)
    await page.waitForTimeout(2500)
    await expect(typed).toHaveText(rawContent.profile.roles[0]!)
  })

  test('the timeline line is shown in full', async ({ page }) => {
    await page.goto('/')
    const scaleY = await page.locator('.timeline-fill').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).d)
    expect(scaleY).toBe(1)
  })
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('every section and case study is fully readable', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Vigneshwaran')
    await expect(page.locator('[data-reveal="armed"]')).toHaveCount(0)
    for (const id of ['about', 'experience', 'case-studies', 'skills', 'projects', 'education', 'contact']) {
      const opacity = await page.locator(`section#${id} h2`).evaluate(el => getComputedStyle(el).opacity)
      expect(opacity, id).toBe('1')
    }

    await page.goto('/case-studies/salesforce-to-django-migration/')
    await expect(page.locator('[data-play]')).toHaveAttribute('data-play', 'done')
    await expect(page.locator('figure').getByText('~14,000 records')).toBeVisible()
  })
})
