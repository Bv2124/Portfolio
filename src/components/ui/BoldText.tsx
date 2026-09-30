// Renders inline **bold** markdown from a plain string.
export default function BoldText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/)
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={part} className="text-slate-200 font-semibold">{part}</strong>
      : part
  )
}
