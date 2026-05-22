import { useState } from 'react'
import type { FeynmanSession, FeynmanStage } from '../../models/feynman'
import Button from '../shared/Button'

interface FeynmanWorkspaceProps {
  session: FeynmanSession
  onUpdateStage: (stage: FeynmanStage) => void
  onSaveContent: (data: { explanation?: string; gapsNoted?: string; simplifiedExplanation?: string; notes?: string }) => void
  onSaveNote: () => void
}

export default function FeynmanWorkspace({ session, onUpdateStage, onSaveContent, onSaveNote }: FeynmanWorkspaceProps) {
  const [explanation, setExplanation] = useState(session.explanation || '')
  const [gaps, setGaps] = useState(session.gapsNoted || '')
  const [simplified, setSimplified] = useState(session.simplifiedExplanation || '')

  const stages: { key: FeynmanStage; label: string; icon: string }[] = [
    { key: 'prepare', label: '准备', icon: '📖' },
    { key: 'explain', label: '解释', icon: '🗣️' },
    { key: 'gaps', label: '找缺口', icon: '🔍' },
    { key: 'review', label: '回顾', icon: '📝' },
    { key: 'simplify', label: '简化', icon: '✨' },
    { key: 'complete', label: '完成', icon: '✅' },
  ]

  const currentIdx = stages.findIndex((s) => s.key === session.currentStage)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Stage Progress */}
      <div className="flex items-center gap-2 mb-8">
        {stages.slice(0, 5).map((stage, i) => (
          <div key={stage.key} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                i < currentIdx
                  ? 'bg-emerald-500 text-white'
                  : i === currentIdx
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                    : 'bg-gray-200 text-gray-400'
              }`}
            >
              {i < currentIdx ? '✓' : stage.icon}
            </div>
            {i < 4 && (
              <div className={`flex-1 h-0.5 ${i < currentIdx ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-6 text-sm">
        {stages.slice(0, 5).map((stage, i) => (
          <span
            key={stage.key}
            className={`${i === currentIdx ? 'text-indigo-700 font-medium' : 'text-gray-400'}`}
          >
            {stage.label}
          </span>
        ))}
      </div>

      {/* Stage Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[300px]">
        {session.currentStage === 'prepare' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">阅读并理解原始材料</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 leading-relaxed whitespace-pre-wrap">
              {session.originalMaterial}
            </div>
            <div className="mt-6 text-center">
              <Button onClick={() => onUpdateStage('explain')}>
                我已准备好，开始解释
              </Button>
            </div>
          </div>
        )}

        {session.currentStage === 'explain' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">用自己的话解释</h3>
            <p className="text-sm text-gray-500 mb-4">
              假设你在教一个完全不懂这个主题的朋友。用最简单的语言解释核心概念。
              不要回头看原文！
            </p>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={10}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="开始你的解释..."
            />
            <div className="mt-4 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  onSaveContent({ explanation })
                  onUpdateStage('gaps')
                }}
                disabled={!explanation.trim()}
              >
                下一步：识别缺口
              </Button>
            </div>
          </div>
        )}

        {session.currentStage === 'gaps' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">识别知识缺口</h3>
            <p className="text-sm text-gray-500 mb-4">
              对比你的解释和原文，找出薄弱、遗漏或不准确的地方
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">你的解释</h4>
                <div className="bg-amber-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {explanation || '(未填写)'}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">原文</h4>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {session.originalMaterial}
                </div>
              </div>
            </div>
            <textarea
              value={gaps}
              onChange={(e) => setGaps(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
              placeholder="记录你发现的缺口..."
            />
            <div className="mt-4 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => onUpdateStage('explain')}>返回修改</Button>
              <Button
                onClick={() => {
                  onSaveContent({ gapsNoted: gaps })
                  onUpdateStage('review')
                }}
              >
                下一步：回顾原文
              </Button>
            </div>
          </div>
        )}

        {session.currentStage === 'review' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">回顾原文，重点学习缺口</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
              {session.originalMaterial}
            </div>
            {gaps && (
              <div className="bg-red-50 rounded-lg p-4 text-sm text-red-800 mb-4">
                <h4 className="font-medium mb-1">你发现的缺口：</h4>
                <p className="whitespace-pre-wrap">{gaps}</p>
              </div>
            )}
            <div className="text-center">
              <Button onClick={() => onUpdateStage('simplify')}>
                我理解了，开始简化
              </Button>
            </div>
          </div>
        )}

        {session.currentStage === 'simplify' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">用最简单的语言总结</h3>
            <p className="text-sm text-gray-500 mb-4">
              用类比、举例或极简语言写出最终版解释。这将成为你的费曼笔记。
            </p>
            <textarea
              value={simplified}
              onChange={(e) => setSimplified(e.target.value)}
              rows={8}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="最简单的解释..."
            />
            <div className="mt-4 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => onUpdateStage('review')}>重新回顾</Button>
              <Button
                onClick={() => {
                  onSaveContent({ simplifiedExplanation: simplified })
                  onSaveNote()
                  onUpdateStage('complete')
                }}
                disabled={!simplified.trim()}
              >
                完成并保存笔记
              </Button>
            </div>
          </div>
        )}

        {session.currentStage === 'complete' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">费曼学习完成!</h3>
            <p className="text-gray-500 mb-6">
              你已成功完成 {session.targetTitle} 的深度学习
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left mb-6 max-w-md mx-auto">
              <h4 className="font-medium text-gray-700 mb-2">你的简化解释：</h4>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{simplified}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
