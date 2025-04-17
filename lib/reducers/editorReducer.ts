import { EditorState, EditorAction, Slide } from '../types/editor'
import { v4 as uuidv4 } from 'uuid'

const initialState: EditorState = {
  slides: [],
  currentSlideIndex: 0,
  title: '',
  description: '',
  language: 'ko',
  isPublic: true,
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'ADD_SLIDE': {
      const newSlide: Slide = {
        id: uuidv4(),
        title: '',
        content: '',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontSize: 24,
        fontFamily: 'Inter',
      }
      return {
        ...state,
        slides: [...state.slides, newSlide],
        currentSlideIndex: state.slides.length,
      }
    }

    case 'DELETE_SLIDE': {
      const { id } = action.payload
      const updatedSlides = state.slides.filter(slide => slide.id !== id)
      return {
        ...state,
        slides: updatedSlides,
        currentSlideIndex: Math.min(state.currentSlideIndex, updatedSlides.length - 1),
      }
    }

    case 'UPDATE_SLIDE': {
      const { id, data } = action.payload
      const updatedSlides = state.slides.map(slide => 
        slide.id === id ? { ...slide, ...data } : slide
      )
      return {
        ...state,
        slides: updatedSlides,
      }
    }

    case 'SET_CURRENT_SLIDE': {
      return {
        ...state,
        currentSlideIndex: action.payload,
      }
    }

    case 'UPDATE_TITLE': {
      return {
        ...state,
        title: action.payload,
      }
    }

    case 'UPDATE_DESCRIPTION': {
      return {
        ...state,
        description: action.payload,
      }
    }

    case 'SET_LANGUAGE': {
      return {
        ...state,
        language: action.payload,
      }
    }

    case 'SET_PUBLIC': {
      return {
        ...state,
        isPublic: action.payload,
      }
    }

    case 'RESET':
      return initialState

    default:
      return state
  }
} 