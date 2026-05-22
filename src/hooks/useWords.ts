import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { Word } from '../models/word'

export function useWords(deckId: string | undefined) {
  return useLiveQuery(() => {
    if (!deckId) return []
    return db.words.where('deckId').equals(deckId).toArray()
  }, [deckId])
}

export async function addWord(
  deckId: string,
  data: Pick<Word, 'front' | 'back' | 'notes' | 'tags'>
): Promise<string> {
  const now = Date.now()
  const id = crypto.randomUUID()
  await db.words.add({
    id,
    deckId,
    front: data.front,
    back: data.back,
    notes: data.notes,
    tags: data.tags,
    createdAt: now,
    updatedAt: now,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewAt: 0,
    lastReviewAt: null,
    lastQuality: null,
  })
  const count = await db.words.where('deckId').equals(deckId).count()
  await db.decks.update(deckId, { wordCount: count, updatedAt: now })
  return id
}

export async function updateWord(id: string, data: Partial<Pick<Word, 'front' | 'back' | 'notes' | 'tags'>>) {
  await db.words.update(id, { ...data, updatedAt: Date.now() })
}

export async function deleteWord(id: string) {
  const word = await db.words.get(id)
  if (word) {
    await db.words.delete(id)
    await db.wordReviewLogs.where('wordId').equals(id).delete()
    const count = await db.words.where('deckId').equals(word.deckId).count()
    await db.decks.update(word.deckId, { wordCount: count, updatedAt: Date.now() })
  }
}

export async function bulkAddWords(
  deckId: string,
  words: Pick<Word, 'front' | 'back' | 'notes' | 'tags'>[]
) {
  const now = Date.now()
  const items: Word[] = words.map((w) => ({
    id: crypto.randomUUID(),
    deckId,
    front: w.front,
    back: w.back,
    notes: w.notes || '',
    tags: w.tags || [],
    createdAt: now,
    updatedAt: now,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewAt: 0,
    lastReviewAt: null,
    lastQuality: null,
  }))
  await db.words.bulkAdd(items)
  const count = await db.words.where('deckId').equals(deckId).count()
  await db.decks.update(deckId, { wordCount: count, updatedAt: now })
}
