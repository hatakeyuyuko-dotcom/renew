import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTextPassage, updateTextPassage } from '../hooks/useTexts'
import { createQuickFeynmanSession } from '../hooks/useFeynmanSession'
import { sm2WithMode } from '../algorithm/urgentSm2'
import { db } from '../db/db'
import PassageViewer from '../components/text/PassageViewer'
import RecallProgressBar from '../components/text/RecallProgressBar'
import SelfAssessmentForm from '../components/text/SelfAssessmentForm'
import SessionSummary from '../components/review/SessionSummary'
import Button from '../components/shared/Button'
import Spinner from '../components/shared/Spinner'
import AudioPlayer from '../components/shared/AudioPlayer'
import { useSpeech } from '../hooks/useSpeech'

export default function TextReviewPage() {
  const { passageId } = useParams()
  const navigate = useNavigate()
  const passage = useTextPassage(passageId)

  const [phase, setPhase] = useState<'loading' | 'recall' | 'assess' | 'end'>('loading')
  const [recallLevel, setRecallLevel] = useState(0)
  const [totalReviewed, setTotalReviewed] = useState(0)
  const [qualityCounts, setQualityCounts] = useState<Record<number, number>>({})
  const [feynmanText, setFeynmanText] = useState('')
  const speech = useSpeech()
  const initiatedRef = useRef(false)

  useEffect(() => {
    if (passage) {
      setRecallLevel(passage.recallLevel)
      setPhase('recall')
    }
  }, [passage])

  // Auto-play initiated by user
  const handlePlay = useCallback(() => {
    initiatedRef.current = true
    speech.speak(passage?.content || '')
  }, [passage, speech])

  const handleSelfAssess = useCallback(async (quality: number, gaps: string) => {
    if (!passage) return

    speech.stop()
    const now = Date.now()
    const sm2Result = sm2WithMode({
      quality,
      repetitions: passage.repetitions,
      easeFactor: passage.easeFactor,
      interval: passage.interval,
    }, passage.mode || 'daily')

    const newRecallLevel = quality >= 4
      ? Math.min(5, recallLevel + 1)
      : quality >= 3
        ? recallLevel
        : Math.max(0, recallLevel - 1)

    if (feynmanText.trim()) {
      await createQuickFeynmanSession({
        targetType: 'text',
        targetId: passage.id,
        targetTitle: passage.title,
        originalMaterial: passage.content.slice(0, 500),
        explanation: feynmanText.trim(),
      })
    }

    await updateTextPassage(passage.id, {
      repetitions: sm2Result.repetitions,
      easeFactor: sm2Result.easeFactor,
      interval: sm2Result.interval,
      nextReviewAt: sm2Result.nextReviewAt,
      lastReviewAt: now,
      lastQuality: quality,
      recallLevel: newRecallLevel,
    })

    await db.textReviewLogs.add({
      id: crypto.randomUUID(),
      passageId: passage.id,
      reviewedAt: now,
      reviewMode: 'progressive-recall',
      recallLevel,
      quality,
      timeSpentMs: 0,
      gapsIdentified: gaps,
      easeBefore: passage.easeFactor,
      easeAfter: sm2Result.easeFactor,
      intervalBefore: passage.interval,
      intervalAfter: sm2Result.interval,
    })

    setQualityCounts((prev) => ({ ...prev, [quality]: (prev[quality] || 0) + 1 }))
    setTotalReviewed((prev) => prev + 1)
    setFeynmanText('')

    if (quality >= 4 && recallLevel >= 5) {
      setPhase('end')
    } else {
      setRecallLevel(quality >= 4 ? Math.min(5, recallLevel + 1) : Math.max(0, recallLevel - 1))
      setPhase('recall')
    }
  }, [passage, recallLevel, feynmanText, speech])

  const handleAdvance = useCallback(() => {
    if (recallLevel >= 5) {
      setPhase('end')
    } else {
      setRecallLevel((prev) => Math.min(5, prev + 1))
    }
  }, [recallLevel])

  if (!passage) return <div className="text-center py-20 text-gray-400">篇章不存在</div>
  if (phase === 'loading') return <Spinner className="py-20" />

  const isUrgent = passage.mode === 'urgent'

  if (phase === 'end') {
    return (
      <div className="max-w-lg mx-auto">
        <SessionSummary
          total={totalReviewed || 1}
          qualityCounts={qualityCounts}
          onFinish={() => navigate(`/texts/${passageId}`)}
          onRestart={() => {
            setRecallLevel(passage.recallLevel)
            setTotalReviewed(0)
            setQualityCounts({})
            setPhase('recall')
          }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-lg font-semibold text-gray-900">{passage.title}</h3>
          {isUrgent && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium animate-pulse">
              🔥 紧急模式
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400">递进式回忆背诵</p>
      </div>

      {/* Audio player */}
      <div className="mb-4">
        <AudioPlayer
          state={speech.state}
          rate={speech.rate}
          onPlay={handlePlay}
          onPause={speech.pause}
          onResume={speech.resume}
          onStop={speech.stop}
          onRateChange={speech.setRate}
          label="听书背诵"
        />
      </div>

      <RecallProgressBar currentLevel={recallLevel} readonly />

      <div className="mb-6 mt-4">
        <PassageViewer
          text={passage.content}
          recallLevel={recallLevel}
          showHints={true}
        />
      </div>

      <div className="text-center text-sm text-gray-400 mb-6">
        尝试回忆被遮蔽的部分，然后在下方评估你的表现
      </div>

      {phase === 'recall' && (
        <>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-amber-800">🧠 费曼复述（选填）</span>
              <span className="text-xs text-amber-500">不看原文，用自己的话复述段落大意</span>
            </div>
            <textarea
              value={feynmanText}
              onChange={(e) => setFeynmanText(e.target.value)}
              rows={2}
              className="w-full border border-amber-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white resize-none"
              placeholder="用最简单的话复述这段话的核心内容..."
            />
          </div>

          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            <Button variant="secondary" onClick={handleAdvance}>
              {recallLevel >= 5 ? '完成' : '进入下一级别'}
            </Button>
            <Button onClick={() => setPhase('assess')}>
              评估掌握程度
            </Button>
          </div>
        </>
      )}

      {phase === 'assess' && (
        <SelfAssessmentForm onSubmit={handleSelfAssess} />
      )}
    </div>
  )
}
