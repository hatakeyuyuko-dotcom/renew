import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTotalDueCount } from '../algorithm/scheduling'
import { db } from '../db/db'
import { useLiveQuery } from 'dexie-react-hooks'

export default function HomePage() {
  const [dueCounts, setDueCounts] = useState({ words: 0, texts: 0 })

  const decks = useLiveQuery(() => db.decks.toArray())
  const passages = useLiveQuery(() => db.textPassages.toArray())

  useEffect(() => {
    getTotalDueCount().then(setDueCounts).catch(() => {})
  }, [])

  const safeDecks = decks?.map((d) => ({ ...d, mode: d.mode || 'daily' })) ?? []
  const safePassages = passages?.map((p) => ({ ...p, mode: p.mode || 'daily' })) ?? []

  const wordCount = safeDecks.reduce((sum, d) => sum + (d.wordCount || 0), 0)
  const textCount = safePassages.length
  const urgentDeckCount = safeDecks.filter((d) => d.mode === 'urgent').length
  const urgentPassageCount = safePassages.filter((p) => p.mode === 'urgent').length
  const totalUrgent = urgentDeckCount + urgentPassageCount

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">欢迎回来</h2>
        <p className="text-gray-500 mt-1 text-sm md:text-base">今天的背诵任务等着你</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="text-2xl md:text-3xl font-bold text-indigo-600">{dueCounts.words}</div>
          <div className="text-xs md:text-sm text-gray-500 mt-1">待复习单词</div>
        </div>
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="text-2xl md:text-3xl font-bold text-emerald-600">{dueCounts.texts}</div>
          <div className="text-xs md:text-sm text-gray-500 mt-1">待背诵篇章</div>
        </div>
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="text-2xl md:text-3xl font-bold text-amber-600">{wordCount + textCount}</div>
          <div className="text-xs md:text-sm text-gray-500 mt-1">总内容数</div>
        </div>
        <div className={`bg-white rounded-xl p-4 md:p-6 shadow-sm border ${totalUrgent > 0 ? 'border-red-200' : 'border-gray-100'}`}>
          <div className={`text-2xl md:text-3xl font-bold ${totalUrgent > 0 ? 'text-red-500' : 'text-gray-300'}`}>
            {totalUrgent > 0 ? (
              <span className="animate-pulse">🔥 {totalUrgent}</span>
            ) : '0'}
          </div>
          <div className="text-xs md:text-sm text-gray-500 mt-1">紧急冲刺中</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <Link
          to="/words"
          className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors group"
        >
          <div className="text-3xl md:text-4xl mb-2 md:mb-3">📝</div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">背单词</h3>
          <p className="text-xs md:text-sm text-gray-500 mt-1">基于间隔重复的抽认卡系统，科学高效地记忆单词</p>
          {safeDecks.length > 0 && (
            <p className="text-xs text-gray-400 mt-3">
              {safeDecks.length} 个牌组 · {wordCount} 个单词
              {urgentDeckCount > 0 && <span className="text-red-400 ml-2">🔥 {urgentDeckCount} 紧急</span>}
            </p>
          )}
        </Link>

        <Link
          to="/texts"
          className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors group"
        >
          <div className="text-3xl md:text-4xl mb-2 md:mb-3">📖</div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">背书</h3>
          <p className="text-xs md:text-sm text-gray-500 mt-1">递进式回忆与完形填空，逐句逐段攻克长篇内容</p>
          {safePassages.length > 0 && (
            <p className="text-xs text-gray-400 mt-3">
              {textCount} 篇文本
              {urgentPassageCount > 0 && <span className="text-red-400 ml-2">🔥 {urgentPassageCount} 紧急</span>}
            </p>
          )}
        </Link>

        <Link
          to="/feynman"
          className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 hover:border-amber-200 transition-colors group"
        >
          <div className="text-3xl md:text-4xl mb-2 md:mb-3">🧠</div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">费曼学习法</h3>
          <p className="text-xs md:text-sm text-gray-500 mt-1">用自己的话解释概念，找出知识缺口，真正理解</p>
        </Link>

        <Link
          to="/import"
          className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 hover:border-purple-200 transition-colors group"
        >
          <div className="text-3xl md:text-4xl mb-2 md:mb-3">📥</div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">导入内容</h3>
          <p className="text-xs md:text-sm text-gray-500 mt-1">支持 TXT/CSV/JSON/Markdown 格式，快速导入背诵材料</p>
        </Link>
      </div>
    </div>
  )
}
