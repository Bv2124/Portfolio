'use client'

import { useMemo, useState } from 'react'
import { Github, ExternalLink, CheckCircle2, Lock } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import type { Project } from '@/lib/types'

interface ProjectsProps {
  projects: Project[]
  githubUrl: string
}

export default function Projects({ projects, githubUrl }: ProjectsProps) {
  // Filter tabs are derived from the data: "All" + each distinct type present.
  const types = useMemo(
    () => ['All', ...Array.from(new Set(projects.map(p => p.type).filter(Boolean)))],
    [projects]
  )
  const [filter, setFilter] = useState('All')

  const visible = filter === 'All' ? projects : projects.filter(p => p.type === filter)

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeading number="04" title="Featured Projects" />

        {/* Filter tabs */}
        {types.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-mono border transition-all duration-200 ${
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
          {visible.map((project, index) => (
            <div
              key={project.title}
              className="group relative bg-slate-900/80 rounded-2xl border border-slate-800/80 p-6 hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-950/60"
            >
              <span className="absolute top-5 right-5 font-mono text-5xl font-bold text-slate-800/70 group-hover:text-slate-700/70 transition-colors select-none leading-none">
                {String(index + 1).padStart(2, '0')}
              </span>

              {project.type && (
                <span className="inline-block mb-3 text-[10px] font-mono uppercase tracking-widest text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded">
                  {project.type}
                </span>
              )}

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

              <div className="space-y-1.5">
                {project.highlights.map(h => (
                  <div key={h} className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span className="text-slate-400 text-xs">{h}</span>
                  </div>
                ))}
              </div>

              {(project.github || project.live) ? (
                <div className="flex gap-4 mt-5 pt-4 border-t border-slate-800">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-slate-400 hover:text-slate-100 text-xs transition-colors">
                      <Github size={13} /> Code
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-slate-400 hover:text-slate-100 text-xs transition-colors">
                      <ExternalLink size={13} /> Live
                    </a>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-5 pt-4 border-t border-slate-800 text-slate-500 text-xs font-mono">
                  <Lock size={12} className="shrink-0" /> Private client project · code under NDA
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
            className="inline-flex items-center gap-2 border border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 text-sm"
          >
            <Github size={18} />
            View More on GitHub
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
