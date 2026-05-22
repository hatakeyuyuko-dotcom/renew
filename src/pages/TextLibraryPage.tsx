import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTextPassages, createTextPassage } from '../hooks/useTexts'
import { useUIStore } from '../store/uiStore'
import Modal from '../components/shared/Modal'
import PassageForm from '../components/text/PassageForm'
import EmptyState from '../components/shared/EmptyState'
import Button from '../components/shared/Button'
import type { StudyMode } from '../models/word'

export default function TextLibraryPage() {
  const passages = useTextPassages()
  const [showCreate, setShowCreate] = useState(false)
  const addToast = useUIStore((s) => s.addToast)

  const handleCreate = async (data: { title: string; content: string; author: string; source: string; mode: StudyMode }) => {
    try {
      await createTextPassage({ ...data, tags: [] })
      setShowCreate(false)
      addToast({ message: '篇章添加成功', type: 'success' })
    } catch (e) {
      addToast({ message: `创建失败: ${(e as Error).message}`, type: 'error' })
    }
  }

  const safePassages = passages?.map((p) => ({
    ...p,
    mode: p.mode || 'daily',
    keyPoints: p.keyPoints || [],
    content: p.content || '',
    title: p.title || '(无标题)',
  }))

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">背书</h2>
          <p className="text-gray-500 mt-1">递进式回忆，逐句逐段攻克长篇内容</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>添加篇章</Button>
      </div>

      {safePassages && safePassages.length > 0 ? (
        <div className="space-y-3">
          {safePassages.map((passage) => (
            <Link
              key={passage.id}
              to={`/texts/${passage.id}`}
              className={`bg-white rounded-xl p-5 shadow-sm border transition-all flex items-center justify-between ${
                passage.mode === 'urgent'
                  ? 'border-red-200 hover:border-red-300'
                  : 'border-gray-100 hover:border-emerald-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{passage.title}</h3>
                  {passage.mode === 'urgent' && (
                    <span className="bg-red-100 text-red-600 text-xs font-medium px-1.5 py-0.5 rounded">🔥紧急</span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  {passage.author ? <span>作者: {passage.author}</span> : null}
                  {passage.source ? <span>出处: {passage.source}</span> : null}
                  <span>字数: {passage.content.length}</span>
                  <span>回忆级别: {passage.recallLevel}/5</span>
                </div>
              </div>
              <div className="text-right text-xs text-gray-400 shrink-0 ml-4">
                {!passage.nextReviewAt || passage.nextReviewAt === 0 ? (
                  <span className="text-indigo-500 font-medium">可以开始背诵</span>
                ) : passage.nextReviewAt <= Date.now() ? (
                  <span className="text-red-500 font-medium">需要复习</span>
                ) : (
                  <span>下次复习: {new Date(passage.nextReviewAt).toLocaleDateString('zh-CN')}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📖"
          title="还没有背诵篇章"
          description="添加你想要背诵的文本，开始递进式回忆练习"
          action={<Button onClick={() => setShowCreate(true)}>添加篇章</Button>}
        />
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="添加篇章">
        <PassageForm onSave={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>
    </div>
  )
}
