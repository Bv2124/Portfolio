import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  // Hover styles only apply on devices that can hover, so taps don't leave them stuck on.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        // Secondary text: >= 5.2:1 on every surface (slate-500/600 fail WCAG AA here).
        muted: '#7c8ba1',
      },
    },
  },
  plugins: [],
}

export default config
