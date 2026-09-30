'use client'

import { Briefcase, MapPin, CheckCircle2 } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import useNow from '@/hooks/useNow'
import { formatRange, formatDuration } from '@/lib/experience'
import type { Job } from '@/lib/types'

export default function Experience({ experience }: { experience: Job[] }) {
  const now = useNow()

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeading number="02" title="Experience" />

        {/* Timeline */}
        <div className="relative border-l border-slate-800 ml-3 sm:ml-4 space-y-10">
          {experience.map(job => {
            const isCurrent = !job.end
            return (
              <div  key={job.company} className="relative pl-8 sm:pl-10">
                {/* Node */}
                <span className={`absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                  isCurrent
                    ? 'bg-emerald-400 border-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.15)]'
                    : 'bg-slate-700 border-slate-600'
                }`} />

                <div className="bg-slate-900/70 rounded-2xl border border-slate-800/80 p-6 hover:border-slate-700/80 transition-colors duration-200">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-slate-100 font-semibold text-lg flex items-center gap-2">
                        <Briefcase size={16} className="text-blue-400 shrink-0" />
                        {job.role}
                      </h3>
                      <p onClick={() => window.open(job.companyUrl, '_blank')} className="text-blue-300 text-sm font-medium mt-0.5 cursor-pointer">{job.company}</p>
                    </div>
                    {isCurrent && (
                      <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>

                  {/* Meta line */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-mono mb-4">
                    <span>{formatRange(job.start, job.end)}</span>
                    {now && (
                      <>
                        <span className="text-slate-700">•</span>
                        <span>{formatDuration(job.start, job.end, now)}</span>
                      </>
                    )}
                    <span className="text-slate-700">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {job.location}
                    </span>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{job.summary}</p>

                  {/* Highlights */}
                  <ul className="space-y-1.5 mb-5">
                    {job.highlights.map(h => (
                      <li key={h} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                        <span className="text-slate-400 text-xs leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech */}
                  <div className="flex flex-wrap gap-2">
                    {job.tech.map(t => (
                      <span
                        key={t}
                        className="px-2.5 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-md border border-blue-500/20 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
