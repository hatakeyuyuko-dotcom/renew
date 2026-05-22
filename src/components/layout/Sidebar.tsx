import { NavLink } from 'react-router-dom'
import { useUIStore } from '../../store/uiStore'

const navItems = [
  { to: '/', label: '仪表盘', icon: '📊' },
  { to: '/words', label: '背单词', icon: '📝' },
  { to: '/texts', label: '背书', icon: '📖' },
  { to: '/feynman', label: '费曼学习', icon: '🧠' },
  { to: '/import', label: '导入', icon: '📥' },
  { to: '/statistics', label: '统计', icon: '📈' },
  { to: '/settings', label: '设置', icon: '⚙️' },
]

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  const handleNav = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  return (
    <aside
      className={`w-64 bg-white border-r border-gray-200 flex flex-col h-screen shrink-0
        fixed top-0 left-0 z-40 transition-transform duration-200
        md:relative md:z-auto md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}`}
    >
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-indigo-600 tracking-tight">背背</h1>
        <p className="text-xs text-gray-400 mt-0.5">科学背诵 · 费曼学习法</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={handleNav}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">每天进步一点点</p>
      </div>
    </aside>
  )
}
