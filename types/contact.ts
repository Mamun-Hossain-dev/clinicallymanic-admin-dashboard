// ============================================
// File: lib/types/contact.ts
// ============================================

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

export interface PaginationMeta {
  total: number
  page: number
  limit: number
}

export interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  meta: PaginationMeta
  data: T
}
