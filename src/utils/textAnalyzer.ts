import type { KeyPoint } from '../models/text'

const SUMMARY_KEYWORDS = [
  '因此', '所以', '总之', '综上所述', '由此可见',
  '核心', '关键', '重要', '本质', '根本',
  '第一', '第二', '第三', '首先', '其次', '最后',
  '一方面', '另一方面', '不仅', '而且',
]

export function extractKeyPoints(text: string): KeyPoint[] {
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  if (paragraphs.length === 0) return []

  const points: KeyPoint[] = []
  const firstPara = paragraphs[0]
  const firstSentences = splitSentences(firstPara)
  if (firstSentences.length > 0) {
    const rootPoint: KeyPoint = {
      id: crypto.randomUUID(),
      text: firstSentences[0].slice(0, 80),
      level: 0,
      children: [],
    }

    for (let i = 1; i < paragraphs.length; i++) {
      const para = paragraphs[i]
      const sentences = splitSentences(para)
      const important = sentences.filter((s) =>
        SUMMARY_KEYWORDS.some((kw) => s.includes(kw))
      )

      if (important.length > 0) {
        const paraPoint: KeyPoint = {
          id: crypto.randomUUID(),
          text: para.slice(0, 60) + (para.length > 60 ? '...' : ''),
          level: 1,
          children: important.slice(0, 3).map((s) => ({
            id: crypto.randomUUID(),
            text: s.slice(0, 80),
            level: 2,
            children: [],
          })),
        }
        rootPoint.children.push(paraPoint)
      } else if (sentences.length > 0) {
        rootPoint.children.push({
          id: crypto.randomUUID(),
          text: sentences[0].slice(0, 80),
          level: 1,
          children: [],
        })
      }
    }

    points.push(rootPoint)
  }

  // If no structure was created, fallback to simple bullet list
  if (points.length === 0 || points[0].children.length === 0) {
    const fallback: KeyPoint = {
      id: crypto.randomUUID(),
      text: paragraphs[0].slice(0, 60),
      level: 0,
      children: paragraphs.slice(1).map((p) => ({
        id: crypto.randomUUID(),
        text: p.slice(0, 80),
        level: 1,
        children: [],
      })),
    }
    return [fallback]
  }

  return points
}

function splitSentences(text: string): string[] {
  return text
    .split(/[。！？；\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3)
}
