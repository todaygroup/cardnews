'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Template {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  isPublic: boolean
  slides: any[]
  author: {
    name: string
    email: string
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
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchTemplate()
  }, [params.id])

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/templates/${params.id}`)
      if (!response.ok) {
        throw new Error('템플릿을 불러오는데 실패했습니다.')
      }
      const data = await response.json()
      setTemplate(data)
    } catch (error) {
      console.error('Error fetching template:', error)
      setError('템플릿을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(t('confirmDelete'))) return
    setDeleting(true)

    try {
      const response = await fetch(`/api/templates/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('템플릿을 삭제하는데 실패했습니다.')
      }

      router.push('/templates')
    } catch (error) {
      console.error('Error deleting template:', error)
      alert('템플릿을 삭제하는데 실패했습니다.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">{t('loading')}</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  if (!template) {
    return null
  }

  const isAuthor = session?.user?.email === template.author.email

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{template.title}</h1>
            <div className="space-x-2">
              {isAuthor && (
                <>
                  <Link
                    href={`/templates/${template.id}/edit`}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    {t('edit')}
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? t('deleting') : t('delete')}
                  </button>
                </>
              )}
              <Link
                href={`/templates/${template.id}/use`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {t('useTemplate')}
              </Link>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <p className="text-gray-600 mb-4">{template.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>{t('by')} {template.author.name}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {t(template.category)}
                </span>
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {template.isPublic ? t('public') : t('private')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 