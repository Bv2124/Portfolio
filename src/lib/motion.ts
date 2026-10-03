// Motion tokens used from JavaScript. The rest live as CSS custom properties in globals.css.

// Count-up duration for metrics (ms).
export const COUNT_UP_MS = 1200

// Index-based stagger for scroll reveals: 60ms apart, capped after 6 items.
export const staggerDelay = (index: number) => `${Math.min(index, 5) * 60}ms`
