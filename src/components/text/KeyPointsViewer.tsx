import type { KeyPoint } from '../../models/text'

interface KeyPointsViewerProps {
  points: KeyPoint[]
}

export default function KeyPointsViewer({ points }: KeyPointsViewerProps) {
  if (points.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-8">暂无要点，点击"提炼要点"生成</p>
  }

  return (
    <div className="space-y-3">
      {points.map((root) => (
        <div key={root.id}>
          <div className="flex items-start gap-2 mb-2">
            <span className="text-indigo-500 font-bold mt-0.5">◆</span>
            <span className="font-semibold text-gray-900">{root.text}</span>
          </div>
          {root.children.map((child) => (
            <div key={child.id} className="ml-6 space-y-1">
              <div className="flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-0.5">●</span>
                <span className="text-gray-700">{child.text}</span>
              </div>
              {child.children.map((sub) => (
                <div key={sub.id} className="ml-6 flex items-start gap-2">
                  <span className="text-gray-300 mt-0.5">-</span>
                  <span className="text-sm text-gray-600">{sub.text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
