import type { CSSProperties, ReactNode } from 'react'
import { Ban, ChevronRight } from 'lucide-react'
import PlayOnView from '@/components/motion/PlayOnView'

// Whole class strings, so Tailwind can see them.
const TONES = {
  slate:   'bg-ground text-ink',
  blue:    'bg-chip-blue text-chip-blue-ink',
  amber:   'bg-chip-amber text-chip-amber-ink',
  emerald: 'bg-tint text-ink',
} as const

// --step orders the play-once sequence (see the data-play rules in globals.css).
const step = (n: number) => ({ '--step': n } as CSSProperties)

function Node({ kicker, title, detail, tone, order, flash = false, children }: {
  kicker: string
  title: string
  detail?: string
  tone: keyof typeof TONES
  order: number
  flash?: boolean
  children?: ReactNode
}) {
  return (
    <div className={`${flash ? 'seq-flash' : 'seq'} flex-1 rounded-3xl px-5 py-4 ${TONES[tone]}`} style={step(order)}>
      <p className="text-[0.8125rem] font-semibold uppercase tracking-wider opacity-80">{kicker}</p>
      <p className="mt-1 text-base font-semibold">{title}</p>
      {detail && <p className="mt-1 text-[0.8125rem] leading-snug">{detail}</p>}
      {children}
    </div>
  )
}

// A short connector whose dashes flow during the sequence; vertical on phones. The entrance
// animation (outer) and the rotation (inner) live on separate elements so they never conflict.
function Connector({ order }: { order: number }) {
  return (
    <div className="seq flex shrink-0 items-center justify-center" style={step(order)}>
      <div className="flex items-center rotate-90 md:rotate-0">
        <span className="flow-arrow block h-0.5 w-6 rounded bg-ink-soft/40" />
        <ChevronRight size={16} aria-hidden="true" className="-ml-1 text-ink-soft" />
      </div>
    </div>
  )
}

// One shared check path (dry-run comparison, then 5+ validation stages) feeding two
// separate scripted runs. The résumé gives the two record counts but not the order of the
// checks within the path, so the diagram keeps them as one path.
export default function MigrationPipeline() {
  return (
    <figure className="rounded-3xl bg-surface p-5 sm:p-6">
      <PlayOnView>
        <div
          role="img"
          aria-label="Diagram: data from Salesforce goes through a dry-run comparison and 5+ validation stages that block duplicates, then moves in two separate runs: about 8,000 records to staging and about 14,000 to production."
        >
          <div aria-hidden="true" className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-1">
            <Node kicker="Source" title="Salesforce" tone="slate" order={0} />
            <Connector order={1} />
            <Node kicker="Check" title="Dry-run comparison" detail="Custom script" tone="blue" order={2} />
            <Connector order={3} />
            <Node kicker="Gate" title="5+ validation stages" tone="amber" order={4} flash>
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-surface/70 px-3 py-1 text-[0.8125rem] font-semibold">
                <Ban size={14} aria-hidden="true" /> Duplicates blocked
              </p>
            </Node>
            <Connector order={5} />
            <div className="flex flex-1 flex-col gap-3">
              <Node kicker="Run 1" title="Staging" detail="~8,000 records" tone="emerald" order={6} />
              <Node kicker="Run 2" title="Production" detail="~14,000 records" tone="emerald" order={7} />
            </div>
          </div>
        </div>
      </PlayOnView>
      <figcaption className="mt-4 text-center text-[0.8125rem] text-ink-soft">
        Dry-run comparison and 5+ validation stages block duplicates · zero data loss
      </figcaption>
    </figure>
  )
}
