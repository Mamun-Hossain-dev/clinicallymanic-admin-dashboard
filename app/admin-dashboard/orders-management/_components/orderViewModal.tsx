// app/orders-management/_components/booking-view-modal.tsx

import { X } from 'lucide-react'
import type { Booking } from '@/types/orders'
import Image from 'next/image'

interface BookingViewModalProps {
  isOpen: boolean
  onClose: () => void
  booking: Booking | null
}

export const BookingViewModal = ({
  isOpen,
  onClose,
  booking,
}: BookingViewModalProps) => {
  if (!isOpen || !booking) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600/20 text-green-400 border-green-600'
      case 'shipping':
        return 'bg-blue-600/20 text-blue-400 border-blue-600'
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-600'
      case 'cancelled':
        return 'bg-red-600/20 text-red-400 border-red-600'
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Order ID</p>
              <p className="text-lg font-mono text-white">{booking._id}</p>
            </div>
            <span
              className={`px-4 py-2 text-sm rounded-full border ${getStatusColor(
                booking.status,
              )}`}
            >
              {booking.status.toUpperCase()}
            </span>
          </div>

          {/* Product Information */}
          {booking.shopId && (
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">
                Product Information
              </h3>
              <div className="flex gap-4">
                {booking.shopId.images?.[0] && (
                  <Image
                    src={booking.shopId.images[0]}
                    alt={booking.shopId.title}
                    width={100}
                    height={100}
                    className="object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="text-white font-medium text-lg">
                    {booking.shopId.title}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {booking.shopId.description}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <p className="text-gray-300">
                      <span className="text-gray-400">Type:</span>{' '}
                      {booking.shopId.type}
                    </p>
                    {booking.size && (
                      <p className="text-gray-300">
                        <span className="text-gray-400">Size:</span>{' '}
                        {booking.size}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Information */}
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-gray-300">{booking.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-gray-300">{booking.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-gray-300">{booking.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-gray-300">{booking.location}</p>
              </div>
            </div>

            {booking.userId && (
              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="flex items-center gap-3">
                  <Image
                    src={booking.userId.profileImage}
                    alt={booking.userId.firstName}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">
                      {booking.userId.firstName} {booking.userId.lastName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {booking.userId.email}
                    </p>
                    {booking.userId.isSubscription && (
                      <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded mt-1 inline-block">
                        Premium Member
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Information */}
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">
              Payment Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Price</span>
                <span className="text-white font-medium">
                  {formatPrice(booking.price)}
                </span>
              </div>
              {booking.paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment ID</span>
                  <span className="text-gray-300 font-mono text-sm">
                    {booking.paymentId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Timeline</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Booking Date</span>
                <span className="text-gray-300">
                  {formatDate(booking.bookingDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Created At</span>
                <span className="text-gray-300">
                  {formatDate(booking.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-gray-300">
                  {formatDate(booking.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
