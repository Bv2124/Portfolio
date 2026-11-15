import type { ReactNode } from 'react'
import { Mail, Phone } from 'lucide-react'
import { Github, Linkedin } from '@/components/ui/BrandIcons'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/motion/Reveal'
import { getIcon } from '@/lib/icons'
import type { Personal, WhyItem } from '@/lib/schema'

interface ContactCardProps {
  href: string
  icon: ReactNode
  label: string
  children: ReactNode
  external?: boolean
}

function ContactCard({ href, icon, label, children, external = false }: ContactCardProps) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="flex items-start gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 hover:border-slate-600/80 hover:bg-slate-900 transition-[border-color,background-color] duration-200 group"
    >
      <div aria-hidden="true" className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <div className="font-medium text-slate-200 text-sm mb-1 group-hover:text-white transition-colors">{label}</div>
        {children}
      </div>
    </a>
  )
}

interface ContactProps {
  personal: Personal
  whyHireMe: WhyItem[]
}

export default function Contact({ personal, whyHireMe }: ContactProps) {
  const [primaryPhone = ''] = personal.phones

  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-24 px-4 sm:px-6 lg:px-8 section-alt">
      <div className="max-w-6xl mx-auto">
        <SectionHeading id="contact" intro="Open to remote, hybrid or on-site roles." />

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact links */}
          <Reveal className="space-y-3">
            <p className="text-slate-400 text-sm leading-relaxed mb-5">{personal.contactIntro}</p>

            <ContactCard
              href={`tel:${primaryPhone.replace(/\s/g, '')}`}
              icon={<Phone size={18} className="text-emerald-400" />}
              label="Phone"
            >
              {personal.phones.map(p => (
                <span key={p} className="block text-slate-400 text-sm">{p}</span>
              ))}
            </ContactCard>

            <ContactCard
              href={`mailto:${personal.email}`}
              icon={<Mail size={18} className="text-blue-400" />}
              label="Email"
            >
              <span className="text-slate-400 text-sm">{personal.email}</span>
            </ContactCard>

            <ContactCard
              href={personal.linkedin}
              icon={<Linkedin size={18} className="text-blue-400" />}
              label="LinkedIn"
              external
            >
              <span className="text-slate-400 text-sm break-all">{personal.linkedin.replace(/^https?:\/\//, '')}</span>
            </ContactCard>

            <ContactCard
              href={personal.github}
              icon={<Github size={18} className="text-slate-300" />}
              label="GitHub"
              external
            >
              <span className="text-slate-400 text-sm">{personal.github.replace(/^https?:\/\//, '')}</span>
            </ContactCard>
          </Reveal>

          {/* Why hire me */}
          <Reveal index={1} className="bg-slate-900/80 rounded-2xl border border-slate-800 p-7">
            <h3 className="font-mono text-xs text-muted mb-6 uppercase tracking-widest">
              <span className="sr-only">Why work with me</span>
              <span aria-hidden="true"><span className="text-blue-400">{'//'}{' '}</span>why_work_with_me()</span>
            </h3>
            <div className="space-y-4">
              {whyHireMe.map(item => {
                const Icon = getIcon(item.iconName)
                return (
                  <div key={item.title} className="flex items-start gap-3">
                    {Icon && <Icon size={14} aria-hidden="true" className="text-blue-400 mt-0.5 shrink-0" />}
                    <p className="text-sm">
                      <span className="text-slate-200 font-semibold">{item.title}:</span>{' '}
                      <span className="text-slate-400">{item.description}</span>
                    </p>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
