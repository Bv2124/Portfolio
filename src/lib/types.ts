// Shape of src/app/data/portfolio.json.
// Interim hand-written model; replaced by zod-inferred types when content validation lands.

export interface Personal {
  name: string
  firstName: string
  lastName: string
  title: string
  location: string
  email: string
  phones: string[]
  github: string
  linkedin: string
  resume: string
  heroBio: string
  footerBio: string
  usersServed: string
  careerStart: string
  yearsExperienceFallback: number
  copyrightYear: number
  openToWork: boolean
  availability: string
}

export interface Achievement {
  text: string
  color: 'blue' | 'purple' | 'green' | 'orange'
}

export interface About {
  paragraphs: string[]
  achievements: Achievement[]
}

export interface Job {
  company: string
  companyUrl: string
  role: string
  location: string
  start: string
  end: string | null
  summary: string
  tech: string[]
  highlights: string[]
}

export interface Specialty {
  title: string
  text: string
}

export interface Skill {
  name: string
  iconName: string
  color: string
  category: string
  level: string
  levelPercent: number
}

export interface Project {
  title: string
  type: string
  description: string
  tech: string[]
  highlights: string[]
  github: string | null
  live: string | null
}

export interface WhyItem {
  iconName: string
  title: string
  description: string
}

export interface EducationItem {
  type: string
  qualification: string
  institution: string
  period: string
  note: string | null
}

export interface Portfolio {
  personal: Personal
  roles: string[]
  about: About
  experience: Job[]
  specialty: Specialty
  skillCategories: string[]
  skills: Skill[]
  projects: Project[]
  whyHireMe: WhyItem[]
  education: EducationItem[]
}
