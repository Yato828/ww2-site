import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
export default function NotFound() {
  return <div className="page-container not-found"><p className="eyebrow">404 — СТРАНИЦА НЕ НАЙДЕНА</p><h1>Нить не обрывается.</h1><p className="lead">Возможно, адрес изменился. Вернитесь к историям и продолжите знакомство с музеем.</p><Link className="button button-primary" to="/"><ArrowLeft size={18} />На главную</Link></div>
}
