// ============================================
// File 2: app/shop-management/page.tsx (FIXED - ShopViewModal)
// ============================================
'use client'

import { useState } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Plus, Search } from 'lucide-react'
import { shopApi } from '@/lib/api/shopApi'
import { Shop } from '@/types/shop'
import { toast } from 'sonner'
import { TableSkeleton } from '@/components/common/tableSkeleton'
import { NoDataFound } from '@/components/common/no-data-found'

import { Button } from '@/components/ui/button'
import { ShopTable } from './shop-table'
import { Pagination } from '@/components/common/table-pagination'
import { ShopFormModal } from './shop-form-modal'
import { DeleteModal } from '@/components/common/delete-modal'
import { ShopViewModal } from './shop-view-modal'

export default function ShopManagementPage() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const token = session?.user?.accessToken || ''

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  const [showFormModal, setShowFormModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)

  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const [viewingShop, setViewingShop] = useState<Shop | null>(null)
  const [deletingShop, setDeletingShop] = useState<Shop | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['shops', page, limit],
    queryFn: () => shopApi.getAll(page, limit),
    placeholderData: keepPreviousData,
  })

  const shops: Shop[] = data?.data || []
  const meta = data?.meta

  const upsertMutation = useMutation({
    mutationFn: (formData: FormData) => {
      if (!token) throw new Error('Unauthorized')
      return editingShop
        ? shopApi.update(editingShop._id, formData, token)
        : shopApi.create(formData, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] })
      setShowFormModal(false)
      setEditingShop(null)
      toast.success(
        editingShop ? 'Product updated successfully' : 'Product created successfully',
      )
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save product')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Unauthorized')
      return shopApi.delete(id, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] })
      setShowDeleteModal(false)
      setDeletingShop(null)
      toast.success('Product deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete product')
    },
  })

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesType =
      filterType === 'all' ||
      shop.type.toLowerCase() === filterType.toLowerCase()
    const matchesCategory =
      filterCategory === 'all' ||
      shop.categories.includes(filterCategory as any)

    return matchesSearch && matchesType && matchesCategory
  })

  return (
    <div className="min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Shop Management</h1>
          <p className="text-gray-400">Manage your shop products</p>
        </div>

        <Button
          onClick={() => {
            setEditingShop(null)
            setShowFormModal(true)
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="standard">Standard</option>
          <option value="exclusive">Exclusive</option>
        </select>

        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="mens">Mens</option>
          <option value="womens">Womens</option>
          <option value="childrens">Childrens</option>
          <option value="accessories">Accessories</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="bg-gray-800/50 rounded-lg border border-gray-700">
        {isLoading ? (
          <TableSkeleton />
        ) : filteredShops.length === 0 ? (
          <NoDataFound message="No products found" />
        ) : (
          <>
            <ShopTable
              shops={filteredShops}
              onEdit={shop => {
                setEditingShop(shop)
                setShowFormModal(true)
              }}
              onView={shop => {
                setViewingShop(shop)
                setShowViewModal(true)
              }}
              onDelete={shop => {
                setDeletingShop(shop)
                setShowDeleteModal(true)
              }}
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
      <ShopFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false)
          setEditingShop(null)
        }}
        onSubmit={formData => upsertMutation.mutate(formData)}
        shop={editingShop}
        loading={upsertMutation.isPending}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() =>
          deletingShop && deleteMutation.mutate(deletingShop._id)
        }
        title={deletingShop?.title || ''}
      />

      <ShopViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        shop={viewingShop}
      />
    </div>
  )
}
