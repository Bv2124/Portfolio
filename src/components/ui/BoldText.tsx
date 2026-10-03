import type { ReactNode } from 'react'

interface BoldTextProps {
  text: string
  // Replaces {{name}} placeholders with nodes (e.g. a live-updating years value).
  tokens?: Record<string, ReactNode>
}

function withTokens(text: string, tokens: Record<string, ReactNode>): ReactNode[] {
  return text.split(/(\{\{\w+\}\})/).map((piece, i) => {
    const name = /^\{\{(\w+)\}\}$/.exec(piece)?.[1]
    return name !== undefined && name in tokens ? <span key={i}>{tokens[name]}</span> : piece
  })
}

// Renders inline **bold** markdown from a plain string.
export default function BoldText({ text, tokens = {} }: BoldTextProps) {
  return text.split(/\*\*(.*?)\*\*/).map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="text-slate-200 font-semibold">{withTokens(part, tokens)}</strong>
      : <span key={i}>{withTokens(part, tokens)}</span>
  )
}
