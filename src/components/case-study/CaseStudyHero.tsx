import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatRange } from '@/lib/experience'
import type { CaseStudy, Job } from '@/lib/schema'

export default function CaseStudyHero({ study, job }: { study: CaseStudy; job: Job }) {
  return (
    <header className="pb-12 pt-28">
      <Link
        href="/#case-studies"
        className="inline-flex min-h-11 items-center gap-2 text-base font-semibold text-accent-ink underline-offset-4 hover:underline"
      >
        <ArrowLeft size={16} aria-hidden="true" /> All case studies
      </Link>

      <p className="meta mt-6">Case study</p>
      <h1 className="mt-3 max-w-4xl text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink">
        {study.title}
      </h1>
      <p className="lead mt-5 max-w-3xl">{study.tagline}</p>

      <p className="meta mt-6">
        {job.company} · {job.role} · {formatRange(job.start, job.end)}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
        {study.stack.map(tech => (
          <li key={tech} className="chip bg-surface">{tech}</li>
        ))}
      </ul>

      <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {study.metrics.map(metric => (
          <div key={metric.label} className="flex h-full flex-col-reverse justify-end gap-2 rounded-3xl bg-surface p-6">
            <dt className="text-[0.8125rem] leading-snug text-ink-soft">{metric.label}</dt>
            <dd className="text-3xl font-bold tabular-nums tracking-[-0.02em] text-ink">
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
