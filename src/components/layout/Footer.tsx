'use client'

import { Github, Linkedin, Mail } from 'lucide-react'
import useNow from '@/hooks/useNow'
import type { Personal } from '@/lib/types'

type FooterPersonal = Pick<Personal, 'name' | 'footerBio' | 'github' | 'linkedin' | 'email' | 'copyrightYear'>

export default function Footer({ personal }: { personal: FooterPersonal }) {
  const now = useNow()
  // Live current year, with the JSON value as the pre-mount fallback.
  const year = now ? now.getFullYear() : personal.copyrightYear

  return (
    <footer className="bg-slate-900/60 border-t border-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="font-mono text-sm text-slate-500 mb-3">
          <span className="text-emerald-400">&quot;{personal.name}&quot;</span>
        </p>
        <p className="text-slate-600 text-sm mb-8 max-w-md mx-auto">{personal.footerBio}</p>

        <div className="flex justify-center gap-6 mb-8">
          <a href={personal.github} target="_blank" rel="noreferrer"
            className="text-slate-600 hover:text-slate-300 transition-colors" aria-label="GitHub">
            <Github size={20} />
          </a>
          <a href={personal.linkedin} target="_blank" rel="noreferrer"
            className="text-slate-600 hover:text-slate-300 transition-colors" aria-label="LinkedIn">
            <Linkedin size={20} />
          </a>
          <a href={`mailto:${personal.email}`}
            className="text-slate-600 hover:text-slate-300 transition-colors" aria-label="Email">
            <Mail size={20} />
          </a>
        </div>

        <p className="text-slate-500 text-xs font-mono">
          © {year} {personal.name} &middot; Built with Next.js &amp; Tailwind CSS
        </p>
      </div>
    </footer>
  )
}
