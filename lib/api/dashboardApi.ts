// ============================================
// File: lib/api/dashboardApi.ts
// ============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export interface DashboardOverview {
  totalRevenue: number
  totalUser: number
  subscriptionRevenue: number
  shopRevenue: number
}

export interface RevenueData {
  month: string
  revenue: number
}

export interface UserGrowthData {
  month: string
  users: number
}

export interface Contact {
  _id: string
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

const getOverview = async (token: string): Promise<DashboardOverview> => {
  const response = await fetch(`${API_URL}/dashboard/overview`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard overview')
  }

  const result: ApiResponse<any> = await response.json()
  return {
    totalRevenue: result.data.totalRevenue,
    totalUser: result.data.totalUsers,
    subscriptionRevenue: result.data.subscriptionRevenue,
    shopRevenue: result.data.shopRevenue,
  }
}

const getRevenueOverview = async (
  year: number,
  token: string,
): Promise<RevenueData[]> => {
  const response = await fetch(
    `${API_URL}/dashboard/revenue-overview?year=${year}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch revenue overview')
  }

  const result: ApiResponse<{ month: string; value: number }[]> = await response.json()
  return result.data.map(item => ({
    month: item.month,
    revenue: item.value,
  }))
}

const getUserGrowth = async (token: string): Promise<UserGrowthData[]> => {
  const response = await fetch(
    `${API_URL}/dashboard/user-growth?year=${new Date().getFullYear()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch user growth data')
  }

  const result: ApiResponse<{ month: string; value: number }[]> = await response.json()
  return result.data.map(item => ({
    month: item.month,
    users: item.value,
  }))
}

const getLatestContacts = async (token: string): Promise<Contact[]> => {
  const response = await fetch(`${API_URL}/contacts?page=1&limit=4`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch latest contacts')
  }

  const result: ApiResponse<any[]> = await response.json()
  return result.data.map(contact => ({
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
  }))
}

export const dashboardApi = {
  getOverview,
  getRevenueOverview,
  getUserGrowth,
  getLatestContacts,
}
