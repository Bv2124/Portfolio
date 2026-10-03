function Bar({ label, value, percent, fill }: { label: string; value: string; percent: number; fill: string }) {
  return (
    <div className="grid grid-cols-[3.5rem_1fr_3.5rem] items-center gap-3">
      <span className="text-xs text-slate-400">{label}</span>
      <div className="h-8 rounded-md bg-slate-800">
        <div className={`h-full rounded-md ${fill}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="font-mono text-sm font-semibold text-slate-100">{value}</span>
    </div>
  )
}

// Two bars, exactly the two numbers the résumé gives. No invented timings or intermediate data.
export default function SyncRateChart() {
  return (
    <figure className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6">
      <div
        role="img"
        aria-label="Bar chart: sync success in low-connectivity areas rose from about 30 percent before to about 80 percent after."
      >
        <div aria-hidden="true" className="space-y-4">
          <Bar label="Before" value="~30%" percent={30} fill="bg-slate-500" />
          <Bar label="After" value="~80%" percent={80} fill="bg-emerald-400" />
        </div>
      </div>
      <figcaption className="mt-4 text-center text-xs text-slate-400">
        Sync success in low-connectivity areas
      </figcaption>
    </figure>
  )
}
