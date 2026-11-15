// Captures the home page of every project that has a live site, for the project cards.
// Usage: npm run shots:projects   (needs network access to the live sites)
// Writes public/projects/<slug>.jpg: 1280x800, JPEG, each under 200 kB. Look at every image
// afterwards: a slow site can be caught mid-load, and a cookie banner would be captured too.
import { mkdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public/projects')
const MAX_BYTES = 200_000

// Sites that cover the page with a splash screen first: the selector of that overlay.
const SPLASH = { write4u: '.splash' }

const projects = JSON.parse(readFileSync(resolve(root, 'src/content/projects.json'), 'utf8'))
const live = projects.filter(p => p.live)

mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()
let failed = 0

for (const project of live) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce', // the final, static state of every animation
  })
  try {
    const response = await page.goto(project.live, { waitUntil: 'load', timeout: 45_000 })
    if (!response || !response.ok()) throw new Error(`HTTP ${response?.status() ?? 'no response'}`)
    // Wait for the network to go quiet, but a site that keeps polling must not block the capture.
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
    const splash = SPLASH[project.slug]
    if (splash) {
      // Wait for the overlay to leave on its own; if it does not, a click dismisses it.
      const gone = await page.waitForSelector(splash, { state: 'detached', timeout: 20_000 }).then(() => true, () => false)
      if (!gone) {
        await page.mouse.click(640, 400)
        await page.waitForSelector(splash, { state: 'detached', timeout: 15_000 })
      }
    }
    await page.waitForTimeout(1000)

    // Start at quality 80 and step down until the file is small enough.
    const file = resolve(outDir, `${project.slug}.jpg`)
    let quality = 80
    for (;;) {
      await page.screenshot({ path: file, type: 'jpeg', quality })
      const size = statSync(file).size
      if (size <= MAX_BYTES || quality <= 40) {
        console.log(`${project.slug}.jpg  ${Math.round(size / 1000)} kB  (quality ${quality})  ${project.live}`)
        break
      }
      quality -= 8
    }
  } catch (error) {
    failed += 1
    console.error(`FAILED ${project.slug} (${project.live}): ${error.message}`)
  } finally {
    await page.close()
  }
}

await browser.close()
if (failed > 0) process.exit(1)
