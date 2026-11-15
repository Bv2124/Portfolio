import type { CSSProperties } from 'react'
import PlayOnView from '@/components/motion/PlayOnView'

function Bar({ label, value, percent, fill, order }: {
  label: string
  value: string
  percent: number
  fill: string
  order: number
}) {
  const step = { '--step': order } as CSSProperties
  return (
    <div className="grid grid-cols-[4rem_1fr_4.5rem] items-center gap-3">
      <span className="text-[0.8125rem] font-medium text-ink-soft">{label}</span>
      <div className="h-9 rounded-full bg-ground">
        <div className={`bar-fill h-full rounded-full ${fill}`} style={{ width: `${percent}%`, ...step }} />
      </div>
      <span className="seq text-base font-bold tabular-nums text-ink" style={{ '--step': order + 3 } as CSSProperties}>
        {value}
      </span>
    </div>
  )
}

// Two bars, exactly the two numbers the résumé gives. No invented timings or intermediate data.
export default function SyncRateChart() {
  return (
    <figure className="rounded-3xl bg-surface p-5 sm:p-6">
      <PlayOnView>
        <div
          role="img"
          aria-label="Bar chart: sync success in low-connectivity areas rose from about 30 percent before to about 80 percent after."
        >
          <div aria-hidden="true" className="space-y-4">
            <Bar label="Before" value="~30%" percent={30} fill="bg-ink-soft" order={0} />
            <Bar label="After" value="~80%" percent={80} fill="bg-accent" order={1} />
          </div>
        </div>
      </PlayOnView>
      <figcaption className="mt-4 text-center text-[0.8125rem] text-ink-soft">
        Sync success in low-connectivity areas
      </figcaption>
    </figure>
  )
}
