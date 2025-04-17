import { NextRequest } from 'next/server'
import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/works/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import { prismaMock } from '../../jest.setup'
import { createWork, getWorks } from '@/app/api/works/route'
import { JsonValue } from '@prisma/client/runtime/library'

// Mock Prisma
const mockPrisma = mockDeep<typeof prisma>();
jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}))

describe('Works API', () => {
  describe('GET /api/works', () => {
    it('should return all works', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const mockWorks = [
        {
          id: '1',
          title: 'Test Work',
          description: null,
          slides: [] as JsonValue,
          authorId: mockUser.id,
          templateId: null,
          isPublic: true,
          language: 'ko',
          translations: {} as JsonValue,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { email: mockUser.email }
      })

      prismaMock.user.findUnique.mockResolvedValue(mockUser)
      prismaMock.work.findMany.mockResolvedValue(mockWorks)

      const req = new Request('http://localhost:3000/api/works')
      const response = await GET(req as unknown as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockWorks.map(work => ({
        ...work,
        createdAt: work.createdAt.toISOString(),
        updatedAt: work.updatedAt.toISOString()
      })))
    })
  })

  describe('POST /api/works', () => {
    it('should create a new work', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const mockWork = {
        id: '1',
        title: 'New Work',
        description: null,
        slides: [] as JsonValue,
        authorId: mockUser.id,
        templateId: null,
        isPublic: true,
        language: 'ko',
        translations: {} as JsonValue,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { email: mockUser.email }
      })

      prismaMock.user.findUnique.mockResolvedValue(mockUser)
      prismaMock.work.create.mockResolvedValue(mockWork)

      const req = {
        json: async () => ({
          title: 'New Work',
          slides: [] as JsonValue,
          language: 'ko',
          translations: {} as JsonValue
        })
      }

      const response = await POST(req as unknown as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual({
        ...mockWork,
        createdAt: mockWork.createdAt.toISOString(),
        updatedAt: mockWork.updatedAt.toISOString()
      })
    })

    it('should return 401 if user is not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const { req } = createMocks({
        method: 'POST',
        body: {
          title: 'Test Work',
          description: 'Test Description',
          slides: [],
          isPublic: true,
        },
      })

      const response = await POST(req as any)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: '로그인이 필요합니다.' })
    })
  })
}) 