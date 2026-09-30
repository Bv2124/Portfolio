'use client'

import { useEffect, useState } from 'react'
import { Download, Menu, X } from 'lucide-react'
import useScrolled from '@/hooks/useScrolled'
import useActiveSection from '@/hooks/useActiveSection'
import type { Personal } from '@/lib/types'

const NAV_LINKS = [
  { id: 'about',      label: 'About'      },
  { id: 'experience', label: 'Experience' },
  { id: 'skills',     label: 'Skills'     },
  { id: 'projects',   label: 'Projects'   },
  { id: 'education',  label: 'Education'  },
  { id: 'contact',    label: 'Contact'    },
] as const
const SECTION_IDS = NAV_LINKS.map(l => l.id)

export default function Navbar({ personal }: { personal: Pick<Personal, 'firstName' | 'resume'> }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled = useScrolled(20)
  const active = useActiveSection(SECTION_IDS)

  // Close the mobile drawer on Escape.
  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 shadow-xl shadow-slate-950/60'
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1 group bg-transparent border-none p-0 cursor-pointer"
          >
            <span className="text-slate-500 font-mono text-sm group-hover:text-slate-400 transition-colors">~/</span>
            <span className="font-bold text-slate-100 font-mono group-hover:text-white transition-colors">
              {personal.firstName.toLowerCase()}
            </span>
            <span className="text-blue-400 font-mono font-bold">.dev</span>
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`px-3 py-2 rounded-lg text-sm font-mono transition-all duration-200 ${
                  active === link.id
                    ? 'text-blue-400 bg-blue-400/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <span className="text-blue-400/50 mr-1">0{i + 1}.</span>
                {link.label}
              </a>
            ))}
            <a
              href={personal.resume}
              download
              className="ml-3 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-500/40 text-blue-400 hover:bg-blue-400/10 hover:border-blue-400/60 transition-all duration-200"
            >
              <Download size={13} />
              Resume
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-slate-900/98 backdrop-blur-md border-b border-slate-800 px-6 pb-6">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 py-3.5 text-slate-300 hover:text-blue-400 transition-colors font-mono text-sm border-b border-slate-800/50 last:border-0"
            >
              <span className="text-blue-400/50 text-xs">0{i + 1}.</span>
              {link.label}
            </a>
          ))}
          <a
            href={personal.resume}
            download
            className="mt-4 flex items-center gap-2 text-blue-400 font-mono text-sm"
          >
            <Download size={14} />
            Download Resume
          </a>
        </div>
      )}
    </nav>
  )
}
