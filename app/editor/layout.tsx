'use client'

import { useTranslations } from 'next-intl'

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = useTranslations('app')

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">{t('title')}</h1>
        </div>
      </header>
      {children}
    </div>
  )
} 