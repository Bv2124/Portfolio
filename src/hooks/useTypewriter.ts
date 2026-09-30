'use client'

import { useEffect, useState } from 'react'

interface TypewriterOptions {
  typeSpeed?: number
  deleteSpeed?: number
  pause?: number
}

// Cycles through `words` with a type/delete animation.
// One self-cleaning timeout per tick — the pause at a full word is just a
// longer delay, so there are never stacked/orphaned timers (the original bug).
export default function useTypewriter(
  words: readonly string[],
  { typeSpeed = 100, deleteSpeed = 50, pause = 2000 }: TypewriterOptions = {}
): string {
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!words.length) return undefined

    const word = words[index % words.length] ?? ''
    const atFullWord = !deleting && text === word
    const atEmpty = deleting && text === ''

    let delay = deleting ? deleteSpeed : typeSpeed
    if (atFullWord) delay = pause
    else if (atEmpty) delay = typeSpeed

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
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause])

  return text
}
