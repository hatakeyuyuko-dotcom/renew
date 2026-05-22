export type StudyMode = 'daily' | 'urgent'

export interface Deck {
  id: string
  name: string
  description: string
  mode: StudyMode
  createdAt: number
  updatedAt: number
  wordCount: number
  newWordsPerDay: number
  maxReviewsPerDay: number
}

export interface Word {
  id: string
  deckId: string
  front: string
  back: string
  notes: string
  tags: string[]
  createdAt: number
  updatedAt: number
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewAt: number
  lastReviewAt: number | null
  lastQuality: number | null
}

export interface WordReviewLog {
  id: string
  wordId: string
  deckId: string
  reviewedAt: number
  quality: number
  responseTimeMs: number
  easeBefore: number
  easeAfter: number
  intervalBefore: number
  intervalAfter: number
}
