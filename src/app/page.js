import data from './data/portfolio.json'
import ScrollProgressBar from './components/ScrollProgressBar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'

const {
  personal, roles, about, experience,
  skills, skillCategories, specialty,
  projects, education, whyHireMe,
} = data

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <ScrollProgressBar />
      <Navbar personal={personal} />

      <main>
        <Hero
          personal={personal}
          roles={roles}
          projectCount={projects.length}
          skillCount={skills.length}
        />
        <About personal={personal} about={about} />
        <Experience experience={experience} />
        <Skills skills={skills} categories={skillCategories} specialty={specialty} />
        <Projects projects={projects} githubUrl={personal.github} />
        <Education education={education} />
        <Contact personal={personal} whyHireMe={whyHireMe} />
      </main>

      <Footer personal={personal} />
    </div>
  )
}
