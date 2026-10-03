import { content } from '@/lib/content'
import ScrollProgressBar from '@/components/layout/ScrollProgressBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Education from '@/components/sections/Education'
import Contact from '@/components/sections/Contact'

const { profile, experience, skills, projects, education } = content
const { personal, roles, about, specialty, whyHireMe } = profile

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <ScrollProgressBar />
      <Navbar personal={personal} />

      <main id="main" tabIndex={-1}>
        <Hero personal={personal} roles={roles} />
        <About personal={personal} about={about} />
        <Experience experience={experience} />
        <Skills groups={skills.groups} specialty={specialty} />
        <Projects projects={projects} githubUrl={personal.github} />
        <Education education={education} />
        <Contact personal={personal} whyHireMe={whyHireMe} />
      </main>

      <Footer personal={personal} />
    </div>
  )
}
