import { useState } from 'react'
import { useDecks, createDeck } from '../hooks/useDeck'
import Modal from '../components/shared/Modal'
import DeckForm from '../components/word/DeckForm'
import DeckCard from '../components/word/DeckCard'
import EmptyState from '../components/shared/EmptyState'
import Button from '../components/shared/Button'
import { useUIStore } from '../store/uiStore'
import type { StudyMode } from '../models/word'

export default function WordDecksPage() {
  const decks = useDecks()
  const [showCreate, setShowCreate] = useState(false)
  const addToast = useUIStore((s) => s.addToast)

  const handleCreate = async (data: { name: string; description: string; mode: StudyMode }) => {
    await createDeck(data)
    setShowCreate(false)
    addToast({ message: '牌组创建成功', type: 'success' })
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">背单词</h2>
          <p className="text-gray-500 mt-1">基于间隔重复的抽认卡系统</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>新建牌组</Button>
      </div>

      {decks && decks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📝"
          title="还没有牌组"
          description="创建你的第一个单词牌组，开始科学的间隔重复背诵"
          action={<Button onClick={() => setShowCreate(true)}>新建牌组</Button>}
        />
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="新建牌组">
        <DeckForm
          onSave={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </div>
  )
}
