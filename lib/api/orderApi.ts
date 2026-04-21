// lib/api/bookingApi.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

const normalizeBooking = (booking: any) => ({
  _id: booking.id,
  shopId: booking.product
    ? {
        _id: booking.product.id,
        name: booking.product.name,
        title: booking.product.title,
        description: booking.product.description,
        images: booking.product.imageUrls || [],
        size: booking.product.sizes || [],
        price: Number(booking.product.price),
        type: booking.product.type.toLowerCase(),
        status: booking.product.status.toLowerCase(),
        details: booking.product.details || '',
        createdBy: booking.product.createdById || '',
        createdAt: booking.product.createdAt,
        updatedAt: booking.product.updatedAt,
      }
    : undefined,
  userId: booking.user
    ? {
        _id: booking.user.id,
        firstName: booking.user.firstName || '',
        lastName: booking.user.lastName || '',
        email: booking.user.email,
        role: booking.user.role,
        profileImage: booking.user.profileImage,
        verified: booking.user.verified,
        isSubscription: booking.user.isSubscribed,
        createdAt: booking.user.createdAt,
        updatedAt: booking.user.updatedAt,
      }
    : undefined,
  productName: booking.productName,
  name: booking.customerName,
  phone: booking.customerPhone || '',
  email: booking.customerEmail || '',
  price: Number(booking.price),
  location: booking.deliveryLocation || '',
  size: booking.size || undefined,
  status:
    booking.status === 'SHIPPED'
      ? 'shipping'
      : booking.status === 'DELIVERED'
        ? 'completed'
        : booking.status.toLowerCase(),
  bookingDate: booking.orderDate,
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
  paymentId: booking.payment?.id,
})

export const bookingApi = {
  getAll: async (page = 1, limit = 10, token: string) => {
    const res = await fetch(
      `${API_BASE_URL}/shop/orders?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (!res.ok) throw new Error('Failed to fetch bookings')
    const response = await res.json()
    return {
      ...response,
      data: response.data.map(normalizeBooking),
    }
  },

  getById: async (id: string, token: string) => {
    const res = await fetch(`${API_BASE_URL}/shop/orders?page=1&limit=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error('Failed to fetch booking')
    const response = await res.json()
    const booking = response.data.find((item: any) => item.id === id)
    return {
      ...response,
      data: booking ? normalizeBooking(booking) : null,
    }
  },

  updateStatus: async (id: string, status: string, token: string) => {
    const mappedStatus =
      status === 'shipping'
        ? 'SHIPPED'
        : status === 'completed'
          ? 'DELIVERED'
          : status.toUpperCase()

    const res = await fetch(`${API_BASE_URL}/shop/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: mappedStatus }),
    })
    if (!res.ok) throw new Error('Failed to update booking status')
    return res.json()
  },

  delete: async (id: string, token: string) => {
    throw new Error('Order delete is not supported by the backend')
  },
}
