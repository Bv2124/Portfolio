import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/motion/Reveal'
import { getIcon } from '@/lib/icons'
import type { SkillGroup } from '@/lib/schema'

interface SkillsProps {
  groups: SkillGroup[]
}

export default function Skills({ groups }: SkillsProps) {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="py-24 px-4 sm:px-6 lg:px-8 section-alt">
      <div className="max-w-6xl mx-auto">
        <SectionHeading id="skills" />

        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mb-10">
          The stack I work in day to day, grouped as on my résumé.{' '}
          <span className="inline-flex items-center gap-1.5 align-middle">
            <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-slate-300">Highlighted</span>
          </span>{' '}
          items are the core of it<span className="sr-only"> (each is marked “core”)</span>.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((group, index) => {
            const Icon = getIcon(group.iconName)
            return (
              <Reveal
                key={group.name}
                index={index % 3}
                className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 hover:border-slate-700/80 transition-colors duration-200"
              >
                <h3 className="flex items-center gap-2.5 text-slate-100 font-semibold text-base mb-4">
                  {Icon && <Icon aria-hidden="true" size={18} className="text-blue-400 shrink-0" />}
                  {group.name}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map(item => (
                    <li
                      key={item.name}
                      className={`px-2.5 py-1 rounded-md border text-xs ${
                        item.core
                          ? 'bg-blue-500/15 text-blue-200 border-blue-400/40 font-medium'
                          : 'bg-slate-800/60 text-slate-300 border-slate-700/70'
                      }`}
                    >
                      {item.name}
                      {item.core && <span className="sr-only"> (core)</span>}
                      {item.note && (
                        <span className={`font-normal ${item.core ? 'text-blue-300' : 'text-muted'}`}> · {item.note}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
