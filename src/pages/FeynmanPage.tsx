import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFeynmanSessions, useFeynmanNotes, createFeynmanSession } from '../hooks/useFeynmanSession'
import Button from '../components/shared/Button'
import Modal from '../components/shared/Modal'

export default function FeynmanPage() {
  const sessions = useFeynmanSessions()
  const notes = useFeynmanNotes()
  const navigate = useNavigate()
  const [showNew, setShowNew] = useState(false)
  const [topicTitle, setTopicTitle] = useState('')
  const [topicContent, setTopicContent] = useState('')

  const handleCreate = async () => {
    if (!topicTitle.trim() || !topicContent.trim()) return
    const id = await createFeynmanSession({
      targetType: 'standalone',
      targetId: null,
      targetTitle: topicTitle,
      originalMaterial: topicContent,
    })
    setShowNew(false)
    setTopicTitle('')
    setTopicContent('')
    navigate(`/feynman/session/${id}`)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">费曼学习法</h2>
          <p className="text-gray-500 mt-1">用自己的话解释，找出知识缺口，真正理解</p>
        </div>
        <Button onClick={() => setShowNew(true)}>新建费曼会话</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">历史会话</h3>
          {sessions && sessions.length > 0 ? (
            <div className="space-y-2">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate(`/feynman/session/${s.id}`)}
                  className="bg-white rounded-lg p-4 border border-gray-100 hover:border-indigo-200 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{s.targetTitle}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      s.currentStage === 'complete'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {s.currentStage === 'complete' ? '已完成' : s.currentStage}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(s.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-400 py-8 text-center">暂无会话，开始你的第一个费曼学习</div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">费曼笔记</h3>
          {notes && notes.length > 0 ? (
            <div className="space-y-2">
              {notes.map((n) => (
                <div key={n.id} className="bg-white rounded-lg p-4 border border-gray-100">
                  <h4 className="font-medium text-gray-900">{n.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{n.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(n.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-400 py-8 text-center">暂无笔记</div>
          )}
        </div>
      </div>

      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="新建费曼学习会话">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">学习主题</label>
            <input
              type="text"
              value={topicTitle}
              onChange={(e) => setTopicTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="例如：SM-2 间隔重复算法"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">原始学习材料</label>
            <textarea
              value={topicContent}
              onChange={(e) => setTopicContent(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="粘贴你要深入理解的内容..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowNew(false)}>取消</Button>
            <Button onClick={handleCreate} disabled={!topicTitle.trim() || !topicContent.trim()}>
              开始学习
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
