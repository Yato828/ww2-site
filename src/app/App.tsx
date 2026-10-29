import { Component, Suspense, lazy, useEffect, useRef } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import HomePage from '../pages/HomePage'

const StoriesPage = lazy(() => import('../features/stories/StoriesPage'))
const StoryPage = lazy(() => import('../features/stories/StoryPage'))
const TimelinePage = lazy(() => import('../features/timeline/TimelinePage'))
const MapPage = lazy(() => import('../features/memory-map/MapPage'))
const MemorialPage = lazy(() => import('../features/memory-map/MemorialPage'))
const GenerationsPage = lazy(() => import('../pages/GenerationsPage'))
const QuizPage = lazy(() => import('../features/quiz/QuizPage'))
const VideosPage = lazy(() => import('../features/videos/VideosPage'))
const AboutPage = lazy(() => import('../pages/AboutPage'))
const NotFound = lazy(() => import('../pages/NotFound'))

const metadata: Record<string, [string, string]> = {
  '/': ['Истории, которые связывают поколения', 'Цифровой музей исторической и семейной памяти Беларуси. Исследуйте истории, места и документы.'],
  '/stories': ['Истории людей', 'Документальные рассказы о людях, войне и сохранении исторической памяти Беларуси.'],
  '/timeline': ['Лента времени', 'Интерактивная хронология Беларуси: 1941–1945 годы, восстановление и сохранение памяти.'],
  '/map': ['Карта памяти', 'Пять памятных мест Беларуси на интерактивной карте с проверенными источниками.'],
  '/generations': ['Голоса поколений', 'Они пережили. Они сохранили. Мы помним. Как история становится семейной памятью.'],
  '/quiz': ['Что мы помним?', 'Десять вопросов об истории Беларуси с объяснениями и ссылками на источники.'],
  '/videos': ['Видеотека', 'Музейные видеопроекты о семейной памяти, письмах и сохранении свидетельств войны.'],
  '/about': ['Источники и о проекте', 'Цель проекта, исторические источники, права на фотографии и устройство цифрового музея.'],
}

function RouteEffects() {
  const { pathname, hash } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    const [title, description] = metadata[pathname] ?? ['Материалы цифрового музея', 'Историческая и семейная память Беларуси. Проверенные материалы и источники.']
    document.title = `${title} — Нить памяти`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' })
    if (!first.current) document.getElementById('main-content')?.focus({ preventScroll: true })
    first.current = false
  }, [pathname, hash])
  return null
}

class PageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Ошибка страницы', error, info.componentStack) }
  render() {
    return this.state.failed ? <div className="page-container error-page"><p className="eyebrow">Не удалось открыть страницу</p><h1>Попробуем ещё раз</h1><p>Обновите страницу, чтобы повторить загрузку материалов музея.</p><button className="button button-primary" onClick={() => window.location.reload()}>Обновить страницу</button></div> : this.props.children
  }
}

export default function App() {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  return <><a className="skip-link" href="#main-content">Перейти к содержимому</a><Header /><RouteEffects /><main id="main-content" tabIndex={-1}><PageBoundary key={pathname}><motion.div initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}><Suspense fallback={<div className="loading-page" role="status"><span className="loading-thread" />Открываем страницу памяти…</div>}><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/stories" element={<StoriesPage />} />
    <Route path="/stories/:id" element={<StoryPage />} />
    <Route path="/timeline" element={<TimelinePage />} />
    <Route path="/map" element={<MapPage />} />
    <Route path="/places/:id" element={<MemorialPage />} />
    <Route path="/generations" element={<GenerationsPage />} />
    <Route path="/archive" element={<Navigate to="/stories" replace />} />
    <Route path="/quiz" element={<QuizPage />} />
    <Route path="/videos" element={<VideosPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes></Suspense></motion.div></PageBoundary></main><Footer /></>
}
