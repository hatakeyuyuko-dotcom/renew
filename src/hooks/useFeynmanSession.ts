import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { FeynmanSession, FeynmanStage } from '../models/feynman'

export function useFeynmanSessions() {
  return useLiveQuery(() => db.feynmanSessions.orderBy('createdAt').reverse().toArray())
}

export function useFeynmanSession(sessionId: string | undefined) {
  return useLiveQuery(() => {
    if (!sessionId) return undefined
    return db.feynmanSessions.get(sessionId)
  }, [sessionId])
}

export function useFeynmanNotes() {
  return useLiveQuery(() => db.feynmanNotes.orderBy('createdAt').reverse().toArray())
}

export async function createFeynmanSession(data: {
  targetType: 'word' | 'text' | 'standalone'
  targetId: string | null
  targetTitle: string
  originalMaterial: string
}): Promise<string> {
  const id = crypto.randomUUID()
  await db.feynmanSessions.add({
    id,
    targetType: data.targetType,
    targetId: data.targetId,
    targetTitle: data.targetTitle,
    createdAt: Date.now(),
    completedAt: null,
    currentStage: 'prepare',
    originalMaterial: data.originalMaterial,
    explanation: '',
    gapsNoted: '',
    simplifiedExplanation: '',
    notes: '',
  })
  return id
}

export async function createQuickFeynmanSession(data: {
  targetType: 'word' | 'text'
  targetId: string
  targetTitle: string
  originalMaterial: string
  explanation: string
}): Promise<string> {
  const id = crypto.randomUUID()
  await db.feynmanSessions.add({
    id,
    targetType: data.targetType,
    targetId: data.targetId,
    targetTitle: data.targetTitle,
    createdAt: Date.now(),
    completedAt: Date.now(),
    currentStage: 'complete',
    originalMaterial: data.originalMaterial,
    explanation: data.explanation,
    gapsNoted: '',
    simplifiedExplanation: data.explanation,
    notes: '',
  })
  return id
}

export async function updateFeynmanStage(sessionId: string, stage: FeynmanStage) {
  const updates: Partial<FeynmanSession> = { currentStage: stage }
  if (stage === 'complete') {
    updates.completedAt = Date.now()
  }
  await db.feynmanSessions.update(sessionId, updates)
}

export async function saveFeynmanContent(
  sessionId: string,
  data: { explanation?: string; gapsNoted?: string; simplifiedExplanation?: string; notes?: string }
) {
  await db.feynmanSessions.update(sessionId, data)
}

export async function saveFeynmanNote(data: {
  sessionId: string
  title: string
  content: string
  tags: string[]
}): Promise<string> {
  const id = crypto.randomUUID()
  await db.feynmanNotes.add({
    id,
    sessionId: data.sessionId,
    title: data.title,
    content: data.content,
    createdAt: Date.now(),
    tags: data.tags,
  })
  return id
}
