import PropTypes from 'prop-types'
import SectionHeading from './SectionHeading'
import { getIcon } from '../lib/icons'

const LEVEL_STYLES = {
  Expert:       { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', bar: 'bg-emerald-400' },
  Intermediate: { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',       bar: 'bg-amber-400'   },
  Basic:        { badge: 'bg-slate-500/15 text-slate-400 border-slate-500/30',        bar: 'bg-slate-500'   },
}

export default function Skills({ skills, categories, specialty }) {
  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 section-alt scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeading number="03" title="Tech Stack" />

        {categories.map(category => {
          const items = skills.filter(s => s.category === category)
          if (!items.length) return null
          return (
            <div key={category} className="mb-12">
              <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-5">
                <span className="text-blue-400">/</span> {category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map(skill => {
                  const Icon = getIcon(skill.iconName)
                  const lvl = LEVEL_STYLES[skill.level] ?? LEVEL_STYLES.Basic
                  return (
                    <div
                      key={skill.name}
                      className="group bg-slate-900/60 rounded-xl border border-slate-800/80 p-5 hover:border-slate-700/80 hover:bg-slate-900 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      {Icon && <Icon className={`mb-3 ${skill.color}`} size={24} />}
                      <div className="font-medium text-slate-200 text-sm mb-2">{skill.name}</div>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full border font-mono ${lvl.badge}`}>
                        {skill.level}
                      </span>
                      <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${lvl.bar}`} style={{ width: `${skill.levelPercent}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Specialty banner (from JSON) */}
        <div className="mt-8 relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-violet-600/90" />
          <div className="absolute inset-0 grid-bg opacity-10" />
          <div className="relative p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-3">{specialty.title}</h3>
            <p className="text-blue-100/80 max-w-2xl mx-auto text-sm leading-relaxed">{specialty.text}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

Skills.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.shape({
    name:         PropTypes.string.isRequired,
    iconName:     PropTypes.string.isRequired,
    color:        PropTypes.string.isRequired,
    category:     PropTypes.string.isRequired,
    level:        PropTypes.string.isRequired,
    levelPercent: PropTypes.number.isRequired,
  })).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  specialty: PropTypes.shape({
    title: PropTypes.string.isRequired,
    text:  PropTypes.string.isRequired,
  }).isRequired,
}
