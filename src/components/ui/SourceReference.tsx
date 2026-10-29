import { ExternalLink } from 'lucide-react'
import type { Source } from '../../data/history'

export default function SourceReference({ source }: { source: Source }) {
  return <a className="source-link" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ExternalLink size={13} aria-label="Откроется в новой вкладке" /></a>
}
