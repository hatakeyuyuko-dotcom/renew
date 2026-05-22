import { useReducer, useCallback } from 'react'
import { db } from '../db/db'
import { sm2WithMode } from '../algorithm/urgentSm2'
import { getDueWords, getDueTexts } from '../algorithm/scheduling'
import type { Word } from '../models/word'
import type { TextPassage } from '../models/text'

type SessionType = 'word' | 'text'

type ReviewState =
  | { phase: 'idle' }
  | { phase: 'loading' }
  | { phase: 'active'; items: (Word | TextPassage)[]; index: number; sessionType: SessionType; isFlipped: boolean; startTime: number }
  | { phase: 'show-answer'; items: (Word | TextPassage)[]; index: number }
  | { phase: 'self-assess'; items: (Word | TextPassage)[]; index: number }
  | { phase: 'end'; results: SessionResult[] }

interface SessionResult {
  itemId: string
  quality: number
  front?: string
}

type Action =
  | { type: 'START_LOAD' }
  | { type: 'LOADED_WORDS'; items: Word[] }
  | { type: 'LOADED_TEXTS'; items: TextPassage[] }
  | { type: 'FLIP' }
  | { type: 'SHOW_ANSWER' }
  | { type: 'RATE'; quality: number }
  | { type: 'NEXT_ITEM'; isLast: boolean }
  | { type: 'SELF_ASSESS' }
  | { type: 'SKIP' }
  | { type: 'END_SESSION' }

function reducer(state: ReviewState, action: Action): ReviewState {
  switch (action.type) {
    case 'START_LOAD':
      return { phase: 'loading' }
    case 'LOADED_WORDS':
      if (action.items.length === 0) return { phase: 'end', results: [] }
      return { phase: 'active', items: action.items, index: 0, sessionType: 'word', isFlipped: false, startTime: Date.now() }
    case 'LOADED_TEXTS':
      if (action.items.length === 0) return { phase: 'end', results: [] }
      return { phase: 'active', items: action.items, index: 0, sessionType: 'text', isFlipped: false, startTime: Date.now() }
    case 'FLIP':
      if (state.phase !== 'active') return state
      return { ...state, isFlipped: true }
    case 'SHOW_ANSWER':
      if (state.phase !== 'active') return state
      return { phase: 'show-answer', items: state.items, index: state.index }
    case 'SELF_ASSESS':
      if (state.phase !== 'active') return state
      return { phase: 'self-assess', items: state.items, index: state.index }
    case 'NEXT_ITEM': {
      if (state.phase !== 'show-answer' && state.phase !== 'self-assess') return state
      const nextIdx = state.index + 1
      if (nextIdx >= state.items.length) return { phase: 'end', results: [] }
      return { phase: 'active', items: state.items, index: nextIdx, sessionType: 'word', isFlipped: false, startTime: Date.now() }
    }
    case 'END_SESSION':
      return { phase: 'end', results: [] }
    default:
      return state
  }
}

export function useReviewSession() {
  const [state, dispatch] = useReducer(reducer, { phase: 'idle' })
  const resultsRef: { current: SessionResult[] } = { current: [] }

  const startWordReview = useCallback(async (deckId: string) => {
    dispatch({ type: 'START_LOAD' })
    const items = await getDueWords(deckId)
    dispatch({ type: 'LOADED_WORDS', items })
  }, [])

  const startTextReview = useCallback(async () => {
    dispatch({ type: 'START_LOAD' })
    const items = await getDueTexts()
    dispatch({ type: 'LOADED_TEXTS', items })
  }, [])

  const flipCard = useCallback(() => {
    dispatch({ type: 'FLIP' })
  }, [])

  const showAnswer = useCallback(() => {
    dispatch({ type: 'SHOW_ANSWER' })
  }, [])

  const selfAssess = useCallback(() => {
    dispatch({ type: 'SELF_ASSESS' })
  }, [])

  const submitRating = useCallback(async (quality: number) => {
    if (state.phase !== 'show-answer' && state.phase !== 'self-assess') return

    const item = state.items[state.index]
    const now = Date.now()

    let mode = 'daily' as 'daily' | 'urgent'
    if ('deckId' in item) {
      const deck = await db.decks.get((item as Word).deckId)
      mode = deck?.mode || 'daily'
    } else {
      mode = (item as TextPassage).mode || 'daily'
    }

    const sm2Result = sm2WithMode({
      quality,
      repetitions: (item as any).repetitions ?? 0,
      easeFactor: (item as any).easeFactor ?? 2.5,
      interval: (item as any).interval ?? 0,
    }, mode)

    resultsRef.current.push({
      itemId: item.id,
      quality,
      front: (item as any).front,
    })

    const isWord = 'deckId' in item
    if (isWord) {
      const word = item as Word
      await db.words.update(word.id, {
        repetitions: sm2Result.repetitions,
        easeFactor: sm2Result.easeFactor,
        interval: sm2Result.interval,
        nextReviewAt: sm2Result.nextReviewAt,
        lastReviewAt: now,
        lastQuality: quality,
      })
      await db.wordReviewLogs.add({
        id: crypto.randomUUID(),
        wordId: word.id,
        deckId: word.deckId,
        reviewedAt: now,
        quality,
        responseTimeMs: 0,
        easeBefore: word.easeFactor,
        easeAfter: sm2Result.easeFactor,
        intervalBefore: word.interval,
        intervalAfter: sm2Result.interval,
      })
    } else {
      const text = item as TextPassage
      ;(db.textPassages as any).update(text.id, {
        repetitions: sm2Result.repetitions,
        easeFactor: sm2Result.easeFactor,
        interval: sm2Result.interval,
        nextReviewAt: sm2Result.nextReviewAt,
        lastReviewAt: now,
        lastQuality: quality,
      })
      await db.textReviewLogs.add({
        id: crypto.randomUUID(),
        passageId: text.id,
        reviewedAt: now,
        reviewMode: 'progressive-recall',
        recallLevel: text.recallLevel,
        quality,
        timeSpentMs: 0,
        gapsIdentified: '',
        easeBefore: text.easeFactor,
        easeAfter: sm2Result.easeFactor,
        intervalBefore: text.interval,
        intervalAfter: sm2Result.interval,
      })
    }

    const nextIdx = state.index + 1
    if (nextIdx >= state.items.length) {
      dispatch({ type: 'END_SESSION' })
    } else {
      dispatch({ type: 'NEXT_ITEM', isLast: nextIdx >= state.items.length - 1 })
    }
  }, [state])

  const skipItem = useCallback(() => {
    submitRating(0)
  }, [submitRating])

  const endSession = useCallback(() => {
    dispatch({ type: 'END_SESSION' })
  }, [])

  return {
    state,
    currentItem: state.phase === 'active' || state.phase === 'show-answer' || state.phase === 'self-assess'
      ? state.items[state.index] : null,
    currentIndex: state.phase === 'active' || state.phase === 'show-answer' || state.phase === 'self-assess'
      ? state.index : 0,
    totalCount: state.phase === 'active' || state.phase === 'show-answer' || state.phase === 'self-assess'
      ? state.items.length : 0,
    isFlipped: state.phase === 'active' ? state.isFlipped : false,
    showAnswerPhase: state.phase === 'show-answer',
    selfAssessPhase: state.phase === 'self-assess',
    isEnded: state.phase === 'end',
    isLoading: state.phase === 'loading',
    startWordReview,
    startTextReview,
    flipCard,
    showAnswer,
    selfAssess,
    submitRating,
    skipItem,
    endSession,
  }
}
