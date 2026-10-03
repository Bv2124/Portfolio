// Generates public/og/default.png (1200x630) from the content files, so the social preview
// always matches the site. Run with `npm run og`; the PNG is committed.
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { personal } = JSON.parse(readFileSync(resolve(root, 'src/content/profile.json'), 'utf8'))

const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const stats = personal.heroStats.filter(s => 'value' in s).slice(0, 3)
const host = new URL(personal.website).host

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; padding: 64px 72px; color: #e2e8f0;
    font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
    background:
      radial-gradient(900px 500px at 85% 0%, rgba(99,102,241,.28), transparent 60%),
      radial-gradient(700px 450px at 0% 100%, rgba(59,130,246,.22), transparent 60%),
      #020617;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .kicker { font: 600 22px ui-monospace, Consolas, monospace; color: #60a5fa; letter-spacing: .04em; }
  h1 { font-size: 66px; line-height: 1.05; font-weight: 800; margin-top: 22px; color: #f1f5f9; white-space: nowrap; }
  .top { display: flex; justify-content: space-between; align-items: center; }
  h1 span { background: linear-gradient(90deg, #60a5fa, #a78bfa); -webkit-background-clip: text; color: transparent; }
  .role { font-size: 36px; font-weight: 600; margin-top: 18px; color: #cbd5e1; }
  .sub { font-size: 26px; margin-top: 14px; color: #94a3b8; line-height: 1.4; max-width: 980px; }
  .stats { display: flex; gap: 20px; }
  .stat { border: 1px solid rgba(148,163,184,.25); background: rgba(15,23,42,.7); border-radius: 16px; padding: 18px 26px; }
  .stat b { display: block; font: 700 40px ui-monospace, Consolas, monospace; color: #60a5fa; }
  .stat span { font-size: 20px; color: #94a3b8; }
  .foot { display: flex; justify-content: space-between; align-items: flex-end; }
  .host { font: 600 24px ui-monospace, Consolas, monospace; color: #94a3b8; }
</style></head><body>
  <div>
    <div class="top">
      <div class="kicker">~/${escape(personal.firstName.toLowerCase())}.dev</div>
      <div class="host">${escape(host)}</div>
    </div>
    <h1>${escape(personal.firstName)} <span>${escape(personal.lastName)}</span></h1>
    <div class="sub">${escape(personal.seoDescription)}</div>
  </div>
  <div class="stats">
    ${stats.map(s => `<div class="stat"><b>${escape(s.value)}</b><span>${escape(s.label)}</span></div>`).join('')}
  </div>
</body></html>`

const out = resolve(root, 'public/og/default.png')
mkdirSync(dirname(out), { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html)
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } })
await browser.close()
console.log(`Wrote ${out}`)
