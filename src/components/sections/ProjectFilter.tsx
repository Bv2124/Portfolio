'use client'

import { useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'

interface ProjectFilterProps {
  // Each project type present, in display order, with how many projects it has.
  types: Array<{ name: string; count: number }>
  total: number
  // The project cards, rendered on the server. Each carries data-project-type.
  children: ReactNode
}

const GRID_ID = 'project-grid'

// The only part of the Projects section that runs in the browser: the filter buttons. The cards
// stay server-rendered; filtering hides the ones that don't match with one CSS rule, so the
// card components and their icons are not shipped to the browser.
export default function ProjectFilter({ types, total, children }: ProjectFilterProps) {
  const [filter, setFilter] = useState('All')
  const options = [{ name: 'All', count: total }, ...types]
  const shown = options.find(option => option.name === filter)?.count ?? total

  // Filtering animates with the browser's View Transitions API: every card and the filter pill
  // carry a view-transition-name, so the browser morphs them to their new positions and fades
  // cards in and out. Browsers without support (or users who prefer reduced motion) switch instantly.
  const changeFilter = (type: string) => {
    if (type === filter) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof document.startViewTransition !== 'function') {
      setFilter(type)
      return
    }
    document.startViewTransition(() => {
      flushSync(() => setFilter(type))
    })
  }

  return (
    <>
      {/* Filter tabs: a rounded track; the dark pill glides between buttons as part of the view transition. */}
      {types.length > 1 && (
        <div role="group" aria-label="Filter projects" className="mb-10 inline-flex max-w-full flex-wrap gap-1 rounded-3xl bg-ground p-1 sm:rounded-full">
          {options.map(({ name }) => {
            const active = filter === name
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                onClick={() => changeFilter(name)}
                className={`relative min-h-11 rounded-full px-5 text-[0.9375rem] font-medium transition-colors duration-200 ${
                  active ? 'text-white' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-ink"
                    style={{ viewTransitionName: 'project-filter-pill' }}
                  />
                )}
                <span className="relative">{name}</span>
              </button>
            )
          })}
        </div>
      )}

      <p role="status" className="sr-only">
        {filter === 'All'
          ? `Showing all ${total} projects`
          : `Showing ${shown} of ${total} projects: ${filter}`}
      </p>

      {/* Hidden cards leave the layout and the accessibility tree. The type names come from a
          fixed list in the content schema, and JSON.stringify quotes them for the selector. */}
      {filter !== 'All' && (
        <style>{`#${GRID_ID} > :not([data-project-type=${JSON.stringify(filter)}]) { display: none; }`}</style>
      )}

      <div id={GRID_ID} className="grid gap-6 md:grid-cols-2">
        {children}
      </div>
    </>
  )
}
