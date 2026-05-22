import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">页面出错了</h3>
          <p className="text-sm text-gray-500 mb-4">
            {this.state.error?.message || '未知错误'}
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left text-xs text-gray-500 max-w-lg mx-auto mb-4 overflow-auto max-h-40">
            {this.state.error?.stack}
          </div>
          <button
            onClick={() => {
              // Clear IndexedDB and reload
              indexedDB.deleteDatabase('MemorizationDB'); indexedDB.deleteDatabase('MemorizationDBv2')
              window.location.reload()
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 cursor-pointer mr-3"
          >
            清除数据并刷新
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer"
          >
            仅刷新页面
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
