// ============================================
// File: lib/api/dashboardApi.ts
// ============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

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
  const response = await fetch(`${API_URL}/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard overview')
  }

  const result: ApiResponse<DashboardOverview> = await response.json()
  return result.data
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

  const result: ApiResponse<RevenueData[]> = await response.json()
  return result.data
}

const getUserGrowth = async (token: string): Promise<UserGrowthData[]> => {
  const response = await fetch(`${API_URL}/dashboard/user-growth`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user growth data')
  }

  const result: ApiResponse<UserGrowthData[]> = await response.json()
  return result.data
}

const getLatestContacts = async (token: string): Promise<Contact[]> => {
  const response = await fetch(`${API_URL}/contact?page=1&limit=4`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch latest contacts')
  }

  const result: ApiResponse<Contact[]> = await response.json()
  return result.data
}

export const dashboardApi = {
  getOverview,
  getRevenueOverview,
  getUserGrowth,
  getLatestContacts,
}
