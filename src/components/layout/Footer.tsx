import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Brand } from './Header'

export default function Footer() {
  return <footer className="site-footer"><div className="footer-top"><Brand /><p>История страны состоит из историй людей.<br />Сохраним их для тех, кто придёт после нас.</p><Link className="text-link" to="/about">О проекте и источники <ArrowUpRight size={17} /></Link></div><div className="footer-bottom"><span>© 2026 «Нить памяти» · Образовательный проект</span><span>Беларусь. Помнить. Сохранять. Передавать.</span><Link to="/about#photos">Авторы фотографий и условия использования</Link></div></footer>
}
