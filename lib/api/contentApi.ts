// ============================================
// File: lib/api/contentApi.ts
// ============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export interface ContentMedia {
  type: 'youtube' | 'spotify' | 'article'
  data: {
    videourl?: string
    previewurl?: string
    description?: string
    body?: string
  }
  _id: string
}

export interface Content {
  _id: string
  category: string
  contentType: string
  title: string
  thumbnail: string
  media: ContentMedia[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
  meta?: {
    page: number
    limit: number
    total: number
  }
}

const getAll = async (
  page: number,
  limit: number,
  contentType?: string,
  category?: string,
  token?: string,
): Promise<ApiResponse<Content[]>> => {
  let url = `${API_URL}/content?page=${page}&limit=${limit}`

  if (contentType) url += `&contentType=${contentType}`
  if (category) url += `&category=${category}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch content')
  }

  return response.json()
}

const getSingle = async (id: string, token?: string): Promise<Content> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}/content/${id}`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch content')
  }

  const result: ApiResponse<Content> = await response.json()
  return result.data
}

const create = async (formData: FormData, token: string): Promise<Content> => {
  const response = await fetch(`${API_URL}/content`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to create content')
  }

  const result: ApiResponse<Content> = await response.json()
  return result.data
}

const update = async (
  id: string,
  formData: FormData,
  token: string,
): Promise<Content> => {
  const response = await fetch(`${API_URL}/content/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to update content')
  }

  const result: ApiResponse<Content> = await response.json()
  return result.data
}

const deleteContent = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/content/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete content')
  }
}

export const contentApi = {
  getAll,
  getSingle,
  create,
  update,
  delete: deleteContent,
}
