import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Story } from '../../data/history'
import ArchiveImage from '../../components/ui/ArchiveImage'

export default function StoryCard({ story, index = 0 }: { story: Story; index?: number }) {
  const previewStyle = story.previewPosition ? { '--preview-position': story.previewPosition } as CSSProperties : undefined
  return <article className="story-card"><Link className="story-card-link" to={`/stories/${story.id}`}><div className="story-image-wrap" style={previewStyle}><ArchiveImage src={story.image} alt={story.imageAlt} /></div><div className="story-card-controls"><span className="image-index">{String(index + 1).padStart(2, '0')} / ИСТОРИИ ПАМЯТИ</span><span className="card-arrow"><ArrowUpRight size={23} /></span></div><span className="story-image-caption">{story.imageAlt}</span><div className="story-meta"><span>{story.category}</span><span>{story.period}</span></div><h3>{story.title}</h3><p>{story.excerpt}</p><span className="story-region">{story.region}</span><span className="sr-only">Читать историю</span></Link></article>
}
