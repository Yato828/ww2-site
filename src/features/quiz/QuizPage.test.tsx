import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import QuizPage from './QuizPage'

vi.mock('../../data/history', () => ({ questions: [
  { id: 'one', question: 'Первый проверочный вопрос?', options: ['Ответ А', 'Ответ Б'], answer: 1, explanation: 'Объяснение первого ответа.', source: { title: 'Первый источник', url: 'https://example.org/one' } },
  { id: 'two', question: 'Второй проверочный вопрос?', options: ['Вариант А', 'Вариант Б'], answer: 0, explanation: 'Объяснение второго ответа.', source: { title: 'Второй источник', url: 'https://example.org/two' } },
] }))

describe('Проверка знаний', () => {
  it('проверяет ответы, считает результат и полностью сбрасывает попытку', async () => {
    const user = userEvent.setup()
    render(<QuizPage />)
    expect(screen.getByRole('button', { name: /Проверить ответ/ })).toBeDisabled()
    await user.click(screen.getByRole('radio', { name: /Ответ Б/ }))
    await user.click(screen.getByRole('button', { name: /Проверить ответ/ }))
    expect(screen.getByRole('status')).toHaveTextContent('Верно')
    expect(screen.getByRole('link', { name: /Первый источник/ })).toHaveAttribute('href', 'https://example.org/one')
    expect(screen.getByRole('radio', { name: /Ответ А/ })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: /Следующий вопрос/ }))
    await user.click(await screen.findByRole('radio', { name: /Вариант Б/ }))
    await user.click(screen.getByRole('button', { name: /Проверить ответ/ }))
    expect(screen.getByRole('status')).toHaveTextContent('Правильный ответ: Вариант А')
    await user.click(screen.getByRole('button', { name: /Посмотреть результат/ }))
    const result = await screen.findByRole('region', { name: 'Результат проверки знаний' })
    expect(within(result).getByText('1')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '2')
    await user.click(screen.getByRole('button', { name: /Пройти ещё раз/ }))
    expect(await screen.findByRole('radio', { name: /Ответ А/ })).not.toBeChecked()
    expect(screen.getByRole('button', { name: /Проверить ответ/ })).toBeDisabled()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0')
  })
})
