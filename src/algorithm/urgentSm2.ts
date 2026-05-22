import { sm2, type SM2Input, type SM2Output } from './sm2'
import type { StudyMode } from '../models/word'

export type { SM2Input, SM2Output }

const MS_PER_HOUR = 3_600_000

export function sm2WithMode(input: SM2Input, mode: StudyMode): SM2Output {
  if (mode === 'urgent') {
    return urgentSm2(input)
  }
  return sm2(input)
}

function urgentSm2(input: SM2Input): SM2Output {
  const { quality } = input
  let { repetitions, easeFactor, interval } = input

  if (quality < 3) {
    return {
      repetitions: 0,
      easeFactor: Math.max(1.3, easeFactor - 0.1),
      interval: 1,
      nextReviewAt: Date.now() + 1 * MS_PER_HOUR,
    }
  }

  const newEF = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  const newReps = repetitions + 1

  let newInterval: number
  if (newReps === 1) {
    newInterval = 4
  } else if (newReps === 2) {
    newInterval = 12
  } else {
    newInterval = Math.round(interval * newEF)
  }

  return {
    repetitions: newReps,
    easeFactor: newEF,
    interval: newInterval,
    nextReviewAt: Date.now() + newInterval * MS_PER_HOUR,
  }
}

export function formatUrgentInterval(hours: number): string {
  if (hours < 24) return `${hours}小时`
  const days = Math.floor(hours / 24)
  const remaining = hours % 24
  if (remaining === 0) return `${days}天`
  return `${days}天${remaining}小时`
}
