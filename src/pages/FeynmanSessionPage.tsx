import { useParams, useNavigate } from 'react-router-dom'
import { useFeynmanSession, updateFeynmanStage, saveFeynmanContent, saveFeynmanNote } from '../hooks/useFeynmanSession'
import { useUIStore } from '../store/uiStore'
import FeynmanWorkspace from '../components/feynman/FeynmanWorkspace'
import Spinner from '../components/shared/Spinner'
import type { FeynmanStage } from '../models/feynman'

export default function FeynmanSessionPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const session = useFeynmanSession(sessionId)
  const addToast = useUIStore((s) => s.addToast)

  if (!session) return <Spinner className="py-20" />

  const handleUpdateStage = async (stage: FeynmanStage) => {
    await updateFeynmanStage(session.id, stage)
    if (stage === 'complete') {
      addToast({ message: '费曼学习完成!', type: 'success' })
    }
  }

  const handleSaveContent = async (data: {
    explanation?: string
    gapsNoted?: string
    simplifiedExplanation?: string
    notes?: string
  }) => {
    await saveFeynmanContent(session.id, data)
  }

  const handleSaveNote = async () => {
    await saveFeynmanNote({
      sessionId: session.id,
      title: session.targetTitle,
      content: session.simplifiedExplanation,
      tags: [],
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate('/feynman')}
            className="text-sm text-indigo-600 hover:text-indigo-800 mb-1 cursor-pointer"
          >
            ← 返回费曼学习
          </button>
          <h3 className="text-lg font-semibold text-gray-900">{session.targetTitle}</h3>
        </div>
      </div>

      <FeynmanWorkspace
        session={session}
        onUpdateStage={handleUpdateStage}
        onSaveContent={handleSaveContent}
        onSaveNote={handleSaveNote}
      />
    </div>
  )
}
