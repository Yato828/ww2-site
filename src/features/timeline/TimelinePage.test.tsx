import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import TimelinePage from './TimelinePage'

vi.mock('../../data/history', () => ({ photoCredits: [], timeline: [
  { id: 'one', year: '1941', date: '22 июня 1941', title: 'Первое событие', description: 'Краткое описание.', details: 'Дополнительные сведения первого события.', source: { title: 'Архивный источник', url: 'https://example.org/one' } },
  { id: 'two', year: '1941', date: 'Июль 1941', title: 'Второе событие', description: 'Второе описание.', details: 'Подробности.', source: { title: 'Второй источник', url: 'https://example.org/two' } },
  { id: 'three', year: '1942', date: '1942', title: 'Третье событие', description: 'Третье описание.', details: 'Подробности.', source: { title: 'Третий источник', url: 'https://example.org/three' } },
] }))

function TimelineHistoryHarness() {
  const navigate = useNavigate()
  const location = useLocation()
  return <><button type="button" onClick={() => navigate(-1)}>Назад в истории</button><output data-testid="current-search">{location.search}</output><TimelinePage /></>
}

describe('Лента времени', () => {
  it('раскрывает сведения и поддерживает переход между периодами и соседними событиями', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><TimelinePage /></MemoryRouter>)
    expect(screen.getByRole('button', { name: 'Предыдущее' })).toBeDisabled()
    expect(screen.queryByText('Дополнительные сведения первого события.')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Узнать больше/ }))
    expect(await screen.findByText('Дополнительные сведения первого события.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '1942: выбрать период' }))
    expect(await screen.findByRole('heading', { name: 'Третье событие' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1942: выбрать период' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Следующее' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Предыдущее' }))
    expect(await screen.findByRole('heading', { name: 'Второе событие' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1941: выбрать период' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('открывает указанный год из ссылки и восстанавливает выбранное событие через историю браузера', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/timeline?year=1942']}><TimelineHistoryHarness /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Третье событие' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Предыдущее' }))
    expect(await screen.findByRole('heading', { name: 'Второе событие' })).toBeInTheDocument()
    expect(screen.getByTestId('current-search')).toHaveTextContent('year=1941&event=two')
    await user.click(screen.getByRole('button', { name: 'Назад в истории' }))
    expect(await screen.findByRole('heading', { name: 'Третье событие' })).toBeInTheDocument()
    expect(screen.getByTestId('current-search')).toHaveTextContent('?year=1942')
  })
})
