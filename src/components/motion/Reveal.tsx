import type { CSSProperties, ReactNode } from 'react'
import { staggerDelay } from '@/lib/motion'

interface RevealProps {
  as?: 'div' | 'li' | 'article' | 'p'
  // Position in a list, for a capped 60ms stagger.
  index?: number
  from?: 'below' | 'left'
  className?: string
  children: ReactNode
}

// Marks content for a scroll reveal (see RevealRoot and globals.css). A server component with
// zero JavaScript: it only adds data attributes, so the content is always in the HTML.
export default function Reveal({ as: Tag = 'div', index = 0, from = 'below', className, children }: RevealProps) {
  return (
    <Tag
      data-reveal=""
      data-reveal-from={from === 'left' ? 'left' : undefined}
      className={className}
      style={{ '--delay': staggerDelay(index) } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
