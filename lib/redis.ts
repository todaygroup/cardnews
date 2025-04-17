import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export async function getCachedData<T>(key: string): Promise<T | null> {
  const data = await redis.get(key)
  return data ? JSON.parse(data) : null
}

export async function setCachedData<T>(key: string, data: T, ttl?: number): Promise<void> {
  const stringData = JSON.stringify(data)
  if (ttl) {
    await redis.setex(key, ttl, stringData)
  } else {
    await redis.set(key, stringData)
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}

export default redis 