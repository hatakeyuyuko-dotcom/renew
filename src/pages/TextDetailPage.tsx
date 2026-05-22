import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTextPassage, updateTextPassage, deleteTextPassage } from '../hooks/useTexts'
import { useUIStore } from '../store/uiStore'
import { extractKeyPoints } from '../utils/textAnalyzer'
import Button from '../components/shared/Button'
import Modal from '../components/shared/Modal'
import PassageForm from '../components/text/PassageForm'
import PassageViewer from '../components/text/PassageViewer'
import RecallProgressBar from '../components/text/RecallProgressBar'
import KeyPointsViewer from '../components/text/KeyPointsViewer'
import MindMapView from '../components/text/MindMapView'
import BatchWordExtractor from '../components/text/BatchWordExtractor'
import ConfirmDialog from '../components/shared/ConfirmDialog'
import type { StudyMode } from '../models/word'

type DetailTab = 'preview' | 'keypoints' | 'mindmap' | 'extract'

export default function TextDetailPage() {
  const { passageId } = useParams()
  const navigate = useNavigate()
  const passage = useTextPassage(passageId)
  const addToast = useUIStore((s) => s.addToast)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [previewLevel, setPreviewLevel] = useState(0)
  const [activeTab, setActiveTab] = useState<DetailTab>('preview')
  const [showExtract, setShowExtract] = useState(false)

  if (!passage) {
    return <div className="text-center py-20 text-gray-400">篇章不存在</div>
  }

  const handleEdit = async (data: { title: string; content: string; author: string; source: string; mode: StudyMode }) => {
    await updateTextPassage(passage.id, data)
    setShowEdit(false)
    addToast({ message: '篇章更新成功', type: 'success' })
  }

  const handleToggleMode = async () => {
    const newMode: StudyMode = (passage.mode || 'daily') === 'daily' ? 'urgent' : 'daily'
    await updateTextPassage(passage.id, { mode: newMode })
    addToast({ message: newMode === 'urgent' ? '已切换到紧急模式' : '已切换到日常模式', type: 'success' })
  }

  const handleDelete = async () => {
    await deleteTextPassage(passage.id)
    navigate('/texts')
    addToast({ message: '篇章已删除', type: 'success' })
  }

  const handleLevelChange = async (level: number) => {
    setPreviewLevel(level)
  }

  const handleExtractKeyPoints = async () => {
    const points = extractKeyPoints(passage.content)
    await updateTextPassage(passage.id, { keyPoints: points })
    addToast({ message: '要点提炼完成', type: 'success' })
    setActiveTab('keypoints')
  }

  const tabs: { key: DetailTab; label: string; icon: string }[] = [
    { key: 'preview', label: '预览', icon: '📖' },
    { key: 'keypoints', label: '要点', icon: '📋' },
    { key: 'mindmap', label: '导图', icon: '🧠' },
    { key: 'extract', label: '提词', icon: '🔤' },
  ]

  const isUrgent = passage.mode === 'urgent'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{passage.title}</h2>
            {isUrgent && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                🔥 紧急模式
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {passage.author && `作者: ${passage.author} · `}
            {passage.source && `出处: ${passage.source} · `}
            字数: {passage.content.length}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={handleToggleMode}
            className={`text-sm font-medium px-3 py-1.5 rounded-lg border-2 transition-colors cursor-pointer ${
              isUrgent
                ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                : 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            {isUrgent ? '🔥 紧急模式' : '📅 日常模式'}
          </button>
          <Button onClick={() => navigate(`/texts/${passageId}/review`)}>
            开始背诵
          </Button>
          <Button variant="secondary" onClick={() => setShowEdit(true)}>编辑</Button>
          <Button variant="danger" onClick={() => setShowDelete(true)}>删除</Button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key)
              if (tab.key === 'extract') setShowExtract(true)
            }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'preview' && (
        <div>
          <div className="mb-4">
            <RecallProgressBar
              currentLevel={previewLevel}
              onChangeLevel={handleLevelChange}
            />
          </div>
          <PassageViewer
            text={passage.content}
            recallLevel={previewLevel}
          />
        </div>
      )}

      {activeTab === 'keypoints' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">要点总结</h3>
            <Button size="sm" onClick={handleExtractKeyPoints}>
              {passage.keyPoints && passage.keyPoints.length > 0 ? '重新提炼' : '提炼要点'}
            </Button>
          </div>
          <KeyPointsViewer points={passage.keyPoints || []} />
        </div>
      )}

      {activeTab === 'mindmap' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">思维导图</h3>
            <Button size="sm" onClick={handleExtractKeyPoints}>
              {passage.keyPoints && passage.keyPoints.length > 0 ? '重新提炼' : '生成导图'}
            </Button>
          </div>
          <MindMapView points={passage.keyPoints || []} />
        </div>
      )}

      {activeTab === 'extract' && showExtract && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">批量提取单词</h3>
          <BatchWordExtractor
            text={passage.content}
            onClose={() => setShowExtract(false)}
            onImported={(count) => {
              addToast({ message: `成功导入 ${count} 个单词`, type: 'success' })
              setShowExtract(false)
            }}
          />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-4 mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">背诵进度</h4>
        <div className="grid grid-cols-4 gap-4 text-center text-sm">
          <div>
            <div className="text-lg font-bold text-indigo-600">{passage.repetitions}</div>
            <div className="text-gray-400">复习次数</div>
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-600">
              {isUrgent ? `${passage.interval}h` : `${passage.interval}天`}
            </div>
            <div className="text-gray-400">当前间隔</div>
          </div>
          <div>
            <div className="text-lg font-bold text-amber-600">{passage.recallLevel}/5</div>
            <div className="text-gray-400">回忆级别</div>
          </div>
          <div>
            <div className="text-lg font-bold text-rose-600">{passage.mode === 'urgent' ? '紧急' : '日常'}</div>
            <div className="text-gray-400">模式</div>
          </div>
        </div>
      </div>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="编辑篇章">
        <PassageForm initial={passage} onSave={handleEdit} onCancel={() => setShowEdit(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="删除篇章"
        message="确认删除此篇章？所有相关的背诵记录也将被删除。"
      />
    </div>
  )
}
