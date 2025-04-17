'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { Template } from '@prisma/client'

interface TemplateListProps {
  category?: string
  language?: string
}

export default function TemplateList({ category = 'all', language = 'ko' }: TemplateListProps) {
  const t = useTranslations('templates')
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(
          `/api/templates?category=${category}&language=${language}`
        )
        if (!response.ok) {
          throw new Error('템플릿을 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        setTemplates(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [category, language])

  if (loading) {
    return <div className="text-center py-8">{t('loading')}</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  if (templates.length === 0) {
    return <div className="text-center py-8">{t('noTemplates')}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Link
          key={template.id}
          href={`/templates/${template.id}`}
          className="group"
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 group-hover:scale-105">
            <div className="relative h-48">
              <Image
                src={template.thumbnail}
                alt={template.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {template.author?.image && (
                    <Image
                      src={template.author.image}
                      alt={template.author.name || ''}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-500">
                    {t('by')} {template.author?.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {template.usageCount} {t('uses')}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 