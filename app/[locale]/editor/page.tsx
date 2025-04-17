'use client';

import { useTranslations } from 'next-intl'
import CardNewsEditor from '@/components/editor/CardNewsEditor'

export default function EditorPage() {
  const t = useTranslations('editor')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      <CardNewsEditor />
    </div>
  )
} 