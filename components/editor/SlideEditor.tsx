'use client'

import { memo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Slide } from '@/lib/types/editor'

interface SlideEditorProps {
  slide: Slide
  onUpdate: (updates: Partial<Slide>) => void
}

function SlideEditor({ slide, onUpdate }: SlideEditorProps) {
  const t = useTranslations('editor')

  const handleChange = useCallback((field: keyof Slide, value: string | number) => {
    onUpdate({ [field]: value })
  }, [onUpdate])

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {t('content')}
        </label>
        <textarea
          value={slide.content}
          onChange={(e) => handleChange('content', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('contentPlaceholder')}
          rows={4}
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {t('imageUrl')}
        </label>
        <input
          type="text"
          value={slide.imageUrl || ''}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('imagePlaceholder')}
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {t('backgroundColor')}
        </label>
        <input
          type="color"
          value={slide.backgroundColor}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
          className="w-full h-10 p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {t('textColor')}
        </label>
        <input
          type="color"
          value={slide.textColor}
          onChange={(e) => handleChange('textColor', e.target.value)}
          className="w-full h-10 p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {t('fontSize')}
        </label>
        <input
          type="number"
          value={slide.fontSize}
          onChange={(e) => handleChange('fontSize', Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          min={12}
          max={72}
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {t('fontFamily')}
        </label>
        <select
          value={slide.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
        </select>
      </div>
    </div>
  )
}

export default memo(SlideEditor) 