import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatRange } from '@/lib/experience'
import type { CaseStudy, Job } from '@/lib/schema'

export default function CaseStudyHero({ study, job }: { study: CaseStudy; job: Job }) {
  return (
    <header className="pt-28 pb-12">
      <Link
        href="/#case-studies"
        className="inline-flex items-center gap-2 min-h-11 text-sm font-mono text-slate-400 hover:text-blue-300 transition-colors"
      >
        <ArrowLeft size={14} aria-hidden="true" /> All case studies
      </Link>

      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-blue-400">Case study</p>
      <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-100">{study.title}</h1>
      <p className="mt-5 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-400">{study.tagline}</p>

      <p className="mt-6 font-mono text-xs text-muted">
        {job.company} · {job.role} · {formatRange(job.start, job.end)}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
        {study.stack.map(tech => (
          <li
            key={tech}
            className="px-2.5 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-md border border-blue-500/20 font-mono"
          >
            {tech}
          </li>
        ))}
      </ul>

      <dl className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {study.metrics.map(metric => (
          <div
            key={metric.label}
            className="flex h-full flex-col-reverse justify-end gap-1 rounded-xl border border-slate-800/80 bg-slate-900/70 p-4"
          >
            <dt className="text-xs leading-tight text-muted">{metric.label}</dt>
            <dd className="font-mono text-2xl font-bold text-blue-400">
              {metric.srText ? (
                <>
                  <span aria-hidden="true">{metric.value}</span>
                  <span className="sr-only">{metric.srText}</span>
                </>
              ) : (
                metric.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </header>
  )
}
