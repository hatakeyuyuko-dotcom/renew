import { useReviewStats, useDailyStreak } from '../hooks/useStatistics'

export default function StatisticsPage() {
  const stats = useReviewStats()
  const streak = useDailyStreak()

  if (!stats) return null

  const maxDaily = Math.max(1, ...stats.dailyReviews.map((d) => d.count))

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">学习统计</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-amber-600">{streak}</div>
          <div className="text-xs text-gray-400 mt-1">连续天数</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.totalWords}</div>
          <div className="text-xs text-gray-400 mt-1">总单词数</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-emerald-600">{stats.totalTexts}</div>
          <div className="text-xs text-gray-400 mt-1">总篇章数</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.wordsReviewedToday + stats.textsReviewedToday}</div>
          <div className="text-xs text-gray-400 mt-1">今日复习</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.totalDue}</div>
          <div className="text-xs text-gray-400 mt-1">待复习</div>
        </div>
      </div>

      {/* Daily review chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">近7天复习趋势</h3>
        <div className="flex items-end gap-2 h-40">
          {stats.dailyReviews.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-gray-600">{day.count}</span>
              <div
                className="w-full bg-indigo-500 rounded-t-lg transition-all min-h-[4px]"
                style={{ height: `${(day.count / maxDaily) * 100}%` }}
              />
              <span className="text-xs text-gray-400">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review history list */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">每日详情</h3>
        <div className="space-y-2">
          {[...stats.dailyReviews].reverse().map((day, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700">{day.date}</span>
              <span className="text-sm font-medium text-gray-900">{day.count} 次复习</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
