// lib/api/shopApi.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export const shopApi = {
  getAll: async (page = 1, limit = 10) => {
    const res = await fetch(`${API_BASE_URL}/shop?page=${page}&limit=${limit}`)
    if (!res.ok) throw new Error('Failed to fetch shops')
    return res.json()
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/shop/${id}`)
    if (!res.ok) throw new Error('Failed to fetch shop')
    return res.json()
  },

  create: async (formData: FormData, token: string) => {
    const res = await fetch(`${API_BASE_URL}/shop`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) throw new Error('Failed to create shop')
    return res.json()
  },

  update: async (id: string, formData: FormData, token: string) => {
    const res = await fetch(`${API_BASE_URL}/shop/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) throw new Error('Failed to update shop')
    return res.json()
  },

  delete: async (id: string, token: string) => {
    const res = await fetch(`${API_BASE_URL}/shop/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error('Failed to delete shop')
    return res.json()
  },
}
