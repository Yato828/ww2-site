import { useState } from 'react'
import { ImageOff } from 'lucide-react'

export default function ArchiveImage({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  return failed ? <div className={`image-fallback ${className}`} role="img" aria-label={alt}><ImageOff size={26} /><span>Фотография недоступна</span></div> : <img className={className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
}
