import type { CSSProperties } from 'react'
import { ArrowRight, ChevronDown, Download } from 'lucide-react'
import RoleTypewriter from '@/components/ui/RoleTypewriter'
import { LiveYears } from '@/components/ui/Live'
import { BUILD_NOW } from '@/lib/build-time'
import { yearsSince } from '@/lib/experience'
import { RESUME_DOWNLOAD_NAME } from '@/lib/site'
import type { HeroStat, Personal } from '@/lib/schema'

interface HeroProps {
  personal: Personal
  roles: string[]
}

// Staggers the CSS entrance animation (see .hero-in in globals.css).
const step = (i: number): CSSProperties => ({ '--i': i } as CSSProperties)

export default function Hero({ personal, roles }: HeroProps) {
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

  return (
    <section className="relative min-h-svh flex flex-col justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle grid + glow orbs */}
      <div aria-hidden="true" className="absolute inset-0 grid-bg pointer-events-none" />
      <div aria-hidden="true" className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/[.06] rounded-full blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-1/4 -right-20 w-80 h-80 bg-violet-600/[.06] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto w-full pt-24 pb-16">

        <p aria-hidden="true" className="hero-in font-mono text-sm text-muted mb-5" style={step(0)}>
          <span className="text-blue-400">$</span> hello --world
        </p>

        {personal.openToWork && (
          <div
            className="hero-in inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-2xl sm:rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono"
            style={step(1)}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            {personal.availability}
          </div>
        )}

        <h1
          className="hero-in text-[clamp(2.25rem,10vw,4.5rem)] font-bold text-slate-100 mb-6 leading-tight"
          style={step(2)}
        >
          <span className="whitespace-nowrap">{personal.firstName}</span>{' '}
          <span className="whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
            {personal.lastName}
          </span>
        </h1>

        {/* Terminal typewriter window */}
        <div className="hero-in terminal-window mb-8 max-w-lg" style={step(3)}>
          <div aria-hidden="true" className="terminal-titlebar">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-muted text-xs font-mono">~/portfolio — bash</span>
            <div className="w-12" />
          </div>
          <div className="terminal-body">
            <p aria-hidden="true" className="font-mono text-sm text-muted">
              <span className="text-emerald-400">➜</span>{' '}
              <span className="text-cyan-400 font-medium">~/portfolio</span>{' '}
              <span className="text-muted">$</span>{' '}
              <span className="text-slate-400">cat role.txt</span>
            </p>
            <RoleTypewriter roles={roles} />
          </div>
        </div>

        <p className="hero-in text-slate-400 text-base sm:text-lg max-w-2xl mb-10 leading-relaxed" style={step(4)}>
          {personal.heroBio}
        </p>

        {/* CTAs */}
        <div className="hero-in flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-16" style={step(5)}>
          <a
            href="#projects"
            className="group flex items-center justify-center gap-2 min-h-11 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-[background-color,box-shadow,transform] duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 text-sm"
          >
            View Projects
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href={personal.resume}
            download={RESUME_DOWNLOAD_NAME}
            className="group flex items-center justify-center gap-2 min-h-11 border border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 px-6 py-3 rounded-lg font-semibold transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 text-sm"
          >
            <Download size={15} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
            Download Resume
          </a>
        </div>

        {/* Stats */}
        <div className="hero-in grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl" style={step(6)}>
          {personal.heroStats.map(stat => (
            <div key={stat.label} className="h-full p-4 bg-slate-900/70 rounded-xl border border-slate-800/80 text-center">
              <div className="text-2xl font-bold text-blue-400 font-mono">{renderStat(stat)}</div>
              <div className="text-xs text-muted mt-1 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint (hidden on short screens where it would overlap the stats) */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex [@media(max-height:960px)]:hidden flex-col items-center gap-1.5 text-muted hover:text-slate-300 transition-colors"
        aria-label="Scroll to about section"
      >
        <span className="text-xs font-mono">scroll</span>
        <ChevronDown size={18} className="motion-safe:animate-bounce" />
      </a>
    </section>
  )
}
