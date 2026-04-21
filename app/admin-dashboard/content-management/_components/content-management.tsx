'use client'

import { useState } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { contentApi } from '@/lib/api/contentApi'
import { Content, ContentType, Category } from '@/types/content'
import { TableSkeleton } from '@/components/common/tableSkeleton'
import { NoDataFound } from '@/components/common/no-data-found'

import { Button } from '@/components/ui/button'
import { ContentTable } from './content-table'
import { Pagination } from '@/components/common/table-pagination'
import { ContentFormModal } from './content-form-modal'
import { DeleteModal } from '@/components/common/delete-modal'
import { ContentViewModal } from './content-view-modal'

export default function ContentManagementPage() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const token = session?.user?.accessToken || ''

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filterContentType, setFilterContentType] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const [showFormModal, setShowFormModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)

  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [viewingContent, setViewingContent] = useState<Content | null>(null)
  const [deletingContent, setDeletingContent] = useState<Content | null>(null)

  /* =======================
     Fetch Contents
  ======================= */
  const { data, isLoading } = useQuery({
    queryKey: ['contents', page, limit, filterContentType, filterCategory],
    queryFn: () =>
      contentApi.getAll(
        page,
        limit,
        filterContentType !== 'all' ? filterContentType : undefined,
        filterCategory !== 'all' ? filterCategory : undefined,
        token,
      ),
    placeholderData: keepPreviousData,
    enabled: !!token,
  })

  const contents: Content[] = data?.data || []
  const meta = data?.meta

  /* =======================
     Create / Update
  ======================= */
  const upsertMutation = useMutation({
    mutationFn: (formData: FormData) => {
      if (!token) throw new Error('Unauthorized')
      return editingContent
        ? contentApi.update(editingContent._id, formData, token)
        : contentApi.create(formData, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] })
      setShowFormModal(false)
      setEditingContent(null)
      toast.success(
        editingContent
          ? 'Content updated successfully!'
          : 'Content created successfully!',
      )
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to save content. Please try again.')
    },
  })

  /* =======================
     Delete
  ======================= */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Unauthorized')
      return contentApi.delete(id, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] })
      setShowDeleteModal(false)
      setDeletingContent(null)
      toast.success('Content deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(
        error?.message || 'Failed to delete content. Please try again.',
      )
    },
  })

  const contentTypes: { value: string; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'article', label: 'Article' },
    { value: 'Youtube-videos', label: 'YouTube Videos' },
    { value: 'Spotify-audios', label: 'Spotify Audios' },
  ]

  const categories: { value: string; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'art', label: 'Art' },
    { value: 'news', label: 'News' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'sports', label: 'Sports' },
    { value: 'music', label: 'Music' },
  ]

  return (
    <div className="min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-gray-400">
            Manage articles, videos, and audio content
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingContent(null)
            setShowFormModal(true)
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Content
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Content Type
            </label>
            <select
              value={filterContentType}
              onChange={e => {
                setFilterContentType(e.target.value)
                setPage(1)
              }}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {contentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={e => {
                setFilterCategory(e.target.value)
                setPage(1)
              }}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700">
        {isLoading ? (
          <TableSkeleton />
        ) : contents.length === 0 ? (
          <NoDataFound message="No content found" />
        ) : (
          <>
            <ContentTable
              contents={contents}
              onEdit={content => {
                setEditingContent(content)
                setShowFormModal(true)
              }}
              onView={content => {
                setViewingContent(content)
                setShowViewModal(true)
              }}
              onDelete={content => {
                setDeletingContent(content)
                setShowDeleteModal(true)
              }}
            />

            <Pagination
              meta={meta || { page: 1, limit: 10, total: 0 }}
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
      <ContentFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false)
          setEditingContent(null)
        }}
        onSubmit={formData => upsertMutation.mutate(formData)}
        content={editingContent}
        loading={upsertMutation.isPending}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() =>
          deletingContent && deleteMutation.mutate(deletingContent._id)
        }
        title={deletingContent?.title || ''}
        // loading={deleteMutation.isPending}
      />

      <ContentViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        content={viewingContent}
      />
    </div>
  )
}
