'use client'

import { useMemo, useState } from 'react'
import { Github, ExternalLink, CheckCircle2, Lock } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import type { Project } from '@/lib/schema'

interface ProjectsProps {
  projects: Project[]
  githubUrl: string
}

export default function Projects({ projects, githubUrl }: ProjectsProps) {
  // Filter tabs are derived from the data: "All" + each distinct type present.
  const types = useMemo(
    () => ['All', ...Array.from(new Set(projects.map(p => p.type)))],
    [projects]
  )
  const [filter, setFilter] = useState('All')

  const visible = filter === 'All' ? projects : projects.filter(p => p.type === filter)

  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeading id="projects" />

        {/* Filter tabs */}
        {types.length > 2 && (
          <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2 mb-10">
            {types.map(type => (
              <button
                key={type}
                type="button"
                aria-pressed={filter === type}
                onClick={() => setFilter(type)}
                className={`min-h-10 px-4 py-1.5 rounded-full text-sm font-mono border transition-colors duration-200 ${
                  filter === type
                    ? 'bg-blue-500/15 text-blue-300 border-blue-500/40'
                    : 'text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {visible.map(project => (
            <div
              key={project.slug}
              className="group relative bg-slate-900/80 rounded-2xl border border-slate-800/80 p-6 hover:border-slate-700/80 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-950/60"
            >
              {/* Decorative watermark number: the project's place in the full list (stable when
                  filtering). Rendered as generated content so it isn't page text. */}
              <span
                aria-hidden="true"
                data-index={String(projects.indexOf(project) + 1).padStart(2, '0')}
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

              <h3 className="text-slate-100 font-semibold text-lg mb-3 pr-12 leading-snug">
                {project.title}
              </h3>
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

              {(project.github || project.live) ? (
                <div className="flex gap-2 mt-5 pt-4 border-t border-slate-800">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 min-h-11 px-2 text-slate-400 hover:text-slate-100 text-xs transition-colors">
                      <Github size={13} aria-hidden="true" /> Code
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 min-h-11 px-2 text-slate-400 hover:text-slate-100 text-xs transition-colors">
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
