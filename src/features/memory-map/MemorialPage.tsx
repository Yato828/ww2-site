import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react'
import { memorials } from '../../data/history'
import ArchiveImage from '../../components/ui/ArchiveImage'
import SourceReference from '../../components/ui/SourceReference'
import NotFound from '../../pages/NotFound'

export default function MemorialPage() {
  const { id } = useParams()
  const place = memorials.find(item => item.id === id)
  useEffect(() => { if (place) { document.title = `${place.name} — Нить памяти`; document.querySelector('meta[name="description"]')?.setAttribute('content', place.description) } }, [place])
  if (!place) return <NotFound />
  return <article className="page-container memorial-detail"><Link className="back-link" to="/map"><ArrowLeft size={16} />На карту памяти</Link><header className="page-heading"><p className="eyebrow">{place.type} · {place.region}</p><h1>{place.name}</h1><p className="lead">{place.description}</p></header><figure className="detail-hero"><ArchiveImage eager src={place.image} alt={place.imageAlt} /><figcaption>{place.imageAlt} · <a href={place.image} target="_blank" rel="noopener noreferrer">Открыть изображение ↗</a> · <Link to="/about#photos">Автор и лицензия</Link></figcaption></figure><div className="article-layout"><aside className="article-sidebar"><p className="eyebrow">МЕСТО ПАМЯТИ</p><p><MapPin size={15} /> {place.region}</p><p className="coordinate-text">{place.coordinates[0].toFixed(4)}° N<br />{place.coordinates[1].toFixed(4)}° E</p><a className="text-link" href={`https://www.openstreetmap.org/?mlat=${place.coordinates[0]}&mlon=${place.coordinates[1]}#map=16/${place.coordinates[0]}/${place.coordinates[1]}`} target="_blank" rel="noopener noreferrer">На OpenStreetMap <ArrowUpRight size={15} /></a></aside><div className="article-body"><p>{place.details}</p><section className="article-sources"><h2>Узнать больше</h2><SourceReference source={place.source} /><p>Информацию о режиме работы и посещении проверяйте у учреждения. Здесь представлен исторический контекст места.</p></section><div className="reflection-box"><h2>Память начинается с внимания</h2><p>После посещения запишите, что вас поразило. Обсудите увиденное с близкими — личный разговор помогает сохранить смысл места.</p><Link className="text-link" to="/generations">Продолжить разговор о памяти <ArrowUpRight size={16} /></Link></div></div></div></article>
}
