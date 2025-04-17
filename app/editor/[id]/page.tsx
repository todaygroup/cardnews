'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import CardNewsEditor from '@/components/editor/CardNewsEditor'

interface SlideData {
  id: string
  title: string
  content: string
  backgroundColor: string
  textColor: string
  fontSize: number
  fontFamily: string
  imageUrl?: string
}

interface Work {
  id: string
  title: string
  description: string | null
  slides: SlideData[]
  isPublic: boolean
  language: string
}

export default function EditorPage({ params }: { params: { id: string } }) {
  const t = useTranslations('editor')
  const router = useRouter()
  const { data: session } = useSession()
  const [work, setWork] = useState<Work | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const response = await fetch(`/api/works/${params.id}`)
        if (!response.ok) {
          throw new Error('작업을 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        setWork(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : '작업을 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchWork()
    } else {
      setLoading(false)
    }
  }, [session, params.id])

  const handleSave = async () => {
    if (!work) return

    setSaving(true)
    try {
      const response = await fetch(`/api/works/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(work),
      })

      if (!response.ok) {
        throw new Error('작업 저장에 실패했습니다.')
      }

      const data = await response.json()
      setWork(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : '작업 저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{t('loginRequired')}</p>
          <a
            href="/auth/signin"
            className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            {t('signIn')}
          </a>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  if (!work) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">{t('workNotFound')}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{work.title}</h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/works')}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            {t('backToWorks')}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? t('saving') : t('save')}
          </button>
        </div>
      </div>

      <CardNewsEditor
        initialSlides={work.slides}
        onSlidesChange={(slides) => setWork({ ...work, slides })}
      />
    </div>
  )
} 