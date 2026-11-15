# Editing the content

Every fact on the site comes from JSON files in `src/content/`. Components hold only fixed
interface wording (section intros, button labels, the 404 page), so you rarely need to touch one
to update the portfolio. Unknown or misspelled fields are rejected, not ignored.

| File | What it holds |
|---|---|
| `profile.json` | Name (`shortName` feeds page titles and the résumé file name), contact details and `address` (for search engines), hero text and stats, about, "outside work" (a sentence, interests and an optional photo), "why work with me" |
| `experience.json` | Jobs, newest first: dates as `YYYY-MM`, `end: null` for the current role |
| `skills.json` | Skill groups as on the résumé. `core: true` highlights an item; `note` keeps a qualifier |
| `projects.json` | Projects, with optional `live` URL, `screenshot` (every live site has one) and `caseStudies` links. Personal projects come first |
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
5. Client work stays anonymous: no end-client or product names, screenshots or code. Screenshots
   are only of the owner's own live sites.
6. Never put Tailwind classes in JSON, or any styling: components decide how things look.
7. Lists never repeat a value (a technology, a highlight, a metric label). The build rejects it.
8. Personal projects describe what the live site shows. Check the numbers against the site before
   changing them.
9. The social-work degree is listed under Education and nowhere else (a test enforces it).

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

## Photos and screenshots

- `public/profile.jpg` (800×800) is the hero portrait and the image in the Person structured data.
  `public/about/cycling.jpg` (1200×1200) is the "Outside work" photo. Both are referenced by path;
  a unit test fails if a referenced file is missing.
- Before adding a photo, resize it and strip its metadata (GPS location, camera details): re-encode
  it, don't just rename it. Keep each file well under 250 kB. Keep full-size originals out of
  `public/` (the git-ignored `docs/redesign/originals/` is where the current ones are).
- Pages load WebP copies of every photo and screenshot (`profile-400.webp`, `profile-800.webp`
  and so on), with the JPEG as the fallback. After adding or replacing a JPEG, run
  `npm run images`; a unit test fails if a copy is missing.
- The browser-tab icon is `public/icon.svg` (with `src/app/favicon.ico` for old browsers) and the
  phone home-screen icon is `public/apple-icon.png`.
- The intro video in the About section is `public/intro.mp4` with its poster frame
  `public/intro-poster.jpg`, named in `profile.json` under `introVideo`. The page shows the poster with a play
  button, and the video is only downloaded when the visitor presses it. Re-encode a new recording before adding it (720p, 30 fps, under 2 MB; a
  unit test enforces the size), for example:
  `ffmpeg -i original.mp4 -map_metadata -1 -vf fps=30 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart public/intro.mp4`
  and take the poster from a late frame: `ffmpeg -ss 29 -i original.mp4 -frames:v 1 -q:v 4 public/intro-poster.jpg`.
  Update `description` if what the video shows changes: it is what screen-reader users get.
- Project screenshots live in `public/projects/<slug>.jpg` and are produced by
  `npm run shots:projects` (which also writes their WebP copies). Always open every image afterwards: a slow site can be caught
  mid-load, and Write4U shows a splash screen the script has to wait out. A project can only have a
  screenshot if it has a `live` URL, and the `alt` says what is visible, not "screenshot of".

## Regenerating assets

- `npm run shots:projects` re-captures the project screenshots from the live sites.
- `npm run og` rebuilds `public/og/default.png` (the link-preview image) from `profile.json`.
- `npm run build && npm run screenshots` rebuilds the README screenshots in `docs/screenshots/`.
- Replace `public/VIGNESHWARAN.pdf` to update the downloadable résumé (the URL stays the same).

## Visitor analytics (optional)

The site can load Vercel Web Analytics, which counts visits without cookies. It is off by default.
To turn it on: enable Web Analytics for the project in the Vercel dashboard, add the environment
variable `NEXT_PUBLIC_VERCEL_ANALYTICS=1` to the project, and redeploy. Do both: with the variable
set but analytics disabled in Vercel, the script address returns a 404.
