'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Template {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  isPublic: boolean
  author: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export default function TemplatesPage() {
  const t = useTranslations('templates')
  const { data: session } = useSession()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates')
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
  }, [])

  const filteredTemplates = templates.filter(
    (template) =>
      selectedCategory === 'all' || template.category === selectedCategory
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            {session && (
              <Link
                href="/templates/create"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {t('createNew')}
              </Link>
            )}
          </div>

          <div className="mb-8">
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('all')}
              </button>
              <button
                onClick={() => setSelectedCategory('business')}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === 'business'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('business')}
              </button>
              <button
                onClick={() => setSelectedCategory('education')}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === 'education'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('education')}
              </button>
              <button
                onClick={() => setSelectedCategory('marketing')}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === 'marketing'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('marketing')}
              </button>
              <button
                onClick={() => setSelectedCategory('social')}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === 'social'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('social')}
              </button>
            </div>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {t('noTemplates')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">
                      {template.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{template.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{template.author.name}</span>
                      <span>
                        {new Date(template.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/editor?templateId=${template.id}`}
                        className="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        {t('useTemplate')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 