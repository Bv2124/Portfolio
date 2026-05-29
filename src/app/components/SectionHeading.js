import PropTypes from 'prop-types'

// Numbered section header — "01. About Me" with an accent underline.
export default function SectionHeading({ number, title }) {
  return (
    <div className="mb-14">
      <p className="font-mono text-xs text-blue-400/70 mb-2 tracking-widest">{number}.</p>
      <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">{title}</h2>
      <div className="w-14 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500" />
    </div>
  )
}

SectionHeading.propTypes = {
  number: PropTypes.string.isRequired,
  title:  PropTypes.string.isRequired,
}
