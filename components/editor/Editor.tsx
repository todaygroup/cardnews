'use client'

import { useReducer, useCallback, useMemo, Dispatch, SetStateAction } from 'react'
import { useTranslations } from 'next-intl'
import { EditorState, EditorAction, Slide } from '@/lib/types/editor'
import { editorReducer } from '@/lib/reducers/editorReducer'
import SlideEditor from './SlideEditor'
import SlideList from './SlideList'
import Toolbar from './Toolbar'

export interface EditorProps {
  slides: Slide[]
  setSlides: Dispatch<SetStateAction<Slide[]>>
}

export default function Editor({ slides, setSlides }: EditorProps) {
  const t = useTranslations('editor')
  const [state, dispatch] = useReducer(editorReducer, {
    slides: slides,
    currentSlideIndex: 0,
    title: '',
    description: '',
    language: 'ko',
    isPublic: true,
  })

  const currentSlide = useMemo(() => 
    state.slides[state.currentSlideIndex],
    [state.slides, state.currentSlideIndex]
  )

  const handleAddSlide = useCallback(() => {
    dispatch({ type: 'ADD_SLIDE' })
  }, [])

  const handleDeleteSlide = useCallback((index: number) => {
    dispatch({ type: 'DELETE_SLIDE', payload: { index } })
  }, [])

  const handleUpdateSlide = useCallback((updates: Partial<EditorState['slides'][0]>) => {
    dispatch({ 
      type: 'UPDATE_SLIDE', 
      payload: { 
        index: state.currentSlideIndex, 
        data: updates 
      } 
    })
  }, [state.currentSlideIndex])

  const handleSetCurrentSlide = useCallback((index: number) => {
    dispatch({ type: 'SET_CURRENT_SLIDE', payload: { index } })
  }, [])

  const handleUpdateTitle = useCallback((title: string) => {
    dispatch({ type: 'UPDATE_TITLE', payload: { value: title } })
  }, [])

  const handleUpdateDescription = useCallback((description: string) => {
    dispatch({ type: 'UPDATE_DESCRIPTION', payload: { value: description } })
  }, [])

  const handleSetLanguage = useCallback((language: string) => {
    dispatch({ type: 'SET_LANGUAGE', payload: { value: language } })
  }, [])

  const handleSetPublic = useCallback((isPublic: boolean) => {
    dispatch({ type: 'SET_PUBLIC', payload: { value: isPublic } })
  }, [])

  const handleSave = useCallback(() => {
    setSlides(state.slides)
  }, [state.slides, setSlides])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <input
                type="text"
                value={state.title}
                onChange={(e) => handleUpdateTitle(e.target.value)}
                placeholder={t('titlePlaceholder')}
                className="w-full text-2xl font-bold border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2"
              />
              <textarea
                value={state.description}
                onChange={(e) => handleUpdateDescription(e.target.value)}
                placeholder={t('descriptionPlaceholder')}
                className="w-full mt-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2 resize-none"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <SlideList
                  slides={state.slides}
                  currentSlideIndex={state.currentSlideIndex}
                  onSelectSlide={handleSetCurrentSlide}
                  onDeleteSlide={handleDeleteSlide}
                  onAddSlide={handleAddSlide}
                />
              </div>

              <div className="lg:col-span-3">
                {currentSlide ? (
                  <SlideEditor
                    slide={currentSlide}
                    onUpdate={handleUpdateSlide}
                  />
                ) : (
                  <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">{t('noSlides')}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <select
                  value={state.language}
                  onChange={(e) => handleSetLanguage(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                </select>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={state.isPublic}
                    onChange={(e) => handleSetPublic(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span>{t('public')}</span>
                </label>
              </div>

              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 