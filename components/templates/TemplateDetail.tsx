'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Template } from '@lib/types/template'

interface TemplateDetailProps {
  templateId: string
}

const template: Template = {
  id: '1',
  name: '비즈니스 프레젠테이션',
  description: '전문적인 비즈니스 프레젠테이션을 위한 템플릿',
  thumbnail: '/templates/business.jpg',
  category: 'business',
  tags: ['비즈니스', '프레젠테이션', '전문적'],
  slides: [
    {
      id: '1',
      content: '비즈니스 프레젠테이션',
      imageUrl: '/templates/business-1.jpg',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      fontSize: 24,
      fontFamily: 'Inter'
    },
    {
      id: '2',
      content: '프로젝트 개요',
      imageUrl: '/templates/business-2.jpg',
      backgroundColor: '#f8f9fa',
      textColor: '#000000',
      fontSize: 20,
      fontFamily: 'Inter'
    }
  ],
  author: {
    id: '1',
    name: '김성훈'
  },
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  usageCount: 150,
  isPublic: true,
  language: 'ko',
  translations: {}
}

export default function TemplateDetail({ templateId }: TemplateDetailProps) {
  const t = useTranslations('templates')
  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-96">
        <Image
          src={template.thumbnail}
          alt={template.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">{t('by')}</span>
            <span className="font-medium">{template.author.name}</span>
          </div>
          <span className="text-gray-500">•</span>
          <span className="text-gray-500">
            {template.usageCount} {t('uses')}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          <Link
            href={`/editor?template=${templateId}`}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('useTemplate')}
          </Link>
          <button
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('preview')}
          </button>
        </div>
      </div>
    </div>
  )
} 