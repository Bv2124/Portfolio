import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/motion/Reveal'
import { getIcon } from '@/lib/icons'
import type { SkillGroup } from '@/lib/schema'

interface SkillsProps {
  groups: SkillGroup[]
}

export default function Skills({ groups }: SkillsProps) {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="section-pad">
      <div className="container-page">
        <SectionHeading id="skills" intro="The stack I work in day to day, grouped as on my résumé." />

        <p className="mb-6 flex items-center gap-2 text-base text-ink-soft">
          <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-accent" />
          <span>
            Highlighted items are the core of the stack<span className="sr-only"> (each is marked “core”)</span>.
          </span>
        </p>

        {/* One row per group: its name on the left, its tools on the right, hairlines between. */}
        <div className="divide-y divide-line border-y border-line">
          {groups.map((group, index) => {
            const Icon = getIcon(group.iconName)
            return (
              <Reveal
                key={group.name}
                index={index % 3}
                className="grid gap-x-10 gap-y-4 py-6 md:grid-cols-[13rem_1fr]"
              >
                <h3 className="flex items-center gap-3 text-lg font-semibold text-ink md:items-start">
                  {Icon && <Icon aria-hidden="true" size={20} className="shrink-0 text-accent-ink md:mt-0.5" />}
                  {group.name}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map(item => (
                    <li
                      key={item.name}
                      className={`rounded-full px-3.5 py-2 text-[0.8125rem] font-semibold leading-snug ${
                        item.core ? 'bg-accent/15 text-accent-ink' : 'bg-surface text-ink'
                      }`}
                    >
                      {item.name}
                      {item.core && <span className="sr-only"> (core)</span>}
                      {item.note && (
                        <span className={`font-medium ${item.core ? 'text-accent-ink' : 'text-ink-soft'}`}> · {item.note}</span>
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
