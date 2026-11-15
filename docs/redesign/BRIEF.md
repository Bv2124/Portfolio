# Redesign brief: "Soft and friendly" theme

This is a complete brief for rebuilding the look of this portfolio. Read all of it before changing
anything. It was written by someone who has read every file in the repository, so where it names a
file or a line of behaviour, trust it, but still open the file before you edit it.

## 1. The goal

The site works well and is well tested, but it looks like a generic dark "developer terminal"
theme. The owner wants it to look like a person designed it over many hours: warm, light,
professional, and memorable to a recruiter who opens it for thirty seconds.

Four things change:

1. **The whole visual theme** moves to the chosen direction (section 4).
2. **Social-work content is removed** everywhere except one line in Education (section 5).
3. **Personal projects show a screenshot** of their live home page (section 6).
4. **The owner appears as a person**: a portrait in the hero, and a short "Outside work" block
   with two hobbies and a photo (section 6a).

Everything else stays: the content, the routes, the static export, the content schema, the
accessibility and motion rules, the test suites and the CI gates. A redesign that breaks those is
not done.

"Done" means: `npm run verify` passes, Lighthouse stays at or above the CI thresholds, the site
looks deliberate at 360px, 768px and 1440px, and the owner would be proud to send the link.

## 2. Read these first

| File | Why |
|---|---|
| `docs/redesign/mockup-f.html` | The approved mockup of the hero and case-study cards. It is a design-tool file: ignore the `<x-dc>`, `<helmet>` and `{{accent}}` syntax and read the inline styles. `{{accent}}` is `#0E7C66`. |
| `docs/adr/0003-motion-and-performance-budget.md` | The motion rules. They still apply in full. |
| `docs/adr/0004-security-headers.md` | Why you cannot load anything from another origin (fonts included). |
| `docs/content.md` | The rules for what the content may say. |
| `src/lib/schema.ts`, `src/lib/content.ts` | How content is validated and reaches components. |
| `e2e/*.spec.ts` | What the site promises. Read them before restyling the thing they test. |

## 3. Decisions already made

These are settled. Do not reopen them or ask about them.

- **Light theme only.** No dark mode, no theme toggle.
- **One typeface: DM Sans**, loaded with `next/font/google` (self-hosted at build time). Never add a
  Google Fonts `<link>`: the Content-Security-Policy in `vercel.json` blocks other origins, and
  `e2e/security-headers.spec.ts` will fail.
- **No monospace "terminal" styling anywhere.** The terminal window, the typewriter, the
  `$ hello --world` line, the `// key_achievements` headings, the `~/name.dev` logo and the
  numbered `01.` kickers all go. Use plain words.
- **Remove these effects and their code**: the aurora background, the grid background, the cursor
  spotlight, the rotating glow border on case-study cards. They belong to the old dark theme.
  Delete `HeroBackground.tsx`, `Spotlight.tsx`, `RoleTypewriter.tsx`, `useTypewriter.ts` and their
  CSS, and update the tests that mention them.
- **Keep these effects**: scroll reveals, the heading reveal, the hero entrance, count-up numbers,
  the timeline fill, the scroll progress bar, the sliding nav highlight, the project-filter view
  transition, and the three case-study visuals with Replay.
- **The `roles` list** from `profile.json` stays in the content and is shown in the hero as a row
  of small static pills under the bio.
- **Photos**: the owner has supplied two, already resized and stripped of metadata. Use these
  files as they are; do not re-encode, crop into new files or replace them.
  - `public/profile.jpg` (800×800): the portrait for the hero.
  - `public/about/cycling.jpg` (1200×1200): the hobby photo for "Outside work".
  The full-size originals are in `docs/redesign/originals/`, which is git-ignored. Never copy
  them into `public/`: they are large and may carry location data.
  No placeholder images, avatar generators or stock art anywhere.
- **No new dependencies** unless this brief names them. No animation library, no UI kit, no icon
  set beyond `lucide-react` and the local `BrandIcons.tsx`.
