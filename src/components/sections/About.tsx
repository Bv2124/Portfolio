'use client'

import { MapPin } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import BoldText from '@/components/ui/BoldText'
import useNow from '@/hooks/useNow'
import { yearsSince } from '@/lib/experience'
import type { About as AboutData, Personal } from '@/lib/types'

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
  const now = useNow()
  const years = now ? yearsSince(personal.careerStart, now) : personal.yearsExperienceFallback

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 section-alt scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeading number="01" title="About Me" />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-5">
            {about.paragraphs.map(para => {
              const resolved = para.replaceAll('{{years}}', String(years))
              return (
                <p key={para.slice(0, 30)} className="text-slate-400 leading-relaxed text-[15px]">
                  <BoldText text={resolved} />
                </p>
              )
            })}
            <div className="flex items-center gap-2.5 pt-2">
              <MapPin size={15} className="text-blue-400 shrink-0" />
              <span className="text-slate-400 text-sm">{personal.location}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-2xl border border-slate-800/80 p-6">
            <h3 className="font-mono text-xs text-slate-500 mb-5 uppercase tracking-widest">
              <span className="text-blue-400">{'//'}{' '}</span>key_achievements
            </h3>
            <ul className="space-y-4">
              {about.achievements.map(ach => (
                <li key={ach.text} className="flex items-start gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full mt-[7px] shrink-0 ${ACHIEVEMENT_COLORS[ach.color]}`} />
                  <span className="text-slate-400 text-sm leading-relaxed">{ach.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
