'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

interface Template {
  id: string
  name: string
  description: string
  thumbnail: string
  category: string
  tags: string[]
  slides: any[]
  author: {
    id: string
    name: string
    image: string | null
  }
  usageCount: number
  language: string
}

export default function TemplatePreviewPage({ params }: { params: { id: string } }) {
  const t = useTranslations('templates')
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

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

  if (loading) {
    return <div className="text-center py-8">{t('loading')}</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  if (!template) {
    return <div className="text-center py-8">{t('templateNotFound')}</div>
  }

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : template.slides.length - 1))
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev < template.slides.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">{template.name}</h1>
              <Link
                href={`/templates/${template.id}`}
                className="text-blue-600 hover:text-blue-700"
              >
                {t('backToTemplate')}
              </Link>
            </div>
            <div className="relative aspect-[9/16] max-w-md mx-auto bg-gray-900 rounded-lg overflow-hidden">
              {template.slides[currentSlide] && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: template.slides[currentSlide].backgroundColor || '#000000',
                  }}
                >
                  {template.slides[currentSlide].imageUrl && (
                    <Image
                      src={template.slides[currentSlide].imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                  <div
                    className="absolute inset-0 flex items-center justify-center p-8"
                    style={{
                      color: template.slides[currentSlide].textColor || '#ffffff',
                      fontSize: `${template.slides[currentSlide].fontSize || 24}px`,
                    }}
                  >
                    {template.slides[currentSlide].content}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handlePrevSlide}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t('previous')}
              </button>
              <span className="text-gray-600">
                {currentSlide + 1} / {template.slides.length}
              </span>
              <button
                onClick={handleNextSlide}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t('next')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 