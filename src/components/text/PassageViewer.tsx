import { useMemo } from 'react'

interface MaskedToken {
  text: string
  isMasked: boolean
  hint: string
}

function maskText(text: string, level: number): MaskedToken[] {
  const tokens = text.split(/(\s+)/)
  const result: MaskedToken[] = []

  if (level === 0) {
    return tokens.map((t) => ({ text: t, isMasked: false, hint: '' }))
  }

  if (level === 5) {
    return tokens.map((t) => {
      if (/^\s+$/.test(t)) return { text: t, isMasked: false, hint: '' }
      return { text: '_'.repeat(t.length), isMasked: true, hint: t.charAt(0) }
    })
  }

  // Levels 1-4: increasing masking rate
  let nth: number
  switch (level) {
    case 1: nth = 5; break
    case 2: nth = 4; break
    case 3: nth = 3; break
    case 4: nth = 2; break
    default: nth = 5
  }

  let wordIndex = 0
  for (const token of tokens) {
    if (/^\s+$/.test(token) || token.length === 1) {
      result.push({ text: token, isMasked: false, hint: '' })
      continue
    }
    wordIndex++
    const shouldMask = wordIndex % nth === 0
    if (shouldMask) {
      result.push({
        text: '_'.repeat(token.length),
        isMasked: true,
        hint: token.charAt(0),
      })
    } else {
      result.push({ text: token, isMasked: false, hint: '' })
    }
  }

  return result
}

interface PassageViewerProps {
  text: string
  recallLevel: number
  segments?: number
  showHints?: boolean
}

export default function PassageViewer({ text, recallLevel, showHints = true }: PassageViewerProps) {
  const tokens = useMemo(() => maskText(text, recallLevel), [text, recallLevel])

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 leading-relaxed text-lg text-gray-800 font-sans whitespace-pre-wrap">
      {tokens.map((token, i) =>
        token.isMasked ? (
          <span
            key={i}
            className="border-b-2 border-indigo-300 text-indigo-400 px-1 inline-block min-w-[1em]"
            title={showHints ? token.hint : ''}
          >
            {token.text}
          </span>
        ) : (
          <span key={i}>{token.text}</span>
        )
      )}
    </div>
  )
}
