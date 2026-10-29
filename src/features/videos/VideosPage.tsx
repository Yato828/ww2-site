import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { videos } from '../../data/videos'
import VideoCard from './VideoCard'

export default function VideosPage() {
  return <div className="page-container videos-page"><header className="page-heading"><p className="eyebrow">ВИДЕОТЕКА · МУЗЕЙНЫЕ ПРОЕКТЫ</p><h1>Историю можно<br /><em>услышать.</em></h1><p className="lead">Семейные рассказы и музейные документы в видеопроектах. У каждого материала есть источник и пояснение, что именно вы смотрите.</p></header><div className="video-directory">{videos.map(video => <VideoCard key={video.id} video={video} />)}</div><aside className="video-afterword"><h2>После просмотра —<br /><em>вернуться к документу.</em></h2><div><p>Видео помогает начать знакомство. Статьи, подписи к фотографиям и ссылки на первоисточники позволяют продолжить исследование и проверить подробности.</p><Link className="text-link" to="/stories">Читать истории и статьи <ArrowUpRight size={17} /></Link></div></aside><p className="editorial-note">Видеоролики принадлежат их авторам и не копируются в проект. Для просмотра требуется интернет; доступность плеера зависит от внешней площадки. Фотографии в карточках показывают музей и его экспозицию; они не являются кадрами из роликов.</p></div>
}
