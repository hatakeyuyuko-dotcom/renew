import type { SpeechState } from '../../hooks/useSpeech'

interface Props {
  state: SpeechState
  rate: number
  onPlay: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onRateChange: (rate: number) => void
  label?: string
  variant?: 'bar' | 'button'
}

const rates = [0.5, 0.75, 1, 1.25, 1.5, 2]

export default function AudioPlayer({
  state, rate, onPlay, onPause, onResume, onStop, onRateChange, label, variant = 'bar',
}: Props) {
  const isSpeaking = state === 'speaking'
  const isPaused = state === 'paused'
  const isActive = state !== 'idle'

  if (variant === 'button') {
    return (
      <button
        onClick={isSpeaking ? onStop : onPlay}
        className="inline-flex items-center gap-1 text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer"
        title={isSpeaking ? '停止朗读' : '朗读'}
      >
        {isSpeaking ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.788l4.5-2.6v11.624l-4.5-2.6H4a1 1 0 01-1-1V9.788a1 1 0 011-1h2.5z" />
          </svg>
        )}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
      {label && <span className="text-xs text-gray-500 whitespace-nowrap hidden sm:inline">{label}</span>}

      <button
        onClick={isPaused ? onResume : isSpeaking ? onPause : onPlay}
        className="text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer shrink-0"
        title={isPaused ? '继续' : isSpeaking ? '暂停' : '播放'}
      >
        {isPaused ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : isSpeaking ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {isActive && (
        <button
          onClick={onStop}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
          title="停止"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
        </button>
      )}

      <div className="flex items-center gap-1 ml-auto">
        <span className="text-xs text-gray-400 hidden sm:inline">语速</span>
        <select
          value={rate}
          onChange={(e) => onRateChange(Number(e.target.value))}
          className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50 cursor-pointer"
        >
          {rates.map((r) => (
            <option key={r} value={r}>{r}x</option>
          ))}
        </select>
      </div>
    </div>
  )
}
