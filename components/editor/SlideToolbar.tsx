'use client'

import { useTranslations } from 'next-intl'

interface SlideToolbarProps {
  onAddSlide: () => void
  onDeleteSlide: () => void
  totalSlides: number
  currentSlide: number
  onSlideChange: (index: number) => void
}

export default function SlideToolbar({
  onAddSlide,
  onDeleteSlide,
  totalSlides,
  currentSlide,
  onSlideChange
}: SlideToolbarProps) {
  const t = useTranslations('editor')

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
      <button
        onClick={onAddSlide}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        {t('addSlide')}
      </button>
      <button
        onClick={onDeleteSlide}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        disabled={totalSlides <= 1}
      >
        {t('deleteSlide')}
      </button>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => onSlideChange(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          ←
        </button>
        <span className="text-sm">
          {currentSlide + 1} / {totalSlides}
        </span>
        <button
          onClick={() => onSlideChange(Math.min(totalSlides - 1, currentSlide + 1))}
          disabled={currentSlide === totalSlides - 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  )
} 