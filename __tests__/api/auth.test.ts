import { prismaMock } from '../../jest.setup'
import { POST } from '@/app/api/auth/register/route'
import { NextRequest } from 'next/server'

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should create a new user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const req = {
        json: async () => ({
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123'
        })
      }

      prismaMock.user.findUnique.mockResolvedValue(null)
      prismaMock.user.create.mockResolvedValue(mockUser)

      const response = await POST(req as unknown as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name
      })
    })

    it('should return 400 if email is already taken', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const req = {
        json: async () => ({
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123'
        })
      }

      prismaMock.user.findUnique.mockResolvedValue(mockUser)

      const response = await POST(req as unknown as NextRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        error: '이미 사용 중인 이메일입니다.'
      })
    })
  })
}) 