- **Do not push.** Commit locally, one commit per phase (section 8).

## 4. The design

### 4.1 Colour

Define these once as CSS variables in `globals.css` and expose them through
`tailwind.config.ts` under semantic names. Components must use the semantic names
(`bg-surface`, `text-ink-soft`), never raw hex values or Tailwind's `slate-*` / `blue-*` palette.
After this work, `grep -rn "slate-\|blue-\|violet-\|emerald-" src` should return nothing.

| Token | Value | Use |
|---|---|---|
| `ground` | `#EEF3F0` | Page background |
| `surface` | `#FFFFFF` | Cards, nav pill track, inputs |
| `tint` | `#DDE9E4` | Quiet fills: active nav item, chips, photo backdrop |
| `ink` | `#14302B` | Headings, body text, the dark button and the contact panel |
| `ink-soft` | `#33514A` | Secondary text (7.8:1 on `ground`) |
| `line` | `#C9D6D0` | Hairline borders and dividers |
| `accent` | `#0E7C66` | Fills only: dots, the avatar, progress bar, timeline fill, focus ring |
| `accent-ink` | `#0B5C4C` | Accent-coloured **text** and link hover (passes 4.5:1 on `ground` and `surface`) |
| `chip-amber` / `chip-amber-ink` | `#F6E6C8` / `#4A3608` | Second chip colour |
| `chip-blue` / `chip-blue-ink` | `#DCE6F5` / `#152B52` | Third chip colour |

Rules:

- `accent` on `ground` is about 4.6:1, too close to the limit for small text. That is why text
  uses `accent-ink`. White text on `accent` is fine (5.1:1).
- Never tell two things apart by colour alone. Skills already add a screen-reader "(core)" label;
  keep it.
- Sections alternate between `ground` and a full-width `surface` band, replacing the old
  `.section-alt` tint. Cards on a `surface` band use `ground` as their fill, so there is always a
  visible step between a card and what it sits on.
- No gradients, no glow, no glassmorphism, no coloured shadows.

### 4.2 Type

DM Sans, weights 400, 500, 600, 700. One scale, used everywhere:

| Role | Size | Weight | Notes |
|---|---|---|---|
| Hero heading | `clamp(2.5rem, 6vw, 4.75rem)` | 600 | line-height 1.02, letter-spacing -0.03em |
| Page title (case study) | `clamp(2rem, 4.5vw, 3.5rem)` | 600 | letter-spacing -0.025em |
| Section heading | 2rem (1.75rem on phones) | 600 | letter-spacing -0.02em |
| Card title | 1.4375rem | 600 | line-height 1.2 |
| Lead paragraph | 1.25rem | 400 | line-height 1.55, `ink-soft`, max-width 36rem |
| Body | 1rem to 1.0625rem | 400 | line-height 1.6 |
| Small / meta | 0.875rem | 500 | `ink-soft` |
| Chip | 0.8125rem | 600 | |

Nothing smaller than 0.8125rem. The old theme used 10px labels in several places; remove them.
Numbers in stats use `font-variant-numeric: tabular-nums`.

### 4.3 Shape and space

- Radii: cards 24px, the hero stats card 28px, buttons, chips and nav items fully rounded.
  Use only these three.
- Cards have no border and no shadow at rest. On hover (pointer devices only, already handled by
  `hoverOnlyWhenSupported`) a card lifts 2px and gains one soft neutral shadow:
  `0 12px 32px -16px rgb(20 48 43 / 0.25)`.
- Page container: max-width 1160px, 32px side padding (20px under 640px).
- Section rhythm: 96px top and bottom on desktop, 64px on phones. The section heading sits 32px
  above its content, with an optional one-line intro to its right (see the mockup's
  "Case studies" header).
- Tap targets stay at 44px minimum. Primary buttons are 52px tall.

### 4.4 Components

