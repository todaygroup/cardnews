'use client'

import { useEffect, useState, useReducer } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { WorkData, EditorState, EditorAction, Slide, createEmptySlide } from '@/lib/types/editor'
import Link from 'next/link'

const initialState: EditorState = {
  slides: [],
  currentSlideIndex: 0,
  title: '',
  description: '',
  language: 'ko',
  isPublic: false,
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'ADD_SLIDE':
      return {
        ...state,
        slides: [...state.slides, createEmptySlide()]
      }
    case 'DELETE_SLIDE':
      return {
        ...state,
        slides: state.slides.filter(slide => slide.id !== action.payload.id)
      }
    case 'UPDATE_SLIDE':
      return {
        ...state,
        slides: state.slides.map(slide => 
          slide.id === action.payload.id 
            ? { ...slide, ...action.payload.data }
            : slide
        )
      }
    case 'SET_SLIDES':
      return {
        ...state,
        slides: action.payload
      }
    case 'SET_CURRENT_SLIDE':
      return {
        ...state,
        currentSlideIndex: action.payload
      }
    case 'UPDATE_TITLE':
      return {
        ...state,
        title: action.payload
      }
    case 'UPDATE_DESCRIPTION':
      return {
        ...state,
        description: action.payload
      }
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload
      }
    case 'SET_PUBLIC':
      return {
        ...state,
        isPublic: action.payload
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export default function EditorPage() {
  const t = useTranslations('editor')
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [state, dispatch] = useReducer(editorReducer, initialState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchWork = async () => {
      const id = searchParams.get('id')
      const templateId = searchParams.get('templateId')

      if (!id && !templateId) {
        setLoading(false)
        return
      }

      try {
        if (id) {
          const response = await fetch(`/api/works/${id}`)
          if (!response.ok) {
            throw new Error('작업을 불러오는데 실패했습니다.')
          }
          const data: WorkData = await response.json()
          dispatch({
            type: 'RESET'
          })
          dispatch({
            type: 'SET_SLIDES',
            payload: data.slides
          })
          dispatch({
            type: 'UPDATE_TITLE',
            payload: data.title
          })
          dispatch({
            type: 'UPDATE_DESCRIPTION',
            payload: data.description || ''
          })
          dispatch({
            type: 'SET_LANGUAGE',
            payload: data.language
          })
          dispatch({
            type: 'SET_PUBLIC',
            payload: data.isPublic
          })
        } else if (templateId) {
          const response = await fetch(`/api/templates/${templateId}/use`, {
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error('템플릿을 사용하는데 실패했습니다.')
          }
          const data = await response.json()
          router.push(`/editor?id=${data.id}`)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchWork()
    } else {
      setLoading(false)
    }
  }, [searchParams, session, router])

  const handleSave = async () => {
    try {
      setSaving(true)
      const id = searchParams.get('id')
      const url = id ? `/api/works/${id}` : '/api/works'
      const method = id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: state.title,
          description: state.description,
          slides: state.slides,
          language: state.language,
          isPublic: state.isPublic,
        }),
      })

      if (!response.ok) {
        throw new Error('작업을 저장하는데 실패했습니다.')
      }

      const data = await response.json()
      if (!id) {
        router.push(`/editor?id=${data.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddSlide = () => {
    dispatch({ type: 'ADD_SLIDE' })
  }

  const handleDeleteSlide = (index: number) => {
    dispatch({ type: 'DELETE_SLIDE', payload: { id: state.slides[index].id } })
  }

  const handleUpdateSlide = (index: number, data: Partial<WorkData['slides'][0]>) => {
    dispatch({
      type: 'UPDATE_SLIDE',
      payload: { 
        id: state.slides[index].id,
        data: data
      }
    })
  }

  const handleSetCurrentSlide = (index: number) => {
    dispatch({ type: 'SET_CURRENT_SLIDE', payload: index })
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl mb-4">{t('loginRequired')}</p>
          <Link
            href="/auth/signin"
            className="text-blue-500 hover:text-blue-600"
          >
            {t('signIn')}
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  const currentSlide = state.slides[state.currentSlideIndex]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="mb-8">
                <input
                  type="text"
                  value={state.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch({ type: 'UPDATE_TITLE', payload: e.target.value })
                  }
                  placeholder={t('titlePlaceholder')}
                  className="w-full text-3xl font-bold mb-4 p-2 border rounded"
                />
                <textarea
                  value={state.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    dispatch({
                      type: 'UPDATE_DESCRIPTION',
                      payload: e.target.value,
                    })
                  }
                  placeholder={t('descriptionPlaceholder')}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>

              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8">
                {currentSlide?.imageUrl && (
                  <img
                    src={currentSlide.imageUrl}
                    alt={currentSlide.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div
                  className="absolute inset-0 flex items-center justify-center p-8"
                  style={{
                    backgroundColor: currentSlide?.backgroundColor || 'transparent',
                  }}
                >
                  <div
                    className="text-center"
                    style={{
                      color: currentSlide?.textColor || '#000000',
                      fontSize: `${currentSlide?.fontSize || 24}px`,
                      fontFamily: currentSlide?.fontFamily || 'sans-serif',
                    }}
                  >
                    <input
                      type="text"
                      value={currentSlide?.title || ''}
                      onChange={(e) =>
                        handleUpdateSlide(state.currentSlideIndex, {
                          title: e.target.value,
                        })
                      }
                      placeholder={t('titlePlaceholder')}
                      className="w-full text-4xl font-bold mb-4 p-2 border rounded bg-transparent"
                    />
                    <textarea
                      value={currentSlide?.content || ''}
                      onChange={(e) =>
                        handleUpdateSlide(state.currentSlideIndex, {
                          content: e.target.value,
                        })
                      }
                      placeholder={t('contentPlaceholder')}
                      className="w-full p-2 border rounded bg-transparent"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddSlide}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {t('addSlide')}
                  </button>
                  <button
                    onClick={() => handleDeleteSlide(state.currentSlideIndex)}
                    disabled={state.slides.length <= 1}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('deleteSlide')}
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? t('saving') : t('save')}
                  </button>
                  <Link
                    href="/works"
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    {t('cancel')}
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {state.slides.map((slide: Slide, index: number) => (
                  <button
                    key={slide.id}
                    onClick={() => handleSetCurrentSlide(index)}
                    className={`aspect-video rounded-lg overflow-hidden ${
                      index === state.currentSlideIndex
                        ? 'ring-2 ring-blue-500'
                        : ''
                    }`}
                    style={{
                      backgroundColor: slide.backgroundColor,
                    }}
                  >
                    {slide.imageUrl && (
                      <img
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div
                      className="absolute inset-0 flex items-center justify-center p-2"
                      style={{
                        color: slide.textColor,
                        fontSize: `${slide.fontSize}px`,
                        fontFamily: slide.fontFamily,
                      }}
                    >
                      <span className="truncate">{slide.title || slide.content}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 