import type { ReactNode } from 'react'
import { ArrowRight, Ban } from 'lucide-react'

const TONES = {
  slate:   'border-slate-700 bg-slate-800/50 text-slate-200',
  blue:    'border-blue-500/40 bg-blue-500/10 text-blue-200',
  amber:   'border-amber-500/40 bg-amber-500/10 text-amber-200',
  emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
} as const

function Node({ kicker, title, detail, tone, children }: {
  kicker: string
  title: string
  detail?: string
  tone: keyof typeof TONES
  children?: ReactNode
}) {
  return (
    <div className={`flex-1 rounded-xl border px-4 py-3 ${TONES[tone]}`}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{kicker}</p>
      <p className="font-semibold text-sm mt-1">{title}</p>
      {detail && <p className="text-xs text-slate-300 mt-1">{detail}</p>}
      {children}
    </div>
  )
}

function Arrow() {
  return <ArrowRight aria-hidden="true" size={18} className="shrink-0 self-center text-slate-500 rotate-90 md:rotate-0" />
}

// One shared check path (dry-run comparison, then 5+ validation stages) feeding two
// separate scripted runs. The résumé gives the two record counts but not the order of the
// checks within the path, so the diagram keeps them as one path.
export default function MigrationPipeline() {
  return (
    <figure className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6">
      <div
        role="img"
        aria-label="Diagram: data from Salesforce goes through a dry-run comparison and 5+ validation stages that block duplicates, then moves in two separate runs: about 8,000 records to staging and about 14,000 to production."
      >
        <div aria-hidden="true" className="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-2">
          <Node kicker="Source" title="Salesforce" tone="slate" />
          <Arrow />
          <Node kicker="Check" title="Dry-run comparison" detail="Custom script" tone="blue" />
          <Arrow />
          <Node kicker="Gate" title="5+ validation stages" tone="amber">
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 px-2 py-0.5 text-xs text-amber-200">
              <Ban size={12} aria-hidden="true" /> Duplicates blocked
            </p>
          </Node>
          <Arrow />
          <div className="flex flex-1 flex-col gap-3">
            <Node kicker="Run 1" title="Staging" detail="~8,000 records" tone="emerald" />
            <Node kicker="Run 2" title="Production" detail="~14,000 records" tone="emerald" />
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-center text-xs text-slate-400">
        Dry-run comparison and 5+ validation stages block duplicates · zero data loss
      </figcaption>
    </figure>
  )
}
