interface SessionProgressProps {
  current: number
  total: number
}

export default function SessionProgress({ current, total }: SessionProgressProps) {
  const pct = total > 0 ? ((current) / total) * 100 : 0

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>进度 {current}/{total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
