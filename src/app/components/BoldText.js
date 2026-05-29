import PropTypes from 'prop-types'

// Renders inline **bold** markdown from a plain string.
export default function BoldText({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/)
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={part} className="text-slate-200 font-semibold">{part}</strong>
      : part
  )
}

BoldText.propTypes = { text: PropTypes.string.isRequired }
