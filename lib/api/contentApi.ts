// ============================================
// File: lib/api/contentApi.ts
// ============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export interface ContentMedia {
  type: 'youtube' | 'spotify' | 'article'
  data: {
    videourl?: string
    previewurl?: string
    description?: string
    body?: string
  }
  _id?: string
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

type BackendContent = {
  id: string
  category: string
  type: 'ARTICLE' | 'YOUTUBE' | 'SPOTIFY'
  title: string
  description: string
  thumbnailUrl?: string | null
  body?: string | null
  videoUrl?: string | null
  audioUrl?: string | null
  createdById: string
  createdAt: string
  updatedAt: string
}

const normalizeContent = (content: BackendContent): Content => ({
  _id: content.id,
  category: content.category,
  contentType:
    content.type === 'ARTICLE'
      ? 'article'
      : content.type === 'YOUTUBE'
        ? 'Youtube-videos'
        : 'Spotify-audios',
  title: content.title,
  thumbnail: content.thumbnailUrl || '',
  media: [
    {
      type:
        content.type === 'ARTICLE'
          ? 'article'
          : content.type === 'YOUTUBE'
            ? 'youtube'
            : 'spotify',
      data:
        content.type === 'ARTICLE'
          ? { body: content.body || '', description: content.description }
          : content.type === 'YOUTUBE'
            ? { videourl: content.videoUrl || '', description: content.description }
            : { previewurl: content.audioUrl || '', description: content.description },
    },
  ],
  createdBy: content.createdById,
  createdAt: content.createdAt,
  updatedAt: content.updatedAt,
})

const getAll = async (
  page: number,
  limit: number,
  contentType?: string,
  category?: string,
  token?: string,
): Promise<ApiResponse<Content[]>> => {
  let url = `${API_URL}/contents?page=${page}&limit=${limit}`

  if (contentType) {
    const mappedType =
      contentType === 'article'
        ? 'ARTICLE'
        : contentType === 'Youtube-videos'
          ? 'YOUTUBE'
          : contentType === 'Spotify-audios'
            ? 'SPOTIFY'
            : contentType
    url += `&type=${mappedType}`
  }
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

  const result: ApiResponse<BackendContent[]> = await response.json()
  return {
    ...result,
    data: result.data.map(normalizeContent),
  }
}

const getSingle = async (id: string, token?: string): Promise<Content> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}/contents/${id}`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch content')
  }

  const result: ApiResponse<BackendContent> = await response.json()
  return normalizeContent(result.data)
}

const create = async (formData: FormData, token: string): Promise<Content> => {
  const response = await fetch(`${API_URL}/contents`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to create content')
  }

  const result: ApiResponse<BackendContent> = await response.json()
  return normalizeContent(result.data)
}

const update = async (
  id: string,
  formData: FormData,
  token: string,
): Promise<Content> => {
  const response = await fetch(`${API_URL}/contents/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to update content')
  }

  const result: ApiResponse<BackendContent> = await response.json()
  return normalizeContent(result.data)
}

const deleteContent = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/contents/${id}`, {
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
