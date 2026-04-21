// app/orders-management/_components/orders-management.tsx

'use client'

import { useState } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Package, Search, Filter } from 'lucide-react'

import { TableSkeleton } from '@/components/common/tableSkeleton'
import { NoDataFound } from '@/components/common/no-data-found'

import { Pagination } from '@/components/common/table-pagination'
import { DeleteModal } from '@/components/common/delete-modal'

import { Input } from '@/components/ui/input'
import { Booking } from '@/types/orders'
import { bookingApi } from '@/lib/api/orderApi'
import { BookingTable } from './order-table'
import { BookingViewModal } from './orderViewModal'

export default function OrdersManagementPage() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const token = session?.user?.accessToken || ''

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)

  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null)
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null)

  /* =======================
     Fetch Bookings
  ======================= */
  const { data, isLoading } = useQuery({
    queryKey: ['bookings', page, limit],
    queryFn: () => bookingApi.getAll(page, limit, token),
    placeholderData: keepPreviousData,
    enabled: !!token,
  })

  const bookings: Booking[] = data?.data || []
  const meta = data?.meta

  /* =======================
     Update Status
  ======================= */
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      if (!token) throw new Error('Unauthorized')
      return bookingApi.updateStatus(id, status, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })

  /* =======================
     Delete
  ======================= */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Unauthorized')
      return bookingApi.delete(id, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      setShowDeleteModal(false)
      setDeletingBooking(null)
    },
  })

  const handleStatusChange = (booking: Booking, status: string) => {
    updateStatusMutation.mutate({ id: booking._id, status })
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm) ||
      booking.productName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    shipping: bookings.filter(b => b.status === 'shipping').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  return (
    <div className="min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            Orders Management
          </h1>
          <p className="text-gray-400">Manage customer orders and bookings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-white">{statusCounts.all}</p>
        </div>
        <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4">
          <p className="text-yellow-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">
            {statusCounts.pending}
          </p>
        </div>
        <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
          <p className="text-blue-400 text-sm">Shipping</p>
          <p className="text-2xl font-bold text-blue-400">
            {statusCounts.shipping}
          </p>
        </div>
        <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
          <p className="text-green-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-400">
            {statusCounts.completed}
          </p>
        </div>
        <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4">
          <p className="text-red-400 text-sm">Cancelled</p>
          <p className="text-2xl font-bold text-red-400">
            {statusCounts.cancelled}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, email, phone, or product..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="shipping">Shipping</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700">
        {isLoading ? (
          <TableSkeleton />
        ) : filteredBookings.length === 0 ? (
          <NoDataFound message="No orders found" />
        ) : (
          <>
            <BookingTable
              bookings={filteredBookings}
              onView={booking => {
                setViewingBooking(booking)
                setShowViewModal(true)
              }}
              onDelete={booking => {
                setDeletingBooking(booking)
                setShowDeleteModal(true)
              }}
              onStatusChange={handleStatusChange}
            />

            <Pagination
              meta={meta}
              onPageChange={setPage}
              onPageSizeChange={l => {
                setLimit(l)
                setPage(1)
              }}
            />
          </>
        )}
      </div>

      {/* Modals */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() =>
          deletingBooking && deleteMutation.mutate(deletingBooking._id)
        }
        title={`Order #${deletingBooking?._id.slice(-8)}`}
      />

      <BookingViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        booking={viewingBooking}
      />
    </div>
  )
}