- **Buttons**: primary is `ink` fill with white text; secondary is `surface` fill with `ink` text.
  Both fully rounded, weight 600. Hover darkens or tints slightly; no translate on buttons.
- **Chips**: fully rounded, 6px by 14px padding, `tint` fill by default. Technology lists are
  chips. Core skills get an `accent`-tinted fill plus the existing "(core)" label.
- **Navigation**: logo on the left is a 40px `accent` circle with the initials in white, then the
  first name. Links sit in a white fully rounded track; the active one has a `tint` fill. The
  existing sliding highlight (`.nav-pill`) becomes that `tint` fill. The header stays fixed; when
  scrolled it gets a `ground` background at 85% opacity with a backdrop blur and a `line` bottom
  border.
- **Focus ring**: 2px `accent` outline, 3px offset, on everything.

### 4.5 What "hand-made" means here

A site reads as machine-made when every section is the same card grid with the same padding and
nothing has a point of view. To avoid that:

- Give each section its own layout that suits its content (section 7 says how). Do not reuse one
  card component for everything.
- Align things to each other on purpose. Left edges of headings, body and cards should line up
  down the whole page. Check this at 1440px with your eyes, not only in code.
- Vary scale. One thing per section should be clearly the largest.
- Write real labels. "Case studies", not "02. Case Studies". "See case studies", not "Explore".
- Fewer, better details: the availability pill with its dot, the initials avatar, the tinted
  metric chip on each case study, a quiet hover lift. Resist adding more.
- If something looks like a template, it probably has too many borders. Remove borders before
  adding anything.

## 5. Content change: remove social-work framing

The owner wants the degree listed in Education and nothing else. Make exactly these changes.

| Where | Change |
|---|---|
| `src/content/profile.json`, `about.paragraphs[3]` | Delete the sentence that starts "My **Master of Social Work…" up to "…healthcare software,". Keep the Nanosoft sentence and end the paragraph with "I've mentored 2 junior developers through regular code reviews." as its own sentence. |
| `src/content/profile.json`, `specialty` | Delete the whole object. |
| `src/content/profile.json`, `whyHireMe` | Delete the "Healthcare Insight" item. Five items remain. |
| `src/lib/schema.ts` | Delete `SpecialtySchema`, the `specialty` field on `ProfileSchema`, and the `Specialty` type. |
| `src/lib/icons.ts` | Remove `HeartPulse` (now unused) from the import and from `ICONS`. |
| `src/components/sections/Skills.tsx`, `src/app/page.tsx` | Remove the specialty banner and the `specialty` prop. |
| `src/content/education.json` | **Leave as is.** "Master of Social Work (Medical & Psychiatry)" stays. |
| `docs/content.md` | Remove "specialty banner" from the `profile.json` row. |
| `docs/redesign/mockup-f.html` | The hero paragraph in the mockup mentions the degree. Do not copy that sentence. Use `personal.heroBio` from the content, which does not mention it. |

Then protect it with a test in `src/lib/content.test.ts`: serialise the content **without**
`education` and assert it does not match `/social work|\bMSW\b|psychiatr/i`; and assert that
`education` still contains "Master of Social Work". The existing deny-list block shows the
pattern to follow.

The words "healthcare and care-sector" stay. They describe the platforms, not the degree.

## 6. Feature: screenshots on personal projects

Five projects have a `live` URL (Vaasi, Akam Psychiatric Care Center, Computer Park, Write4U,
Full-Stack Core Concepts). Each card should lead with a screenshot of the site's home page, so a
visitor sees the work before reading about it.

**Content and schema**

- Add an optional field to `ProjectSchema`:
  `screenshot: z.strictObject({ src: <string matching /^\/projects\/[a-z0-9-]+\.jpg$/>, alt: nonEmpty }).optional()`.
