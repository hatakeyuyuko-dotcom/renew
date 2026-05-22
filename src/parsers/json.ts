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

export function parseJson(text: string, fileName: string): ParseResult {
  const errors: string[] = []

  try {
    const data = JSON.parse(text)

    if (data.type === 'deck' && Array.isArray(data.words)) {
      return {
        type: 'word-deck',
        deckName: data.name || fileName,
        words: data.words.map((w: any) => ({
          front: String(w.front || ''),
          back: String(w.back || ''),
          notes: w.notes || '',
          tags: w.tags || [],
        })),
        errors,
      }
    }

    if (data.type === 'passage' && data.content) {
      return {
        type: 'text-passage',
        passage: {
          title: data.title || fileName,
          content: data.content,
          author: data.author || '',
          source: data.source || '',
        },
        errors,
      }
    }

    if (Array.isArray(data) && data.length > 0) {
      return {
        type: 'word-deck',
        deckName: fileName.replace(/\.[^.]+$/, ''),
        words: data.map((w: any) => ({
          front: String(w.front || w.word || w.term || ''),
          back: String(w.back || w.definition || w.meaning || ''),
          notes: w.notes || '',
          tags: w.tags || [],
        })),
        errors,
      }
    }

    if (data.content && typeof data.content === 'string') {
      return {
        type: 'text-passage',
        passage: {
          title: data.title || fileName,
          content: data.content,
          author: data.author || '',
          source: data.source || '',
        },
        errors,
      }
    }

    return { type: 'text-passage', passage: { title: fileName, content: text, author: '', source: '' }, errors: ['无法识别的 JSON 格式'] }
  } catch (e) {
    return { type: 'text-passage', passage: { title: fileName, content: text, author: '', source: '' }, errors: [`JSON 解析失败: ${(e as Error).message}`] }
  }
}
