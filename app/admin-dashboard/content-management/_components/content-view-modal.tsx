// ============================================
// File: app/content-management/_components/content-view-modal.tsx
// ============================================

import { X } from 'lucide-react'
import type { Content } from '@/types/content'
import Image from 'next/image'

interface ContentViewModalProps {
  isOpen: boolean
  onClose: () => void
  content: Content | null
}

export const ContentViewModal = ({
  isOpen,
  onClose,
  content,
}: ContentViewModalProps) => {
  if (!isOpen || !content) return null

  const mediaData = content.media[0]?.data || {}
  const mediaType = content.media[0]?.type

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-gray-900 rounded-lg p-6 max-w-3xl w-full my-8 border border-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Content Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Thumbnail */}
          <div>
            <h4 className="text-base text-gray-400 mb-3 font-medium">
              Thumbnail
            </h4>
            <div className="relative w-full h-64 rounded border border-gray-700 overflow-hidden">
              <Image
                src={content.thumbnail}
                alt={content.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-base text-gray-400 mb-1">Title</h4>
              <p className="text-base text-white">{content.title}</p>
            </div>
            <div>
              <h4 className="text-base text-gray-400 mb-1">Category</h4>
              <span className="inline-block px-3 py-1 text-sm bg-purple-600/20 text-purple-400 rounded-full capitalize">
                {content.category}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-base text-gray-400 mb-1">Content Type</h4>
            <span className="inline-block px-3 py-1 text-sm bg-blue-600/20 text-blue-400 rounded-full">
              {content.contentType}
            </span>
          </div>

          {/* Media-specific content */}
          {mediaType === 'article' && mediaData.description && (
            <div>
              <h4 className="text-base text-gray-400 mb-1">Description</h4>
              <div
                className="prose prose-invert max-w-none text-base text-white"
                dangerouslySetInnerHTML={{ __html: mediaData.description }}
              />
            </div>
          )}

          {mediaType === 'youtube' && (
            <>
              {mediaData.videourl && (
                <div>
                  <h4 className="text-base text-gray-400 mb-1">Video URL</h4>
                  <a
                    href={mediaData.videourl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-blue-400 hover:underline break-all"
                  >
                    {mediaData.videourl}
                  </a>
                </div>
              )}
              {mediaData.description && (
                <div>
                  <h4 className="text-base text-gray-400 mb-1">Description</h4>
                  <p className="text-base text-white">
                    {mediaData.description}
                  </p>
                </div>
              )}
            </>
          )}

          {mediaType === 'spotify' && (
            <>
              {mediaData.previewurl && (
                <div>
                  <h4 className="text-base text-gray-400 mb-1">Preview URL</h4>
                  <a
                    href={mediaData.previewurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-blue-400 hover:underline break-all"
                  >
                    {mediaData.previewurl}
                  </a>
                </div>
              )}
              {mediaData.description && (
                <div>
                  <h4 className="text-base text-gray-400 mb-1">Description</h4>
                  <p className="text-base text-white">
                    {mediaData.description}
                  </p>
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-base text-gray-400 mb-1">Created At</h4>
              <p className="text-base text-white">
                {new Date(content.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="text-base text-gray-400 mb-1">Updated At</h4>
              <p className="text-base text-white">
                {new Date(content.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-800 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 text-base bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
