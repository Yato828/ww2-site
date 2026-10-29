import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowDown, ArrowLeft, ArrowRight, ChevronDown, ExternalLink } from 'lucide-react'
import { photoCredits, timeline } from '../../data/history'
import ArchiveImage from '../../components/ui/ArchiveImage'
import './timeline.css'

export default function TimelinePage() {
  const [params, setParams] = useSearchParams()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()
  const requestedYear = params.get('year')
  const requestedEvent = params.get('event')
  const activeEvent = timeline.find((event) => event.id === requestedEvent && (!requestedYear || event.year === requestedYear))
    ?? timeline.find((event) => event.year === requestedYear) ?? timeline[0]
  const years = [...new Set(timeline.map((event) => event.year))]

  if (!activeEvent) {
    return <div className="page-container timeline-page"><h1 className="page-heading">Лента времени</h1><p>Материалы хронологии пока недоступны.</p></div>
  }

  const currentIndex = timeline.findIndex((event) => event.id === activeEvent.id)
  const yearEvents = timeline.filter((event) => event.year === activeEvent.year)
  const expanded = expandedId === activeEvent.id
  const imageCredit = photoCredits.find((photo) => photo.path === activeEvent.image)

  function chooseEvent(id: string) {
    const event = timeline.find((item) => item.id === id)
    if (!event) return
    const next = new URLSearchParams(params)
    next.set('year', event.year)
    next.set('event', event.id)
    setParams(next)
    setExpandedId(null)
  }

  function chooseYear(year: string) {
    const first = timeline.find((event) => event.year === year)
    if (first) chooseEvent(first.id)
  }

  return (
    <div className="page-container timeline-page">
      <header className="timeline-intro">
        <p className="eyebrow">Хроника памяти / 1941 — после войны</p>
        <h1 className="page-heading">Время проходит.<br /><em>Память остаётся.</em></h1>
        <p className="lead">За каждой датой — человеческие судьбы. Пройдите путь от первых дней войны до восстановления страны и сохранения памяти.</p>
      </header>

      <nav className="timeline-years" aria-label="Периоды хронологии">
        {years.map((year, index) => (
          <button key={year} type="button" className={`timeline-year ${activeEvent.year === year ? 'is-active' : ''}`} aria-label={`${year}: выбрать период`} aria-pressed={activeEvent.year === year} onClick={() => chooseYear(year)}>
            <span className="timeline-year-dot" aria-hidden="true" />
            <span className="timeline-year-number">{year}</span>
            <span className="timeline-year-count">{String(index + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </nav>

      <div className="timeline-exhibit">
        <aside className="timeline-index" aria-label={`События периода ${activeEvent.year}`}>
          <p className="timeline-index-label">Выбранный период</p>
          <div className={`timeline-large-year${/^\d{4}$/.test(activeEvent.year) ? '' : ' timeline-period-name'}`} aria-hidden="true">{activeEvent.year}</div>
          <div className="timeline-event-buttons">
            {yearEvents.map((event) => (
              <button className={`timeline-event-button ${event.id === activeEvent.id ? 'is-active' : ''}`} type="button" key={event.id} aria-pressed={event.id === activeEvent.id} onClick={() => chooseEvent(event.id)}>
                <span>{event.date}</span>
                <strong>{event.title}</strong>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
          <p className="timeline-index-note"><ArrowDown size={15} aria-hidden="true" /> Выберите год, затем событие</p>
        </aside>

        <div className="timeline-card-wrapper">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article className="timeline-card" key={activeEvent.id} initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }} transition={{ duration: reduceMotion ? 0 : 0.22 }}>
              {activeEvent.image && <figure className="timeline-figure"><div className="timeline-image"><ArchiveImage src={activeEvent.image} alt={imageCredit?.title ?? `Иллюстрация к материалу «${activeEvent.title}»`} /></div><figcaption>{imageCredit?.title ?? 'Иллюстрация материала'}{imageCredit && ` · ${imageCredit.author} · ${imageCredit.license}`}<a href={activeEvent.image} target="_blank" rel="noopener noreferrer">Открыть изображение ↗</a><Link to="/about#photos">Происхождение и права ↗</Link></figcaption></figure>}
              <div className="timeline-card-content">
                <p className="eyebrow timeline-date">{activeEvent.date}</p>
                <h2>{activeEvent.title}</h2>
                <p className="timeline-description">{activeEvent.description}</p>
                <button className="timeline-details-toggle" type="button" aria-expanded={expanded} aria-controls={`event-details-${activeEvent.id}`} onClick={() => setExpandedId(expanded ? null : activeEvent.id)}>
                  {expanded ? 'Свернуть подробности' : 'Узнать больше'} <ChevronDown size={17} className={expanded ? 'is-open' : ''} aria-hidden="true" />
                </button>
                <AnimatePresence initial={false}>
                  {expanded && <motion.div id={`event-details-${activeEvent.id}`} initial={{ height: reduceMotion ? 'auto' : 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: reduceMotion ? 'auto' : 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="timeline-details"><p>{activeEvent.details}</p></motion.div>}
                </AnimatePresence>
                <a className="source-link timeline-source" href={activeEvent.source.url} target="_blank" rel="noreferrer">{activeEvent.source.title}<ExternalLink size={13} aria-hidden="true" /><span className="sr-only"> (откроется в новой вкладке)</span></a>
              </div>
            </motion.article>
          </AnimatePresence>
          <div className="timeline-pagination">
            <button type="button" className="timeline-step" disabled={currentIndex === 0} onClick={() => chooseEvent(timeline[currentIndex - 1].id)}><ArrowLeft size={18} aria-hidden="true" /><span>Предыдущее</span></button>
            <span className="timeline-position" aria-live="polite">{String(currentIndex + 1).padStart(2, '0')} <span>/ {String(timeline.length).padStart(2, '0')}</span></span>
            <button type="button" className="timeline-step" disabled={currentIndex === timeline.length - 1} onClick={() => chooseEvent(timeline[currentIndex + 1].id)}><span>Следующее</span><ArrowRight size={18} aria-hidden="true" /></button>
          </div>
        </div>
      </div>
      <div className="timeline-context"><span className="timeline-context-mark" aria-hidden="true">*</span><p>Эта лента — отправная точка для изучения истории. Она не охватывает все события войны. У каждого материала есть источник, по которому можно продолжить исследование.</p></div>
    </div>
  )
}
