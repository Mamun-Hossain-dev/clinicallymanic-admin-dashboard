// lib/api/shopApi.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

const normalizeShop = (shop: any) => ({
  _id: shop.id,
  name: shop.name,
  title: shop.title,
  description: shop.description,
  images: shop.imageUrls || [],
  size: shop.sizes || [],
  price: Number(shop.price),
  type: shop.type.toLowerCase(),
  status: shop.status.toLowerCase(),
  details: shop.details || '',
  categories: (shop.categories || []).map((category: string) =>
    category.toLowerCase(),
  ),
  createdBy: shop.createdById || '',
  createdAt: shop.createdAt,
  updatedAt: shop.updatedAt,
})

export const shopApi = {
  getAll: async (page = 1, limit = 10) => {
    const res = await fetch(
      `${API_BASE_URL}/shop/products?page=${page}&limit=${limit}`,
    )
    if (!res.ok) throw new Error('Failed to fetch shops')
    const response = await res.json()
    return {
      ...response,
      data: response.data.map(normalizeShop),
    }
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/shop/products/${id}`)
    if (!res.ok) throw new Error('Failed to fetch shop')
    const response = await res.json()
    return {
      ...response,
      data: normalizeShop(response.data),
    }
  },

  create: async (formData: FormData, token: string) => {
    const res = await fetch(`${API_BASE_URL}/shop/products`, {
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
    const res = await fetch(`${API_BASE_URL}/shop/products/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!res.ok) throw new Error('Failed to update shop')
    return res.json()
  },

  delete: async (id: string, token: string) => {
    const res = await fetch(`${API_BASE_URL}/shop/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error('Failed to delete shop')
    return res.json()
  },
}
