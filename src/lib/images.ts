// Every photo and screenshot is a JPEG in public/ with WebP copies at two widths beside it,
// written by scripts/optimize-images.mjs (npm run images). The widths here must match that script.
export const IMAGE_WIDTHS = {
  portrait: [400, 800],
  outsideWork: [600, 1200],
  screenshot: [640, 1280],
} as const

// "/profile.jpg", 400 -> "/profile-400.webp"
export const webpVariant = (src: string, width: number) => src.replace(/\.jpg$/, `-${width}.webp`)

export const webpSrcSet = (src: string, widths: readonly number[]) =>
  widths.map(width => `${webpVariant(src, width)} ${width}w`).join(', ')
