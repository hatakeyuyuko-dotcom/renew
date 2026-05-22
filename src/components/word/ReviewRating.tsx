import { QUALITY_LABELS } from '../../algorithm/sm2'

interface ReviewRatingProps {
  onRate: (quality: number) => void
}

const qualityColors: Record<number, string> = {
  0: 'bg-red-600 hover:bg-red-700',
  1: 'bg-orange-500 hover:bg-orange-600',
  2: 'bg-amber-500 hover:bg-amber-600',
  3: 'bg-yellow-500 hover:bg-yellow-600',
  4: 'bg-lime-500 hover:bg-lime-600',
  5: 'bg-emerald-500 hover:bg-emerald-600',
}

export default function ReviewRating({ onRate }: ReviewRatingProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-medium text-gray-700">你的掌握程度如何？</p>
      <div className="flex gap-2 flex-wrap justify-center">
        {[0, 1, 2, 3, 4, 5].map((q) => (
          <button
            key={q}
            onClick={() => onRate(q)}
            className={`${qualityColors[q]} text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer`}
            title={QUALITY_LABELS[q]}
          >
            {q}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-400 grid grid-cols-3 gap-x-4 gap-y-1 mt-1">
        <span>0 = 完全忘记</span>
        <span>1-2 = 错误</span>
        <span>3-5 = 正确</span>
      </div>
    </div>
  )
}
