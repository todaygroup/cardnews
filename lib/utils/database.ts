import { WorkData, CardNewsData, DatabaseWorkData, DatabaseCardNewsData, Slide, WorkTranslation } from '../types/editor'

export function serializeSlides(slides: Slide[]): string {
  return JSON.stringify(slides)
}

export function deserializeSlides(slides: string): Slide[] {
  try {
    return JSON.parse(slides)
  } catch (error) {
    console.error('Failed to deserialize slides:', error)
    return []
  }
}

export function serializeTranslations(translations: Record<string, WorkTranslation> | undefined): string {
  return JSON.stringify(translations || {})
}

export function deserializeTranslations(translations: string | null): Record<string, WorkTranslation> {
  try {
    return JSON.parse(translations || '{}')
  } catch (error) {
    console.error('Failed to deserialize translations:', error)
    return {}
  }
}

export function convertToDatabaseWork(work: WorkData): DatabaseWorkData {
  const { slides, translations, ...rest } = work
  return {
    ...rest,
    slides: serializeSlides(slides),
    translations: translations ? serializeTranslations(translations) : null
  }
}

export function convertFromDatabaseWork(work: DatabaseWorkData): WorkData {
  const { slides, translations, ...rest } = work
  return {
    ...rest,
    slides: deserializeSlides(slides),
    translations: translations ? deserializeTranslations(translations) : undefined
  }
}

export function convertToDatabaseTemplate(template: CardNewsData): DatabaseCardNewsData {
  const { slides, translations, ...rest } = template
  return {
    ...rest,
    slides: serializeSlides(slides),
    translations: serializeTranslations(translations)
  }
}

export function convertFromDatabaseTemplate(template: DatabaseCardNewsData): CardNewsData {
  const { slides, translations, ...rest } = template
  return {
    ...rest,
    slides: deserializeSlides(slides),
    translations: deserializeTranslations(translations || null)
  }
} 