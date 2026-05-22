import { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useReviewSession } from '../hooks/useReviewSession'
import { useDeck } from '../hooks/useDeck'
import { createQuickFeynmanSession } from '../hooks/useFeynmanSession'
import WordCard from '../components/word/WordCard'
import ReviewRating from '../components/word/ReviewRating'
import SessionProgress from '../components/review/SessionProgress'
import SessionSummary from '../components/review/SessionSummary'
import Button from '../components/shared/Button'
import Spinner from '../components/shared/Spinner'
import AudioPlayer from '../components/shared/AudioPlayer'
import { useSpeech } from '../hooks/useSpeech'
import type { Word } from '../models/word'

export default function WordReviewPage() {
  const { deckId } = useParams()
  const navigate = useNavigate()
  const session = useReviewSession()
  const deck = useDeck(deckId)
  const [qualityCounts, setQualityCounts] = useState<Record<number, number>>({})
  const [feynmanText, setFeynmanText] = useState('')
  const speech = useSpeech()

  useEffect(() => {
    if (deckId) {
      session.startWordReview(deckId)
    }
  }, [deckId])

  const word = session.currentItem as Word | null

  useEffect(() => {
    speech.stop()
  }, [word?.id])

  const speakWord = useCallback(() => {
    if (!word) return
    const text = session.isFlipped ? word.back : word.front
    speech.speak(text)
  }, [word, session.isFlipped, speech])

  const handleRating = useCallback(async (quality: number) => {
    setQualityCounts((prev) => ({ ...prev, [quality]: (prev[quality] || 0) + 1 }))
    const w = session.currentItem as Word | null
    if (w && feynmanText.trim()) {
      await createQuickFeynmanSession({
        targetType: 'word',
        targetId: w.id,
        targetTitle: w.front,
        originalMaterial: `${w.front}: ${w.back}`,
        explanation: feynmanText.trim(),
      })
    }
    setFeynmanText('')
    speech.stop()
    await session.submitRating(quality)
  }, [session, feynmanText, speech])

  if (session.isLoading) return <Spinner className="py-20" />

  if (session.isEnded) {
    return (
      <div className="max-w-lg mx-auto">
        <SessionSummary
          total={session.totalCount}
          qualityCounts={qualityCounts}
          onFinish={() => navigate(`/words/${deckId}`)}
          onRestart={() => {
            setQualityCounts({})
            session.startWordReview(deckId!)
          }}
        />
      </div>
    )
  }

  if (!word) return <Spinner className="py-20" />

  const isUrgent = deck?.mode === 'urgent'

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <span className="text-sm text-gray-500">{deck?.name || '复习'}</span>
          {isUrgent && (
            <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium animate-pulse">
              🔥 紧急模式
            </span>
          )}
        </div>
        <AudioPlayer
          variant="button"
          state={speech.state}
          rate={speech.rate}
          onPlay={speakWord}
          onPause={speech.pause}
          onResume={speech.resume}
          onStop={speech.stop}
          onRateChange={speech.setRate}
        />
      </div>

      <SessionProgress current={session.currentIndex + 1} total={session.totalCount} />

      <WordCard
        word={word}
        isFlipped={session.isFlipped}
        onClick={() => session.showAnswer()}
      />

      {!session.showAnswerPhase && (
        <div className="text-center mt-4 space-y-2">
          <Button variant="ghost" onClick={() => session.showAnswer()}>
            显示答案
          </Button>
        </div>
      )}

      {session.showAnswerPhase && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-amber-800">🧠 费曼解释（选填）</span>
              <span className="text-xs text-amber-500">用自己的话解释，真正理解这个词</span>
            </div>
            <textarea
              value={feynmanText}
              onChange={(e) => setFeynmanText(e.target.value)}
              rows={2}
              className="w-full border border-amber-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white resize-none"
              placeholder={`用最简单的语言解释"${word.front}"...`}
            />
          </div>

          <ReviewRating onRate={handleRating} />
        </div>
      )}
    </div>
  )
}
