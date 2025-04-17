import { Providers } from '@/app/providers'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { Inter } from 'next/font/google'
import LanguageSelector from '@/components/shared/LanguageSelector'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

type Props = {
  children: ReactNode
  params: {
    locale: string
  }
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <div className="fixed top-4 right-4 z-50">
              <LanguageSelector />
            </div>
            <main className="min-h-screen bg-white">
              {children}
            </main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
} 