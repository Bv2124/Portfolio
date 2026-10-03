// Single registry for page sections: nav order, heading numbers and titles all come from here.
export const SECTIONS = [
  { id: 'about',        label: 'About',        title: 'About Me'                   },
  { id: 'experience',   label: 'Experience',   title: 'Experience'                 },
  { id: 'case-studies', label: 'Case Studies', title: 'Case Studies'               },
  { id: 'skills',       label: 'Skills',       title: 'Tech Stack'                 },
  { id: 'projects',     label: 'Projects',     title: 'Featured Projects'          },
  { id: 'education',    label: 'Education',    title: 'Education & Certifications' },
  { id: 'contact',      label: 'Contact',      title: 'Get In Touch'               },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

export const SECTION_IDS: readonly SectionId[] = SECTIONS.map(s => s.id)

export function getSection(id: SectionId) {
  const index = SECTIONS.findIndex(s => s.id === id)
  const section = SECTIONS[index]
  if (!section) throw new Error(`Unknown section "${id}"`)
  return { ...section, number: String(index + 1).padStart(2, '0') }
}
