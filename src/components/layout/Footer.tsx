import { Mail } from 'lucide-react'
import { Github, Linkedin } from '@/components/ui/BrandIcons'
import { CurrentYear } from '@/components/ui/Live'
import { BUILD_NOW } from '@/lib/build-time'
import type { Personal } from '@/lib/schema'

type FooterPersonal = Pick<Personal, 'name' | 'footerBio' | 'github' | 'linkedin' | 'email' | 'sourceRepo'>

const ICON_LINK =
  'inline-flex h-11 w-11 items-center justify-center text-muted hover:text-slate-200 transition-colors'

export default function Footer({ personal }: { personal: FooterPersonal }) {
  return (
    <footer className="bg-slate-900/60 border-t border-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="font-mono text-sm text-muted mb-3">
          <span className="text-emerald-400">&quot;{personal.name}&quot;</span>
        </p>
        <p className="text-muted text-sm mb-8 max-w-md mx-auto">{personal.footerBio}</p>

        <div className="flex justify-center gap-2 mb-8">
          <a href={personal.github} target="_blank" rel="noreferrer" className={ICON_LINK} aria-label="GitHub">
            <Github size={20} aria-hidden="true" />
          </a>
          <a href={personal.linkedin} target="_blank" rel="noreferrer" className={ICON_LINK} aria-label="LinkedIn">
            <Linkedin size={20} aria-hidden="true" />
          </a>
          <a href={`mailto:${personal.email}`} className={ICON_LINK} aria-label="Email">
            <Mail size={20} aria-hidden="true" />
          </a>
        </div>

        <p className="text-muted text-xs font-mono">
          © <CurrentYear fallback={BUILD_NOW.getFullYear()} /> {personal.name} &middot; Built with Next.js, TypeScript &amp; Tailwind CSS
          {personal.sourceRepo && (
            <>
              {' '}&middot;{' '}
              <a
                href={personal.sourceRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 underline underline-offset-4 hover:text-white"
              >
                View source
              </a>
            </>
          )}
        </p>
      </div>
    </footer>
  )
}
