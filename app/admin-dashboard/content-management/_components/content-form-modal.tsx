// ============================================
// File: app/content-management/_components/content-form-modal.tsx
// ============================================

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Content, ContentType, Category } from '@/types/content'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { TiptapEditor } from '@/components/editor/tiptap-editor'

interface ContentFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => void
  content?: Content | null
  loading?: boolean
}

export const ContentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  content,
  loading,
}: ContentFormModalProps) => {
  const [activeTab, setActiveTab] = useState<ContentType>('article')
  const [formData, setFormData] = useState({
    title: '',
    category: 'news' as Category,
    thumbnail: null as File | null,
    // Article fields
    articleDescription: '',
    // YouTube fields
    videoUrl: '',
    videoDescription: '',
    // Spotify fields
    previewUrl: '',
    spotifyDescription: '',
  })
  const [previewImage, setPreviewImage] = useState<string>('')

  useEffect(() => {
    if (content) {
      const mediaData = content.media[0]?.data || {}

      setFormData({
        title: content.title,
        category: content.category as Category,
        thumbnail: null,
        articleDescription: mediaData.description || '',
        videoUrl: mediaData.videourl || '',
        videoDescription: mediaData.description || '',
        previewUrl: mediaData.previewurl || '',
        spotifyDescription: mediaData.description || '',
      })

      setPreviewImage(content.thumbnail)

      // Set active tab based on contentType
      if (content.contentType === 'Youtube-videos') {
        setActiveTab('Youtube-videos')
      } else if (content.contentType === 'Spotify-audios') {
        setActiveTab('Spotify-audios')
      } else {
        setActiveTab('article')
      }
    } else {
      resetForm()
    }
  }, [content, isOpen])

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'news',
      thumbnail: null,
      articleDescription: '',
      videoUrl: '',
      videoDescription: '',
      previewUrl: '',
      spotifyDescription: '',
    })
    setPreviewImage('')
    setActiveTab('article')
  }

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = new FormData()

    data.append('title', formData.title)
    data.append('category', formData.category)
    data.append('contentType', activeTab)

    if (formData.thumbnail) {
      data.append('thumbnail', formData.thumbnail)
    }

    // Prepare media data based on active tab
    const mediaData: any = {}

    if (activeTab === 'article') {
      mediaData.type = 'article'
      mediaData.data = {
        description: formData.articleDescription,
      }
    } else if (activeTab === 'Youtube-videos') {
      mediaData.type = 'youtube'
      mediaData.data = {
        videourl: formData.videoUrl,
        description: formData.videoDescription,
      }
    } else if (activeTab === 'Spotify-audios') {
      mediaData.type = 'spotify'
      mediaData.data = {
        previewurl: formData.previewUrl,
        description: formData.spotifyDescription,
      }
    }

    data.append('media', JSON.stringify([mediaData]))

    onSubmit(data)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, thumbnail: file })
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const categories: Category[] = ['art', 'news', 'fashion', 'sports', 'music']
  const tabs: { id: ContentType; label: string }[] = [
    { id: 'article', label: 'Article' },
    { id: 'Youtube-videos', label: 'YouTube Video' },
    { id: 'Spotify-audios', label: 'Spotify Audio' },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-gray-900 rounded-lg p-6 max-w-3xl w-full my-8 border border-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {content ? 'Edit Content' : 'Add Content'}
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              disabled={loading}
              className={`px-4 py-2 text-base font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Enter content title"
              />
            </div>

            <div>
              <label className="block text-base text-gray-300 mb-2 font-medium">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={e =>
                  setFormData({
                    ...formData,
                    category: e.target.value as Category,
                  })
                }
                className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-base text-gray-300 mb-2 font-medium">
              Thumbnail *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!content}
            />
            {previewImage && (
              <div className="mt-3 relative w-full h-40 rounded border border-gray-700 overflow-hidden">
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Article Tab Content */}
          {activeTab === 'article' && (
            <div>
              <label className="block text-base text-gray-300 mb-2 font-medium">
                Description *
              </label>
              <TiptapEditor
                content={formData.articleDescription}
                onChange={value =>
                  setFormData({ ...formData, articleDescription: value })
                }
                placeholder="Write your article description here..."
                disabled={loading}
              />
            </div>
          )}

          {/* YouTube Tab Content */}
          {activeTab === 'Youtube-videos' && (
            <>
              <div>
                <label className="block text-base text-gray-300 mb-2 font-medium">
                  YouTube Video URL *
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={e =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                  placeholder="https://youtu.be/..."
                />
              </div>
              <div>
                <label className="block text-base text-gray-300 mb-2 font-medium">
                  Description
                </label>
                <textarea
                  value={formData.videoDescription}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      videoDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  placeholder="Video description"
                />
              </div>
            </>
          )}

          {/* Spotify Tab Content */}
          {activeTab === 'Spotify-audios' && (
            <>
              <div>
                <label className="block text-base text-gray-300 mb-2 font-medium">
                  Spotify Preview URL *
                </label>
                <input
                  type="url"
                  value={formData.previewUrl}
                  onChange={e =>
                    setFormData({ ...formData, previewUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                  placeholder="https://open.spotify.com/..."
                />
              </div>
              <div>
                <label className="block text-base text-gray-300 mb-2 font-medium">
                  Description
                </label>
                <textarea
                  value={formData.spotifyDescription}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      spotifyDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  placeholder="Audio description"
                />
              </div>
            </>
          )}

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
              disabled={loading}
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
                  {content ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                <>{content ? 'Update Content' : 'Create Content'}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
