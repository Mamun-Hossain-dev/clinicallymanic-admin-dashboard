// ============================================
// File: lib/api/bannerApi.ts
// ============================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export const bannerApi = {
  getAll: async (page = 1, limit = 10) => {
    const res = await fetch(
      `${API_BASE_URL}/banner?page=${page}&limit=${limit}`,
    )
    if (!res.ok) throw new Error('Failed to fetch banners')
    return res.json()
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/banner/${id}`)
    if (!res.ok) throw new Error('Failed to fetch banner')
    return res.json()
  },

  create: async (formData: FormData, token: string) => {
    const res = await fetch(`${API_BASE_URL}/banner`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) throw new Error('Failed to create banner')
    return res.json()
  },

  update: async (id: string, formData: FormData, token: string) => {
    const res = await fetch(`${API_BASE_URL}/banner/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) throw new Error('Failed to update banner')
    return res.json()
  },

  delete: async (id: string, token: string) => {
    const res = await fetch(`${API_BASE_URL}/banner/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error('Failed to delete banner')
    return res.json()
  },
}
