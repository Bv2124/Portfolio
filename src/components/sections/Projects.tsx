'use client'

import { useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import Link from 'next/link'
import { ExternalLink, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react'
import { Github } from '@/components/ui/BrandIcons'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/motion/Reveal'
import type { ProjectWithLinks } from '@/lib/content'

interface ProjectsProps {
  projects: ProjectWithLinks[]
  githubUrl: string
}

function ProjectCard({ project, number }: { project: ProjectWithLinks; number: string }) {
  return (
    <div className="group relative h-full bg-slate-900/80 rounded-2xl border border-slate-800/80 p-6 hover:border-slate-700/80 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-950/60">
      {/* Decorative watermark number: the project's place in the full list (stable when
          filtering). Rendered as generated content so it isn't page text. */}
      <span
        aria-hidden="true"
        data-index={number}
        className="pointer-events-none absolute top-5 right-5 font-mono text-5xl font-bold text-slate-800/70 group-hover:text-slate-700/70 transition-colors select-none leading-none before:content-[attr(data-index)]"
      />

      {project.live && (
        <div aria-hidden="true" className="flex items-center gap-2 mb-4 -mt-1 pr-14">
          <span className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-700" />
            <span className="w-2 h-2 rounded-full bg-slate-700" />
            <span className="w-2 h-2 rounded-full bg-slate-700" />
          </span>
          <span className="flex-1 truncate rounded bg-slate-950/70 border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-muted">
            {new URL(project.live).host}
          </span>
        </div>
      )}

      <span className="inline-block mb-3 text-[10px] font-mono uppercase tracking-widest text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded">
        {project.type}
      </span>

      <h3 className="text-slate-100 font-semibold text-lg mb-3 pr-12 leading-snug">{project.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-5">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {project.tech.map(t => (
          <span
            key={t}
            className="px-2.5 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-md border border-blue-500/20 font-mono"
          >
            {t}
          </span>
        ))}
      </div>

      <ul className="space-y-1.5">
        {project.highlights.map(h => (
          <li key={h} className="flex items-center gap-2">
            <CheckCircle2 size={13} aria-hidden="true" className="text-emerald-400 shrink-0" />
            <span className="text-slate-400 text-xs">{h}</span>
          </li>
        ))}
      </ul>

      {project.caseStudies.length > 0 && (
        <div className="mt-4 flex flex-col">
          {project.caseStudies.map(study => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}/`}
              className="inline-flex items-start gap-1.5 min-h-11 py-2 text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors"
            >
              <span>Case study: {study.title}</span>
              <ArrowUpRight size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {project.github || project.live ? (
        <div className="flex gap-2 mt-5 pt-4 border-t border-slate-800">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 min-h-11 px-2 text-slate-400 hover:text-slate-100 text-xs transition-colors"
            >
              <Github size={13} aria-hidden="true" /> Code
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 min-h-11 px-2 text-slate-400 hover:text-slate-100 text-xs transition-colors"
            >
              <ExternalLink size={13} aria-hidden="true" /> Live
            </a>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 mt-5 pt-4 border-t border-slate-800 text-muted text-xs font-mono">
          <Lock size={12} aria-hidden="true" className="shrink-0" /> Private project · code not public
        </div>
      )}
    </div>
  )
}

export default function Projects({ projects, githubUrl }: ProjectsProps) {
  // Filter tabs are derived from the data: "All" + each distinct type present.
  const types = useMemo(
    () => ['All', ...Array.from(new Set(projects.map(p => p.type)))],
    [projects]
  )
  const [filter, setFilter] = useState('All')

  const visible = filter === 'All' ? projects : projects.filter(p => p.type === filter)

  // Filtering animates with the browser's View Transitions API: every card and the filter pill
  // carry a view-transition-name, so the browser morphs them to their new positions and fades
  // cards in and out. No animation library needed; browsers without support (or users who
  // prefer reduced motion) simply switch instantly.
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
    <section id="projects" aria-labelledby="projects-heading" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading id="projects" />

        {/* Filter tabs: the highlight glides between buttons as part of the view transition. */}
        {types.length > 2 && (
          <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2 mb-10">
            {types.map(type => {
              const active = filter === type
              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={active}
                  onClick={() => changeFilter(type)}
                  className={`relative min-h-10 px-4 py-1.5 rounded-full text-sm font-mono border transition-colors duration-200 ${
                    active
                      ? 'text-blue-300 border-transparent'
                      : 'text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-blue-500/40 bg-blue-500/15"
                      style={{ viewTransitionName: 'project-filter-pill' }}
                    />
                  )}
                  <span className="relative">{type}</span>
                </button>
              )
            })}
          </div>
        )}

        <p role="status" className="sr-only">
          {filter === 'All'
            ? `Showing all ${projects.length} projects`
            : `Showing ${visible.length} of ${projects.length} projects: ${filter}`}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {visible.map((project, index) => (
            <div
              key={project.slug}
              className="project-card"
              style={{ viewTransitionName: `project-${project.slug}` }}
            >
              <Reveal index={index % 2} className="h-full">
                <ProjectCard
                  project={project}
                  number={String(projects.indexOf(project) + 1).padStart(2, '0')}
                />
              </Reveal>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 min-h-11 border border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 px-6 py-3 rounded-lg font-medium transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 text-sm"
          >
            <Github size={18} aria-hidden="true" />
            View More on GitHub
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
