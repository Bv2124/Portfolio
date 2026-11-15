import type { Config } from 'tailwindcss'

// Every colour is a semantic token backed by a CSS variable (see :root in globals.css), so the
// palette lives in one place. Components use these names, never raw hex values or Tailwind's
// default palette.
const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  // Hover styles only apply on devices that can hover, so taps don't leave them stuck on.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    // Replaces (not extends) the default palette: a stray `bg-slate-900` is a build-time no-op
    // instead of a quiet departure from the design.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      ground: token('ground'),
      surface: token('surface'),
      tint: token('tint'),
      ink: token('ink'),
      'ink-soft': token('ink-soft'),
      line: token('line'),
      accent: token('accent'),
      'accent-ink': token('accent-ink'),
      'chip-amber': token('chip-amber'),
      'chip-amber-ink': token('chip-amber-ink'),
      'chip-blue': token('chip-blue'),
      'chip-blue-ink': token('chip-blue-ink'),
    },
    extend: {
      boxShadow: {
        // The one shadow in the design: a soft, neutral lift for hovered cards.
        lift: '0 12px 32px -16px rgb(20 48 43 / 0.25)',
      },
    },
  },
  plugins: [],
}

export default config
