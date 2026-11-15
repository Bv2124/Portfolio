// Measures Largest Contentful Paint of the built site (out/) the way ADR 3 describes: real
// Chrome, Pixel 7 profile, 4x CPU slowdown, ~1.6 Mbps and 150 ms RTT; prints every run and the median.
// Usage: npm run build && npm run lcp            (optional: node scripts/measure-lcp.mjs [runs] [path])
// The absolute number depends on the machine's CPU, so compare runs on the same machine
// (for example before and after a change), not against a figure measured elsewhere.
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { createServer } from 'node:net'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, devices } from '@playwright/test'

const require = createRequire(import.meta.url)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const runs = Number(process.argv[2] ?? 7)
const path = process.argv[3] ?? '/'

// A free port, so a server that is already running can never be measured by mistake.
const port = await new Promise((done, fail) => {
  const probe = createServer()
  probe.once('error', fail)
  probe.listen(0, () => {
    const { port: free } = probe.address()
    probe.close(() => done(free))
  })
})
const base = `http://localhost:${port}`
const serveBin = resolve(dirname(require.resolve('serve/package.json')), 'build/main.js')
const server = spawn(process.execPath, [serveBin, 'out', '-l', String(port)], { cwd: root, stdio: 'ignore' })

const results = []
try {
  let up = false
  for (let i = 0; i < 50 && !up; i++) {
    try { up = (await fetch(base)).ok } catch { /* not up yet */ }
    if (!up) await new Promise(r => setTimeout(r, 200))
  }
  if (!up) throw new Error('The static server did not start. Run `npm run build` first.')

  const browser = await chromium.launch()
  for (let run = 0; run < runs; run++) {
    const context = await browser.newContext({ ...devices['Pixel 7'] }) // fresh context: nothing cached
    const page = await context.newPage()
    const cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await page.addInitScript(() => {
      window.__lcp = { time: 0, element: '' }
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const el = entry.element
          window.__lcp = { time: entry.startTime, element: el ? `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}` : '' }
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true })
    })
    await page.goto(base + path, { waitUntil: 'load' })
    await page.waitForTimeout(2500)
    results.push(await page.evaluate(() => window.__lcp))
    await context.close()
  }
  await browser.close()
} finally {
  server.kill()
}

const times = results.map(r => r.time).sort((a, b) => a - b)
const median = times[Math.floor(times.length / 2)]
console.log(`LCP of ${path} over ${runs} runs: ${times.map(t => Math.round(t)).join(', ')} ms`)
console.log(`Median ${Math.round(median)} ms (LCP element: ${results[0].element})`)
