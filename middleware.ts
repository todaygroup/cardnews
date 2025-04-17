import createMiddleware from 'next-intl/middleware'
import { locales } from './app/i18n/config'

export default createMiddleware({
  locales,
  defaultLocale: 'ko',
  localePrefix: 'always'
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
} 