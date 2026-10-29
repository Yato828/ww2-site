import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { useEffect } from 'react'
import { stories } from '../../data/history'
import ArchiveImage from '../../components/ui/ArchiveImage'
import SourceReference from '../../components/ui/SourceReference'
import StoryCard from './StoryCard'
import { videos } from '../../data/videos'
import VideoCard from '../videos/VideoCard'
import NotFound from '../../pages/NotFound'

export default function StoryPage() {
  const { id } = useParams()
  const story = stories.find(item => item.id === id)
  useEffect(() => { if (story) { document.title = `${story.title} — Нить памяти`; document.querySelector('meta[name="description"]')?.setAttribute('content', story.excerpt) } }, [story])
  if (!story) return <NotFound />
  const relatedVideos = videos.filter(video => video.relatedStories.includes(story.id))
  const relatedStories = stories.filter(item => item.id !== story.id).sort((a, b) => Number(b.category === story.category) - Number(a.category === story.category)).slice(0, 2)
  return <article className="story-detail page-container"><Link className="back-link" to="/stories"><ArrowLeft size={16} />Ко всем историям</Link><header className="page-heading"><p className="eyebrow">{story.category} · {story.region}</p><h1>{story.title}</h1><p className="lead">{story.excerpt}</p><span className="detail-period">{story.period} <span /> ДОКУМЕНТАЛЬНЫЙ ОЧЕРК</span></header><figure className="detail-hero"><ArchiveImage eager src={story.image} alt={story.imageAlt} /><figcaption>{story.imageAlt} · <a href={story.image} target="_blank" rel="noopener noreferrer">Открыть изображение ↗</a> · <Link to="/about#photos">Об изображении и его авторе</Link></figcaption></figure><div className="article-layout"><aside className="article-sidebar"><p className="eyebrow">НИТЬ СОБЫТИЙ</p><ol>{story.timeline.map((event, i) => <li key={i}><span>{event.date}</span><p>{event.text}</p></li>)}</ol></aside><div className="article-body">{story.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}{relatedVideos.length > 0 && <section className="article-videos"><h2>Посмотреть по теме</h2>{relatedVideos.map(video => <VideoCard key={video.id} video={video} compact />)}</section>}<div className="reflection-box"><p className="eyebrow">ПРОДОЛЖИТЬ РАЗГОВОР</p><h2>Что об этом помнят в вашей семье?</h2><p>Спросите близких, сохраните их ответ и отметьте, от кого вы услышали рассказ. Семейное свидетельство и установленный исторический факт могут дополнять друг друга.</p><Link className="text-link" to="/generations">Голоса поколений <ArrowUpRight size={16} /></Link></div><section className="article-sources"><h2>Источники материала</h2>{story.sources.map(source => <SourceReference key={source.url} source={source} />)}<p>Текст подготовлен как образовательный пересказ. Фотографии служат иллюстрациями и не устанавливают родство или связь между изображёнными людьми.</p></section></div></div><section className="related-stories"><div className="section-heading"><h2>Продолжить <em>знакомство</em></h2><Link className="text-link" to="/stories">Все истории <ArrowUpRight size={17} /></Link></div><div className="featured-grid">{relatedStories.map((item, i) => <StoryCard key={item.id} story={item} index={i} />)}</div></section></article>
}
