'use client'

import { useTranslations } from 'next-intl'
import { TemplateCategory } from '@lib/types/template'

const categories: TemplateCategory[] = [
  {
    id: 'business',
    name: '비즈니스',
    description: '비즈니스 관련 템플릿',
    icon: '💼',
    count: 12
  },
  {
    id: 'education',
    name: '교육',
    description: '교육 관련 템플릿',
    icon: '📚',
    count: 8
  },
  {
    id: 'marketing',
    name: '마케팅',
    description: '마케팅 관련 템플릿',
    icon: '📢',
    count: 15
  },
  {
    id: 'social',
    name: '소셜',
    description: '소셜 미디어용 템플릿',
    icon: '🌐',
    count: 20
  }
]

export default function TemplateCategories() {
  const t = useTranslations('templates')

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">{t('categories')}</h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              <span>{category.name}</span>
            </div>
            <span className="text-sm text-gray-500">{category.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
} 