import { Github, Linkedin, Mail, Phone } from 'lucide-react'
import PropTypes from 'prop-types'
import SectionHeading from './SectionHeading'
import { getIcon } from '../lib/icons'

function ContactCard({ href, icon, label, children, external }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="flex items-start gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 hover:border-slate-600/80 hover:bg-slate-900 transition-all duration-200 group"
    >
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <div className="font-medium text-slate-200 text-sm mb-1 group-hover:text-white transition-colors">{label}</div>
        {children}
      </div>
    </a>
  )
}
ContactCard.propTypes = {
  href:     PropTypes.string.isRequired,
  icon:     PropTypes.node.isRequired,
  label:    PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  external: PropTypes.bool,
}
ContactCard.defaultProps = { external: false }

export default function Contact({ personal, whyHireMe }) {
  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 section-alt scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeading number="06" title="Get In Touch" />

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact links */}
          <div className="space-y-3">
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Ready to build something reliable, scalable and offline-ready? Let&apos;s connect!
            </p>

            <ContactCard
              href={`tel:${personal.phones[0].replace(/\s/g, '')}`}
              icon={<Phone size={18} className="text-emerald-400" />}
              label="Phone / WhatsApp"
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
              <span className="text-slate-400 text-sm">Connect with me</span>
            </ContactCard>

            <ContactCard
              href={personal.github}
              icon={<Github size={18} className="text-slate-300" />}
              label="GitHub"
              external
            >
              <span className="text-slate-400 text-sm">Check out my code</span>
            </ContactCard>
          </div>

          {/* Why hire me */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-7">
            <h3 className="font-mono text-xs text-slate-500 mb-6 uppercase tracking-widest">
              <span className="text-blue-400">{'//'}{' '}</span>why_work_with_me()
            </h3>
            <div className="space-y-4">
              {whyHireMe.map(item => {
                const Icon = getIcon(item.iconName)
                return (
                  <div key={item.title} className="flex items-start gap-3">
                    {Icon && <Icon size={14} className="text-blue-400 mt-0.5 shrink-0" />}
                    <p className="text-sm">
                      <span className="text-slate-200 font-semibold">{item.title}:</span>{' '}
                      <span className="text-slate-400">{item.description}</span>
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

Contact.propTypes = {
  personal: PropTypes.shape({
    phones:   PropTypes.arrayOf(PropTypes.string).isRequired,
    email:    PropTypes.string.isRequired,
    linkedin: PropTypes.string.isRequired,
    github:   PropTypes.string.isRequired,
  }).isRequired,
  whyHireMe: PropTypes.arrayOf(PropTypes.shape({
    iconName:    PropTypes.string.isRequired,
    title:       PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  })).isRequired,
}
