import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { videos } from '../../data/videos'
import VideoCard from './VideoCard'

describe('Музейные видеоматериалы', () => {
  it('подключает внешний плеер только по запросу и позволяет его закрыть', async () => {
    const user = userEvent.setup()
    const video = videos.find(item => item.embedUrl)!
    const { container } = render(<MemoryRouter><VideoCard video={video} /></MemoryRouter>)
    expect(container.querySelector('iframe')).toBeNull()
    expect(screen.getByRole('img')).toHaveAttribute('src', video.image)
    await user.click(screen.getByRole('button', { name: `Смотреть «${video.title}»` }))
    expect(screen.getByTitle(video.title)).toHaveAttribute('src', video.embedUrl)
    expect(screen.getByRole('link', { name: new RegExp(video.source.title) })).toHaveAttribute('href', video.source.url)
    await user.click(screen.getByRole('button', { name: 'Закрыть плеер' }))
    expect(container.querySelector('iframe')).toBeNull()
  })

  it('открывает материал без встраивания на официальной странице музея', () => {
    const video = videos.find(item => !item.embedUrl)!
    const { container } = render(<MemoryRouter><VideoCard video={video} /></MemoryRouter>)
    const link = screen.getByRole('link', { name: /Смотреть на сайте музея/ })
    expect(link).toHaveAttribute('href', video.source.url)
    expect(link).toHaveAttribute('target', '_blank')
    expect(container.querySelector('iframe')).toBeNull()
  })
})
