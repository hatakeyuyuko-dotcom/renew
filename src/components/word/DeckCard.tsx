import { Link } from 'react-router-dom'
import type { Deck } from '../../models/word'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'

export default function DeckCard({ deck }: { deck: Deck }) {
  const dueCount = useLiveQuery(async () => {
    const now = Date.now()
    const newWords = await db.words.where('[deckId+nextReviewAt]').between([deck.id, 0], [deck.id, 0]).count()
    const dueWords = await db.words.where('[deckId+nextReviewAt]').between([deck.id, 1], [deck.id, now]).count()
    return newWords + dueWords
  }, [deck.id])

  const isUrgent = deck.mode === 'urgent'

  return (
    <Link
      to={`/words/${deck.id}`}
      className={`bg-white rounded-xl p-5 shadow-sm border transition-all block ${
        isUrgent
          ? 'border-red-300 hover:border-red-400 hover:shadow-md'
          : 'border-gray-100 hover:border-indigo-200 hover:shadow'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">{deck.name}</h3>
          {isUrgent && (
            <span className="bg-red-100 text-red-600 text-xs font-medium px-1.5 py-0.5 rounded">🔥紧急</span>
          )}
        </div>
        {dueCount !== undefined && dueCount > 0 && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isUrgent ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
          }`}>
            {dueCount} 待复习
          </span>
        )}
      </div>
      {deck.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{deck.description}</p>
      )}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>{deck.wordCount} 个单词</span>
        <span>新词/天: {deck.newWordsPerDay}</span>
      </div>
    </Link>
  )
}
