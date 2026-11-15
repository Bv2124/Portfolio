import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/motion/Reveal'
import CountUp from '@/components/motion/CountUp'
import type { CaseStudy } from '@/lib/schema'

// The metric chip's colour rotates by position. Whole class strings, so Tailwind can see them.
const METRIC_TONES = [
  'bg-tint text-ink',
  'bg-chip-amber text-chip-amber-ink',
  'bg-chip-blue text-chip-blue-ink',
] as const

export default function CaseStudies({ studies }: { studies: CaseStudy[] }) {
  return (
    <section id="case-studies" aria-labelledby="case-studies-heading" className="section-pad bg-surface">
      <div className="container-page">
        <SectionHeading id="case-studies" intro="Challenge, approach and outcome, sticking to what I actually did." />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((study, index) => {
            const headline = study.metrics[0]
            const tone = METRIC_TONES[index % METRIC_TONES.length]
            return (
              <Reveal key={study.slug} index={index} className="md:max-lg:[&:last-child:nth-child(odd)]:col-span-2">
                <article className="group card-lift relative flex h-full flex-col gap-5 rounded-3xl bg-ground p-7 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent">
                  {headline && (
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className={`chip px-4 py-2 text-base font-bold tabular-nums ${tone}`}>
                        <span aria-hidden="true"><CountUp value={headline.value} /></span>
                        <span className="sr-only">{headline.srText ?? headline.value}</span>
                      </span>
                      <span className="meta">{headline.label}</span>
                    </p>
                  )}

                  <h3 className="text-[1.4375rem] font-semibold leading-tight text-ink">
                    {/* The title link stretches over the whole card, so the entire card is one target. */}
                    <Link
                      href={`/case-studies/${study.slug}/`}
                      className="outline-none after:absolute after:inset-0 after:content-['']"
                    >
                      {study.title}
                    </Link>
                  </h3>

                  <p className="flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">{study.stack.join(' · ')}</p>

                  <p className="inline-flex items-center gap-2 text-base font-semibold text-accent-ink">
                    Read case study
                    <ArrowRight
                      size={16}
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
