import { GraduationCap, Award } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/motion/Reveal'
import type { EducationItem } from '@/lib/schema'

export default function Education({ education }: { education: EducationItem[] }) {
  return (
    <section id="education" aria-labelledby="education-heading" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading id="education" intro="Degrees and certifications." />

        <div className="grid sm:grid-cols-2 gap-5">
          {education.map((item, index) => {
            const isCert = item.type === 'Certification'
            const Icon = isCert ? Award : GraduationCap
            return (
              <Reveal
                key={item.qualification}
                index={index % 2}
                className="bg-slate-900/70 rounded-2xl border border-slate-800/80 p-6 hover:border-slate-700/80 transition-colors duration-200"
              >
                <div className="flex items-start gap-3 mb-2">
                  <Icon size={18} aria-hidden="true" className={`mt-0.5 shrink-0 ${isCert ? 'text-amber-400' : 'text-blue-400'}`} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-slate-100 font-semibold text-base leading-snug">
                        {item.qualification}
                      </h3>
                      {item.note && !isCert && (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded">
                          {item.note}
                        </span>
                      )}
                    </div>
                    <p className="text-blue-300 text-sm mt-0.5">{item.institution}</p>
                  </div>
                </div>

                <p className="font-mono text-xs text-muted ml-[30px]">{item.period}</p>

                {item.note && isCert && (
                  <p className="text-slate-400 text-xs leading-relaxed mt-3 ml-[30px]">{item.note}</p>
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
