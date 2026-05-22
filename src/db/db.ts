import Dexie, { type Table } from 'dexie'
import type { Deck, Word, WordReviewLog } from '../models/word'
import type { TextPassage, TextReviewLog } from '../models/text'
import type { FeynmanSession, FeynmanNote } from '../models/feynman'

export class MemorizationDB extends Dexie {
  decks!: Table<Deck, string>
  words!: Table<Word, string>
  wordReviewLogs!: Table<WordReviewLog, string>
  textPassages!: Table<TextPassage, string>
  textReviewLogs!: Table<TextReviewLog, string>
  feynmanSessions!: Table<FeynmanSession, string>
  feynmanNotes!: Table<FeynmanNote, string>

  constructor() {
    super('MemorizationDBv3')

    this.version(1).stores({
      decks: 'id, createdAt, updatedAt',
      words: 'id, deckId, nextReviewAt, easeFactor, [deckId+nextReviewAt]',
      wordReviewLogs: 'id, wordId, deckId, reviewedAt, [wordId+reviewedAt]',
      textPassages: 'id, nextReviewAt, easeFactor, updatedAt',
      textReviewLogs: 'id, passageId, reviewedAt, reviewMode, [passageId+reviewedAt]',
      feynmanSessions: 'id, targetType, targetId, createdAt',
      feynmanNotes: 'id, sessionId, createdAt',
    })

    this.version(2).stores({
      decks: 'id, createdAt, updatedAt, mode',
      words: 'id, deckId, nextReviewAt, easeFactor, [deckId+nextReviewAt]',
      wordReviewLogs: 'id, wordId, deckId, reviewedAt, [wordId+reviewedAt]',
      textPassages: 'id, nextReviewAt, easeFactor, mode, updatedAt',
      textReviewLogs: 'id, passageId, reviewedAt, reviewMode, [passageId+reviewedAt]',
      feynmanSessions: 'id, targetType, targetId, createdAt',
      feynmanNotes: 'id, sessionId, createdAt',
    }).upgrade(async (tx) => {
      await tx.table('decks').toCollection().modify((deck: any) => {
        if (!deck.mode) deck.mode = 'daily'
      })
      await tx.table('textPassages').toCollection().modify((p: any) => {
        if (!p.mode) p.mode = 'daily'
        if (!p.keyPoints) p.keyPoints = []
      })
    })

    this.version(3).stores({
      decks: 'id, createdAt, updatedAt, mode',
      words: 'id, deckId, nextReviewAt, easeFactor, [deckId+nextReviewAt]',
      wordReviewLogs: 'id, wordId, deckId, reviewedAt, [wordId+reviewedAt]',
      textPassages: 'id, nextReviewAt, easeFactor, mode, updatedAt',
      textReviewLogs: 'id, passageId, reviewedAt, reviewMode, [passageId+reviewedAt]',
      feynmanSessions: 'id, targetType, targetId, createdAt',
      feynmanNotes: 'id, sessionId, createdAt',
    }).upgrade(async (tx) => {
      await tx.table('decks').toCollection().modify((deck: any) => {
        if (!deck.mode) deck.mode = 'daily'
      })
      await tx.table('textPassages').toCollection().modify((p: any) => {
        if (!p.mode) p.mode = 'daily'
        if (!p.keyPoints) p.keyPoints = []
      })
    })
  }
}

export const db = new MemorizationDB()
