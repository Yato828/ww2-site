import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Play, X } from 'lucide-react'
import type { MuseumVideo } from '../../data/videos'
import { stories } from '../../data/history'
import ArchiveImage from '../../components/ui/ArchiveImage'
import SourceReference from '../../components/ui/SourceReference'
import './videos.css'

export default function VideoCard({ video, compact = false }: { video: MuseumVideo; compact?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const Heading = compact ? 'h3' : 'h2'
  const related = stories.filter(story => video.relatedStories.includes(story.id))
  return <article className={`video-card ${compact ? 'video-card-compact' : ''}`}>
    <div><div className="video-stage">
      {playing && video.embedUrl ? <iframe src={video.embedUrl} title={video.title} allow="fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <>
        <ArchiveImage src={video.image} alt={video.imageAlt} />
        {video.embedUrl ? <button className="video-play" onClick={() => setPlaying(true)} aria-label={`Смотреть «${video.title}»`}><Play size={25} fill="currentColor" /><span>Смотреть видео</span></button> : <a className="video-play" href={video.source.url} target="_blank" rel="noopener noreferrer"><Play size={25} fill="currentColor" /><span>Смотреть на сайте музея <ArrowUpRight size={15} /></span></a>}
      </>}
    </div><p className="video-photo-caption">{video.imageAlt} <Link to="/about#photos">Источник фото ↗</Link></p></div>
    <div className="video-description"><p className="eyebrow">{video.genre}</p><Heading>{video.title}</Heading><p>{video.description}</p><p className="video-context">{video.context}</p>
      <details className="video-questions"><summary>На что обратить внимание</summary><ul>{video.watchFor.map(question => <li key={question}>{question}</li>)}</ul></details>
      <SourceReference source={video.source} />
      {video.embedUrl && <p className="video-provider">Плеер VK загружается после нажатия. Если видео недоступно, откройте страницу музея по ссылке выше.</p>}
      {playing && <button className="text-link" onClick={() => setPlaying(false)}><X size={15} />Закрыть плеер</button>}
      {!compact && <nav className="video-related" aria-label={`Статьи к видео «${video.title}»`}><p className="eyebrow">ЧИТАТЬ ПО ТЕМЕ</p>{related.map(story => <Link key={story.id} to={`/stories/${story.id}`}>{story.title}<ArrowUpRight size={14} /></Link>)}</nav>}
    </div>
  </article>
}
