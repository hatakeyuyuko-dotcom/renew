import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { Deck, StudyMode } from '../models/word'

export function useDecks() {
  return useLiveQuery(() => db.decks.orderBy('updatedAt').reverse().toArray())
}

export function useDeck(deckId: string | undefined) {
  return useLiveQuery(() => {
    if (!deckId) return undefined
    return db.decks.get(deckId)
  }, [deckId])
}

export async function createDeck(data: Pick<Deck, 'name' | 'description'> & { mode?: StudyMode }): Promise<string> {
  const now = Date.now()
  const id = crypto.randomUUID()
  await db.decks.add({
    id,
    name: data.name,
    description: data.description,
    mode: data.mode || 'daily',
    createdAt: now,
    updatedAt: now,
    wordCount: 0,
    newWordsPerDay: 20,
    maxReviewsPerDay: 100,
  })
  return id
}

export async function updateDeck(id: string, data: Partial<Pick<Deck, 'name' | 'description' | 'newWordsPerDay' | 'maxReviewsPerDay' | 'mode'>>) {
  await db.decks.update(id, { ...data, updatedAt: Date.now() })
}

export async function deleteDeck(id: string) {
  await db.words.where('deckId').equals(id).delete()
  await db.wordReviewLogs.where('deckId').equals(id).delete()
  await db.decks.delete(id)
}
