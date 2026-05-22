import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { TextPassage } from '../models/text'
import type { StudyMode } from '../models/word'

export function useTextPassages() {
  return useLiveQuery(() => db.textPassages.orderBy('updatedAt').reverse().toArray())
}

export function useTextPassage(passageId: string | undefined) {
  return useLiveQuery(() => {
    if (!passageId) return undefined
    return db.textPassages.get(passageId)
  }, [passageId])
}

export async function createTextPassage(
  data: Pick<TextPassage, 'title' | 'content' | 'author' | 'source' | 'tags'> & { mode?: StudyMode }
): Promise<string> {
  const now = Date.now()
  const id = crypto.randomUUID()
  await db.textPassages.add({
    id,
    title: data.title,
    content: data.content,
    author: data.author || '',
    source: data.source || '',
    tags: data.tags || [],
    mode: data.mode || 'daily',
    createdAt: now,
    updatedAt: now,
    clozeDeletions: [],
    keyPoints: [],
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewAt: 0,
    lastReviewAt: null,
    lastQuality: null,
    recallLevel: 0,
    recallSegments: 20,
  })
  return id
}

export async function updateTextPassage(id: string, data: Partial<Pick<TextPassage, 'title' | 'content' | 'author' | 'source' | 'tags' | 'clozeDeletions' | 'recallLevel' | 'keyPoints' | 'mode' | 'repetitions' | 'easeFactor' | 'interval' | 'nextReviewAt' | 'lastReviewAt' | 'lastQuality'>>) {
  await (db.textPassages as any).update(id, { ...data, updatedAt: Date.now() })
}

export async function deleteTextPassage(id: string) {
  await db.textPassages.delete(id)
  await db.textReviewLogs.where('passageId').equals(id).delete()
}
