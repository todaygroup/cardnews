'use client'

import { useEffect, useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { WorkData } from '@/lib/types/editor'

export default function WorksPage() {
  const t = useTranslations('works')
  const { data: session } = useSession()
  const [works, setWorks] = useState<WorkData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [sharing, setSharing] = useState<string | null>(null)
  const [exporting, setExporting] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await fetch('/api/works')
        if (!response.ok) {
          throw new Error('작업을 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        setWorks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchWorks()
    } else {
      setLoading(false)
    }
  }, [session])

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return

    try {
      setDeleting(id)
      const response = await fetch(`/api/works/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('작업을 삭제하는데 실패했습니다.')
      }

      setWorks(works.filter((work) => work.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setDeleting(null)
    }
  }

  const handleShare = async (id: string, isPublic: boolean) => {
    try {
      setSharing(id)
      const response = await fetch(`/api/works/${id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublic: !isPublic }),
      })

      if (!response.ok) {
        throw new Error('작업 공유 설정에 실패했습니다.')
      }

      const updatedWork = await response.json()
      setWorks(works.map((work) => (work.id === id ? updatedWork : work)))
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setSharing(null)
    }
  }

  const handleExport = async (id: string, title: string) => {
    try {
      setExporting(id)
      const response = await fetch(`/api/works/${id}/export`)
      if (!response.ok) {
        throw new Error('작업을 내보내는데 실패했습니다.')
      }

      const data = await response.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setExporting(null)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setImporting(true)
      const text = await file.text()
      const data = JSON.parse(text)

      const response = await fetch('/api/works/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('작업을 가져오는데 실패했습니다.')
      }

      const work = await response.json()
      setWorks([work, ...works])
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl mb-4">{t('loginRequired')}</p>
          <Link
            href="/auth/signin"
            className="text-blue-500 hover:text-blue-600"
          >
            {t('signIn')}
          </Link>
        </div>
      </div>
    )
  }

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <div className="flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? t('importing') : t('import')}
            </button>
            <Link
              href="/editor"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t('createNew')}
            </Link>
          </div>
        </div>

        {works.length === 0 ? (
          <div className="text-center text-gray-500 py-8">{t('noWorks')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work) => (
              <div
                key={work.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{work.title}</h2>
                  <p className="text-gray-600 mb-4">{work.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{new Date(work.updatedAt).toLocaleDateString()}</span>
                    <span>{work.isPublic ? t('public') : t('private')}</span>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Link
                      href={`/editor?id=${work.id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {t('edit')}
                    </Link>
                    <Link
                      href={`/preview?id=${work.id}`}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      {t('preview')}
                    </Link>
                    <button
                      onClick={() => handleShare(work.id, work.isPublic)}
                      disabled={sharing === work.id}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sharing === work.id
                        ? t('sharing')
                        : work.isPublic
                        ? t('makePrivate')
                        : t('makePublic')}
                    </button>
                    <button
                      onClick={() => handleExport(work.id, work.title)}
                      disabled={exporting === work.id}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {exporting === work.id ? t('exporting') : t('export')}
                    </button>
                    <button
                      onClick={() => handleDelete(work.id)}
                      disabled={deleting === work.id}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting === work.id ? t('deleting') : t('delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 