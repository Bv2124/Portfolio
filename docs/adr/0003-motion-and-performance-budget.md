# 3. Motion is CSS-first, never hides content, and has a budget

- **Status:** Accepted
- **Date:** 2026-09

## Context

The site should feel polished in an interview demo. Animation libraries make that easy, but the
common pattern (`initial={{ opacity: 0 }}`) writes `opacity:0` into the server HTML. That delays
Largest Contentful Paint, hides content from crawlers and print, and leaves the page blank if
JavaScript fails.

## Decision

Rules:

1. **Nothing is hidden in the server HTML.** The hero entrance is pure CSS (per-word mask reveal,
   transform-only on the likely LCP paragraph). Scroll reveals use a `data-reveal` attribute.
   `RevealRoot` only "arms" (hides) elements that its first IntersectionObserver callback reports
   as off screen. No JavaScript or reduced motion means nothing is ever armed. A test asserts
   there's no inline `opacity:0` in the HTML.
2. **Reduced motion is a first-class mode**, not an afterthought: every effect has a defined static
   state, and the E2E suite runs with `reducedMotion: 'reduce'` and with JavaScript disabled.
3. **No forced synchronous layout at start-up.** Count-ups, reveals and the case-study visuals
   decide "on screen or not" from IntersectionObserver callbacks, not `getBoundingClientRect()`.
4. **Budget:** the home page's first-load JS stays at or below 150 kB, and Lighthouse
   accessibility, best-practices and SEO stay at or above 0.95 (enforced in CI).

Platform features over libraries:

| Effect | Implementation |
|---|---|
| Project filter animation | View Transitions API: cards and filter pill morph; instant fallback |
| Nav highlight | One measured element moved with a CSS transition |
| Progress bar, timeline fill | Transform written in `requestAnimationFrame`, no React re-renders |
| Card glow border | A rotating conic-gradient pseudo-element (compositor-only), hover/focus only |

## Evidence

The first implementation used the `motion` library. Measuring the build showed about 30 kB
(gzipped) of layout-projection code on the critical path of **every** page, for effects that
didn't need it. Moving the progress bar, timeline and nav pill to CSS and native APIs, and the
filter to View Transitions, removed the dependency:

| | With `motion` | CSS + native APIs |
|---|---|---|
| Home first-load JS | 142 kB | 115 kB |
| Case-study first-load JS | 139 kB | 112 kB |
| Lighthouse desktop (home) | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |

Mobile was measured in real Chrome with CDP throttling (4× CPU, ~1.6 Mbps, 150 ms RTT): median LCP
is about 1.5 s. Lighthouse's *simulated* mobile score on the development machine was much lower,
because its CPU benchmark was 665–1170 against the faster reference hardware the simulation
assumes. So real-browser numbers were used for decisions.

`content-visibility: auto` on below-the-fold sections was also tried. A controlled A/B (same network
path, 7 runs each) showed no significant change in FCP, LCP or TBT. It was removed rather than kept
for its anchor-jump risks.

## Consequences

- Some effects are slightly simpler than a library would allow (for example, no spring physics).
- Browsers without View Transitions get an instant, correct filter.
- New animations must follow the rules above. `e2e/motion.spec.ts` and `e2e/a11y.spec.ts` enforce
  most of them.
