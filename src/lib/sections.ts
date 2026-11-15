// Single registry for page sections: nav order, labels and heading titles all come from here.
export const SECTIONS = [
  { id: 'about',        label: 'About',        title: 'About me'                   },
  { id: 'experience',   label: 'Experience',   title: 'Experience'                 },
  { id: 'case-studies', label: 'Case studies', title: 'Case studies'               },
  { id: 'skills',       label: 'Skills',       title: 'Tech stack'                 },
  { id: 'projects',     label: 'Projects',     title: 'Projects'                   },
  { id: 'education',    label: 'Education',    title: 'Education & certifications' },
  { id: 'contact',      label: 'Contact',      title: 'Get in touch'               },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

export const SECTION_IDS: readonly SectionId[] = SECTIONS.map(s => s.id)

export function getSection(id: SectionId) {
  const section = SECTIONS.find(s => s.id === id)
  if (!section) throw new Error(`Unknown section "${id}"`)
  return section
}
