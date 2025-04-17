'use client'

import { memo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Slide } from '@/lib/types/editor'

interface SlideListProps {
  slides: Slide[]
  currentSlideIndex: number
  onSelectSlide: (index: number) => void
  onDeleteSlide: (index: number) => void
  onAddSlide: () => void
}

function SlideList({ 
  slides, 
  currentSlideIndex, 
  onSelectSlide, 
  onDeleteSlide, 
  onAddSlide 
}: SlideListProps) {
  const t = useTranslations('editor')

  const handleSelect = useCallback((index: number) => {
    onSelectSlide(index)
  }, [onSelectSlide])

  const handleDelete = useCallback((index: number) => {
    onDeleteSlide(index)
  }, [onDeleteSlide])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{t('slides')}</h2>
        <button
          onClick={onAddSlide}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('addSlide')}
        </button>
      </div>

      <div className="space-y-2">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              index === currentSlideIndex
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => handleSelect(index)}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {t('slide')} {index + 1}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(index)
                }}
                className="text-red-600 hover:text-red-700"
              >
                {t('delete')}
              </button>
            </div>
            <p className="text-sm text-gray-600 truncate mt-1">
              {slide.content || t('emptySlide')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(SlideList) 