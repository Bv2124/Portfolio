import { MapPin } from 'lucide-react'
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
    <section id="experience" aria-labelledby="experience-heading" className="section-pad">
      <div className="container-page">
        <SectionHeading id="experience" intro="Where I have worked and what I shipped there." />

        {/* Timeline: a hairline that fills with the accent colour as you scroll through it */}
        <div className="relative ml-1.5 flex flex-col gap-8 border-l border-line sm:ml-4">
          <TimelineProgress />
          {experience.map((job, index) => {
            const isCurrent = !job.end
            const builtDuration = formatDuration(job.start, job.end, BUILD_NOW)
            return (
              <Reveal key={`${job.company}-${job.start}`} index={index} from="left" className="relative pl-5 sm:pl-10">
                {/* Node */}
                <span
                  aria-hidden="true"
                  className={`absolute -left-[7px] top-8 h-3.5 w-3.5 rounded-full ring-4 ring-ground ${
                    isCurrent ? 'bg-accent' : 'bg-ink-soft'
                  }`}
                />

                <div className="rounded-3xl bg-surface p-5 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <div>
                      <h3 className="text-[1.4375rem] font-semibold leading-tight text-ink">{job.role}</h3>
                      <a
                        href={job.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="-mt-0.5 inline-flex min-h-11 items-center text-base font-medium text-accent-ink underline-offset-4 hover:underline"
                      >
                        {job.company}
                      </a>
                    </div>
                    {isCurrent && (
                      <span className="chip gap-2">
                        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
                        Current
                      </span>
                    )}
                  </div>

                  <p className="meta mt-3 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
                    <span>{formatRange(job.start, job.end)}</span>
                    <span aria-hidden="true" className="hidden sm:inline">·</span>
                    <span>
                      {isCurrent
                        ? <LiveDuration start={job.start} end={job.end} fallback={builtDuration} />
                        : builtDuration}
                    </span>
                    <span aria-hidden="true" className="hidden sm:inline">·</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={14} aria-hidden="true" /> {job.location}
                    </span>
                  </p>

                  <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink">{job.summary}</p>

                  <ul className="mt-5 space-y-3">
                    {job.highlights.map(h => (
                      <li key={h} className="flex items-start gap-3">
                        <span aria-hidden="true" className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span className="text-base leading-relaxed text-ink-soft"><BoldText text={h} /></span>
                      </li>
                    ))}
                  </ul>

                  <ul aria-label="Technologies" className="mt-6 flex flex-wrap gap-2">
                    {job.tech.map(t => (
                      <li key={t} className="chip">{t}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
