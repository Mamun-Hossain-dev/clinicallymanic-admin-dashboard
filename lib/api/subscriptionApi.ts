import { useQuery, useMutation } from '@tanstack/react-query'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

// =====================
// Types
// =====================
export interface Subscription {
  _id: string
  name: 'exclusive' | 'basic'
  type: 'monthly' | 'yearly' | 'weekly'
  price: number
  status: 'active' | 'inactive'
  features: string[]
  totalSubscribedUsers: string[]
  createdAt: string
  updatedAt: string
}

export interface SubscriptionsResponse {
  statusCode: number
  success: boolean
  message: string
  meta: {
    total: number
    page: number
    limit: number
  }
  data: Subscription[]
}

export interface PaymentResponse {
  statusCode: number
  success: boolean
  message: string
  data: {
    url: string
    sessionId: string
  }
}

// =====================
// Get all subscriptions
// =====================
export const useGetSubscriptions = () => {
  return useQuery<SubscriptionsResponse>({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/subscription`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!res.ok) {
        throw new Error('Failed to fetch subscriptions')
      }

      return res.json()
    },
  })
}

// =====================
// Pay for subscription
// =====================
export const usePaySubscription = () => {
  return useMutation({
    mutationFn: async ({
      subscriptionId,
      token,
    }: {
      subscriptionId: string
      token: string
    }) => {
      const res = await fetch(`${API_URL}/subscription/pay/${subscriptionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.message || 'Payment failed')
      }

      return (await res.json()) as PaymentResponse
    },
  })
}
