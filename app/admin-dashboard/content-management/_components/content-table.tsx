// ============================================
// File: app/content-management/_components/content-table.tsx
// ============================================

import { Pencil, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Content } from '@/types/content'
import Image from 'next/image'

interface ContentTableProps {
  contents: Content[]
  onEdit: (content: Content) => void
  onDelete: (content: Content) => void
  onView: (content: Content) => void
}

export const ContentTable = ({
  contents,
  onEdit,
  onDelete,
  onView,
}: ContentTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-800 border-b border-gray-700">
          <tr>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Thumbnail
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Title
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Category
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Content Type
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Created Date
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {contents.map(content => (
            <tr
              key={content._id}
              className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-6 py-4">
                <Image
                  src={content.thumbnail}
                  alt={content.title}
                  width={80}
                  height={48}
                  className="object-cover rounded"
                />
              </td>
              <td className="px-6 py-4 text-base text-gray-300 font-medium">
                {content.title}
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 text-sm bg-purple-600/20 text-purple-400 rounded-full capitalize">
                  {content.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 text-sm bg-blue-600/20 text-blue-400 rounded-full">
                  {content.contentType}
                </span>
              </td>
              <td className="px-6 py-4 text-base text-gray-400">
                {formatDate(content.createdAt)}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(content)}
                    title="View"
                  >
                    <Eye className="h-5 w-5 text-green-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(content)}
                    title="Edit"
                  >
                    <Pencil className="h-5 w-5 text-blue-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(content)}
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5 text-red-400" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
