import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
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
      <h2 id={`${id}-heading`} className="text-2xl font-bold text-slate-100">{title}</h2>
      <div className="mt-5">{children}</div>
    </>
  )
  return (
    <section aria-labelledby={`${id}-heading`} className="mt-14">
      {reveal ? <Reveal>{body}</Reveal> : body}
    </section>
  )
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="max-w-3xl space-y-4">
      {items.map((text, i) => (
        <p key={i} className="text-[15px] leading-relaxed text-slate-400">{text}</p>
      ))}
    </div>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="max-w-3xl space-y-2.5">
      {items.map((text, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <CheckCircle2 size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-400" />
          <span className="text-[15px] leading-relaxed text-slate-400">{text}</span>
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

export default function CaseStudyBody({ study, related, prev, next, sourceUrl }: BodyProps) {
  const Visual = VISUALS[study.visual]

  return (
    <>
      <p className="max-w-3xl text-[15px] leading-relaxed text-slate-300">{study.context}</p>

      <div className="mt-10">
        <Visual />
      </div>

      <Block id="challenge" title="The challenge">
        <Paragraphs items={study.challenge} />
      </Block>

      <Block id="approach" title="The approach" reveal={false}>
        <ol className="max-w-3xl space-y-4">
          {study.approach.map((step, i) => (
            <Reveal as="li" key={step.title} index={i} className="flex gap-4 rounded-xl border border-slate-800/80 bg-slate-900/60 p-5">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 font-mono text-sm text-blue-300"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-slate-100">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{step.text}</p>
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
        <p className="mt-14 max-w-3xl text-sm text-slate-400">
          Same platform:{' '}
          {related.map((rel, i) => (
            <span key={rel.slug}>
              {i > 0 && ', '}
              <Link href={`/case-studies/${rel.slug}/`} className="text-blue-300 underline underline-offset-4 hover:text-blue-200">
                {rel.title}
              </Link>
            </span>
          ))}
        </p>
      )}

      {sourceUrl && (
        <p className="mt-6 max-w-3xl text-sm text-slate-400">
          This page is generated from{' '}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 underline underline-offset-4 hover:text-blue-200"
          >
            a validated JSON file in the site&apos;s repository
          </a>
          .
        </p>
      )}

      <nav aria-label="More case studies" className="mt-14 grid gap-4 border-t border-slate-800 pt-8 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/case-studies/${prev.slug}/`}
            className="group rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 transition-colors hover:border-slate-700"
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
              <ArrowLeft size={12} aria-hidden="true" /> Previous
            </span>
            <span className="mt-2 block text-sm font-semibold text-slate-100">{prev.title}</span>
          </Link>
        ) : <span aria-hidden="true" />}
        {next && (
          <Link
            href={`/case-studies/${next.slug}/`}
            className="group rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 text-left transition-colors hover:border-slate-700 sm:text-right"
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
              Next <ArrowRight size={12} aria-hidden="true" />
            </span>
            <span className="mt-2 block text-sm font-semibold text-slate-100">{next.title}</span>
          </Link>
        )}
      </nav>
    </>
  )
}
