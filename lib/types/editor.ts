export interface SlideData {
  id: string
  content: string
  imageUrl: string
  backgroundColor: string
  textColor: string
  fontSize: number
  fontFamily: string
}

export interface BaseWorkData {
  id: string
  title: string
  description: string | null
  isPublic: boolean
  language: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
  }
}

export interface WorkData extends BaseWorkData {
  slides: Slide[]
  translations?: Record<string, WorkTranslation>
}

export interface DatabaseWorkData extends BaseWorkData {
  slides: string
  translations: string | null
}

export interface WorkTranslation {
  title: string
  description: string
  slides: Slide[]
}

export interface BaseCardNewsData {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
  }
  language: string
}

export interface CardNewsData extends BaseCardNewsData {
  slides: Slide[]
  translations: Record<string, WorkTranslation>
}

export interface DatabaseCardNewsData extends BaseCardNewsData {
  slides: string
  translations: string | null
}

export interface Slide {
  id: string
  title: string
  content: string
  backgroundColor: string
  textColor: string
  fontSize: number
  fontFamily: string
  imageUrl?: string
}

export const createEmptySlide = (): Slide => ({
  id: crypto.randomUUID(),
  title: '',
  content: '',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  fontSize: 24,
  fontFamily: 'sans-serif',
  imageUrl: ''
})

export interface EditorState {
  slides: Slide[]
  currentSlideIndex: number
  title: string
  description: string
  language: string
  isPublic: boolean
}

export type EditorActionType = 
  | 'ADD_SLIDE'
  | 'DELETE_SLIDE'
  | 'UPDATE_SLIDE'
  | 'SET_SLIDES'
  | 'SET_CURRENT_SLIDE'
  | 'UPDATE_TITLE'
  | 'UPDATE_DESCRIPTION'
  | 'SET_LANGUAGE'
  | 'SET_PUBLIC'
  | 'RESET'

export type EditorAction =
  | { type: 'ADD_SLIDE' }
  | { type: 'DELETE_SLIDE'; payload: { id: string } }
  | { type: 'UPDATE_SLIDE'; payload: { id: string; data: Partial<Slide> } }
  | { type: 'SET_SLIDES'; payload: Slide[] }
  | { type: 'SET_CURRENT_SLIDE'; payload: number }
  | { type: 'UPDATE_TITLE'; payload: string }
  | { type: 'UPDATE_DESCRIPTION'; payload: string }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_PUBLIC'; payload: boolean }
  | { type: 'RESET' } 