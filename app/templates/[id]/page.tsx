'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
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
    image?: string | null
  }
  createdAt: string
  updatedAt: string
}

export default function TemplateDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const t = useTranslations('templates')
  const router = useRouter()
  const { data: session } = useSession()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/templates/${params.id}`)
        if (!response.ok) {
          throw new Error('템플릿을 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        setTemplate(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm(t('confirmDelete'))) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/templates/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('템플릿을 삭제하는데 실패했습니다.')
      }

      router.push('/templates')
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-500">{error || '템플릿을 찾을 수 없습니다.'}</div>
      </div>
    )
  }

  const isAuthor = session?.user?.email === template.author.email

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
                <p className="text-gray-600">{template.description}</p>
              </div>
              {isAuthor && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => router.push(`/templates/${params.id}/edit`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    {isDeleting ? t('deleting') : t('delete')}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">{t('categories')}</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {t(template.category)}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">{t('tags')}</h2>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {template.author.image && (
                    <img
                      src={template.author.image}
                      alt={template.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">{template.author.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/editor?templateId=${template.id}`)}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  {t('useTemplate')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 