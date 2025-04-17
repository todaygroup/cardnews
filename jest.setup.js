const { mockDeep } = require('jest-mock-extended')

const prismaMock = mockDeep()

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: prismaMock
}))

beforeEach(() => {
  jest.clearAllMocks()
})

module.exports = { prismaMock } 