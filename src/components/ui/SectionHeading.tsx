import { getSection, type SectionId } from '@/lib/sections'

// Section header: the title on the left and a one-line intro on the right. The title comes from
// the section registry so the nav and the headings can't drift. On scroll the title wipes in and
// the intro fades (globals.css); `hr-kicker` and `hr-title` are the hooks for that motion.
export default function SectionHeading({ id, intro }: { id: SectionId; intro: string }) {
  const { title } = getSection(id)
  return (
    <div data-reveal="" className="heading-reveal mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <h2 id={`${id}-heading`} className="hr-title section-title">{title}</h2>
      <p className="hr-kicker section-intro sm:text-right">{intro}</p>
    </div>
  )
}
