interface ParsedWord {
  front: string
  back: string
  notes: string
  tags: string[]
}

interface ParseResult {
  type: 'word-deck' | 'text-passage'
  deckName?: string
  words?: ParsedWord[]
  passage?: { title: string; content: string; author: string; source: string }
  errors: string[]
}

const DELIMITERS = ['\t', ' - ', ': ', '=', ' — ']

export function parseTxt(text: string, fileName: string): ParseResult {
  const errors: string[] = []
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0)

  if (lines.length === 0) {
    return { type: 'text-passage', passage: { title: fileName, content: '', author: '', source: '' }, errors: ['文件为空'] }
  }

  let wordLineCount = 0
  for (const line of lines.slice(0, Math.min(lines.length, 20))) {
    for (const delim of DELIMITERS) {
      const parts = line.split(delim)
      if (parts.length >= 2 && parts[0].trim().length > 0 && parts[1].trim().length > 0) {
        wordLineCount++
        break
      }
    }
  }

  const isWordList = wordLineCount >= Math.min(lines.length, 20) * 0.5

  if (isWordList) {
    const words: ParsedWord[] = []
    for (const line of lines) {
      let matched = false
      for (const delim of DELIMITERS) {
        const idx = line.indexOf(delim)
        if (idx > 0) {
          const front = line.substring(0, idx).trim()
          const back = line.substring(idx + delim.length).trim()
          if (front && back) {
            words.push({ front, back, notes: '', tags: [] })
            matched = true
            break
          }
        }
      }
      if (!matched) {
        errors.push(`无法解析行: "${line.slice(0, 50)}"`)
      }
    }
    return {
      type: 'word-deck',
      deckName: fileName.replace(/\.[^.]+$/, ''),
      words,
      errors,
    }
  }

  const title = lines[0].length <= 100 ? lines[0] : fileName.replace(/\.[^.]+$/, '')
  const content = lines[0].length <= 100 ? lines.slice(1).join('\n') : lines.join('\n')

  return {
    type: 'text-passage',
    passage: { title, content, author: '', source: '' },
    errors,
  }
}
