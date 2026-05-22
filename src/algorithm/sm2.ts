export interface SM2Input {
  quality: number
  repetitions: number
  easeFactor: number
  interval: number
}

export interface SM2Output {
  repetitions: number
  easeFactor: number
  interval: number
  nextReviewAt: number
}

const MS_PER_DAY = 86_400_000

export function sm2(input: SM2Input): SM2Output {
  const { quality } = input
  let { repetitions, easeFactor, interval } = input

  if (quality < 3) {
    return {
      repetitions: 0,
      easeFactor: Math.max(1.3, easeFactor - 0.2),
      interval: 1,
      nextReviewAt: Date.now() + 1 * MS_PER_DAY,
    }
  }

  const newEF = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  const newReps = repetitions + 1

  let newInterval: number
  if (newReps === 1) {
    newInterval = 1
  } else if (newReps === 2) {
    newInterval = 6
  } else {
    newInterval = Math.round(interval * newEF)
  }

  return {
    repetitions: newReps,
    easeFactor: newEF,
    interval: newInterval,
    nextReviewAt: Date.now() + newInterval * MS_PER_DAY,
  }
}

export const QUALITY_LABELS: Record<number, string> = {
  0: '完全忘记',
  1: '错误，看答案后想起',
  2: '错误，但答案很简单',
  3: '正确但很困难',
  4: '正确但有些犹豫',
  5: '完全掌握',
}
