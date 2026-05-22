import { useState } from 'react'
import { createQuickFeynmanSession } from '../../hooks/useFeynmanSession'
import Button from '../shared/Button'

interface FeynmanInlineProps {
  targetType: 'word' | 'text'
  targetId: string
  targetTitle: string
  originalMaterial: string
  onClose: () => void
  onSaved: () => void
}

export default function FeynmanInline({
  targetType,
  targetId,
  targetTitle,
  originalMaterial,
  onClose,
  onSaved,
}: FeynmanInlineProps) {
  const [step, setStep] = useState<'explain' | 'done'>('explain')
  const [explanation, setExplanation] = useState('')

  const handleSave = async () => {
    if (!explanation.trim()) return
    await createQuickFeynmanSession({
      targetType,
      targetId,
      targetTitle,
      originalMaterial,
      explanation: explanation.trim(),
    })
    setStep('done')
    onSaved()
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-amber-800">
          🧠 费曼解释
        </h4>
        <button onClick={onClose} className="text-amber-500 hover:text-amber-700 cursor-pointer text-sm">
          关闭
        </button>
      </div>

      {step === 'explain' && (
        <>
          <p className="text-xs text-amber-700 mb-2">
            用你自己的话解释"{targetTitle}"，假设你在教一个完全不懂的人
          </p>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={3}
            className="w-full border border-amber-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white"
            placeholder="我的理解是..."
          />
          <div className="flex justify-end mt-2">
            <Button size="sm" onClick={handleSave} disabled={!explanation.trim()}>
              保存解释
            </Button>
          </div>
        </>
      )}

      {step === 'done' && (
        <div className="text-center py-4">
          <span className="text-2xl">✅</span>
          <p className="text-sm text-amber-800 mt-1">费曼解释已保存</p>
          <p className="text-xs text-amber-600 mt-1">
            在"费曼学习"页面查看完整记录
          </p>
        </div>
      )}
    </div>
  )
}
