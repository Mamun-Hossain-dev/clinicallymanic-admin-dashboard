// ============================================
// File: app/banner-management/page.tsx
// ============================================

'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import type { Banner } from '@/types/banner'
import {
  useBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
} from '@/hooks/useBanner'
import { TableSkeleton } from '@/components/common/tableSkeleton'
import { NoDataFound } from '@/components/common/no-data-found'
import { BannerTable } from './banner-table'
import { Pagination } from '@/components/common/table-pagination'
import { BannerFormModal } from './banner-form'
import { DeleteModal } from '@/components/common/delete-modal'

export default function BannerManagementPage() {
  const { data: session } = useSession()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const [showFormModal, setShowFormModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [deletingBanner, setDeletingBanner] = useState<{
    id: string
    title: string
  } | null>(null)

  // React Query hooks
  const { data, isLoading, error } = useBanners(page, limit)
  const createBanner = useCreateBanner()
  const updateBanner = useUpdateBanner()
  const deleteBanner = useDeleteBanner()

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editingBanner) {
        await updateBanner.mutateAsync({ id: editingBanner._id, formData })
      } else {
        await createBanner.mutateAsync(formData)
      }
      setShowFormModal(false)
      setEditingBanner(null)
    } catch (error) {
      console.error('Error submitting banner:', error)
    }
  }

  const handleDelete = async () => {
    if (!deletingBanner) return
    try {
      await deleteBanner.mutateAsync(deletingBanner.id)
      setShowDeleteModal(false)
      setDeletingBanner(null)
    } catch (error) {
      console.error('Error deleting banner:', error)
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setShowFormModal(true)
  }

  const handleDeleteClick = (banner: Banner) => {
    setDeletingBanner({ id: banner._id, title: banner.title })
    setShowDeleteModal(true)
  }

  const banners = data?.data || []
  const meta = data?.meta || { total: 0, page: 1, limit: 10 }

  const filteredBanners = banners.filter(banner =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Error Loading Banners
          </h2>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Banner Management</h1>
              <p className="text-base text-gray-400">
                Manage banners and promotional content
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingBanner(null)
                setShowFormModal(true)
              }}
              className="text-base"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Banner
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search banners..."
              className="w-full pl-10 pr-4 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 rounded-lg border border-gray-700">
          {isLoading ? (
            <TableSkeleton />
          ) : filteredBanners.length === 0 ? (
            <NoDataFound message="No banners found" />
          ) : (
            <>
              <BannerTable
                banners={filteredBanners}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
              <Pagination
                meta={meta}
                onPageChange={newPage => setPage(newPage)}
                onPageSizeChange={newLimit => {
                  setLimit(newLimit)
                  setPage(1)
                }}
              />
            </>
          )}
        </div>

        {/* Modals */}
        <BannerFormModal
          isOpen={showFormModal}
          onClose={() => {
            setShowFormModal(false)
            setEditingBanner(null)
          }}
          onSubmit={handleSubmit}
          banner={editingBanner}
          isLoading={createBanner.isPending || updateBanner.isPending}
        />

        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setDeletingBanner(null)
          }}
          onConfirm={handleDelete}
          title={deletingBanner?.title || ''}
          // isLoading={deleteBanner.isPending}
        />
      </div>
    </div>
  )
}
