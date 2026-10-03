# Vigneshwaran B — Portfolio

Personal portfolio for a Full-Stack Engineer, live at <https://bv2124.vercel.app>.

Built with Next.js (App Router, static export), TypeScript (strict), Tailwind CSS and lucide-react. Content lives in validated JSON files, so the UI never hard-codes résumé facts and a bad edit fails the build with the exact path of the problem.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server on http://localhost:3000 |
| `npm run build` | Lint, type-check and export the static site to `out/` |
| `npm run preview` | Serve `out/` locally on http://localhost:4173 |
| `npm run lint` | ESLint (`--max-warnings=0`) |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |
| `npm test` | Vitest unit tests (date helpers, content schema) |
| `npm run test:e2e` | Playwright smoke, accessibility (axe) and SEO tests against `out/` — run `npm run build` first |
| `npm run verify` | Everything above, in order — what CI runs |

Requires Node 24 (see `.nvmrc`). First-time E2E setup: `npx playwright install chromium`.

## Quality gates

`.github/workflows/ci.yml` runs on every pull request and push to `main`: lint → type-check → unit tests → build → Playwright (desktop and mobile, including axe accessibility and reduced-motion checks) → Lighthouse CI (accessibility, best-practices and SEO ≥ 0.95; performance ≥ 0.9 warns).

## Where things live

```
src/app/            App Router entry (layout, page, global CSS)
src/content/        Content as JSON (profile, experience, skills, projects, education)
src/components/     layout/ (nav, footer, progress bar), sections/, ui/
src/hooks/          Small client hooks
src/lib/            schema.ts (zod), content.ts (validated, server-only), date helpers, icons, section registry
e2e/                Playwright specs
public/             Résumé PDF and static assets
```

Content is parsed with zod at build time (`src/lib/content.ts`), never in the browser. Tailwind classes never appear in the JSON: content stores tokens (e.g. an accent name) and components map them to literal classes.

## Licence

Source code is MIT (see `LICENSE`). The personal content and the résumé PDFs are © Vigneshwaran B and are not licensed for reuse.
