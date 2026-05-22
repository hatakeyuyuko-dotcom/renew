import Button from '../shared/Button'

interface SessionSummaryProps {
  total: number
  qualityCounts: Record<number, number>
  onFinish: () => void
  onRestart: () => void
}

export default function SessionSummary({ total, qualityCounts, onFinish, onRestart }: SessionSummaryProps) {
  const correct = (qualityCounts[3] || 0) + (qualityCounts[4] || 0) + (qualityCounts[5] || 0)
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <div className="flex flex-col items-center py-12 text-center">
      <span className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}</span>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">复习完成！</h3>
      <p className="text-gray-500 mb-2">共复习 {total} 项</p>
      <p className="text-lg font-semibold text-indigo-600 mb-6">
        正确率 {pct}%（{correct}/{total}）
      </p>

      <div className="flex gap-3 text-xs text-gray-500 mb-8">
        {[0, 1, 2, 3, 4, 5].map((q) => (
          <span key={q} className="bg-gray-100 rounded px-2 py-1">
            {q}: {qualityCounts[q] || 0}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onRestart}>再来一轮</Button>
        <Button onClick={onFinish}>返回</Button>
      </div>
    </div>
  )
}
