// Enforces the JavaScript budget from ADR 3: the scripts the home page loads on first visit
// must stay at or below 150 kB gzipped. Run after `npm run build`; used by CI and `npm run verify`.
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const BUDGET_KB = 150

const out = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'out')
const page = join(out, 'index.html')
if (!existsSync(page)) {
  console.error('out/index.html not found. Run `npm run build` first.')
  process.exit(1)
}

const html = readFileSync(page, 'utf8')
// `noModule` scripts are polyfills that only legacy browsers download, so they don't count.
const sources = [...new Set(
  [...html.matchAll(/<script[^>]+src="(\/_next\/[^"]+\.js)"[^>]*>/g)]
    .filter(m => !/nomodule/i.test(m[0]))
    .map(m => m[1])
)]
if (sources.length === 0) {
  console.error('No scripts found in out/index.html: the budget check would pass for the wrong reason.')
  process.exit(1)
}

const bytes = sources.reduce((sum, src) => sum + gzipSync(readFileSync(join(out, src))).length, 0)
const kb = bytes / 1000

console.log(`Home first-load JavaScript: ${kb.toFixed(1)} kB gzipped across ${sources.length} files (budget ${BUDGET_KB} kB)`)
if (kb > BUDGET_KB) {
  console.error(`Over budget by ${(kb - BUDGET_KB).toFixed(1)} kB.`)
  process.exit(1)
}
