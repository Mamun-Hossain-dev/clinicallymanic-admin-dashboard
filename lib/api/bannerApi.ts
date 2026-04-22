// ============================================
// File: lib/api/bannerApi.ts
// ============================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

type BackendBanner = {
  id: string
  title: string
  description: string
  bannerImageUrl?: string | null
  category: string
  status: 'ACTIVE' | 'INACTIVE'
  createdById: string
  createdAt: string
  updatedAt: string
}

const normalizeBanner = (banner: BackendBanner) => ({
  _id: banner.id,
  title: banner.title,
  description: banner.description,
  image: banner.bannerImageUrl || '',
  type: banner.category,
  status: banner.status.toLowerCase(),
  createdBy: banner.createdById,
  createdAt: banner.createdAt,
  updatedAt: banner.updatedAt,
})

const handleResponseError = async (res: Response, fallbackMessage: string) => {
  const payload = await res.json().catch(() => null)
  const error = new Error(payload?.message || fallbackMessage) as Error & {
    status?: number
  }
  error.status = res.status
  throw error
}

export const bannerApi = {
  getAll: async (page = 1, limit = 10) => {
    const res = await fetch(
      `${API_BASE_URL}/banners?page=${page}&limit=${limit}`,
    )
    if (!res.ok) {
      await handleResponseError(res, 'Failed to fetch banners')
    }
    const response = await res.json()
    return {
      ...response,
      data: response.data.map(normalizeBanner),
    }
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/banners/${id}`)
    if (!res.ok) {
      await handleResponseError(res, 'Failed to fetch banner')
    }
    const response = await res.json()
    return {
      ...response,
      data: normalizeBanner(response.data),
    }
  },

  create: async (formData: FormData, token: string) => {
    const res = await fetch(`${API_BASE_URL}/banners`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) {
      await handleResponseError(res, 'Failed to create banner')
    }
    return res.json()
  },

  update: async (id: string, formData: FormData, token: string) => {
    const res = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) {
      await handleResponseError(res, 'Failed to update banner')
    }
    return res.json()
  },

  delete: async (id: string, token: string) => {
    const res = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) {
      await handleResponseError(res, 'Failed to delete banner')
    }
    return res.json()
  },
}
