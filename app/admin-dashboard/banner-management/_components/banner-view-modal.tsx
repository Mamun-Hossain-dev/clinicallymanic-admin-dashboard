import { X } from 'lucide-react'
import Image from 'next/image'
import type { Banner } from '@/types/banner'

interface BannerViewModalProps {
  isOpen: boolean
  onClose: () => void
  banner: Banner | null
}

export const BannerViewModal = ({
  isOpen,
  onClose,
  banner,
}: BannerViewModalProps) => {
  if (!isOpen || !banner) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="my-8 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-gray-800 bg-gray-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Banner Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-base font-medium text-gray-400">Image</h4>
            <div className="relative h-64 w-full overflow-hidden rounded border border-gray-700">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="mb-1 text-base text-gray-400">Title</h4>
              <p className="text-base text-white">{banner.title}</p>
            </div>
            <div>
              <h4 className="mb-1 text-base text-gray-400">Type</h4>
              <span className="inline-block rounded-full bg-blue-600/20 px-3 py-1 text-sm capitalize text-blue-400">
                {banner.type}
              </span>
            </div>
          </div>

          <div>
            <h4 className="mb-1 text-base text-gray-400">Description</h4>
            <p className="text-base leading-7 text-white">{banner.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="mb-1 text-base text-gray-400">Status</h4>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm capitalize ${
                  banner.status === 'active'
                    ? 'bg-green-600/20 text-green-400'
                    : 'bg-gray-600/20 text-gray-400'
                }`}
              >
                {banner.status}
              </span>
            </div>
            <div>
              <h4 className="mb-1 text-base text-gray-400">Created By</h4>
              <p className="break-all text-base text-white">{banner.createdBy}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="mb-1 text-base text-gray-400">Created At</h4>
              <p className="text-base text-white">
                {new Date(banner.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="mb-1 text-base text-gray-400">Updated At</h4>
              <p className="text-base text-white">
                {new Date(banner.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-gray-800 pt-6">
          <button
            onClick={onClose}
            className="rounded bg-gray-800 px-6 py-2 text-base text-white transition-colors hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
