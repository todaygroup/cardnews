export const defaultLocale = 'ko'
export const locales = ['ko', 'en'] as const

export type Locale = (typeof locales)[number]

export default {
  defaultLocale,
  locales,
  localePrefix: 'always'
} 