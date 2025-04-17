'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Slide } from '@/lib/types/editor'

interface CardSlideProps {
  data: Slide
  onChange: (data: Partial<Slide>) => void
}

export default function CardSlide({ data, onChange }: CardSlideProps) {
  const t = useTranslations('editor')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onChange({ imageUrl: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onChange({ imageUrl: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div 
      className="relative w-[600px] h-[600px] rounded-lg shadow-lg overflow-hidden"
      style={{ backgroundColor: data.backgroundColor }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {data.imageUrl ? (
          <Image
            src={data.imageUrl}
            alt={t('uploadImage')}
            fill
            className="object-cover"
          />
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            {t('uploadImage')}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
      <textarea
        value={data.content}
        onChange={(e) => onChange({ content: e.target.value })}
        className="absolute inset-0 w-full h-full p-4 bg-transparent resize-none focus:outline-none"
        style={{
          color: data.textColor,
          fontSize: `${data.fontSize}px`,
          fontFamily: data.fontFamily
        }}
        placeholder={t('textPlaceholder')}
      />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <input
          type="color"
          value={data.backgroundColor}
          onChange={(e) => onChange({ backgroundColor: e.target.value })}
          className="w-8 h-8 rounded cursor-pointer"
          title={t('backgroundColor')}
        />
        <input
          type="color"
          value={data.textColor}
          onChange={(e) => onChange({ textColor: e.target.value })}
          className="w-8 h-8 rounded cursor-pointer"
          title={t('textColor')}
        />
        <select
          value={data.fontSize}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          className="px-2 py-1 rounded bg-white bg-opacity-50"
          title={t('fontSize')}
        >
          {[12, 14, 16, 18, 20, 24, 28, 32, 36, 40].map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </div>
    </div>
  )
} 