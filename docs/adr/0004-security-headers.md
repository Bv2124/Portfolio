# 4. Set security headers in vercel.json, and test them before they ship

- **Status:** Accepted
- **Date:** 2026-11

## Context

A static export has no server, so `next.config.ts` cannot set response headers: the host has to.
Without them the site could be framed by another page, and nothing limited where scripts, styles
or fonts may load from.

The risk in adding a Content-Security-Policy is that it is only enforced on Vercel. A policy that
is too strict blanks the production site while every local check stays green.

## Decision

`vercel.json` sets five headers on every response:

| Header | Value | Why |
|---|---|---|
| `Content-Security-Policy` | everything from `'self'`; `object-src 'none'`; `base-uri 'self'`; `frame-ancestors 'none'` | The site loads nothing from another origin (the font file is in the repository and served from the site), so nothing else is allowed |
| `X-Frame-Options` | `DENY` | Same as `frame-ancestors`, for older browsers |
| `X-Content-Type-Options` | `nosniff` | Files are only ever treated as their declared type |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Outbound links reveal the origin, not the page |
| `Permissions-Policy` | camera, microphone, geolocation and topics off | The site uses none of them |

`script-src` and `style-src` include `'unsafe-inline'`. Next.js writes its hydration data as
inline scripts whose content changes with every build, and components set CSS variables through
`style` attributes. A nonce needs a server, and a hash list would have to be regenerated per
build for every page. The site takes no user input and stores nothing, so the remaining exposure
is small; the directives that matter here (`frame-ancestors`, `object-src`, `base-uri`, no
third-party origins) are strict.

`e2e/security-headers.spec.ts` reads `vercel.json`, adds its headers to every response in the
browser, and then uses the site: hydration, the project filter, web fonts, a case-study visual and
client-side navigation. Any `securitypolicyviolation` event or console error fails the test.

## Consequences

- A policy change that would break the site fails CI instead of production. This was checked by
  removing `'unsafe-inline'` from `script-src`: two of the three tests fail.
- Adding anything from another origin (analytics, an embedded video, a hosted font) means editing
  the policy first. The test will say so.
- Vercel's preview toolbar is loaded from another origin and is blocked on preview deployments.
  That is accepted; production is unaffected.
- If the site ever moves host, the headers have to be recreated there. The test reads
  `vercel.json`, so it would keep passing while protecting nothing: move the test's source of
  truth along with the headers.
