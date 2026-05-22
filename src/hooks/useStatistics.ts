import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'

export function useReviewStats() {
  return useLiveQuery(async () => {
    const now = Date.now()
    const dayMs = 86_400_000

    // Word stats
    const totalWords = await db.words.count()
    const wordsReviewedToday = await db.wordReviewLogs
      .where('reviewedAt')
      .between(now - dayMs, now)
      .count()

    // Text stats
    const totalTexts = await db.textPassages.count()
    const textsReviewedToday = await db.textReviewLogs
      .where('reviewedAt')
      .between(now - dayMs, now)
      .count()

    // Last 7 days review counts
    const dailyReviews: { date: string; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const dayStart = now - (i + 1) * dayMs
      const dayEnd = now - i * dayMs

      const wordCount = await db.wordReviewLogs
        .where('reviewedAt')
        .between(dayStart, dayEnd)
        .count()

      const textCount = await db.textReviewLogs
        .where('reviewedAt')
        .between(dayStart, dayEnd)
        .count()

      const date = new Date(dayEnd)
      dailyReviews.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        count: wordCount + textCount,
      })
    }

    // Due counts
    const newWords = await db.words.where('nextReviewAt').equals(0).count()
    const dueWords = await db.words.where('nextReviewAt').between(1, now).count()
    const newTexts = await db.textPassages.where('nextReviewAt').equals(0).count()
    const dueTexts = await db.textPassages.where('nextReviewAt').between(1, now).count()

    return {
      totalWords,
      totalTexts,
      wordsReviewedToday,
      textsReviewedToday,
      totalDue: newWords + dueWords + newTexts + dueTexts,
      dailyReviews,
    }
  })
}

export function useDailyStreak(): number {
  const logs = useLiveQuery(async () => {
    const allWordLogs = await db.wordReviewLogs.orderBy('reviewedAt').reverse().limit(365).toArray()
    const allTextLogs = await db.textReviewLogs.orderBy('reviewedAt').reverse().limit(365).toArray()
    return [...allWordLogs, ...allTextLogs].sort((a, b) => b.reviewedAt - a.reviewedAt)
  })

  if (!logs || logs.length === 0) return 0

  const dayMs = 86_400_000
  let streak = 0
  let checkDate = new Date()
  checkDate.setHours(0, 0, 0, 0)

  // Build set of dates that have reviews
  const reviewDates = new Set<string>()
  for (const log of logs) {
    const d = new Date(log.reviewedAt)
    d.setHours(0, 0, 0, 0)
    reviewDates.add(d.toISOString().split('T')[0])
  }

  // Count consecutive days backwards from today
  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0]
    if (reviewDates.has(dateStr)) {
      streak++
      checkDate = new Date(checkDate.getTime() - dayMs)
    } else {
      // Check if today hasn't had reviews yet (don't break streak for today)
      if (i === 0) {
        checkDate = new Date(checkDate.getTime() - dayMs)
        continue
      }
      break
    }
  }

  return streak
}
