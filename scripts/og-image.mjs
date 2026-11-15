// Generates public/og/default.png (1200x630) from the content files, so the social preview
// always matches the site. Run with `npm run og`; the PNG is committed.
// Same palette as the site (see :root in src/app/globals.css). The font falls back to the system
// sans-serif if DM Sans is not installed, so the result depends slightly on the machine.
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { personal } = JSON.parse(readFileSync(resolve(root, 'src/content/profile.json'), 'utf8'))
const portrait = readFileSync(resolve(root, 'public/profile.jpg')).toString('base64')

const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const stats = personal.heroStats.filter(s => 'value' in s).slice(0, 3)
const host = new URL(personal.website).host
const initials = personal.name.split(/\s+/).map(word => word[0]).join('').slice(0, 2).toUpperCase()

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; padding: 56px 72px; color: #14302B; background: #EEF3F0;
    font-family: 'DM Sans', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
    display: flex; align-items: stretch; gap: 56px;
  }
  .left { flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; }
  .top { display: flex; align-items: center; gap: 14px; font-size: 24px; font-weight: 600; }
  .avatar { width: 48px; height: 48px; border-radius: 50%; background: #0E7C66; color: #fff;
    display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; }
  h1 { font-size: 68px; line-height: 1.02; font-weight: 600; letter-spacing: -0.03em; }
  h1 em { font-style: normal; color: #0B5C4C; }
  .sub { font-size: 26px; line-height: 1.45; color: #33514A; margin-top: 22px; max-width: 640px; }
  .stats { display: flex; gap: 16px; }
  .stat { background: #fff; border-radius: 24px; padding: 16px 24px; }
  .stat b { display: block; font-size: 38px; font-weight: 700; letter-spacing: -0.02em; }
  .stat span { font-size: 19px; color: #33514A; }
  .photo { width: 340px; flex: none; border-radius: 28px; overflow: hidden; background: #DDE9E4; }
  .photo img { width: 100%; height: 100%; object-fit: cover; object-position: 30% 30%; display: block; }
</style></head><body>
  <div class="left">
    <div class="top"><div class="avatar">${escape(initials)}</div>${escape(host)}</div>
    <div>
      <h1>${escape(personal.firstName)}<br><em>${escape(personal.lastName)}</em></h1>
      <div class="sub">${escape(personal.seoDescription)}</div>
    </div>
    <div class="stats">
      ${stats.map(s => `<div class="stat"><b>${escape(s.value)}</b><span>${escape(s.label)}</span></div>`).join('')}
    </div>
  </div>
  <div class="photo"><img alt="" src="data:image/jpeg;base64,${portrait}"></div>
</body></html>`

const out = resolve(root, 'public/og/default.png')
mkdirSync(dirname(out), { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html)
await page.locator('img').evaluate(img => img.decode())
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } })
await browser.close()
console.log(`Wrote ${out}`)
