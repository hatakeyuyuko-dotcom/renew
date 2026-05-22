import { db } from '../db/db'
import type { Word } from '../models/word'
import type { TextPassage } from '../models/text'

export async function getDueWords(deckId: string, limit?: number): Promise<Word[]> {
  const now = Date.now()

  const newWords = await db.words
    .where('[deckId+nextReviewAt]')
    .between([deckId, 0], [deckId, 0])
    .toArray()

  const dueWords = await db.words
    .where('[deckId+nextReviewAt]')
    .between([deckId, 1], [deckId, now])
    .toArray()

  // Check if this deck is in urgent mode
  const deck = await db.decks.get(deckId)
  const isUrgent = deck?.mode === 'urgent'

  let allDue = [...dueWords, ...newWords]

  if (isUrgent) {
    // Urgent mode: sort by lastQuality (weak items first), then by nextReviewAt
    allDue.sort((a, b) => {
      const qA = a.lastQuality ?? 0
      const qB = b.lastQuality ?? 0
      if (qA !== qB) return qA - qB
      return a.nextReviewAt - b.nextReviewAt
    })
  }

  if (limit && allDue.length > limit) {
    return allDue.slice(0, limit)
  }

  return allDue
}

export async function getDueTexts(limit?: number): Promise<TextPassage[]> {
  const now = Date.now()

  const newTexts = await db.textPassages
    .where('nextReviewAt')
    .equals(0)
    .toArray()

  const dueTexts = await db.textPassages
    .where('nextReviewAt')
    .between(1, now)
    .toArray()

  const allDue = [...dueTexts, ...newTexts]

  // Separate urgent texts and sort weak items first
  const urgentTexts = allDue.filter((t) => t.mode === 'urgent')
  const dailyTexts = allDue.filter((t) => t.mode !== 'urgent')
  urgentTexts.sort((a, b) => {
    const qA = a.lastQuality ?? 0
    const qB = b.lastQuality ?? 0
    if (qA !== qB) return qA - qB
    return a.nextReviewAt - b.nextReviewAt
  })

  const sorted = [...urgentTexts, ...dailyTexts]

  if (limit && sorted.length > limit) {
    return sorted.slice(0, limit)
  }

  return sorted
}

export async function getTotalDueCount(): Promise<{ words: number; texts: number }> {
  const now = Date.now()

  const newWords = await db.words.where('nextReviewAt').equals(0).count()
  const dueWords = await db.words.where('nextReviewAt').between(1, now).count()

  const newTexts = await db.textPassages.where('nextReviewAt').equals(0).count()
  const dueTexts = await db.textPassages.where('nextReviewAt').between(1, now).count()

  return {
    words: newWords + dueWords,
    texts: newTexts + dueTexts,
  }
}
