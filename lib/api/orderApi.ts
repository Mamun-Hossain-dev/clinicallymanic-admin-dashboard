// lib/api/bookingApi.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export const bookingApi = {
  getAll: async (page = 1, limit = 10, token: string) => {
    const res = await fetch(
      `${API_BASE_URL}/booking?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (!res.ok) throw new Error('Failed to fetch bookings')
    return res.json()
  },

  getById: async (id: string, token: string) => {
    const res = await fetch(`${API_BASE_URL}/booking/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error('Failed to fetch booking')
    return res.json()
  },

  updateStatus: async (id: string, status: string, token: string) => {
    const res = await fetch(`${API_BASE_URL}/booking/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error('Failed to update booking status')
    return res.json()
  },

  delete: async (id: string, token: string) => {
    const res = await fetch(`${API_BASE_URL}/booking/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error('Failed to delete booking')
    return res.json()
  },
}
