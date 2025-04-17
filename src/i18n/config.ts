export const locales = ['ko'] as const;
export const defaultLocale = 'ko' as const;

export type Locale = typeof locales[number]; 