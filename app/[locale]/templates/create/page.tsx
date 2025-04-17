'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Editor from '@/components/editor/Editor'
import { Slide } from '@/lib/types/editor'

export default function CreateTemplatePage() {
  const t = useTranslations('templates')
  const router = useRouter()
  const { data: session, status } = useSession()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('business')
  const [tags, setTags] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [slides, setSlides] = useState<Slide[]>([])
  const [saving, setSaving] = useState(false)

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)

    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category,
          tags: tags.split(',').map((tag) => tag.trim()),
          isPublic,
          slides,
        }),
      })

      if (!response.ok) {
        throw new Error('템플릿 생성에 실패했습니다.')
      }

      const template = await response.json()
      router.push(`/templates/${template.id}`)
    } catch (error) {
      console.error('Error creating template:', error)
      alert('템플릿 생성에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('title')}
              className="w-full px-4 py-2 text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('description')}
              className="w-full mt-4 px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="business">{t('business')}</option>
                <option value="education">{t('education')}</option>
                <option value="marketing">{t('marketing')}</option>
                <option value="social">{t('social')}</option>
              </select>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder={t('tagsPlaceholder')}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mr-2"
                />
                {t('public')}
              </label>
            </div>
          </div>
          <Editor slides={slides} setSlides={setSlides} />
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || !title}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? t('saving') : t('save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 