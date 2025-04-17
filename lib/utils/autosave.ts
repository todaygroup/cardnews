import { debounce } from 'lodash'
import { getCachedData, setCachedData } from '@/lib/redis'

const AUTOSAVE_PREFIX = 'autosave:'
const AUTOSAVE_TTL = 60 * 60 * 24 // 24 hours

export interface AutosaveData {
  id: string
  type: 'work' | 'template'
  data: any
  lastSaved: Date
}

export const autosave = debounce(async (
  id: string,
  type: 'work' | 'template',
  data: any
) => {
  const key = `${AUTOSAVE_PREFIX}${type}:${id}`
  const autosaveData: AutosaveData = {
    id,
    type,
    data,
    lastSaved: new Date()
  }

  await setCachedData(key, autosaveData, AUTOSAVE_TTL)
}, 1000)

export async function getAutosaveData(id: string, type: 'work' | 'template'): Promise<AutosaveData | null> {
  const key = `${AUTOSAVE_PREFIX}${type}:${id}`
  return getCachedData<AutosaveData>(key)
}

export async function clearAutosaveData(id: string, type: 'work' | 'template'): Promise<void> {
  const key = `${AUTOSAVE_PREFIX}${type}:${id}`
  await setCachedData(key, null)
} 