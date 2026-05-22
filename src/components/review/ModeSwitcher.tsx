import type { StudyMode } from '../../models/word'

interface ModeSwitcherProps {
  mode: StudyMode
  onChange: (mode: StudyMode) => void
}

const MODE_INFO: Record<StudyMode, { label: string; icon: string; color: string; desc: string }> = {
  daily: {
    label: '日常模式',
    icon: '📅',
    color: 'border-blue-500 bg-blue-50 text-blue-700',
    desc: '间隔重复，稳步积累',
  },
  urgent: {
    label: '紧急模式',
    icon: '🔥',
    color: 'border-red-500 bg-red-50 text-red-700',
    desc: '考前冲刺，高频复习',
  },
}

export default function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500">背诵模式:</span>
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {(Object.keys(MODE_INFO) as StudyMode[]).map((m) => (
          <button
            key={m}
            onClick={() => onChange(m)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
              mode === m
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {MODE_INFO[m].icon} {MODE_INFO[m].label}
          </button>
        ))}
      </div>
      {mode === 'urgent' && (
        <span className="text-xs text-red-500 font-medium animate-pulse">
          考前冲刺中
        </span>
      )}
    </div>
  )
}

export { MODE_INFO }
