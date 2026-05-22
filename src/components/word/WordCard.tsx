import type { Word } from '../../models/word'

interface WordCardProps {
  word: Word
  isFlipped: boolean
  onClick: () => void
}

export default function WordCard({ word, isFlipped, onClick }: WordCardProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <div
        onClick={onClick}
        className={`w-full max-w-md aspect-[3/2] rounded-2xl shadow-lg border-2 cursor-pointer transition-all duration-500 flex items-center justify-center p-8 ${
          isFlipped
            ? 'bg-indigo-50 border-indigo-300'
            : 'bg-white border-gray-200 hover:border-indigo-200 hover:shadow-xl'
        }`}
        style={{ perspective: '1000px' }}
      >
        <div className="text-center">
          <p className={`font-medium transition-all ${isFlipped ? 'text-base text-gray-700' : 'text-3xl text-gray-900'}`}>
            {isFlipped ? word.back : word.front}
          </p>
          {isFlipped && word.notes && (
            <p className="text-sm text-gray-400 mt-3">{word.notes}</p>
          )}
          <p className="text-xs text-gray-300 mt-4">
            {isFlipped ? '点击进行评分' : '点击翻看答案'}
          </p>
        </div>
      </div>
    </div>
  )
}
