// ============================================
// File 1: types/shop.ts (FIXED)
// ============================================
export interface Shop {
  _id: string
  name?: string
  title: string
  description: string
  images: string[]
  size?: string[]
  price: number
  type: 'exclusive' | 'clothing' | 'shoes' | 'accessories' | 'other'
  status: 'active' | 'inactive'
  details?: string
  categories: ('mens' | 'womens' | 'childrens' | 'accessories' | 'other')[]
  createdBy: string
  totalShopUsers?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
}
