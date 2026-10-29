import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { categories, heroImage, memorials, photoCredits, questions, sources, stories, timeline } from './history'
import { videos } from './videos'

const collections = { stories, memorials, questions, timeline }

function expectSafeExternalUrl(value: string) {
  const url = new URL(value)
  expect(url.protocol).toBe('https:')
  expect(url.hostname).not.toBe('')
  expect(url.username).toBe('')
  expect(url.password).toBe('')
}

describe('Целостность исторического каталога', () => {
  it('сохраняет уникальные идентификаторы маршрутов и покрывает все темы', () => {
    for (const items of Object.values(collections)) {
      expect(new Set(items.map((item) => item.id)).size).toBe(items.length)
      for (const item of items) expect(item.id).toMatch(/^[a-z0-9-]+$/)
    }
    expect(new Set(categories).size).toBe(categories.length)
    for (const story of stories) expect(categories).toContain(story.category)
    for (const category of categories) expect(stories.some((story) => story.category === category)).toBe(true)
  })

  it('предоставляет атрибуцию и локальный файл каждому показанному изображению', () => {
    const usedImages = [heroImage, ...stories.map((story) => story.image), ...videos.map(video => video.image), ...memorials.map((place) => place.image), ...timeline.flatMap((event) => event.image ? [event.image] : [])]
    expect(new Set(stories.map(story => story.image)).size).toBe(stories.length)
    expect(new Set(photoCredits.map((photo) => photo.path)).size).toBe(photoCredits.length)
    for (const image of usedImages) {
      expect(image).toMatch(/^\/images\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/)
      const credit = photoCredits.find((photo) => photo.path === image)
      expect(credit, `Нет атрибуции ${image}`).toBeDefined()
      const file = resolve('public', image.slice(1))
      expect(existsSync(file), `Нет файла ${image}`).toBe(true)
      expect(statSync(file).size).toBeGreaterThan(1000)
    }
    for (const credit of photoCredits) {
      expect(credit.title.trim().length).toBeGreaterThan(0)
      expect(credit.author.trim().length).toBeGreaterThan(0)
      expect(credit.license.trim().length).toBeGreaterThan(0)
      expectSafeExternalUrl(credit.sourceUrl)
      expectSafeExternalUrl(credit.licenseUrl)
    }
  })

  it('обеспечивает допустимый ответ и объяснение для каждого вопроса', () => {
    expect(questions.length).toBeGreaterThanOrEqual(10)
    for (const question of questions) {
      expect(question.options.length).toBeGreaterThanOrEqual(2)
      expect(new Set(question.options).size).toBe(question.options.length)
      expect(Number.isInteger(question.answer)).toBe(true)
      expect(question.answer).toBeGreaterThanOrEqual(0)
      expect(question.answer).toBeLessThan(question.options.length)
      expect(question.explanation.trim().length).toBeGreaterThan(0)
      expectSafeExternalUrl(question.source.url)
    }
  })

  it('содержит источники с безопасным протоколом у всех исторических материалов', () => {
    const references = [...Object.values(sources), ...stories.flatMap((story) => story.sources), ...memorials.map((place) => place.source), ...timeline.map((event) => event.source)]
    for (const reference of references) {
      expect(reference.title.trim().length).toBeGreaterThan(0)
      expectSafeExternalUrl(reference.url)
    }
    for (const story of stories) expect(story.sources.length).toBeGreaterThan(0)
  })

  it('располагает мемориалы в географических пределах Беларуси', () => {
    for (const place of memorials) {
      const [latitude, longitude] = place.coordinates
      expect(Number.isFinite(latitude) && Number.isFinite(longitude)).toBe(true)
      expect(latitude).toBeGreaterThan(51)
      expect(latitude).toBeLessThan(57)
      expect(longitude).toBeGreaterThan(23)
      expect(longitude).toBeLessThan(33)
    }
  })

  it('связывает видеоматериалы с существующими статьями и официальными страницами', () => {
    for (const video of videos) {
      expectSafeExternalUrl(video.source.url)
      expect(new URL(video.source.url).hostname).toBe('warmuseum.by')
      for (const id of video.relatedStories) expect(stories.some(story => story.id === id)).toBe(true)
      if (video.embedUrl) {
        expectSafeExternalUrl(video.embedUrl)
        expect(new URL(video.embedUrl).hostname).toBe('vk.com')
      }
    }
  })
})
