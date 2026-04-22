// ============================================
// File: app/shop-management/_components/ShopViewModal.tsx
// ============================================

import { X } from 'lucide-react'
import type { Shop } from '@/types/shop'
import Image from 'next/image'

interface ShopViewModalProps {
  isOpen: boolean
  onClose: () => void
  shop: Shop | null
}

export const ShopViewModal = ({
  isOpen,
  onClose,
  shop,
}: ShopViewModalProps) => {
  if (!isOpen || !shop) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-gray-900 rounded-lg p-6 max-w-3xl w-full my-8 border border-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Product Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Images */}
          <div>
            <h4 className="text-base text-gray-400 mb-3 font-medium">Images</h4>
            <div className="grid grid-cols-3 gap-3">
              {shop.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-full h-32 rounded border border-gray-700 overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`${shop.title} ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-base text-gray-400 mb-1">Name</h4>
              <p className="text-base text-white">{shop.name}</p>
            </div>
            <div>
              <h4 className="text-base text-gray-400 mb-1">Title</h4>
              <p className="text-base text-white">{shop.title}</p>
            </div>
          </div>

          <div>
            <h4 className="text-base text-gray-400 mb-1">Description</h4>
            <p className="text-base text-white">{shop.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-base text-gray-400 mb-1">Price</h4>
              <p className="text-base text-white font-semibold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(shop.price)}
              </p>
            </div>
            <div>
              <h4 className="text-base text-gray-400 mb-1">Type</h4>
              <span
                className={`inline-block px-3 py-1 text-sm rounded-full ${
                  shop.type === 'exclusive'
                    ? 'bg-purple-600/20 text-purple-400'
                    : 'bg-blue-600/20 text-blue-400'
                }`}
              >
                {shop.type}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-base text-gray-400 mb-1">Details</h4>
            <p className="text-base text-white">{shop.details}</p>
          </div>

          <div>
            <h4 className="text-base text-gray-400 mb-1">Available Sizes</h4>
            <div className="flex gap-2">
              {shop.size?.map(s => (
                <span
                  key={s}
                  className="px-3 py-1 bg-gray-800 text-white rounded text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-base text-gray-400 mb-1">Status</h4>
              <span
                className={`inline-block px-3 py-1 text-sm rounded-full ${
                  shop.status === 'active'
                    ? 'bg-green-600/20 text-green-400'
                    : 'bg-gray-600/20 text-gray-400'
                }`}
              >
                {shop.status}
              </span>
            </div>
            <div>
              <h4 className="text-base text-gray-400 mb-1">Total Users</h4>
              <p className="text-base text-white">
                {shop.totalShopUsers?.length || 0}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-base text-gray-400 mb-1">Created At</h4>
              <p className="text-base text-white">
                {new Date(shop.createdAt as any).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="text-base text-gray-400 mb-1">Updated At</h4>
              <p className="text-base text-white">
                {new Date(shop.updatedAt as any).toLocaleDateString()}
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
