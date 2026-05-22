import { useState } from 'react'
import type { Word } from '../../models/word'
import Button from '../shared/Button'

interface WordFormProps {
  initial?: Word | null
  onSave: (data: { front: string; back: string; notes: string }) => void
  onCancel: () => void
}

export default function WordForm({ initial, onSave, onCancel }: WordFormProps) {
  const [front, setFront] = useState(initial?.front ?? '')
  const [back, setBack] = useState(initial?.back ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">单词 / 问题面</label>
        <input
          type="text"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="输入单词..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">释义 / 答案面</label>
        <textarea
          value={back}
          onChange={(e) => setBack(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="输入释义..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">笔记（可选）</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="额外笔记..."
        />
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>取消</Button>
        <Button onClick={() => onSave({ front, back, notes })} disabled={!front.trim() || !back.trim()}>
          {initial ? '保存' : '添加'}
        </Button>
      </div>
    </div>
  )
}
