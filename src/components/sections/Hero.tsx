import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Download } from 'lucide-react'
import { LiveYears } from '@/components/ui/Live'
import { BUILD_NOW } from '@/lib/build-time'
import { yearsSince } from '@/lib/experience'
import type { HeroStat, Personal } from '@/lib/schema'

interface HeroProps {
  personal: Personal
  resumeDownloadName: string
  roles: string[]
}

// Staggers the CSS entrance animation (see .hero-in in globals.css).
const step = (i: number): CSSProperties => ({ '--i': i } as CSSProperties)

export default function Hero({ personal, resumeDownloadName, roles }: HeroProps) {
  const builtYears = yearsSince(personal.careerStart, BUILD_NOW)

  const renderStat = (stat: HeroStat) => {
    if ('computed' in stat) return <><LiveYears start={personal.careerStart} fallback={builtYears} />+</>
    if (stat.srText) {
      return (
        <>
          <span aria-hidden="true">{stat.value}</span>
          <span className="sr-only">{stat.srText}</span>
        </>
      )
    }
    return stat.value
  }

  // "Hi, I'm Vigneshwaran. I'm a full-stack engineer." One word per mask, each sliding up in turn.
  const titleWords = personal.title.toLowerCase().split(' ')
  const words = [
    { text: 'Hi,', name: false, breakAfter: false },
    { text: "I'm", name: false, breakAfter: false },
    { text: `${personal.firstName}.`, name: true, breakAfter: true },
    { text: "I'm", name: false, breakAfter: false },
    { text: 'a', name: false, breakAfter: false },
    ...titleWords.map((word, i) => ({
      text: i === titleWords.length - 1 ? `${word}.` : word,
      name: false,
      breakAfter: false,
    })),
  ]

  return (
    <section className="pb-16 pt-28 md:pb-24 md:pt-36">
      <div className="container-page">
        {personal.openToWork && (
          <p
            className="hero-in inline-flex items-center gap-2.5 rounded-full bg-surface px-4 py-2 text-sm font-medium"
            style={step(0)}
          >
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-accent" />
            {personal.availability}
          </p>
        )}

        {/* The heading spans the full width so it sits on two lines at full size. Each word slides up
            from behind a mask (transform only; the text is always in the HTML). */}
        <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
          {words.map((word, i) => (
            <span key={i}>
              {i > 0 && (words[i - 1]?.breakAfter ? <br /> : ' ')}
              <span className="hero-mask">
                <span
                  className={`hero-word ${word.name ? 'text-accent-ink' : ''}`}
                  style={{ '--d': `${i * 60}ms` } as CSSProperties}
                >
                  {word.text}
                </span>
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-wrap items-start gap-x-14 gap-y-12">
          <div className="flex min-w-0 flex-[3_1_30rem] flex-col items-start gap-6">
            {/* Transform-only entrance: the bio is a likely LCP element, so it is never transparent. */}
            <p className="hero-rise lead" style={step(3)}>
              {personal.heroBio}
            </p>

            <ul aria-label="Roles" className="hero-in flex flex-wrap gap-2" style={step(4)}>
              {roles.map(role => (
                <li key={role} className="chip bg-surface">{role}</li>
              ))}
            </ul>

            <div className="hero-in flex flex-wrap gap-3" style={step(5)}>
              <Link href="/#case-studies" className="btn btn-primary">
                See case studies
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href={personal.resume} download={resumeDownloadName} className="btn btn-secondary">
                <Download size={18} aria-hidden="true" />
                Download résumé
              </a>
            </div>
          </div>

          {/* The portrait, then the four headline numbers. Transform-only entrance, as the photo may be the LCP element. */}
          <div className="hero-rise flex w-full max-w-md flex-[2_1_20rem] flex-col gap-6 rounded-[28px] bg-surface p-7" style={step(4)}>
            <div className="aspect-[5/4] overflow-hidden rounded-[20px] bg-tint">
              <Image
                src="/profile.jpg"
                width={800}
                height={800}
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 448px, 90vw"
                priority
                alt={`${personal.firstName} standing on a beach, arms crossed`}
                className="h-full w-full object-cover object-[30%_30%]"
              />
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
              {personal.heroStats.map(stat => (
                <div key={stat.label} className="flex flex-col-reverse justify-end gap-1">
                  <dt className="text-[0.8125rem] leading-snug text-ink-soft">{stat.label}</dt>
                  <dd className="text-3xl font-bold tabular-nums tracking-[-0.02em] text-ink">{renderStat(stat)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
