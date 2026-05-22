import { useState } from 'react'
import type { Deck, StudyMode } from '../../models/word'
import Button from '../shared/Button'

interface DeckFormProps {
  initial?: Deck | null
  onSave: (data: { name: string; description: string; mode: StudyMode }) => void
  onCancel: () => void
}

export default function DeckForm({ initial, onSave, onCancel }: DeckFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [mode, setMode] = useState<StudyMode>(initial?.mode ?? 'daily')

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">牌组名称</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="例如：考研英语核心词汇"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">背诵模式</label>
        <div className="flex gap-3">
          <label
            className={`flex-1 border-2 rounded-lg p-3 cursor-pointer transition-colors ${
              mode === 'daily'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="mode"
              value="daily"
              checked={mode === 'daily'}
              onChange={() => setMode('daily')}
              className="sr-only"
            />
            <div className="text-center">
              <span className="text-lg">📅</span>
              <p className="text-sm font-medium text-gray-700 mt-1">日常模式</p>
              <p className="text-xs text-gray-400 mt-0.5">间隔重复，稳步积累</p>
            </div>
          </label>
          <label
            className={`flex-1 border-2 rounded-lg p-3 cursor-pointer transition-colors ${
              mode === 'urgent'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="mode"
              value="urgent"
              checked={mode === 'urgent'}
              onChange={() => setMode('urgent')}
              className="sr-only"
            />
            <div className="text-center">
              <span className="text-lg">🔥</span>
              <p className="text-sm font-medium text-gray-700 mt-1">紧急模式</p>
              <p className="text-xs text-gray-400 mt-0.5">考前冲刺，高频复习</p>
            </div>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">描述（可选）</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="简单描述这个牌组..."
        />
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>取消</Button>
        <Button onClick={() => onSave({ name, description, mode })} disabled={!name.trim()}>
          {initial ? '保存' : '创建'}
        </Button>
      </div>
    </div>
  )
}
