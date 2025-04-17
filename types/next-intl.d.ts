import { useTranslations as useNextIntlTranslations } from 'next-intl'

declare module 'next-intl' {
  export function useTranslations(namespace: string): (key: string) => string
} 