import { preload } from 'react-dom'
import { webpSrcSet, webpVariant } from '@/lib/images'

interface PhotoProps {
  // The JPEG in public/. Its WebP copies are found by name (see src/lib/images.ts).
  src: string
  alt: string
  width: number
  height: number
  widths: readonly number[]
  sizes: string
  className?: string
  // Above the fold: loaded eagerly, at high priority, and preloaded from the document head.
  priority?: boolean
}

// A photo served as WebP at the size the screen needs, with the JPEG as the fallback.
// The site is a static export, where next/image cannot resize anything, so the sizes are
// generated ahead of time (npm run images).
export default function Photo({ src, alt, width, height, widths, sizes, className, priority = false }: PhotoProps) {
  const srcSet = webpSrcSet(src, widths)
  if (priority) {
    const largest = widths[widths.length - 1] ?? width
    preload(webpVariant(src, largest), {
      as: 'image',
      type: 'image/webp',
      imageSrcSet: srcSet,
      imageSizes: sizes,
      fetchPriority: 'high',
    })
  }

  return (
    <picture className="contents">
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={className}
      />
    </picture>
  )
}
