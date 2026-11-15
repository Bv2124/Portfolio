import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/motion/Reveal'
import CountUp from '@/components/motion/CountUp'
import type { CaseStudy } from '@/lib/schema'

export default function CaseStudies({ studies }: { studies: CaseStudy[] }) {
  return (
    <section id="case-studies" aria-labelledby="case-studies-heading" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading id="case-studies" intro="Challenge, approach and outcome, sticking to what I actually did." />

        <div className="grid gap-6 lg:grid-cols-3">
          {studies.map((study, index) => {
            const headline = study.metrics[0]
            return (
              <Reveal key={study.slug} index={index}>
                {/* glow-card: the 1px ring around the inner fill lights up and rotates on hover/focus. */}
                <article
                  className="group flex h-full flex-col rounded-2xl bg-slate-800/70 p-6 transition-shadow duration-300 hover:shadow-2xl hover:shadow-slate-950/60 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-blue-400"
                >
                  {headline && (
                    <>
                      <p className="font-mono text-3xl font-bold text-blue-400">
                        <span aria-hidden="true"><CountUp value={headline.value} /></span>
                        <span className="sr-only">{headline.srText ?? headline.value}</span>
                      </p>
                      <p className="mt-1 text-xs text-muted">{headline.label}</p>
                    </>
                  )}

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
                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1 group-focus-within:translate-x-1"
                    />
                  </p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
