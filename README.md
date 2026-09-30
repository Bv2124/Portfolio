# Vigneshwaran B — Portfolio

Personal portfolio for a Full-Stack Engineer, live at <https://bv2124.vercel.app>.

Built with Next.js (App Router, static export), TypeScript (strict), Tailwind CSS and lucide-react. All content is data-driven from a single JSON file, so the UI never hard-codes résumé facts.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server on http://localhost:3000 |
| `npm run build` | Lint, type-check and export the static site to `out/` |
| `npm run preview` | Serve `out/` locally on http://localhost:4173 |
| `npm run lint` | ESLint (`--max-warnings=0`) |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |

Requires Node 24 (see `.nvmrc`).

## Where things live

```
src/app/            App Router entry (layout, page, global CSS, data)
src/components/     layout/ (nav, footer, progress bar), sections/, ui/
src/hooks/          small client hooks
src/lib/            date helpers, icon registry, content types
src/app/data/       portfolio.json — the single content source
public/             resume PDF and static assets
```

## Licence

Source code is MIT (see `LICENSE`). The personal content and the résumé PDFs are © Vigneshwaran B and are not licensed for reuse.
