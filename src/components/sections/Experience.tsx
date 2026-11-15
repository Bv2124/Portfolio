import { Briefcase, MapPin, CheckCircle2 } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import BoldText from '@/components/ui/BoldText'
import Reveal from '@/components/motion/Reveal'
import TimelineProgress from '@/components/motion/TimelineProgress'
import { LiveDuration } from '@/components/ui/Live'
import { BUILD_NOW } from '@/lib/build-time'
import { formatRange, formatDuration } from '@/lib/experience'
import type { Job } from '@/lib/schema'

export default function Experience({ experience }: { experience: Job[] }) {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading id="experience" intro="Where I have worked and what I shipped there." />

        {/* Timeline */}
        <div className="relative border-l border-slate-800 ml-3 sm:ml-4 flex flex-col gap-10">
          <TimelineProgress />
          {experience.map((job, index) => {
            const isCurrent = !job.end
            const builtDuration = formatDuration(job.start, job.end, BUILD_NOW)
            return (
              <Reveal key={`${job.company}-${job.start}`} index={index} from="left" className="relative pl-8 sm:pl-10">
                {/* Node */}
                <span aria-hidden="true" className={`absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                  isCurrent
                    ? 'bg-emerald-400 border-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.15)]'
                    : 'bg-slate-700 border-slate-600'
                }`} />

                <div className="bg-slate-900/70 rounded-2xl border border-slate-800/80 p-6 hover:border-slate-700/80 transition-colors duration-200">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-slate-100 font-semibold text-lg flex items-center gap-2">
                        <Briefcase size={16} aria-hidden="true" className="text-blue-400 shrink-0" />
                        {job.role}
                      </h3>
                      <a
                        href={job.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-blue-300 hover:text-blue-200 text-sm font-medium mt-0.5"
                      >
                        {job.company}
                      </a>
                    </div>
                    {isCurrent && (
                      <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>

                  {/* Meta line */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted font-mono mb-4">
                    <span>{formatRange(job.start, job.end)}</span>
                    <span aria-hidden="true" className="text-slate-600">•</span>
                    <span>
                      {isCurrent
                        ? <LiveDuration start={job.start} end={job.end} fallback={builtDuration} />
                        : builtDuration}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} aria-hidden="true" /> {job.location}
                    </span>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{job.summary}</p>

                  {/* Highlights */}
                  <ul className="space-y-1.5 mb-5">
                    {job.highlights.map(h => (
                      <li key={h} className="flex items-start gap-2">
                        <CheckCircle2 size={13} aria-hidden="true" className="text-emerald-400 mt-0.5 shrink-0" />
                        <span className="text-slate-400 text-xs leading-relaxed"><BoldText text={h} /></span>
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
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
