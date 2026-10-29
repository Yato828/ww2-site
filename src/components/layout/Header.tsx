import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const links = [
  ['/stories', 'Истории людей'], ['/timeline', 'Лента времени'], ['/map', 'Карта памяти'],
  ['/generations', 'Голоса поколений'], ['/videos', 'Видеотека'], ['/quiz', 'Что мы помним?'],
]
export function Brand() {
  return <Link className="brand" to="/" aria-label="Нить памяти — на главную"><svg className="brand-symbol" width="38" height="43" viewBox="0 0 38 43" aria-hidden="true"><path d="M3 36V7l16 28V7m0 28L35 7v29" fill="none" stroke="currentColor" strokeWidth="1.3" /><circle cx="19" cy="7" r="3" fill="#a86565" /></svg><span>НИТЬ ПАМЯТИ<small>ИСТОРИИ, КОТОРЫЕ СВЯЗЫВАЮТ ПОКОЛЕНИЯ</small></span></Link>
}
export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const close = () => setOpen(false)
  return <header className={`site-header ${isHome ? 'header-home' : ''}`} onKeyDown={event => { if (event.key === 'Escape') { close(); document.getElementById('menu-toggle')?.focus() } }}><div className="header-inner"><div onClick={close}><Brand /></div><nav className="desktop-nav" aria-label="Основная навигация">{links.map(([path, name]) => <NavLink key={path} to={path}>{name}</NavLink>)}</nav><Link onClick={close} className="header-archive" to="/about">О проекте <ArrowUpRight size={15} /></Link><button id="menu-toggle" className="menu-toggle" aria-label={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>{open && <nav id="mobile-nav" className="mobile-nav" aria-label="Мобильная навигация">{[...links, ['/about', 'Источники и о проекте']].map(([path, name]) => <NavLink onClick={close} key={path} to={path}>{name}<ArrowUpRight size={16} /></NavLink>)}</nav>}</header>
}
