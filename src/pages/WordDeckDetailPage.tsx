import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDeck, deleteDeck } from '../hooks/useDeck'
import { useWords, addWord, updateWord, deleteWord } from '../hooks/useWords'
import { useUIStore } from '../store/uiStore'
import Button from '../components/shared/Button'
import Modal from '../components/shared/Modal'
import WordForm from '../components/word/WordForm'
import EmptyState from '../components/shared/EmptyState'
import ConfirmDialog from '../components/shared/ConfirmDialog'
import type { Word } from '../models/word'

export default function WordDeckDetailPage() {
  const { deckId } = useParams()
  const navigate = useNavigate()
  const deck = useDeck(deckId)
  const words = useWords(deckId)
  const addToast = useUIStore((s) => s.addToast)

  const [showAdd, setShowAdd] = useState(false)
  const [editWord, setEditWord] = useState<Word | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  if (!deck) {
    return <div className="text-center py-20 text-gray-400">牌组不存在</div>
  }

  const handleAdd = async (data: { front: string; back: string; notes: string }) => {
    await addWord(deckId!, { ...data, tags: [] })
    setShowAdd(false)
    addToast({ message: '单词添加成功', type: 'success' })
  }

  const handleEdit = async (data: { front: string; back: string; notes: string }) => {
    if (!editWord) return
    await updateWord(editWord.id, { ...data, tags: editWord.tags })
    setEditWord(null)
    addToast({ message: '单词更新成功', type: 'success' })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteWord(deleteTarget)
    setDeleteTarget(null)
    addToast({ message: '单词已删除', type: 'success' })
  }

  const handleDeleteDeck = async () => {
    await deleteDeck(deck.id)
    addToast({ message: '牌组已删除', type: 'success' })
    navigate('/words')
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{deck.name}</h2>
          {deck.description && <p className="text-gray-500 mt-1">{deck.description}</p>}
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate(`/words/${deckId}/review`)}>
            开始复习
          </Button>
          <Button variant="secondary" onClick={() => setShowAdd(true)}>
            添加单词
          </Button>
          <Button variant="danger" onClick={handleDeleteDeck}>
            删除牌组
          </Button>
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-4">
        共 {words?.length ?? 0} 个单词
      </div>

      {words && words.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">单词</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">释义</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">下次复习</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">间隔</th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {words.map((word) => (
                <tr key={word.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{word.front}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{word.back}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {word.nextReviewAt === 0 ? '新词' : new Date(word.nextReviewAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{word.interval}天</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditWord(word)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 mr-3 cursor-pointer"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => setDeleteTarget(word.id)}
                      className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon="📭"
          title="还没有单词"
          description="开始添加单词到这个牌组"
          action={<Button onClick={() => setShowAdd(true)}>添加单词</Button>}
        />
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="添加单词">
        <WordForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>

      <Modal isOpen={!!editWord} onClose={() => setEditWord(null)} title="编辑单词">
        <WordForm initial={editWord} onSave={handleEdit} onCancel={() => setEditWord(null)} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="确认删除"
        message="这个单词将被永久删除，不可恢复。"
        confirmLabel="删除"
      />
    </div>
  )
}
