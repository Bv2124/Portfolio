'use client'

import { useEffect, useState } from 'react'

interface TypewriterOptions {
  typeSpeed?: number
  deleteSpeed?: number
  pause?: number
  // When false no timers run and the current text stays put (off-screen, reduced motion…).
  enabled?: boolean
}

// Cycles through `words` with a type/delete animation.
// Starts on the first word fully typed, so the server HTML already contains a real role.
// One self-cleaning timeout per tick — the pause at a full word is just a longer delay,
// so there are never stacked/orphaned timers.
export default function useTypewriter(
  words: readonly string[],
  { typeSpeed = 65, deleteSpeed = 35, pause = 1600, enabled = true }: TypewriterOptions = {}
): string {
  const [text, setText] = useState(words[0] ?? '')
  const [index, setIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!enabled || !words.length) return undefined

    const word = words[index % words.length] ?? ''
    const atFullWord = !deleting && text === word
    const atEmpty = deleting && text === ''

    let delay = deleting ? deleteSpeed : typeSpeed
    if (atFullWord) delay = pause

    const timer = setTimeout(() => {
      if (atFullWord) {
        setDeleting(true)
      } else if (atEmpty) {
        setDeleting(false)
        setIndex(i => (i + 1) % words.length)
      } else {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause, enabled])

  return text
}
