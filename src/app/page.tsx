import type { Metadata } from 'next'
import { SITE_URL, content, getCaseStudies, getProjects, navPersonal, siteOpenGraph, siteTitle } from '@/lib/content'
import ScrollProgressBar from '@/components/layout/ScrollProgressBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import CaseStudies from '@/components/sections/CaseStudies'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Education from '@/components/sections/Education'
import Contact from '@/components/sections/Contact'
import JsonLd from '@/components/ui/JsonLd'

const { profile, experience, skills, education } = content
const { personal, roles, about, whyHireMe } = profile

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  // Setting `openGraph` replaces the layout's object, so the shared fields are repeated here.
  openGraph: { ...siteOpenGraph, url: '/', title: siteTitle, description: personal.seoDescription },
}

// Structured data: who this site is about, and the site itself.
const personJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: personal.name,
      alternateName: personal.shortName,
      jobTitle: personal.title,
      url: `${SITE_URL}/`,
      email: personal.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: personal.address.locality,
        addressRegion: personal.address.region,
        addressCountry: personal.address.countryCode,
      },
      sameAs: [personal.github, personal.linkedin],
      knowsAbout: skills.groups.flatMap(g => g.items.filter(i => i.core).map(i => i.name)),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: siteTitle,
      publisher: { '@id': `${SITE_URL}/#person` },
    },
  ],
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <JsonLd data={personJsonLd} />
      <ScrollProgressBar />
      <Navbar personal={navPersonal} />

      <main id="main" tabIndex={-1}>
        <Hero personal={personal} resumeDownloadName={navPersonal.resumeDownloadName} roles={roles} />
        <About personal={personal} about={about} />
        <Experience experience={experience} />
        <CaseStudies studies={getCaseStudies()} />
        <Skills groups={skills.groups} />
        <Projects projects={getProjects()} githubUrl={personal.github} />
        <Education education={education} />
        <Contact personal={personal} whyHireMe={whyHireMe} />
      </main>

      <Footer personal={personal} />
    </div>
  )
}
