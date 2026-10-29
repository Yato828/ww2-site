import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { categories, stories } from '../../data/history'
import { videos } from '../../data/videos'
import StoryCard from './StoryCard'
import Reveal from '../../components/ui/Reveal'

export default function StoriesPage() {
  const [params, setParams] = useSearchParams()
  const category = params.get('theme') ?? 'Все истории'
  const search = params.get('q') ?? ''
  const filtered = useMemo(() => stories.filter(story => (category === 'Все истории' || story.category === category) && `${story.title} ${story.excerpt} ${story.region} ${story.paragraphs.join(' ')}`.toLocaleLowerCase('ru').includes(search.toLocaleLowerCase('ru').trim())), [category, search])
  function update(key: string, value: string) { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: key === 'q' }) }
  return <div className="page-container stories-page"><header className="page-heading"><p className="eyebrow">КОЛЛЕКЦИЯ · ИСТОРИИ ЛЮДЕЙ</p><h1>За каждой датой —<br /><em>человеческая судьба.</em></h1><p className="lead">Документальные рассказы о войне, возвращении к миру и памяти, которую мы передаём друг другу. Личные судьбы, письма, музейные предметы и семейные документы.</p><div className="collection-overview"><span><strong>{stories.length}</strong>статей и историй</span><span><strong>{categories.length}</strong>тем</span><Link to="/videos"><strong>{videos.length}</strong>видеоматериала</Link></div></header><div className="collection-toolbar"><div className="filter-tabs" aria-label="Фильтр по тематике">{['Все истории', ...categories].map(item => <button key={item} aria-pressed={category === item} className={category === item ? 'active' : ''} onClick={() => update('theme', item === 'Все истории' ? '' : item)}>{item}</button>)}</div><label className="search-field"><Search size={18} /><span className="sr-only">Поиск историй</span><input type="search" placeholder="Имя, место или событие" value={search} onChange={event => update('q', event.target.value)} /></label></div><p className="results-count" aria-live="polite">Найдено материалов: {filtered.length}</p><h2 className="sr-only">Истории по выбранной теме</h2><div className="stories-grid">{filtered.map((story, i) => <Reveal key={story.id}><StoryCard story={story} index={i} /></Reveal>)}</div>{filtered.length === 0 && <div className="empty-state"><h2>Здесь пока тихо</h2><p>Попробуйте другую тему или измените поисковый запрос.</p><button className="button button-secondary" onClick={() => setParams({})}><X size={16} />Сбросить фильтры</button></div>}<aside className="collection-note"><span className="eyebrow">О ДОСТОВЕРНОСТИ</span><p>В коллекции — биографические и тематические очерки по музейным публикациям. Факты о людях и семейных документах сопровождаются ссылками. Мы не придумываем свидетельства и цитаты. В каждом материале можно перейти к источникам.</p></aside></div>
}
