import { expect, test } from '@playwright/test'
import { stories } from '../src/data/history'

const routes = ['/', '/stories', '/timeline', '/map', '/generations', '/videos', '/quiz', '/about']

test('all museum routes render without runtime errors, with local images', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.text().includes('Ошибка страницы')) errors.push(message.text()) })
  await page.setViewportSize({ width: 1440, height: 1000 })
  for (const route of routes) {
    await page.goto(route)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('.error-page')).toHaveCount(0)
    await expect(page.locator('a[href="/archive"]')).toHaveCount(0)
    await page.evaluate(() => document.fonts.ready)
    const localImages = page.locator('img[src^="/images/"]')
    for (let i = 0; i < await localImages.count(); i++) {
      await localImages.nth(i).scrollIntoViewIfNeeded()
      await expect(localImages.nth(i)).toHaveJSProperty('complete', true)
      expect(await localImages.nth(i).evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
      const isPreview = await localImages.nth(i).evaluate(image => Boolean(image.closest('.story-image-wrap')))
      expect(await localImages.nth(i).evaluate(image => getComputedStyle(image).objectFit)).toBe(isPreview ? 'cover' : 'contain')
    }
    if (route === '/map') {
      await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible({ timeout: 15000 })
      await expect.poll(() => page.locator('.leaflet-tile').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete)), { timeout: 15000 }).toBe(true)
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await page.screenshot({ path: `test-results/desktop-${route.slice(1) || 'home'}.png`, fullPage: false })
    if (route === '/') await page.locator('.featured-grid').screenshot({ path: 'test-results/home-story-previews.png' })
    if (route === '/stories') {
      await page.locator('.story-card').nth(2).scrollIntoViewIfNeeded()
      await page.screenshot({ path: 'test-results/catalog-story-previews.png' })
    }
  }
  expect(errors).toEqual([])
})

for (const width of [320, 390, 768]) {
  test(`responsive pages fit ${width}px and mobile menu navigates`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    for (const route of routes) {
      await page.goto(route)
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('.error-page')).toHaveCount(0)
      await page.evaluate(() => document.fonts.ready)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true)
    }
    await page.goto('/')
    await page.getByRole('button', { name: 'Открыть меню' }).click()
    await page.getByRole('navigation', { name: 'Мобильная навигация' }).getByRole('link', { name: 'Истории людей' }).click()
    await expect(page).toHaveURL(/\/stories$/)
    await expect(page.locator('.stories-grid')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Открыть меню' })).toHaveAttribute('aria-expanded', 'false')
    await page.screenshot({ path: `test-results/mobile-${width}-stories.png`, fullPage: true })
    await page.goto('/')
    await page.screenshot({ path: `test-results/mobile-${width}-home.png` })
  })
}

test('story filters, empty results, article, and browser Back', async ({ page }) => {
  await page.goto('/stories')
  await expect(page.locator('.story-card')).toHaveCount(stories.length)
  await page.getByRole('button', { name: 'Семейная память', exact: true }).click()
  await expect(page.locator('.story-card')).toHaveCount(stories.filter(story => story.category === 'Семейная память').length)
  await page.locator('.story-card-link').first().click()
  await expect(page.locator('.article-sources')).toBeVisible()
  await page.goBack()
  await expect(page.locator('.story-card')).toHaveCount(stories.filter(story => story.category === 'Семейная память').length)
  await page.getByRole('searchbox', { name: 'Поиск историй' }).fill('несуществующий материал')
  await expect(page.getByText('Здесь пока тихо')).toBeVisible()
  await page.getByRole('button', { name: 'Сбросить фильтры' }).click()
  await expect(page.locator('.story-card')).toHaveCount(stories.length)
})

