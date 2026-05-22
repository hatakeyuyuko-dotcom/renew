import type { StudyMode } from './word'

export interface ClozeDeletion {
  id: string
  startIndex: number
  endIndex: number
  answer: string
  hint: string
}

export interface KeyPoint {
  id: string
  text: string
  level: number
  children: KeyPoint[]
}

export interface TextPassage {
  id: string
  title: string
  content: string
  author: string
  source: string
  tags: string[]
  mode: StudyMode
  createdAt: number
  updatedAt: number
  clozeDeletions: ClozeDeletion[]
  keyPoints: KeyPoint[]
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewAt: number
  lastReviewAt: number | null
  lastQuality: number | null
  recallLevel: number
  recallSegments: number
}

export interface TextReviewLog {
  id: string
  passageId: string
  reviewedAt: number
  reviewMode: 'progressive-recall' | 'cloze-only' | 'full-recite'
  recallLevel: number
  quality: number
  timeSpentMs: number
  gapsIdentified: string
  easeBefore: number
  easeAfter: number
  intervalBefore: number
  intervalAfter: number
}