- In `superRefine`, reject a project that has `screenshot` but no `live`.
- `alt` describes what is visible ("Write4U home page: a text box on the left and a handwritten
  page on the right"), not "screenshot of…".
- Add a unit test that every `screenshot.src` exists under `public/`.

**Capturing**

- Add `scripts/project-shots.mjs`, modelled on `scripts/screenshots.mjs`. For each project with a
  `live` URL: open it in Chromium at 1280×800, device scale factor 1, `reducedMotion: 'reduce'`,
  wait for `networkidle` plus one second, and save `public/projects/<slug>.jpg` at JPEG
  quality 80. Add an npm script `shots:projects`.
- Run it, look at every image (use the Read tool on the file), and re-capture any that caught a
  loading state, a cookie banner or an error page. Commit the images.
- Each image should be under 200 kB. If one is larger, lower the quality for that one.
- These are the owner's own sites, so capturing them is fine. Do not screenshot client work.

**Rendering**

- Use `next/image` with explicit `width={1280}` `height={800}` and a `sizes` attribute. The
  project lint rule forbids plain `<img>`, and `images.unoptimized` is already set for the
  static export. Images are below the fold, so leave them lazy.
- The image sits at the top of the card in a 16:10 box, `object-fit: cover`,
  `object-position: top`, with the card's top corners rounded. A thin `line` border around the
  image keeps white screenshots from bleeding into a white card.
- The whole image is part of one link to the live site, together with a visible
  "Visit site" label. Do not create two adjacent links to the same URL.
- Remove the fake browser-chrome strip the current cards draw for live projects; the real
  screenshot replaces it.
- Projects without a screenshot (client work) keep the text-only card and the existing
  "Private project · code not public" note.
- `Projects.tsx` is a client component and receives projects as props, so the new field arrives
  with no extra work.

**Tests**

- In `e2e/smoke.spec.ts`: every project with a screenshot renders an image that has loaded
  (`naturalWidth > 0` after scrolling it into view) and sits inside a link to its `live` URL.
- The view-transition filter tests must still pass with images in the cards.

## 6a. Feature: portrait and "Outside work"

**Portrait (hero)**

- It fills the photo area of the hero stats card: a box about 4:3 on desktop, with the card's
  20px inner radius. The subject stands left of centre with arms crossed, so use
  `object-fit: cover` with `object-position: 30% 25%`. Check at 360px and 1440px that the face
  and the crossed arms are both in frame; adjust the position, not the file.
- Use `next/image` with `width={800}` `height={800}`, a `sizes` attribute, and `priority`,
  because it is above the fold and may become the LCP element. Run Lighthouse afterwards: if LCP
  gets worse than before, that is the first thing to look at.
- `alt`: "Vigneshwaran standing on a beach with his arms crossed". Build the name from the
  content.
- The photo is a dusk beach scene with cool grey-blue tones. It sits well against `tint`; do not
  add a colour overlay, a duotone filter or a decorative frame.
- Add the portrait to the Person structured data in `src/app/page.tsx` as
  an `image` property whose value is `SITE_URL` followed by `/profile.jpg`, and add a test for it beside the existing Person
  assertions in `e2e/seo.spec.ts`.

**Outside work**

The owner's hobbies are cycling and watching movies. This is the one personal note on the page,
so keep it short and warm, and do not invent details (no distances, routes, favourite films or
genres: none were given).

- Content: add to `profile.json`

  ```json
  "outsideWork": {
    "text": "Away from the keyboard I'm usually out on my bike, or watching a film.",
    "interests": ["Cycling", "Movies"],
    "photo": {
      "src": "/about/cycling.jpg",
      "alt": "A black and orange mountain bike parked on a paved path beside a lake"
    }
  }
  ```

- Schema: an optional `outsideWork` strict object on `ProfileSchema` with `text` (non-empty),
  `interests` (at least one, no repeats) and an optional `photo` of `{ src, alt }` where `src`
  starts with `/`. Extend the "file exists under `public/`" unit test from section 6 to cover
  this photo and `/profile.jpg`.
- Placement: inside the About section, as the last item of the right-hand column, under
  "Quick facts". It is not a section of its own and does not go in the navigation.
- Layout: one card with the photo on top in a 4:3 box (`object-position: 50% 65%` keeps the
  whole bike in frame and trims the sky), then the sentence, then the two interests as chips.
  A small "Outside work" label in the meta style sits above the sentence.
- `next/image`, `width={1200}` `height={1200}`, lazy (the default), with `sizes`.
- Do not add icons for the hobbies, and do not turn this into a grid of "interest cards".
  One photo, one sentence, two chips.

## 7. Section-by-section guidance

Work through these in order. For each, open the current component, keep its data flow and
semantics, and change the presentation.

**Global chrome** (`layout.tsx`, `globals.css`, `Navbar.tsx`, `Footer.tsx`, `ScrollProgressBar.tsx`)
- `layout.tsx`: swap Inter for DM Sans; set `colorScheme: 'light'` and `themeColor` to the ground
  colour; the skip link becomes `ink` on white.
- `globals.css`: delete the terminal, grid, aurora, spotlight and glow-card blocks. Update the
  scrollbar colours. Keep every motion rule and the reduced-motion block. The print block can
  lose its "force dark text" rules because the theme is now light, but keep the rules that
  un-hide reveals, and keep hiding `.site-header`.
- `Navbar.tsx`: the mobile drawer must stay **outside** `<header>` (there is a comment explaining
  why, and a test). Restyle the drawer as a white sheet with large rows.
- Footer: one quiet row. Name, short bio, three icon links, copyright. No "built with" list of
  technologies is needed, but keep the "View source" link logic.

**Hero** (`Hero.tsx`)
- Follow the mockup: availability pill, greeting heading, bio, two buttons on the left; the stats
  card (the portrait from section 6a plus a 2×2 grid of the four `heroStats`) on the right.
  Under 900px the card drops below the text.
- The heading is "Hi, I'm {firstName}. I'm a {title, lower-cased}." Build it from the content.
- Keep the per-word entrance animation classes (`hero-mask`, `hero-word`, `hero-in`, `hero-rise`)
  and the rule that the bio never starts transparent: it is the likely LCP element.
- The first heading on the page must still contain the first name: several tests look for it.
- The "years of experience" stat still uses `LiveYears`.

**About** (`About.tsx`)
- Two columns: the paragraphs on the left at a comfortable reading width; on the right, "Key
  achievements" as a plain list with `accent` dots, and "Quick facts" as a definition list. Drop
  the four-colour bullet scheme: remove the `color` field from `AchievementSchema` and from the
  content, since the schema is strict.
- "Outside work" (section 6a) is the last item in the right-hand column.
- This is the section most at risk of looking like a wall of text. Keep the line length under
  70 characters and give the first paragraph the lead style.

**Experience** (`Experience.tsx`, `TimelineProgress.tsx`)
- Keep the vertical timeline and its scroll fill; the fill becomes solid `accent`.
- Each job is a white card: role and company on the first line, dates and location as meta,
  the summary, then highlights. Nine highlights is a lot: show them as a clean list with
  generous line spacing, not tiny text. Technologies are chips at the bottom.
- The "Current" badge becomes a `tint` chip with the `accent` dot.

**Case studies** (`CaseStudies.tsx`)
- Follow the mockup: white card, a coloured metric chip at the top (rotate `tint`, `chip-amber`,
  `chip-blue` by index), the title, then the stack as one line of text.
- Keep the count-up on the headline number and keep its accessible text pattern
  (`aria-hidden` animated value plus `sr-only` full value). `e2e/motion.spec.ts` checks both.
- The whole card stays one link through the stretched title link.

**Skills** (`Skills.tsx`)
- Nine groups. Avoid nine identical boxes: use a two-column definition layout on desktop, group
  name on the left, chips on the right, separated by `line` hairlines. On phones the name sits
  above its chips.
- The intro sentence and the "(core)" labels stay.

**Projects** (`Projects.tsx`)
- Filter buttons live in a white rounded track like the nav. Keep `aria-pressed`, the view
  transition and the `role="status"` announcement.
- Remove the large watermark numbers. `e2e/smoke.spec.ts` has a test named "project numbers stay
  stable when filtering" that reads `[data-index]`; delete that test with the feature.
- Screenshot cards as described in section 6. Put the five personal projects' images to work:
  when the filter is "All", personal projects with screenshots should not be buried at the
  bottom of ten cards. Reorder `projects.json` so that Personal Projects come first, or make
  "Personal Projects" the visually richer group. Reordering the JSON is the simpler choice;
  update any test that depends on order.

**Education** (`Education.tsx`)
- A simple list, not cards: qualification, institution, period on one row each, with the
  certification's note beneath it. Four items do not need four boxes.

**Contact** (`Contact.tsx`)
- This is the close of the page, so make it the one dark moment: a full-width `ink` panel with
  white text, the `contactIntro` as a large heading-sized line, and the contact methods as large
  white-outlined pill links. "Why work with me" sits beneath or beside it as a plain list.
- Check contrast for every text colour on `ink`.

**Case-study pages** (`CaseStudyHero.tsx`, `CaseStudyBody.tsx`, `visuals/*`, `PlayOnView.tsx`)
- Same tokens. The metrics row becomes four white cards. Approach steps keep their numbers.
- The three visuals use hard-coded dark colours (`TONES` in `MigrationPipeline.tsx`, the bar
  fills in `SyncRateChart.tsx`, the red and green states in `TimezoneShift.tsx`). Re-map each to
  the new tokens. For the time-zone example, "wrong" and "correct" must differ by more than hue:
  keep the words "Wrong:" and "Correct:" that are already there.
- The CSS for `.flow-arrow`, `gate-flash` and `.bar-fill` has hard-coded blue and amber values.

**404 page** (`not-found.tsx`): restyle with the same tokens. Keep the heading text.

**Generated assets**
- `scripts/og-image.mjs` has the old dark colours inline. Restyle it to the new theme, run
  `npm run og`, and look at the result.
- After the build passes, run `npm run screenshots` to refresh the README images. The script
  scrolls the case-study shot to the `figure`; check all three images.

## 8. Order of work

One commit per phase. Run the listed check before committing. If a check fails, fix the cause;
do not move on with a red suite.

| Phase | Work | Check |
|---|---|---|
| 0 | `npm ci`, then `npm run verify` on the untouched tree, so you know the baseline is green | all pass |
| 1 | Content removal (section 5) | `npm run lint && npm run typecheck && npm test` |
| 2 | Tokens, font, `globals.css` clean-up, `layout.tsx`; delete the retired effects and their tests | lint, typecheck, unit tests, `npm run build` |
| 3 | Navbar, footer, progress bar | build, then `npx playwright test e2e/smoke.spec.ts` |
| 4 | Hero, including the portrait and its structured-data entry | same |
| 5 | About (with "Outside work"), Experience, Case studies, Skills, Education, Contact | build, then the full `npm run test:e2e` |
| 6 | Projects and screenshots (section 6) | full e2e |
| 7 | Case-study pages, visuals, 404 | full e2e |
| 8 | OG image, README screenshots, README numbers, ADR 3 wording about removed effects, `docs/content.md` | `npm run verify` |
| 9 | Review pass (section 10) | `npm run verify`, then Lighthouse |

To run Lighthouse locally without uploading the report:

```bash
export CHROME_PATH="$(node -e "console.log(require('@playwright/test').chromium.executablePath())")"
npx --yes @lhci/cli@0.15 collect && npx --yes @lhci/cli@0.15 assert
```

Do not run `lhci autorun`: it uploads the report to public storage.

## 9. Things that will bite

- **Tests tied to old styling.** `e2e/motion.spec.ts` and `e2e/smoke.spec.ts` select
  `.terminal-body` and `.text-emerald-300` for the typewriter. Those tests go away with the
  typewriter; replace them with one test that the hero shows every role from `profile.json`.
  The test "typewriter renders a real role… Roles:" goes too. Tests that select `.fade-in`,
  `.heading-reveal`, `.hr-title`, `.hr-kicker`, `.timeline-fill` and `[data-countup]` are tied to
  behaviour you are keeping: keep those class names.
- **Never weaken a test to make it pass.** If a test fails, decide which is wrong: the new code
  or an expectation about something this brief removes. Only the second kind may be changed, and
  say so in the commit message.
- **Contrast.** `e2e/a11y.spec.ts` runs axe on every page. A light theme fails in different
  places than a dark one: grey meta text on `tint`, white on `accent` at small sizes, chip text.
  Use the token pairs from section 4.1 and you will pass.
- **Tailwind only sees class names that appear as whole strings in `src/**/*.{ts,tsx}`.** Never
  build a class name by concatenation (`` `bg-${color}` ``), and never put class names in JSON.
  Map tokens to full literal class strings in a lookup object, as `About.tsx` does today.
- **The schema is strict.** Removing a field from a schema means removing it from every content
  file in the same commit, and the reverse. Lists may not contain repeated values.
- **The JavaScript budget is 150 kB** for the home page (`npm run budget`). Deleting the
  typewriter and spotlight helps. Do not turn server components into client components to make
  styling easier; `Projects.tsx`, `Navbar.tsx` and the small motion components are the only
  client code, and it should stay that way.
- **Never pass the whole `personal` object to a client component.** `navPersonal` in
  `src/lib/content.ts` exists for this, and a test checks the page payload.
- **Motion rules** (ADR 3): nothing is hidden in the server HTML; no inline `opacity: 0`;
  reduced motion and no-JavaScript are tested modes. Any new animation follows the same pattern
  as the existing ones or is left out.
- **Layout shift.** The photo, the screenshots and the count-up numbers all need reserved space
  (explicit `width`/`height` or an aspect-ratio box). Lighthouse will catch you if not.
- **Windows.** The working tree is on Windows with Git Bash. Use forward slashes in commands,
  and expect "LF will be replaced by CRLF" warnings from Git: they are harmless.
- **Playwright's preview server** serves `out/`. After any source change you must
  `npm run build` again before running end-to-end tests, or you are testing the old site.

## 10. Review pass before you say it is finished

Do this as a separate step, after everything is green.

1. Build, start `npm run preview`, and take full-page screenshots of the home page and one
   case-study page at 360, 768 and 1440 pixels wide. Open each image and look at it.
2. For each section ask: does it line up with the sections above and below? Is one thing clearly
   the most important? Is anything cramped, orphaned or wrapping badly? Is there any leftover
   dark-theme colour, monospace text, or 10px label?
3. Tab through the home page with the keyboard. Every interactive thing shows the focus ring and
   the order makes sense. Open the mobile menu at 390px, scroll first, and check the backdrop
   covers the page.
4. Print preview the home page (Playwright `emulateMedia({ media: 'print' })` and a screenshot):
   readable, no hidden headings.
5. Run `grep -rn "slate-\|blue-\|violet-\|emerald-\|font-mono" src`. It should print nothing.
6. Run `grep -rni "social work\|psychiatr" src --include=*.tsx --include=*.ts --include=*.json`.
   Only `src/content/education.json` and the new test should match.
7. Update the numbers in the README "Results" table (test counts, first-load JavaScript) from
   the real output of the last `npm run verify`.

## 11. When to stop and ask the owner

- Either photo is missing from `public/`, or looks wrong at every crop you try.
- A live project site is down or shows an error when you try to capture it.
- A change would require loosening the Content-Security-Policy, adding a dependency, or changing
  what the content claims.

Otherwise make the decision yourself, in the spirit of section 4.5, and note it in the commit.

## 12. What to report at the end

A short summary for the owner: what changed, the final test counts and Lighthouse scores,
anything you could not do and why, and the list of local commits. Remind them nothing has been
pushed.
