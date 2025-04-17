/// <reference types="@types/jest" />
import { createMocks } from 'node-mocks-http'
import { GET } from '@/app/api/templates/route'
import { prismaMock } from '../../jest.setup'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextRequest } from 'next/server'
import { JsonValue } from '@prisma/client/runtime/library'

// Mock Prisma
const mockPrisma = mockDeep<typeof prismaMock>();
jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}))
jest.mock('next-auth')
jest.mock('@/app/api/auth/[...nextauth]/route')

describe('Templates API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: {
        email: 'test@example.com'
      }
    })
  })

  const mockTemplates = [
    {
      id: '1',
      title: 'Template 1',
      description: 'Description 1',
      category: 'general',
      language: 'ko',
      isPublic: true,
      slides: [],
      tags: [],
      translations: {},
      thumbnail: null,
      usageCount: 0,
      authorId: '1',
      author: {
        id: '1',
        name: 'User 1',
      },
      createdAt: new Date('2025-04-17T01:10:21.130Z'),
      updatedAt: new Date('2025-04-17T01:10:21.130Z'),
    },
  ]

  describe('GET /api/templates', () => {
    it('should return all templates', async () => {
      const mockTemplates = [
        {
          id: '1',
          title: 'Test Template',
          description: 'Test Description',
          thumbnail: null,
          slides: [] as JsonValue,
          category: 'BUSINESS',
          tags: [],
          isPublic: true,
          authorId: '1',
          author: {
            id: '1',
            name: 'Test User'
          },
          usageCount: 0,
          language: 'ko',
          translations: {} as JsonValue,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const req = new Request('http://localhost:3000/api/templates')
      prismaMock.template.findMany.mockResolvedValue(mockTemplates)

      const response = await GET(req as unknown as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockTemplates.map(template => ({
        ...template,
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString()
      })))
    })

    it('should return templates filtered by category', async () => {
      const mockTemplates = [
        {
          id: '1',
          title: 'Business Template',
          description: 'Business Description',
          thumbnail: null,
          slides: [] as JsonValue,
          category: 'BUSINESS',
          tags: [],
          isPublic: true,
          authorId: '1',
          author: {
            id: '1',
            name: 'Test User'
          },
          usageCount: 0,
          language: 'ko',
          translations: {} as JsonValue,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const req = new Request('http://localhost:3000/api/templates?category=BUSINESS')
      prismaMock.template.findMany.mockResolvedValue(mockTemplates)

      const response = await GET(req as unknown as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockTemplates.map(template => ({
        ...template,
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString()
      })))
    })

    it('should fetch templates', async () => {
      const { req } = createMocks({
        method: 'GET'
      })

      ;(prismaMock.template.findMany as jest.Mock).mockResolvedValue([mockTemplates[0]])

      const response = await GET(req as unknown as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual([mockTemplates[0]])
    })
  })
}) 