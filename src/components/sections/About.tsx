import SectionHeading from '@/components/ui/SectionHeading'
import BoldText from '@/components/ui/BoldText'
import Reveal from '@/components/motion/Reveal'
import { LiveYears } from '@/components/ui/Live'
import { BUILD_NOW } from '@/lib/build-time'
import { yearsSince } from '@/lib/experience'
import type { About as AboutData, Personal } from '@/lib/schema'

const ACHIEVEMENT_COLORS: Record<AboutData['achievements'][number]['color'], string> = {
  blue:   'bg-blue-500',
  purple: 'bg-violet-500',
  green:  'bg-emerald-500',
  orange: 'bg-orange-500',
}

interface AboutProps {
  personal: Personal
  about: AboutData
}

export default function About({ personal, about }: AboutProps) {
  const tokens = {
    years: <LiveYears start={personal.careerStart} fallback={yearsSince(personal.careerStart, BUILD_NOW)} />,
  }

  return (
    <section id="about" aria-labelledby="about-heading" className="py-24 px-4 sm:px-6 lg:px-8 section-alt scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeading id="about" />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Reveal className="space-y-5">
            {about.paragraphs.map((para, i) => (
              <p key={i} className="text-slate-400 leading-relaxed text-[15px]">
                <BoldText text={para} tokens={tokens} />
              </p>
            ))}
          </Reveal>

          <div className="space-y-6">
            <Reveal index={1} className="bg-slate-900/80 rounded-2xl border border-slate-800/80 p-6">
              <h3 className="font-mono text-xs text-muted mb-5 uppercase tracking-widest">
                <span className="sr-only">Key achievements</span>
                <span aria-hidden="true"><span className="text-blue-400">{'//'}{' '}</span>key_achievements</span>
              </h3>
              <ul className="space-y-4">
                {about.achievements.map(ach => (
                  <li key={ach.text} className="flex items-start gap-3">
                    <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full mt-[7px] shrink-0 ${ACHIEVEMENT_COLORS[ach.color]}`} />
                    <span className="text-slate-400 text-sm leading-relaxed">{ach.text}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal index={2} className="bg-slate-900/80 rounded-2xl border border-slate-800/80 p-6">
              <h3 className="font-mono text-xs text-muted mb-5 uppercase tracking-widest">
                <span className="sr-only">Quick facts</span>
                <span aria-hidden="true"><span className="text-blue-400">{'//'}{' '}</span>quick_facts</span>
              </h3>
              <dl className="space-y-3">
                {personal.quickFacts.map(fact => (
                  <div key={fact.label} className="flex flex-col sm:flex-row sm:gap-4 text-sm">
                    <dt className="sm:w-28 shrink-0 font-mono text-xs text-muted pt-0.5">{fact.label}</dt>
                    <dd className="text-slate-300">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
