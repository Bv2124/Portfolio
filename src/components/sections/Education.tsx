import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/motion/Reveal'
import type { EducationItem } from '@/lib/schema'

// A plain list: four entries don't need four boxes.
export default function Education({ education }: { education: EducationItem[] }) {
  return (
    <section id="education" aria-labelledby="education-heading" className="section-pad">
      <div className="container-page">
        <SectionHeading id="education" intro="What I have studied, and what I am studying now." />

        <div className="divide-y divide-line border-y border-line">
          {education.map((item, index) => {
            const isCert = item.type === 'Certification'
            return (
              <Reveal
                key={item.qualification}
                index={index % 2}
                className="grid gap-x-10 gap-y-1 py-6 sm:grid-cols-[1fr_auto] sm:items-baseline"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3 className="text-lg font-semibold leading-snug text-ink">{item.qualification}</h3>
                    {item.note && !isCert && <span className="chip bg-surface">{item.note}</span>}
                  </div>
                  <p className="mt-1 text-base text-accent-ink">{item.institution}</p>
                  {item.note && isCert && <p className="mt-2 text-base text-ink-soft">{item.note}</p>}
                </div>
                <p className="meta tabular-nums">{item.period}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
