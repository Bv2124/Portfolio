import Link from 'next/link'
import { ExternalLink, Lock, ArrowUpRight } from 'lucide-react'
import { Github } from '@/components/ui/BrandIcons'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/motion/Reveal'
import Photo from '@/components/ui/Photo'
import ProjectFilter from './ProjectFilter'
import { IMAGE_WIDTHS } from '@/lib/images'
import type { ProjectWithLinks } from '@/lib/content'

interface ProjectsProps {
  projects: ProjectWithLinks[]
  githubUrl: string
}

const TEXT_LINK =
  'inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-accent-ink underline-offset-4 hover:underline'

// This section sits on the white band, so its cards use the ground colour as their fill.
function ProjectCard({ project }: { project: ProjectWithLinks }) {
  const { screenshot, live } = project

  return (
    <div className="card-lift flex h-full flex-col overflow-hidden rounded-3xl bg-ground">
      {/* The screenshot is the link to the live site: one link, with a visible label. */}
      {screenshot && live && (
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block aspect-[16/10] overflow-hidden border-b border-line bg-tint"
        >
          <Photo
            src={screenshot.src}
            alt={screenshot.alt}
            width={1280}
            height={800}
            widths={IMAGE_WIDTHS.screenshot}
            sizes="(min-width: 1160px) 560px, (min-width: 768px) 46vw, 100vw"
            className="h-full w-full object-cover object-top"
          />
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-2 text-[0.8125rem] font-semibold leading-none text-ink transition-colors group-hover:bg-ink group-hover:text-white">
            Visit site
            <ExternalLink size={14} aria-hidden="true" />
          </span>
        </a>
      )}

      <div className="flex flex-1 flex-col gap-4 p-7">
        <p className="meta flex flex-wrap gap-x-3 gap-y-0.5">
          <span className="font-semibold text-ink">{project.type}</span>
          {live && <span>{new URL(live).host}</span>}
        </p>
        <h3 className="text-[1.4375rem] font-semibold leading-tight text-ink">{project.title}</h3>
        <p className="text-base leading-relaxed text-ink-soft">{project.description}</p>

        <ul aria-label="Technologies" className="flex flex-wrap gap-2">
          {project.tech.map(t => (
            <li key={t} className="chip bg-surface">{t}</li>
          ))}
        </ul>

        <ul className="space-y-2">
          {project.highlights.map(h => (
            <li key={h} className="flex items-start gap-3">
              <span aria-hidden="true" className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="text-[0.9375rem] leading-relaxed text-ink-soft">{h}</span>
            </li>
          ))}
        </ul>

        {project.caseStudies.length > 0 && (
          <div className="flex flex-col">
            {project.caseStudies.map(study => (
              <Link key={study.slug} href={`/case-studies/${study.slug}/`} className={`${TEXT_LINK} items-start py-2`}>
                <span>Case study: {study.title}</span>
                <ArrowUpRight size={16} aria-hidden="true" className="mt-1 shrink-0" />
              </Link>
            ))}
          </div>
        )}

        {/* Only drawn when there is something in it: a project with just a screenshot link has no footer. */}
        {(project.github || (live && !screenshot) || !live) && (
        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-line pt-4">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={TEXT_LINK}>
              <Github size={16} aria-hidden="true" /> Code
            </a>
          )}
          {/* A live site without a screenshot still needs its link; with one, the image is the link. */}
          {live && !screenshot && (
            <a href={live} target="_blank" rel="noopener noreferrer" className={TEXT_LINK}>
              <ExternalLink size={16} aria-hidden="true" /> Live site
            </a>
          )}
          {!project.github && !live && (
            <p className="meta flex min-h-11 items-center gap-2">
              <Lock size={14} aria-hidden="true" className="shrink-0" /> Private project · code not public
            </p>
          )}
        </div>
        )}
      </div>
    </div>
  )
}

export default function Projects({ projects, githubUrl }: ProjectsProps) {
  // Filter tabs are derived from the data: each distinct type present, in order of appearance.
  const typeNames = [...new Set(projects.map(p => p.type))]
  const types = typeNames.map(name => ({ name, count: projects.filter(p => p.type === name).length }))

  return (
    <section id="projects" aria-labelledby="projects-heading" className="section-pad bg-surface">
      <div className="container-page">
        <SectionHeading id="projects" intro="Work from my jobs, and sites I built myself." />

        <ProjectFilter types={types} total={projects.length}>
          {projects.map((project, index) => (
            <div
              key={project.slug}
              data-project-type={project.type}
              className="project-card"
              style={{ viewTransitionName: `project-${project.slug}` }}
            >
              <Reveal index={index % 2} className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            </div>
          ))}
        </ProjectFilter>

        <div className="mt-12 text-center">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-ground text-ink hover:bg-tint"
          >
            <Github size={18} aria-hidden="true" />
            More on GitHub
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
