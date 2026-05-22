import Papa from 'papaparse'

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

export function parseCsv(text: string, fileName: string): ParseResult {
  const errors: string[] = []
  const result = Papa.parse(text, { header: true, skipEmptyLines: true })

  if (result.errors.length > 0) {
    result.errors.forEach((e) => errors.push(`CSV解析错误: ${e.message}`))
  }

  const headers = result.meta.fields ?? []
  const rows = result.data as Record<string, string>[]

  if (rows.length === 0) {
    return { type: 'word-deck', deckName: fileName, words: [], errors: ['CSV 文件为空'] }
  }

  const frontCol =
    headers.find((h) => ['front', 'word', 'term', '单词', '词汇', '问题'].includes(h.toLowerCase())) ?? headers[0]
  const backCol =
    headers.find((h) => ['back', 'definition', 'meaning', '释义', '定义', '答案'].includes(h.toLowerCase())) ?? headers[1]

  if (!frontCol || !backCol) {
    return { type: 'word-deck', deckName: fileName, words: [], errors: ['无法识别单词/释义列'] }
  }

  const words: ParsedWord[] = []
  for (const row of rows) {
    const front = row[frontCol]?.trim()
    const back = row[backCol]?.trim()
    if (front && back) {
      words.push({
        front,
        back,
        notes: row['notes'] || row['note'] || row['笔记'] || '',
        tags: row['tags'] ? row['tags'].split(',').map((t) => t.trim()) : [],
      })
    }
  }

  return {
    type: 'word-deck',
    deckName: fileName.replace(/\.[^.]+$/, ''),
    words,
    errors,
  }
}
