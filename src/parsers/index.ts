import { parseTxt } from './txt'
import { parseCsv } from './csv'
import { parseJson } from './json'
import { parseMarkdown } from './markdown'

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

export type { ParseResult, ParsedWord }

export async function parseFile(file: File): Promise<ParseResult> {
  const text = await file.text()
  const ext = file.name.split('.').pop()?.toLowerCase()

  switch (ext) {
    case 'csv':
      return parseCsv(text, file.name)
    case 'json':
      return parseJson(text, file.name)
    case 'md':
    case 'markdown':
      return parseMarkdown(text, file.name)
    case 'txt':
    default:
      return parseTxt(text, file.name)
  }
}
