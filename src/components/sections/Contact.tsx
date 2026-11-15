import type { ReactNode } from 'react'
import { Mail, Phone } from 'lucide-react'
import { Github, Linkedin } from '@/components/ui/BrandIcons'
import Reveal from '@/components/motion/Reveal'
import { getIcon } from '@/lib/icons'
import { getSection } from '@/lib/sections'
import type { Personal, WhyItem } from '@/lib/schema'

interface PillProps {
  href: string
  icon: ReactNode
  children: ReactNode
  external?: boolean
}

// A large white-outlined pill. Everything here sits on the dark panel.
function Pill({ href, icon, children, external = false }: PillProps) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="inline-flex min-h-14 items-center gap-3 rounded-full border-2 border-white/70 px-6 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-ink"
    >
      <span aria-hidden="true" className="shrink-0">{icon}</span>
      {children}
    </a>
  )
}

interface ContactProps {
  personal: Personal
  whyHireMe: WhyItem[]
}

export default function Contact({ personal, whyHireMe }: ContactProps) {
  const [primaryPhone = ''] = personal.phones
  const { title } = getSection('contact')

  return (
    // The one dark moment on the page. `on-ink` makes the focus ring white; `contact-panel`
    // swaps it to dark-on-white when printed (browsers drop background colours).
    <section id="contact" aria-labelledby="contact-heading" className="contact-panel on-ink section-pad bg-ink text-white">
      <div className="container-page grid gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <Reveal>
          <h2 id="contact-heading" className="section-title !text-white">{title}</h2>
          <p className="mt-5 max-w-xl text-2xl font-medium leading-snug sm:text-3xl">{personal.contactIntro}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Pill href={`mailto:${personal.email}`} icon={<Mail size={20} />}>{personal.email}</Pill>
            <Pill href={`tel:${primaryPhone.replace(/\s/g, '')}`} icon={<Phone size={20} />}>{primaryPhone}</Pill>
            <Pill href={personal.linkedin} icon={<Linkedin size={20} />} external>LinkedIn</Pill>
            <Pill href={personal.github} icon={<Github size={20} />} external>GitHub</Pill>
          </div>
        </Reveal>

        <Reveal index={1}>
          <h3 className="text-lg font-semibold">Why work with me</h3>
          <ul className="mt-6 space-y-6">
            {whyHireMe.map(item => {
              const Icon = getIcon(item.iconName)
              return (
                <li key={item.title} className="flex items-start gap-4">
                  {Icon && <Icon size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-white/70" />}
                  <p className="text-base leading-relaxed text-white/80">
                    <span className="font-semibold text-white">{item.title}.</span>{' '}
                    {item.description}
                  </p>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
