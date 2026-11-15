# 2. Keep content in validated JSON, separate from components

- **Status:** Accepted
- **Date:** 2026-09

## Context

Every fact on the site comes from the author's résumé, and the résumé changes. The previous version
kept content in one untyped JSON file. PropTypes appeared to guard it, but the App Router runs
Next's bundled React 19, which no longer checks PropTypes. In practice nothing was validated:

- a misspelled icon name rendered nothing
- Tailwind classes stored in JSON were never generated (Tailwind doesn't scan JSON), so 12 icons
  silently lost their colour
- unsupported claims could drift in unnoticed

## Decision

- Content lives in `src/content/*.json`, with one file per case study.
- `src/lib/schema.ts` defines it with zod. TypeScript types are `z.infer`'d from the schema, so the
  types and the runtime checks cannot disagree.
- `src/lib/content.ts` (marked `server-only`) parses the content once at build time and exposes small
  selectors. Components never import raw JSON, and content never ships to the browser.
- Cross-references are validated too: case-study employers must exist in the experience list,
  related studies and project links must point at real slugs, and every `visual` must have a
  registered component.
- Objects are strict: an unknown or misspelled field is an error, never silently dropped. Lists
  whose values identify their items (technologies, highlights, metric labels) must not repeat.
- JSON stores tokens, never CSS classes. Components map tokens to literal Tailwind classes.

Tests in `src/lib/content.test.ts`:

- mutate a copy of the real content and assert the exact path of each error
- keep a deny-list of claims the résumé doesn't support (for example "14K+" where the résumé says
  "~14,000")
- assert that key facts keep their qualifiers ("in low-connectivity areas")

## Consequences

- A bad edit fails `next build` (and CI) with a message such as `caseStudies.0.employer: No
  experience entry for "…"`, instead of shipping a broken or wrong page.
- Visitors pay nothing: zod runs only at build time.
- Adding a field means updating the schema first, which is the point.
