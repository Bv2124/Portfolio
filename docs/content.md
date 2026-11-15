# Editing the content

Every fact on the site comes from JSON files in `src/content/`. Components hold only fixed
interface wording (section intros, button labels, the 404 page), so you rarely need to touch one
to update the portfolio. Unknown or misspelled fields are rejected, not ignored.

| File | What it holds |
|---|---|
| `profile.json` | Name (`shortName` feeds page titles and the résumé file name), contact details and `address` (for search engines), hero text and stats, about, "why work with me" |
| `experience.json` | Jobs, newest first: dates as `YYYY-MM`, `end: null` for the current role |
| `skills.json` | Skill groups as on the résumé. `core: true` highlights an item; `note` keeps a qualifier |
| `projects.json` | Projects, with optional `live` URL and `caseStudies` links |
| `education.json` | Degrees and certifications |
| `case-studies/<slug>.json` | One file per case study (also add it to `src/content/index.ts`) |

After editing, run `npm test` (fast) or `npm run verify` (everything). If something is wrong, the
error names the exact field, for example `experience.0.start: Expected YYYY-MM`.

## Rules for what goes in

These keep the site and the résumé saying the same thing. Several are enforced by
`src/lib/content.test.ts`.

1. Every claim must trace to the résumé. Don't invent numbers, multipliers, team sizes or timelines.
2. Keep qualifiers attached: "~30% → ~80% sync success **in low-connectivity areas**",
   "**image** payloads".
3. Number formats:
   - In prose: "~8,000", "~14,000", "2,000+".
   - In compact tiles only: "~14K", always with the tilde, never "14K+".
4. Use "healthcare and care-sector". Only the stakeholders are "Australian".
5. Client work stays anonymous: no end-client or product names, screenshots or code.
6. Never put Tailwind classes in JSON. Use the tokens the schema accepts.

7. Lists never repeat a value (a technology, a highlight, a metric label). The build rejects it.
8. Personal projects describe what the live site shows. Check the numbers against the site before
   changing them.

When a claim is retired, add it to the deny-list in `content.test.ts` so it can't creep back.

## Writing a case study

```jsonc
{
  "slug": "kebab-case-and-unique",            // becomes /case-studies/<slug>/
  "title": "…",                               // also the <h1>, <title>, og:title
  "tagline": "…",                             // one sentence, shown under the title
  "seoDescription": "…",                      // meta description, 160 characters at most
  "employer": "Intergy Consulting",           // must match a company in experience.json
  "context": "…",                             // one or two sentences of setting
  "stack": ["Django", "PostgreSQL"],          // only what the work actually used
  "metrics": [{ "value": "~14K", "label": "…", "srText": "approximately 14,000 …" }], // 2–4
  "challenge": ["…"],
  "approach": [{ "title": "…", "text": "…" }], // at least 2 steps
  "outcome": ["…"],
  "alsoShipped": { "title": "…", "items": ["…"] }, // optional: related wins that aren't outcomes of this work
  "related": ["other-slug"],                  // optional: same-platform studies
  "visual": "pipeline",                       // one of the visuals registered in components/case-study/visuals
  "team": "…", "tradeoffs": ["…"], "learnings": ["…"] // optional; rendered only when present
}
```

Use `srText` whenever the visible value is abbreviated (`~14K`), so screen readers hear the full
figure. The first metric is the headline on the home-page card. It counts up if it is a single
number.

## Regenerating assets

- `npm run og` rebuilds `public/og/default.png` (the link-preview image) from `profile.json`.
- `npm run build && npm run screenshots` rebuilds the README screenshots in `docs/screenshots/`.
- Replace `public/VIGNESHWARAN.pdf` to update the downloadable résumé (the URL stays the same).
