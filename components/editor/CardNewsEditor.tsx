'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface SlideData {
  id: string
  content: string
  imageUrl?: string
}

interface CardNewsEditorProps {
  initialSlides?: SlideData[]
  onSlidesChange?: (slides: SlideData[]) => void
}

export default function CardNewsEditor({ 
  initialSlides = [], 
  onSlidesChange 
}: CardNewsEditorProps) {
  const t = useTranslations('editor')
  const [slides, setSlides] = useState<SlideData[]>(initialSlides)
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleSlidesChange = (newSlides: SlideData[]) => {
    setSlides(newSlides)
    onSlidesChange?.(newSlides)
  }

  const addSlide = () => {
    const newSlide: SlideData = {
      id: Date.now().toString(),
      content: '',
    }
    handleSlidesChange([...slides, newSlide])
    setCurrentSlide(slides.length)
  }

  const deleteSlide = (index: number) => {
    const newSlides = slides.filter((_, i) => i !== index)
    handleSlidesChange(newSlides)
    setCurrentSlide(Math.min(currentSlide, newSlides.length - 1))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{t('slides')}</h2>
        <button
          onClick={addSlide}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {t('addSlide')}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`p-4 border rounded cursor-pointer ${
                index === currentSlide ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => setCurrentSlide(index)}
            >
              <p className="truncate">{slide.content || t('emptySlide')}</p>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          {slides[currentSlide] && (
            <div className="p-4 border rounded">
              <textarea
                value={slides[currentSlide].content}
                onChange={(e) => {
                  const newSlides = [...slides]
                  newSlides[currentSlide].content = e.target.value
                  handleSlidesChange(newSlides)
                }}
                className="w-full h-32 p-2 border rounded"
                placeholder={t('slideContent')}
              />
              <button
                onClick={() => deleteSlide(currentSlide)}
                className="mt-2 text-red-500 hover:text-red-600"
              >
                {t('deleteSlide')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 