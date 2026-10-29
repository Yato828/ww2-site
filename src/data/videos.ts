import type { Source } from './history'

export interface MuseumVideo {
  id: string
  title: string
  genre: string
  publisher: string
  description: string
  context: string
  watchFor: string[]
  image: string
  imageAlt: string
  source: Source
  embedUrl?: string
  relatedStories: string[]
}

export const videos: MuseumVideo[] = [
  {
    id: 'family-museum-album', title: 'Как наши деды воевали…', genre: 'Виртуальный музейный альбом',
    publisher: 'Белорусский государственный музей истории Великой Отечественной войны',
    description: 'Сотрудники музея обращаются к истории собственных семей: фронт, партизанское движение, подполье, труд в тылу и детство во время войны.',
    context: 'Современный музейный проект к Дню Победы. Это семейные рассказы сотрудников, а не хроника, снятая в годы войны. Описание и плеер опубликованы на официальном сайте музея.',
    watchFor: ['Как личная история связывается с общей историей войны?', 'Какие документы помогают рассказать о родственниках?', 'Что в рассказе передано через семейную память?'],
    image: '/images/museum-victory-hall.jpg', imageAlt: 'Зал Победы в музее истории Великой Отечественной войны. Фото Julian Nyča, 2014 год. Не кадр из видеоролика.',
    source: { title: 'Официальная страница проекта «Как наши деды воевали…»', url: 'https://warmuseum.by/about/proekty/kak-nashi-dedy-voevali/' },
    embedUrl: 'https://vk.com/video_ext.php?hash=9472bf18c1722922&hd=2&id=456239120&oid=-122382728',
    relatedStories: ['shishkin-family-album', 'kudinov-childhood-work', 'family-album'],
  },
  {
    id: 'letters-14', title: 'Письма военной поры. Выпуск 14', genre: 'Музейная видеопостановка · 1 ноября 2024',
    publisher: 'Белорусский государственный музей истории Великой Отечественной войны',
    description: 'Служебное письмо первого директора музея Василия Стальнова становится отправной точкой рассказа об экспедициях сотрудников в Восточную Пруссию и Берлин в 1945 году.',
    context: 'Роли исполняют сотрудники музея. Это современная постановка по документу, а не подлинная запись разговора 1945 года. Выпуск открывается на сайте учреждения.',
    watchFor: ['Что можно узнать из служебного письма?', 'Как предметы попадали в музей ещё во время войны?', 'Чем документ отличается от его современного исполнения?'],
    image: '/images/museum-exhibition.jpg', imageAlt: 'Современная музейная реконструкция партизанского лагеря. Фото Julian Nyča, 2014 год. Не кадр из выпуска.',
    source: { title: 'Музей: «Письма военной поры», выпуск 14', url: 'https://warmuseum.by/news/pisma_voennoy_pory/multimediynyy_proekt_pisma_voennoy_pory_vypusk_14/' },
    relatedStories: ['stalnov-museum-expeditions', 'front-photographers'],
  },
]
