// ============================================
// File: lib/api/contactApi.ts
// ============================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

type BackendContact = {
  id: string
  name: string
  email: string
  phoneNumber: string
  occupation: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

const normalizeContact = (contact: BackendContact) => ({
  _id: contact.id,
  name: contact.name,
  email: contact.email,
  phoneNumber: contact.phoneNumber,
  occupation: contact.occupation,
  subject: contact.subject,
  message: contact.message,
  isRead: contact.isRead,
  createdAt: contact.createdAt,
  updatedAt: contact.updatedAt,
})

export const contactApi = {
  getAll: async (page = 1, limit = 10) => {
    const res = await fetch(
      `${API_BASE_URL}/contacts?page=${page}&limit=${limit}`,
    )
    if (!res.ok) throw new Error('Failed to fetch contacts')
    const response = await res.json()
    return {
      ...response,
      data: response.data.map(normalizeContact),
    }
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/contacts/${id}`)
    if (!res.ok) throw new Error('Failed to fetch contact')
    const response = await res.json()
    return {
      ...response,
      data: normalizeContact(response.data),
    }
  },

  delete: async (id: string, token: string) => {
    const res = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error('Failed to delete contact')
    return res.json()
  },
}
