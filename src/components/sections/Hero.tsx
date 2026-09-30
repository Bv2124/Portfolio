'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, ChevronDown, Download } from 'lucide-react'
import useTypewriter from '@/hooks/useTypewriter'
import useNow from '@/hooks/useNow'
import { yearsSince } from '@/lib/experience'
import type { Personal } from '@/lib/types'

interface HeroProps {
  personal: Personal
  roles: string[]
  projectCount: number
  skillCount: number
}

export default function Hero({ personal, roles, projectCount, skillCount }: HeroProps) {
  const [visible, setVisible] = useState(false)
  const displayText = useTypewriter(roles)
  const now = useNow()

  useEffect(() => { setVisible(true) }, [])

  // Years of experience computed live on the client; JSON value is the
  // pre-mount fallback so SSR and first render match (no hydration warning).
  const years = now ? yearsSince(personal.careerStart, now) : personal.yearsExperienceFallback

  const stats = [
    { value: `${years}+`,            label: 'Years Experience' },
    { value: personal.usersServed,   label: 'Users Served'     },
    { value: `${projectCount}`,      label: 'Projects'         },
    { value: `${skillCount}+`,       label: 'Technologies'     },
  ]

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle grid + glow orbs */}
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-violet-600/6 rounded-full blur-3xl pointer-events-none" />

      <div className={`relative max-w-6xl mx-auto w-full pt-24 pb-16 transition-all duration-1000 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>

        <p className="font-mono text-sm text-slate-500 mb-5">
          <span className="text-blue-400">$</span> hello --world
        </p>

        {personal.openToWork && (
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            {personal.availability}
          </div>
        )}

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-100 mb-6 leading-tight">
          {personal.firstName}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
            {' '}{personal.lastName}
          </span>
        </h1>

        {/* Terminal typewriter window */}
        <div className="terminal-window mb-8 max-w-lg">
          <div className="terminal-titlebar">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-slate-600 text-xs font-mono">~/portfolio — bash</span>
            <div className="w-12" />
          </div>
          <div className="terminal-body">
            <p className="font-mono text-sm text-slate-500">
              <span className="text-emerald-400">➜</span>{' '}
              <span className="text-cyan-400 font-medium">~/portfolio</span>{' '}
              <span className="text-slate-600">$</span>{' '}
              <span className="text-slate-400">cat role.txt</span>
            </p>
            <p className="font-mono text-sm mt-2 min-h-[20px]">
              <span className="text-emerald-300">{displayText}</span>
              <span className="inline-block w-[9px] h-[15px] bg-emerald-400 ml-px align-middle animate-pulse" />
            </p>
          </div>
        </div>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mb-10 leading-relaxed">
          {personal.heroBio}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 mb-16">
          <a
            href="#projects"
            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 text-sm"
          >
            View Projects
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href={personal.resume}
            download
            className="group flex items-center gap-2 border border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 text-sm"
          >
            <Download size={15} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
            Download CV
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
          {stats.map(stat => (
            <div key={stat.label} className="p-4 bg-slate-900/70 rounded-xl border border-slate-800/80 text-center">
              <div className="text-2xl font-bold text-blue-400 font-mono">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors cursor-pointer"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to about section"
      >
        <span className="text-xs font-mono">scroll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </button>
    </section>
  )
}
