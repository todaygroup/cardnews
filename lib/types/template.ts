import { SlideData } from './editor'

export interface Template {
  id: string
  name: string
  description: string
  thumbnail: string
  category: string
  tags: string[]
  slides: SlideData[]
  author: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
  usageCount: number
  isPublic: boolean
  language: string
  translations: {
    [key: string]: {
      name: string
      description: string
      slides: SlideData[]
    }
  }
}

export interface TemplateCategory {
  id: string
  name: string
  description: string
  icon: string
  count: number
} 