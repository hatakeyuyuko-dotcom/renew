const LEVEL_LABELS: Record<number, string> = {
  0: '全文可见',
  1: '轻度遮蔽',
  2: '中度遮蔽',
  3: '重度遮蔽',
  4: '句首尾可见',
  5: '完全空白',
}

const LEVEL_COLORS: Record<number, string> = {
  0: 'bg-emerald-500',
  1: 'bg-lime-500',
  2: 'bg-yellow-500',
  3: 'bg-orange-500',
  4: 'bg-red-500',
  5: 'bg-rose-500',
}

interface RecallProgressBarProps {
  currentLevel: number
  onChangeLevel?: (level: number) => void
  readonly?: boolean
}

export default function RecallProgressBar({ currentLevel, onChangeLevel, readonly }: RecallProgressBarProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>回忆级别</span>
        <span>{LEVEL_LABELS[currentLevel]}</span>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            disabled={readonly}
            onClick={() => onChangeLevel?.(level)}
            className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
              level <= currentLevel ? LEVEL_COLORS[currentLevel] : 'bg-gray-200'
            }`}
            title={LEVEL_LABELS[level]}
          />
        ))}
      </div>
    </div>
  )
}
