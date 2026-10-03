import { getSection, type SectionId } from '@/lib/sections'

// Numbered section header — "01. About Me" with an accent underline.
// Number and title come from the section registry so nav and headings can't drift.
export default function SectionHeading({ id }: { id: SectionId }) {
  const { number, title } = getSection(id)
  return (
    <div className="mb-14">
      <p aria-hidden="true" className="font-mono text-xs text-blue-400 mb-2 tracking-widest">{number}.</p>
      <h2 id={`${id}-heading`} className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">{title}</h2>
      <div className="w-14 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500" />
    </div>
  )
}
