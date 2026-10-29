import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { useEffect } from 'react'
import { ArrowUpRight, MapPin, Search } from 'lucide-react'
import { memorials } from '../../data/history'
import ArchiveImage from '../../components/ui/ArchiveImage'
import SourceReference from '../../components/ui/SourceReference'
import 'leaflet/dist/leaflet.css'
import './map.css'

function MapFocus({ selected }: { selected: string | null }) {
  const map = useMap()
  useEffect(() => {
    const place = memorials.find(item => item.id === selected)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (place) map.flyTo(place.coordinates, 10, { animate: !reduced, duration: 0.8 })
    else map.fitBounds([[51.6, 23.1], [55.9, 32.7]], { animate: false, padding: [20, 20] })
  }, [selected, map])
  return null
}

export default function MapPage() {
  const [params, setParams] = useSearchParams()
  const [selected, setSelected] = useState<string | null>(null)
  const [tileError, setTileError] = useState(false)
  const search = params.get('q') ?? ''
  const type = params.get('type') ?? 'Все места'
  const types = ['Все места', ...new Set(memorials.map(item => item.type))]
  const filtered = useMemo(() => memorials.filter(place => (type === 'Все места' || place.type === type) && `${place.name} ${place.region}`.toLocaleLowerCase('ru').includes(search.trim().toLocaleLowerCase('ru'))), [search, type])
  function update(key: string, value: string) { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true }); setSelected(null) }
  return <div className="page-container memory-map-page"><header className="page-heading"><p className="eyebrow">ГЕОГРАФИЯ ПАМЯТИ · БЕЛАРУСЬ</p><h1>Места, где история<br /><em>говорит с нами.</em></h1><p className="lead">Пять точек на карте. Пять поводов остановиться, узнать и передать память дальше.</p></header><div className="map-toolbar"><label className="search-field"><Search size={18} /><span className="sr-only">Найти памятное место</span><input type="search" value={search} placeholder="Название или регион" onChange={event => update('q', event.target.value)} /></label><label className="map-type-filter"><span>Тип объекта</span><select value={type} onChange={event => update('type', event.target.value)}>{types.map(item => <option key={item}>{item}</option>)}</select></label><span className="results-count" aria-live="polite">Мест: {filtered.length}</span></div><div className="map-workspace"><div className="places-list" aria-label="Список памятных мест">{filtered.map((place) => <article key={place.id} className={`place-list-card ${selected === place.id ? 'selected' : ''}`}><Link className="place-preview" to={`/places/${place.id}`}><ArchiveImage src={place.image} alt={place.imageAlt} /></Link><button className="place-select" onClick={() => setSelected(place.id)} aria-pressed={selected === place.id}><span className="place-number">{String(memorials.indexOf(place) + 1).padStart(2, '0')}</span><span><span className="place-type">{place.type}</span><strong>{place.name}</strong><span className="place-region"><MapPin size={12} />{place.region}</span></span></button><Link to={`/places/${place.id}`} className="place-detail-link">История места <ArrowUpRight size={14} /></Link></article>)}{!filtered.length && <div className="empty-state"><p>Места не найдены. Попробуйте другой запрос.</p><button className="button button-secondary" onClick={() => setParams({})}>Сбросить фильтры</button></div>}</div><div className="interactive-map" role="region" aria-label="Интерактивная карта Беларуси. Все места также доступны в списке"><MapContainer center={[53.6, 27.8]} zoom={7} minZoom={5} scrollWheelZoom={false} className="leaflet-memory-map"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" eventHandlers={{ tileerror: () => setTileError(true) }} /><MapFocus selected={selected} />{filtered.map(place => <Marker key={place.id} position={place.coordinates} title={place.name} icon={divIcon({ className: 'memorial-map-marker', html: `<span><b>${memorials.indexOf(place) + 1}</b></span>`, iconSize: [34, 40], iconAnchor: [17, 40], popupAnchor: [0, -36] })} eventHandlers={{ click: () => setSelected(place.id) }}><Popup maxWidth={380} maxHeight={650}><div className="memorial-popup"><ArchiveImage src={place.image} alt={place.imageAlt} /><span>{place.region}</span><h2>{place.name}</h2><p>{place.description}</p><SourceReference source={place.source} /><Link className="text-link" to={`/places/${place.id}`}>Подробнее о месте <ArrowUpRight size={14} /></Link></div></Popup></Marker>)}</MapContainer><div className="map-hint"><MapPin size={13} />Выберите точку на карте или место в списке</div></div></div>{tileError && <p role="status" className="notice">Не удалось загрузить часть карты. Проверьте подключение к интернету. Все описания, фотографии и ссылки доступны в списке мест.</p>}<p className="editorial-note">Для подложки карты требуется интернет. Координаты указывают на мемориальные комплексы; это образовательная карта, а не навигация до входа.</p></div>
}
