'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface ExportButtonProps {
  workId: string
  workTitle: string
}

export default function ExportButton({ workId, workTitle }: ExportButtonProps) {
  const t = useTranslations('editor')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/works/${workId}/export`)
      if (!response.ok) {
        throw new Error('내보내기에 실패했습니다.')
      }

      const data = await response.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${workTitle}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        {loading ? t('exporting') : t('export')}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
} 