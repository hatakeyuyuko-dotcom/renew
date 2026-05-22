import { useUIStore } from '../store/uiStore'
import Button from '../components/shared/Button'

export default function SettingsPage() {
  const { theme, setTheme } = useUIStore()

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">设置</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">外观</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">主题模式</p>
              <p className="text-xs text-gray-400">选择浅色或深色主题</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                浅色
              </Button>
              <Button
                variant={theme === 'dark' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                深色
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">关于</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">应用名称</span>
              <span className="text-gray-700 font-medium">背背</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">核心算法</span>
              <span className="text-gray-700">SM-2 间隔重复</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">学习方法</span>
              <span className="text-gray-700">费曼学习法</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">数据存储</span>
              <span className="text-gray-700">本地浏览器 (IndexedDB)</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">使用说明</h3>
          <div className="text-sm text-gray-600 space-y-3">
            <div>
              <h4 className="font-medium text-gray-700 mb-1">背单词</h4>
              <p>创建牌组后添加单词，系统会根据你的掌握程度自动安排复习计划。每次复习时给单词评分（0-5），算法会自动调整复习间隔。</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-1">背书</h4>
              <p>添加要背诵的文本后，使用递进式回忆功能逐级挑战：从全文可见到完全空白默背。每次背诵后自我评估，系统自动安排下次复习。</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-1">费曼学习法</h4>
              <p>选择要深入理解的内容，按照「准备→解释→找缺口→回顾→简化」五个步骤完成深度学习。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
