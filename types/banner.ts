export interface Banner {
  _id: string
  title: string
  description: string
  image: string
  type: string
  status: 'active' | 'inactive'
  createdBy: string
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
