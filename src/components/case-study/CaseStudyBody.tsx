import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { VISUALS } from './visuals'
import Reveal from '@/components/motion/Reveal'
import type { CaseStudy } from '@/lib/schema'

// A titled section. By default the whole block reveals on scroll; blocks whose items reveal
// one by one (the approach steps) opt out so nothing is animated twice.
function Block({ id, title, reveal = true, children }: {
  id: string
  title: string
  reveal?: boolean
  children: ReactNode
}) {
  const body = (
    <>
      <h2 id={`${id}-heading`} className="text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </>
  )
  return (
    <section aria-labelledby={`${id}-heading`} className="mt-16">
      {reveal ? <Reveal>{body}</Reveal> : body}
    </section>
  )
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="max-w-3xl space-y-4">
      {items.map((text, i) => (
        <p key={i} className="text-[1.0625rem] leading-relaxed text-ink-soft">{text}</p>
      ))}
    </div>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="max-w-3xl space-y-3">
      {items.map((text, i) => (
        <li key={i} className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span className="text-[1.0625rem] leading-relaxed text-ink-soft">{text}</span>
        </li>
      ))}
    </ul>
  )
}

interface BodyProps {
  study: CaseStudy
  related: Array<{ slug: string; title: string }>
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
  // Link to this study's content file in the public repository, once it is public.
  sourceUrl: string | null
}

const NAV_CARD = 'card-lift group block rounded-3xl bg-surface p-6'

export default function CaseStudyBody({ study, related, prev, next, sourceUrl }: BodyProps) {
  const Visual = VISUALS[study.visual]

  return (
    <>
      <p className="max-w-3xl text-[1.0625rem] leading-relaxed text-ink">{study.context}</p>

      <div className="mt-10">
        <Visual />
      </div>

      <Block id="challenge" title="The challenge">
        <Paragraphs items={study.challenge} />
      </Block>

      <Block id="approach" title="The approach" reveal={false}>
        <ol className="max-w-3xl space-y-4">
          {study.approach.map((step, i) => (
            <Reveal as="li" key={step.title} index={i} className="flex gap-4 rounded-3xl bg-surface p-6">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tint text-base font-bold text-ink"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold leading-snug text-ink">{step.title}</h3>
                <p className="mt-1 text-base leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Block>

      <Block id="outcome" title="The outcome">
        <Bullets items={study.outcome} />
      </Block>

      {study.alsoShipped && (
        <Block id="also-shipped" title={study.alsoShipped.title}>
          <Bullets items={study.alsoShipped.items} />
        </Block>
      )}

      {study.team && (
        <Block id="team" title="Team">
          <Paragraphs items={[study.team]} />
        </Block>
      )}
      {study.tradeoffs && (
        <Block id="tradeoffs" title="Trade-offs">
          <Bullets items={study.tradeoffs} />
        </Block>
      )}
      {study.learnings && (
        <Block id="learnings" title="What I would do differently">
          <Bullets items={study.learnings} />
        </Block>
      )}

      {related.length > 0 && (
        <p className="mt-16 max-w-3xl text-base text-ink-soft">
          Same platform:{' '}
          {related.map((rel, i) => (
            <span key={rel.slug}>
              {i > 0 && ', '}
              <Link href={`/case-studies/${rel.slug}/`} className="font-semibold text-accent-ink underline underline-offset-4">
                {rel.title}
              </Link>
            </span>
          ))}
        </p>
      )}

      {sourceUrl && (
        <p className="mt-6 max-w-3xl text-base text-ink-soft">
          This page is generated from{' '}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent-ink underline underline-offset-4"
          >
            a validated JSON file in the site&apos;s repository
          </a>
          .
        </p>
      )}

      <nav aria-label="More case studies" className="mt-16 grid gap-4 sm:grid-cols-2">
        {prev ? (
          <Link href={`/case-studies/${prev.slug}/`} className={NAV_CARD}>
            <span className="meta inline-flex items-center gap-1.5">
              <ArrowLeft size={14} aria-hidden="true" /> Previous
            </span>
            <span className="mt-2 block text-lg font-semibold leading-snug text-ink">{prev.title}</span>
          </Link>
        ) : <span aria-hidden="true" />}
        {next && (
          <Link href={`/case-studies/${next.slug}/`} className={`${NAV_CARD} text-left sm:text-right`}>
            <span className="meta inline-flex items-center gap-1.5">
              Next <ArrowRight size={14} aria-hidden="true" />
            </span>
            <span className="mt-2 block text-lg font-semibold leading-snug text-ink">{next.title}</span>
          </Link>
        )}
      </nav>
    </>
  )
}
