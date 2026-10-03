// Regenerates the README screenshots from the built site, so they always match the code.
// Usage: npm run build && npm run screenshots   (serves out/ on a free port while it runs)
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const require = createRequire(import.meta.url)

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'docs/screenshots')
const port = 4321
const base = `http://localhost:${port}`

const shots = [
  { name: 'home-desktop', path: '/', viewport: { width: 1440, height: 900 } },
  { name: 'home-mobile', path: '/', viewport: { width: 390, height: 844 }, mobile: true },
  { name: 'case-study-desktop', path: '/case-studies/salesforce-to-django-migration/', viewport: { width: 1440, height: 900 }, scrollTo: 'figure' },
]

mkdirSync(outDir, { recursive: true })
// Run serve's entry point with this Node binary directly: no shell, works the same on every OS,
// and kill() stops the real server process.
const serveBin = resolve(dirname(require.resolve('serve/package.json')), 'build/main.js')
const server = spawn(process.execPath, [serveBin, 'out', '-l', String(port)], { cwd: root, stdio: 'ignore' })

try {
  const browser = await chromium.launch()
  // Wait for the static server to come up.
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(base)).ok) break } catch { /* not up yet */ }
    await new Promise(r => setTimeout(r, 200))
  }

  for (const shot of shots) {
    const page = await browser.newPage({
      viewport: shot.viewport,
      deviceScaleFactor: shot.mobile ? 2 : 1,
      isMobile: Boolean(shot.mobile),
      hasTouch: Boolean(shot.mobile),
      reducedMotion: 'reduce', // final, static state of every animation
    })
    await page.goto(base + shot.path, { waitUntil: 'networkidle' })
    if (shot.scrollTo) {
      await page.locator(shot.scrollTo).first().scrollIntoViewIfNeeded()
      await page.waitForTimeout(400) // let the header switch to its scrolled style
    }
    await page.screenshot({ path: resolve(outDir, `${shot.name}.png`) })
    await page.close()
    console.log(`docs/screenshots/${shot.name}.png`)
  }
  await browser.close()
} finally {
  server.kill()
}
