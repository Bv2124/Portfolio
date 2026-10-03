import type { CSSProperties, ReactNode } from 'react'
import { Ban, ChevronRight } from 'lucide-react'
import PlayOnView from '@/components/motion/PlayOnView'

const TONES = {
  slate:   'border-slate-700 bg-slate-800/50 text-slate-200',
  blue:    'border-blue-500/40 bg-blue-500/10 text-blue-200',
  amber:   'border-amber-500/40 bg-amber-500/10 text-amber-200',
  emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
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
    <div className={`${flash ? 'seq-flash' : 'seq'} flex-1 rounded-xl border px-4 py-3 ${TONES[tone]}`} style={step(order)}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{kicker}</p>
      <p className="font-semibold text-sm mt-1">{title}</p>
      {detail && <p className="text-xs text-slate-300 mt-1">{detail}</p>}
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
        <span className="flow-arrow block h-0.5 w-6 rounded bg-slate-600" />
        <ChevronRight size={14} aria-hidden="true" className="-ml-1 text-slate-500" />
      </div>
    </div>
  )
}

// One shared check path (dry-run comparison, then 5+ validation stages) feeding two
// separate scripted runs. The résumé gives the two record counts but not the order of the
// checks within the path, so the diagram keeps them as one path.
export default function MigrationPipeline() {
  return (
    <figure className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6">
      <PlayOnView>
        <div
          role="img"
          aria-label="Diagram: data from Salesforce goes through a dry-run comparison and 5+ validation stages that block duplicates, then moves in two separate runs: about 8,000 records to staging and about 14,000 to production."
        >
          <div aria-hidden="true" className="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-1">
            <Node kicker="Source" title="Salesforce" tone="slate" order={0} />
            <Connector order={1} />
            <Node kicker="Check" title="Dry-run comparison" detail="Custom script" tone="blue" order={2} />
            <Connector order={3} />
            <Node kicker="Gate" title="5+ validation stages" tone="amber" order={4} flash>
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 px-2 py-0.5 text-xs text-amber-200">
                <Ban size={12} aria-hidden="true" /> Duplicates blocked
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
      <figcaption className="mt-4 text-center text-xs text-slate-400">
        Dry-run comparison and 5+ validation stages block duplicates · zero data loss
      </figcaption>
    </figure>
  )
}
