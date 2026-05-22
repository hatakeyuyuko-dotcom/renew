import { useState } from 'react'
import type { KeyPoint } from '../../models/text'

interface MindMapViewProps {
  points: KeyPoint[]
}

export default function MindMapView({ points }: MindMapViewProps) {
  if (points.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-8">暂无思维导图</p>
  }

  return (
    <div className="overflow-x-auto py-4">
      {points.map((root) => (
        <MindMapNode key={root.id} node={root} isRoot />
      ))}
    </div>
  )
}

function MindMapNode({ node, isRoot }: { node: KeyPoint; isRoot?: boolean }) {
  const [collapsed, setCollapsed] = useState(false)
  const hasChildren = node.children.length > 0

  return (
    <div className={isRoot ? '' : 'ml-6 border-l-2 border-indigo-100 pl-4'}>
      <div
        className={`flex items-center gap-2 py-1.5 group ${
          hasChildren ? 'cursor-pointer' : ''
        }`}
        onClick={() => hasChildren && setCollapsed(!collapsed)}
      >
        {hasChildren && (
          <span className="text-xs text-gray-400 w-3 text-center">
            {collapsed ? '▶' : '▼'}
          </span>
        )}
        <span
          className={`rounded-lg px-2.5 py-1 text-sm font-medium ${
            isRoot
              ? 'bg-indigo-100 text-indigo-800'
              : node.level === 1
                ? 'bg-amber-50 text-amber-800'
                : 'bg-gray-50 text-gray-700'
          }`}
        >
          {node.text}
        </span>
      </div>
      {!collapsed && hasChildren && (
        <div>
          {node.children.map((child) => (
            <MindMapNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  )
}
