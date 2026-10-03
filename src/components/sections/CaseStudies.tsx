import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import type { CaseStudy } from '@/lib/schema'

export default function CaseStudies({ studies }: { studies: CaseStudy[] }) {
  return (
    <section id="case-studies" aria-labelledby="case-studies-heading" className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeading id="case-studies" />

        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mb-10">
          Three pieces of work, written up as challenge, approach and outcome. Each one sticks to what I actually did.
        </p>

        <div className="grid gap-6 lg:grid-cols-3">
          {studies.map(study => {
            const headline = study.metrics[0]
            return (
              <article
                key={study.slug}
                className="group relative flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 transition-[border-color,box-shadow] duration-300 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-slate-950/60 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-blue-400"
              >
                {headline && (
                  <p className="font-mono text-3xl font-bold text-blue-400">
                    {headline.srText ? (
                      <>
                        <span aria-hidden="true">{headline.value}</span>
                        <span className="sr-only">{headline.srText}</span>
                      </>
                    ) : (
                      headline.value
                    )}
                  </p>
                )}
                {headline && <p className="mt-1 text-xs text-muted">{headline.label}</p>}

                <h3 className="mt-5 text-lg font-semibold leading-snug text-slate-100">
                  {/* The title link stretches over the whole card, so the entire card is one target. */}
                  <Link
                    href={`/case-studies/${study.slug}/`}
                    className="outline-none after:absolute after:inset-0 after:content-['']"
                  >
                    {study.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{study.tagline}</p>

                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                  {study.stack.map(tech => (
                    <li
                      key={tech}
                      className="px-2.5 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-md border border-blue-500/20 font-mono"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-blue-300">
                  Read case study
                  <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
