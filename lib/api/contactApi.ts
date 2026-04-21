// ============================================
// File: lib/api/contactApi.ts
// ============================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export const contactApi = {
  getAll: async (page = 1, limit = 10) => {
    const res = await fetch(
      `${API_BASE_URL}/contact?page=${page}&limit=${limit}`,
    )
    if (!res.ok) throw new Error('Failed to fetch contacts')
    return res.json()
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/contact/${id}`)
    if (!res.ok) throw new Error('Failed to fetch contact')
    return res.json()
  },

  delete: async (id: string, token: string) => {
    const res = await fetch(`${API_BASE_URL}/contact/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error('Failed to delete contact')
    return res.json()
  },
}
