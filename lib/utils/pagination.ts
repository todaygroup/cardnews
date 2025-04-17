export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export function getPaginationParams(params: PaginationParams) {
  const page = Math.max(1, params.page || 1)
  const limit = Math.min(100, Math.max(1, params.limit || 10))
  const skip = (page - 1) * limit

  return {
    skip,
    take: limit,
    orderBy: params.sortBy ? {
      [params.sortBy]: params.sortOrder || 'desc'
    } : undefined
  }
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResponse<T> {
  const page = params.page || 1
  const limit = params.limit || 10
  const totalPages = Math.ceil(total / limit)

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages
    }
  }
} 