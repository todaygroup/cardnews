/// <reference types="@types/jest" />

import '@testing-library/jest-dom'
import { mockDeep, mockReset } from 'jest-mock-extended'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn()
}))

const prismaMock = mockDeep<PrismaClient>()

// 기본 모의 구현을 설정합니다
prismaMock.template.findMany.mockResolvedValue([
  {
    id: '1',
    title: 'Test Template 1',
    description: 'Test Description 1',
    category: 'GENERAL',
    isPublic: true,
    slides: [],
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: '1',
    thumbnail: null,
    language: 'ko',
    translations: {},
    usageCount: 0,
  },
])

prismaMock.user.findUnique.mockResolvedValue({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedpassword',
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
})

// Mock Request and Response
global.Request = class Request {
  constructor(input: RequestInfo | URL, init?: RequestInit) {}
} as any;

global.Response = class Response {
  constructor(body?: BodyInit | null, init?: ResponseInit) {}
  json() {
    return Promise.resolve({});
  }
} as any;

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: ResponseInit) => {
      return {
        status: init?.status || 200,
        json: () => Promise.resolve(body),
      };
    },
  },
}));

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

const mockSession = {
  user: {
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
}

;(getServerSession as jest.Mock).mockImplementation(() => {
  return Promise.resolve(mockSession)
})

beforeEach(() => {
  mockReset(prismaMock)
})

export { prismaMock } 