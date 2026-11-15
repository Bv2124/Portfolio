import { Mail } from 'lucide-react'
import { Github, Linkedin } from '@/components/ui/BrandIcons'
import { CurrentYear } from '@/components/ui/Live'
import { BUILD_NOW } from '@/lib/build-time'
import type { Personal } from '@/lib/schema'

type FooterPersonal = Pick<Personal, 'name' | 'footerBio' | 'github' | 'linkedin' | 'email' | 'sourceRepo'>

const ICON_LINK =
  'inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-tint hover:text-ink'

export default function Footer({ personal }: { personal: FooterPersonal }) {
  return (
    <footer className="bg-ground">
      <div className="container-page py-10">
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
          <div className="max-w-md">
            <p className="font-semibold text-ink">{personal.name}</p>
            <p className="meta mt-1">{personal.footerBio}</p>
          </div>

          <div className="flex items-center gap-1">
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
        </div>

        <p className="meta mt-8 border-t border-line pt-6">
          © <CurrentYear fallback={BUILD_NOW.getFullYear()} /> {personal.name}
          {personal.sourceRepo && (
            <>
              {' '}&middot;{' '}
              <a
                href={personal.sourceRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-ink"
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
