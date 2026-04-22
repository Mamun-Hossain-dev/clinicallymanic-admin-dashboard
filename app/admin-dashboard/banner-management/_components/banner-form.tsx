// ============================================
// File: app/banner-management/_components/BannerFormModal.tsx
// ============================================

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Banner } from '@/types/banner'
import Image from 'next/image'

interface BannerFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => void
  banner?: Banner | null
  isLoading?: boolean
}

const BANNER_TYPES = [
  { value: 'news', label: 'News' },
  { value: 'playlists', label: 'Playlists' },
  { value: 'articles', label: 'Articles' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'offers', label: 'Offers' },
  { value: 'events', label: 'Events' },
  { value: 'shop', label: 'Shop' },
  { value: 'art', label: 'Art' },
  { value: 'sports', label: 'Sports' },
]

export const BannerFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  banner,
  isLoading,
}: BannerFormModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'news',
    image: null as File | null,
  })
  const [previewImage, setPreviewImage] = useState<string>('')

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        description: banner.description,
        type: banner.type,
        image: null,
      })
      setPreviewImage(banner.image)
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'news',
        image: null,
      })
      setPreviewImage('')
    }
  }, [banner, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('category', formData.type)
    data.append('status', 'ACTIVE')
    if (formData.image) {
      data.append('bannerImage', formData.image)
    }
    onSubmit(data)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const url = URL.createObjectURL(file)
      setPreviewImage(url)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full my-8 border border-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {banner ? 'Edit Banner' : 'Add Banner'}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-base text-gray-300 mb-2 font-medium">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., Latest News"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-base text-gray-300 mb-2 font-medium">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
              placeholder="Banner description"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-base text-gray-300 mb-2 font-medium">
              Type *
            </label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            >
              {BANNER_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-base text-gray-300 mb-2 font-medium">
              Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!banner}
              disabled={isLoading}
            />
            {previewImage && (
              <div className="mt-3">
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={700} // Approximate width
                  height={192} // h-48 in tailwind = 12rem = 192px
                  className="w-full h-48 object-cover rounded border border-gray-700"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-base"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="text-base" disabled={isLoading}>
              {isLoading
                ? banner
                  ? 'Updating...'
                  : 'Creating...'
                : banner
                ? 'Update Banner'
                : 'Create Banner'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
