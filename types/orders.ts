// types/booking.ts

export interface BookingUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  profileImage: string
  verified: boolean
  isSubscription: boolean
  createdAt: string
  updatedAt: string
  subscription?: string
  subscriptionExpiry?: string
}

export interface BookingShop {
  _id: string
  name: string
  title: string
  description: string
  images: string[]
  size: string[]
  price: number
  type: string
  status: string
  details: string
  createdBy: string
  totalShopUsers?: string[]
  createdAt: string
  updatedAt: string
}

export interface Booking {
  _id: string
  shopId?: BookingShop
  userId?: BookingUser
  productName?: string
  name: string
  phone: string
  email: string
  price: number
  location: string
  size?: string
  status: 'pending' | 'shipping' | 'completed' | 'cancelled'
  bookingDate: string
  createdAt: string
  updatedAt: string
  paymentId?: string
}

export interface BookingResponse {
  statusCode: number
  success: boolean
  message: string
  meta: {
    page: number
    limit: number
    total: number
  }
  data: Booking[]
}

export interface SingleBookingResponse {
  statusCode: number
  success: boolean
  message: string
  data: Booking
}
