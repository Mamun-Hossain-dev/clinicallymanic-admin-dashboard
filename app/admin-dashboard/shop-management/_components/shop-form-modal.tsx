// ============================================
// File 3: app/shop-management/_components/shop-form-modal.tsx (FIXED)
// ============================================
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Shop } from '@/types/shop'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface ShopFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => void
  shop?: Shop | null
  loading?: boolean
}

export const ShopFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  shop,
  loading,
}: ShopFormModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    price: '',
    type: 'exclusive' as 'standard' | 'exclusive',
    details: '',
    status: 'active' as 'active' | 'inactive',
    images: [] as File[],
  })

  const [sizes, setSizes] = useState<string[]>([])
  const [sizeInput, setSizeInput] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])

  useEffect(() => {
    if (shop) {
      setFormData({
        name: shop.name || '',
        title: shop.title,
        description: shop.description,
        price: shop.price.toString(),
        type: shop.type,
        details: shop.details || '',
        status: shop.status,
        images: [],
      })
      setSizes(shop.size || [])
      setCategories(shop.categories)
      setExistingImages(shop.images)
      setPreviewImages([])
    } else {
      setFormData({
        name: '',
        title: '',
        description: '',
        price: '',
        type: 'exclusive',
        details: '',
        status: 'active',
        images: [],
      })
      setSizes([])
      setCategories([])
      setExistingImages([])
      setPreviewImages([])
    }
    setSizeInput('')
  }, [shop, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (categories.length === 0) {
      alert('Please select at least one category')
      return
    }

    const data = new FormData()
    const payload: Record<string, unknown> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      type: formData.type.toUpperCase(),
      status: formData.status.toUpperCase(),
      categories: categories.map(category => category.toUpperCase()),
      sizes,
    }

    if (formData.name.trim()) {
      payload.name = formData.name.trim()
    }

    if (formData.details.trim()) {
      payload.details = formData.details.trim()
    }

    data.append('data', JSON.stringify(payload))

    formData.images.forEach(img => {
      data.append('images', img)
    })

    onSubmit(data)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData({ ...formData, images: files })

    const urls = files.map(file => URL.createObjectURL(file))
    setPreviewImages(urls)
  }

  const removeNewImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
    setPreviewImages(previewImages.filter((_, i) => i !== index))
  }

  const addSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim().toUpperCase())) {
      setSizes([...sizes, sizeInput.trim().toUpperCase()])
      setSizeInput('')
    }
  }

  const removeSize = (sizeToRemove: string) => {
    setSizes(sizes.filter(s => s !== sizeToRemove))
  }

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter(c => c !== category))
    } else {
      setCategories([...categories, category])
    }
  }

  const categoryOptions = [
    'mens',
    'womens',
    'childrens',
    'accessories',
    'other',
  ]
  const typeOptions: (
    | 'standard'
    | 'exclusive'
  )[] = ['standard', 'exclusive']

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full my-8 border border-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {shop ? 'Edit Product' : 'Add Product'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base text-gray-300 mb-2 font-medium">
                Name <span className="text-gray-500">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                placeholder="e.g., Urban Threads"
              />
            </div>

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
                disabled={loading}
                placeholder="e.g., Classic Cotton T-Shirt"
              />
            </div>
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
              className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
              placeholder="Detailed product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-base text-gray-300 mb-2 font-medium">
                Price *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={e =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
                placeholder="49.99"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-base text-gray-300 mb-2 font-medium">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={e =>
                  setFormData({
                    ...formData,
                    type: e.target.value as typeof formData.type,
                  })
                }
                className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              >
                {typeOptions.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base text-gray-300 mb-2 font-medium">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={e =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'active' | 'inactive',
                  })
                }
                className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-base text-gray-300 mb-2 font-medium">
              Categories *{' '}
              <span className="text-sm text-gray-500">
                (select at least one)
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    categories.includes(cat)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            {categories.length === 0 && (
              <p className="text-sm text-red-400 mt-2">
                At least one category is required
              </p>
            )}
          </div>

          <div>
            <label className="block text-base text-gray-300 mb-2 font-medium">
              Details <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.details}
              onChange={e =>
                setFormData({ ...formData, details: e.target.value })
              }
              className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              placeholder="Additional product details"
            />
          </div>

          <div>
            <label className="block text-base text-gray-300 mb-2 font-medium">
              Sizes <span className="text-gray-500">(optional)</span>
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={sizeInput}
                onChange={e => setSizeInput(e.target.value)}
                onKeyPress={e =>
                  e.key === 'Enter' && (e.preventDefault(), addSize())
                }
                className="flex-1 px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter size (e.g., M, XL, 42)"
                disabled={loading}
              />
              <button
                type="button"
                onClick={addSize}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>

            {sizes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <span
                    key={size}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800 text-white rounded border border-gray-700"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(size)}
                      disabled={loading}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-base text-gray-300 mb-2 font-medium">
              Images {!shop && '*'}
              <span className="text-sm text-gray-500 ml-1">
                (multiple files)
              </span>
            </label>

            {existingImages.length > 0 && (
              <div className="mb-3">
                <p className="text-sm text-gray-400 mb-2">Current Images:</p>
                <div className="grid grid-cols-4 gap-2">
                  {existingImages.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative w-full h-20 rounded border border-gray-700 overflow-hidden group"
                    >
                      <Image
                        src={url}
                        alt={`Existing ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={loading}
              className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!shop && existingImages.length === 0}
            />

            {previewImages.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-400 mb-2">New Images:</p>
                <div className="grid grid-cols-4 gap-2">
                  {previewImages.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative w-full h-20 rounded border border-gray-700 overflow-hidden group"
                    >
                      <Image
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        disabled={loading}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 text-base bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={loading || categories.length === 0}
              className="px-6 py-2 text-base text-white rounded transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {shop ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                <>{shop ? 'Update Product' : 'Create Product'}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