test('every article has a distinct real image and opens with its sources', async ({ page }) => {
  for (const story of stories) {
    await page.goto(`/stories/${story.id}`)
    await expect(page.getByRole('heading', { level: 1, name: story.title })).toBeVisible()
    const image = page.locator('.detail-hero img')
    await image.scrollIntoViewIfNeeded()
    await expect(image).toHaveJSProperty('complete', true)
    expect(await image.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
    expect(await image.evaluate(el => getComputedStyle(el).objectFit)).toBe('contain')
    await expect(page.locator('.article-sources .source-link').first()).toHaveAttribute('href', /^https:\/\//)
  }
  await page.goto('/stories')
  await page.getByRole('searchbox', { name: 'Поиск историй' }).fill('Шишкина')
  await expect(page.locator('.story-card')).toHaveCount(1)
  await expect(page.locator('.story-card h3')).toHaveText('Шестьдесят фотографий семьи Шишкиных')
})

test('video library keeps player optional and links related articles', async ({ page }) => {
  await page.goto('/videos')
  await expect(page.locator('.video-card')).toHaveCount(2)
  await expect(page.locator('iframe')).toHaveCount(0)
  await page.route('https://vk.com/**', route => route.abort())
  await page.getByRole('button', { name: 'Смотреть «Как наши деды воевали…»' }).click()
  await expect(page.locator('iframe')).toHaveAttribute('src', /^https:\/\/vk.com\/video_ext.php/)
  await page.getByRole('button', { name: 'Закрыть плеер' }).click()
  await expect(page.locator('iframe')).toHaveCount(0)
  await expect(page.getByRole('link', { name: /Смотреть на сайте музея/ })).toHaveAttribute('href', /warmuseum.by/)
  await page.locator('.video-related a[href="/stories/stalnov-museum-expeditions"]').click()
  await expect(page.locator('.article-videos')).toBeVisible()
})

test('timeline deep link and map markers expose real materials', async ({ page }) => {
  await page.goto('/timeline?year=1944')
  await expect(page.getByRole('button', { name: '1944: выбрать период' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Узнать больше' }).click()
  await expect(page.locator('.timeline-details')).toBeVisible()
  await page.goto('/map')
  await expect(page.locator('.leaflet-marker-icon')).toHaveCount(5)
  await page.locator('.leaflet-marker-icon').first().click()
  await expect(page.locator('.memorial-popup')).toBeVisible()
  await page.locator('.memorial-popup .text-link').click()
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('.article-sources a')).toHaveAttribute('href', /^https:\/\//)
})

test('first-day photograph is shown fully at a larger size and the removed archive redirects', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/timeline?year=1941')
  const photograph = page.locator('.timeline-image img')
  await photograph.scrollIntoViewIfNeeded()
  await expect(photograph).toHaveJSProperty('complete', true)
  expect(await photograph.evaluate(image => getComputedStyle(image).objectFit)).toBe('contain')
  expect((await photograph.boundingBox())!.height).toBeGreaterThanOrEqual(700)
  await page.locator('.timeline-figure').screenshot({ path: 'test-results/timeline-first-day-full.png' })
  await page.setViewportSize({ width: 390, height: 844 })
  await photograph.scrollIntoViewIfNeeded()
  const mobilePhoto = await photograph.boundingBox()
  const naturalRatio = await photograph.evaluate(image => (image as HTMLImageElement).naturalWidth / (image as HTMLImageElement).naturalHeight)
  expect(mobilePhoto!.width / mobilePhoto!.height).toBeCloseTo(naturalRatio, 2)
  await page.goto('/archive')
  await expect(page).toHaveURL(/\/stories$/)
  await expect(page.locator('.stories-grid')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Сохранить черновик' })).toHaveCount(0)
})

test('postwar period keeps whole words inside the timeline sidebar', async ({ page }) => {
  await page.goto('/timeline?event=recovery')
  await page.evaluate(() => document.fonts.ready)
  const label = page.locator('.timeline-large-year')
  await expect(label).toHaveText('После войны')
  for (const width of [701, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await expect(label).toBeVisible()
    const layout = await label.evaluate(element => {
      const text = element.firstChild!
      const container = element.parentElement!.getBoundingClientRect()
      return [[0, 5], [6, 11]].map(([start, end]) => {
        const range = document.createRange()
        range.setStart(text, start)
        range.setEnd(text, end)
        const rects = [...range.getClientRects()]
        return { lines: rects.length, fits: rects.every(rect => rect.left >= container.left && rect.right <= container.right + 1) }
      })
    })
    expect(layout).toEqual([{ lines: 1, fits: true }, { lines: 1, fits: true }])
    await page.locator('.timeline-index').screenshot({ path: `test-results/postwar-period-${width}.png` })
  }
  await page.setViewportSize({ width: 320, height: 844 })
  await expect(label).toBeHidden()
  await expect(page.getByRole('button', { name: 'После войны: выбрать период' })).toHaveAttribute('aria-pressed', 'true')
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('quiz explains all ten answers and restarts', async ({ page }) => {
  await page.goto('/quiz')
  await expect(page.getByRole('radio').first()).toBeVisible()
  const optionCount = await page.getByRole('radio').count()
  for (let i = 0; i < 10; i++) {
    await page.getByRole('radio').first().check()
    await page.getByRole('button', { name: 'Проверить ответ' }).click()
    await expect(page.locator('.quiz-explanation')).toBeVisible()
    await page.getByRole('button', { name: i === 9 ? 'Посмотреть результат' : 'Следующий вопрос' }).click()
  }
  await expect(page.locator('.quiz-result')).toBeVisible()
  await page.getByRole('button', { name: 'Пройти ещё раз' }).click()
  await expect(page.getByRole('radio')).toHaveCount(optionCount)
  await expect(page.getByRole('button', { name: 'Проверить ответ' })).toBeDisabled()
})
