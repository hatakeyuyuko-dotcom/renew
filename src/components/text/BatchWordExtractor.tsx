import { useState, useMemo } from 'react'
import { extractWords, getTopWords } from '../../utils/wordExtractor'
import { db } from '../../db/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { bulkAddWords } from '../../hooks/useWords'
import Button from '../shared/Button'

interface BatchWordExtractorProps {
  text: string
  onClose: () => void
  onImported: (count: number) => void
}

export default function BatchWordExtractor({ text, onClose, onImported }: BatchWordExtractorProps) {
  const [selectedDeckId, setSelectedDeckId] = useState('')
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set())

  const decks = useLiveQuery(() => db.decks.toArray())

  const existingWordsSet = useLiveQuery(async () => {
    if (!selectedDeckId) return new Set<string>()
    const words = await db.words.where('deckId').equals(selectedDeckId).toArray()
    return new Set(words.map((w) => w.front))
  }, [selectedDeckId])

  const extractedWords = useMemo(() => {
    const wordMap = extractWords(text)
    return getTopWords(wordMap, 100, existingWordsSet)
  }, [text, existingWordsSet])

  const toggleWord = (word: string) => {
    const next = new Set(selectedWords)
    if (next.has(word)) {
      next.delete(word)
    } else {
      next.add(word)
    }
    setSelectedWords(next)
  }

  const toggleAll = () => {
    const newWords = extractedWords.filter((w) => !w.exists)
    if (selectedWords.size === newWords.length) {
      setSelectedWords(new Set())
    } else {
      setSelectedWords(new Set(newWords.map((w) => w.word)))
    }
  }

  const handleImport = async () => {
    if (!selectedDeckId || selectedWords.size === 0) return
    const wordsToAdd = [...selectedWords].map((w) => ({
      front: w,
      back: '',
      notes: '从篇章批量提取',
      tags: [] as string[],
    }))
    await bulkAddWords(selectedDeckId, wordsToAdd)
    onImported(wordsToAdd.length)
  }

  const newWords = extractedWords.filter((w) => !w.exists)
  const existingWords = extractedWords.filter((w) => w.exists)

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">目标牌组</label>
        <select
          value={selectedDeckId}
          onChange={(e) => {
            setSelectedDeckId(e.target.value)
            setSelectedWords(new Set())
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">选择牌组...</option>
          {decks?.map((d) => (
            <option key={d.id} value={d.id}>{d.name} ({d.wordCount}词)</option>
          ))}
        </select>
      </div>

      {extractedWords.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              共 {extractedWords.length} 个词 ({newWords.length} 新词, {existingWords.length} 已存在)
            </span>
            {newWords.length > 0 && (
              <button
                onClick={toggleAll}
                className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                {selectedWords.size === newWords.length ? '取消全选' : '全选新词'}
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto border rounded-lg">
            {extractedWords.map((w) => (
              <div
                key={w.word}
                className={`flex items-center justify-between px-3 py-2 border-b border-gray-50 last:border-0 text-sm ${
                  w.exists ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {!w.exists && (
                    <input
                      type="checkbox"
                      checked={selectedWords.has(w.word)}
                      onChange={() => toggleWord(w.word)}
                      className="rounded"
                    />
                  )}
                  <span className={w.exists ? 'text-gray-400' : 'text-gray-800 font-medium'}>
                    {w.word}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {w.exists ? '已存在' : `${w.frequency}次`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>取消</Button>
        <Button
          onClick={handleImport}
          disabled={!selectedDeckId || selectedWords.size === 0}
        >
          导入 {selectedWords.size > 0 ? `${selectedWords.size} 个` : ''}新词
        </Button>
      </div>
    </div>
  )
}
