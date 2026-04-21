// app/orders-management/_components/booking-table.tsx

import { Eye, Trash2 } from 'lucide-react'
import type { Booking } from '@/types/orders'
import Image from 'next/image'

interface BookingTableProps {
  bookings: Booking[]
  onView: (booking: Booking) => void
  onDelete?: (booking: Booking) => void
  onStatusChange: (booking: Booking, status: string) => void
}

export const BookingTable = ({
  bookings,
  onView,
  onDelete,
  onStatusChange,
}: BookingTableProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600/20 text-green-400'
      case 'shipping':
        return 'bg-blue-600/20 text-blue-400'
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400'
      case 'cancelled':
        return 'bg-red-600/20 text-red-400'
      default:
        return 'bg-gray-600/20 text-gray-400'
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-800 border-b border-gray-700">
          <tr>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Product
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Customer
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Contact
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Location
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Price
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Status
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Date
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr
              key={booking._id}
              className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {booking.shopId?.images?.[0] && (
                    <Image
                      src={booking.shopId.images[0]}
                      alt={booking.productName || 'Product'}
                      width={48}
                      height={48}
                      className="object-cover rounded"
                    />
                  )}
                  <div>
                    <div className="text-base text-white font-medium">
                      {booking.productName || booking.shopId?.title || 'N/A'}
                    </div>
                    {booking.size && (
                      <div className="text-sm text-gray-400">
                        Size: {booking.size}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-base text-gray-300">{booking.name}</div>
                {booking.userId && (
                  <div className="text-sm text-gray-400">
                    {booking.userId.firstName} {booking.userId.lastName}
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-base text-gray-300">{booking.phone}</div>
                <div className="text-sm text-gray-400">{booking.email}</div>
              </td>
              <td className="px-6 py-4 text-base text-gray-300 max-w-xs truncate">
                {booking.location}
              </td>
              <td className="px-6 py-4 text-base text-gray-300 font-medium">
                {formatPrice(booking.price)}
              </td>
              <td className="px-6 py-4">
                <select
                  value={booking.status}
                  onChange={e => onStatusChange(booking, e.target.value)}
                  className={`px-3 py-1 text-sm rounded-full border-0 cursor-pointer ${getStatusColor(
                    booking.status,
                  )}`}
                >
                  <option value="pending">Pending</option>
                  <option value="shipping">Shipping</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td className="px-6 py-4 text-base text-gray-300">
                {formatDate(booking.bookingDate)}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(booking)}
                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5 text-gray-400" />
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(booking)}
                      className="p-2 hover:bg-gray-700 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5 text-red-400" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
