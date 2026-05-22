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

export function parseMarkdown(text: string, fileName: string): ParseResult {
  const errors: string[] = []
  const lines = text.split('\n')

  const tableRows = lines.filter((l) => l.match(/^\|.*\|$/)).length
  const boldDefLines = lines.filter((l) => /^\*\*[^*]+\*\*:/.test(l)).length

  const isWordTable = tableRows >= 3
  const isBoldDefList = boldDefLines >= 3

  if (isWordTable) {
    const words: ParsedWord[] = []
    for (const line of lines) {
      const cells = line.split('|').map((c) => c.trim()).filter(Boolean)
      if (cells.length >= 2 && !cells[0].match(/^-+$/)) {
        const front = cells[0].replace(/\*\*/g, '')
        const back = cells[1].replace(/\*\*/g, '')
        if (front && back && front !== 'word' && front !== '单词') {
          words.push({ front, back, notes: '', tags: [] })
        }
      }
    }
    if (words.length > 0) {
      return {
        type: 'word-deck',
        deckName: fileName.replace(/\.[^.]+$/, ''),
        words,
        errors,
      }
    }
  }

  if (isBoldDefList) {
    const words: ParsedWord[] = []
    for (const line of lines) {
      const match = line.match(/^\*\*([^*]+)\*\*:\s*(.+)/)
      if (match) {
        words.push({ front: match[1].trim(), back: match[2].trim(), notes: '', tags: [] })
      }
    }
    return {
      type: 'word-deck',
      deckName: fileName.replace(/\.[^.]+$/, ''),
      words,
      errors,
    }
  }

  const titleMatch = text.match(/^#\s+(.+)/m)
  const title = titleMatch ? titleMatch[1] : (lines[0] && lines[0].length <= 100 ? lines[0] : fileName.replace(/\.[^.]+$/, ''))

  return {
    type: 'text-passage',
    passage: { title, content: text, author: '', source: '' },
    errors,
  }
}
