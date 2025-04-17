'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { WorkData } from '@/lib/types/editor'

export default function PreviewPage() {
  const t = useTranslations('preview')
  const searchParams = useSearchParams()
  const [work, setWork] = useState<WorkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const fetchWork = async () => {
      const id = searchParams.get('id')
      if (!id) {
        setError(t('noData'))
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/works/${id}/preview`)
        if (!response.ok) {
          throw new Error('작업을 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        setWork(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchWork()
  }, [searchParams, t])

  const handlePrevSlide = () => {
    if (work && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleNextSlide = () => {
    if (work && currentSlide < work.slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !work) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error || t('noData')}</div>
      </div>
    )
  }

  const currentSlideData = work.slides[currentSlide]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">{work.title}</h1>
              <p className="text-gray-600 mb-8">{work.description}</p>

              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8">
                {currentSlideData.imageUrl && (
                  <img
                    src={currentSlideData.imageUrl}
                    alt={currentSlideData.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div
                  className="absolute inset-0 flex items-center justify-center p-8"
                  style={{
                    backgroundColor: currentSlideData.backgroundColor || 'transparent',
                  }}
                >
                  <div
                    className="text-center"
                    style={{
                      color: currentSlideData.textColor || '#000000',
                      fontSize: `${currentSlideData.fontSize || 24}px`,
                      fontFamily: currentSlideData.fontFamily || 'sans-serif',
                    }}
                  >
                    <h2 className="text-4xl font-bold mb-4">{currentSlideData.title}</h2>
                    <p className="text-xl">{currentSlideData.content}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlide === 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('prev')}
                </button>
                <span className="text-gray-600">
                  {currentSlide + 1} / {work.slides.length}
                </span>
                <button
                  onClick={handleNextSlide}
                  disabled={currentSlide === work.slides.length - 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('next')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 