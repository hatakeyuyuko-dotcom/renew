import { useState } from 'react'
import { QUALITY_LABELS } from '../../algorithm/sm2'

interface SelfAssessmentFormProps {
  onSubmit: (quality: number, gaps: string) => void
}

export default function SelfAssessmentForm({ onSubmit }: SelfAssessmentFormProps) {
  const [gaps, setGaps] = useState('')

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">自我评估掌握程度</p>
        <div className="flex gap-2 flex-wrap">
          {[0, 1, 2, 3, 4, 5].map((q) => (
            <button
              key={q}
              onClick={() => onSubmit(q, gaps)}
              className={`px-3 py-2 rounded-lg text-sm font-medium text-white cursor-pointer transition-colors ${
                q < 3
                  ? 'bg-red-500 hover:bg-red-600'
                  : q < 4
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              {q} - {QUALITY_LABELS[q]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">发现的薄弱点（可选）</label>
        <textarea
          value={gaps}
          onChange={(e) => setGaps(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="记录背诵中遇到的困难..."
        />
      </div>
    </div>
  )
}
