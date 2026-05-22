import { HashRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AppShell from './components/layout/AppShell'
import Spinner from './components/shared/Spinner'
import ErrorBoundary from './components/shared/ErrorBoundary'
import HomePage from './pages/HomePage'

const WordDecksPage = lazy(() => import('./pages/WordDecksPage'))
const WordDeckDetailPage = lazy(() => import('./pages/WordDeckDetailPage'))
const WordReviewPage = lazy(() => import('./pages/WordReviewPage'))
const TextLibraryPage = lazy(() => import('./pages/TextLibraryPage'))
const TextDetailPage = lazy(() => import('./pages/TextDetailPage'))
const TextReviewPage = lazy(() => import('./pages/TextReviewPage'))
const FeynmanPage = lazy(() => import('./pages/FeynmanPage'))
const FeynmanSessionPage = lazy(() => import('./pages/FeynmanSessionPage'))
const FileImportPage = lazy(() => import('./pages/FileImportPage'))
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

function LazyLoad({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner className="py-20" />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<ErrorBoundary><HomePage /></ErrorBoundary>} />

          <Route path="words">
            <Route index element={<LazyLoad><WordDecksPage /></LazyLoad>} />
            <Route path=":deckId" element={<LazyLoad><WordDeckDetailPage /></LazyLoad>} />
            <Route path=":deckId/review" element={<LazyLoad><WordReviewPage /></LazyLoad>} />
          </Route>

          <Route path="texts">
            <Route index element={<LazyLoad><TextLibraryPage /></LazyLoad>} />
            <Route path=":passageId" element={<LazyLoad><TextDetailPage /></LazyLoad>} />
            <Route path=":passageId/review" element={<LazyLoad><TextReviewPage /></LazyLoad>} />
          </Route>

          <Route path="feynman">
            <Route index element={<LazyLoad><FeynmanPage /></LazyLoad>} />
            <Route path="session/:sessionId" element={<LazyLoad><FeynmanSessionPage /></LazyLoad>} />
          </Route>

          <Route path="import" element={<LazyLoad><FileImportPage /></LazyLoad>} />
          <Route path="statistics" element={<LazyLoad><StatisticsPage /></LazyLoad>} />
          <Route path="settings" element={<LazyLoad><SettingsPage /></LazyLoad>} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
