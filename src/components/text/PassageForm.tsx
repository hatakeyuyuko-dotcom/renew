import { useState } from 'react'
import type { TextPassage } from '../../models/text'
import type { StudyMode } from '../../models/word'
import Button from '../shared/Button'

interface PassageFormProps {
  initial?: TextPassage | null
  onSave: (data: { title: string; content: string; author: string; source: string; mode: StudyMode }) => void
  onCancel: () => void
}

export default function PassageForm({ initial, onSave, onCancel }: PassageFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [author, setAuthor] = useState(initial?.author ?? '')
  const [source, setSource] = useState(initial?.source ?? '')
  const [mode, setMode] = useState<StudyMode>(initial?.mode ?? 'daily')

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="例如：岳阳楼记"
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
              name="passage-mode"
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
              name="passage-mode"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">正文内容</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono"
          placeholder="粘贴要背诵的文本内容..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">作者（可选）</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">出处（可选）</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>取消</Button>
        <Button onClick={() => onSave({ title, content, author, source, mode })} disabled={!title.trim() || !content.trim()}>
          {initial ? '保存' : '添加'}
        </Button>
      </div>
    </div>
  )
}
