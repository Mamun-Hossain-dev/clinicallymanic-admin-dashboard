// ============================================
// File: app/banner-management/_components/BannerTable.tsx
// ============================================

import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Banner } from '@/types/banner'
import Image from 'next/image'

interface BannerTableProps {
  banners: Banner[]
  onView: (banner: Banner) => void
  onEdit: (banner: Banner) => void
  onDelete: (banner: Banner) => void
}

export const BannerTable = ({
  banners,
  onView,
  onEdit,
  onDelete,
}: BannerTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-800 border-b border-gray-700">
          <tr>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Image
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Title
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Description
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Type
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Status
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {banners.map(banner => (
            <tr
              key={banner._id}
              className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-6 py-4">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  width={80} // w-20 in Tailwind = 5rem = 80px
                  height={48} // h-12 in Tailwind = 3rem = 48px
                  className="object-cover rounded"
                />
              </td>
              <td className="px-6 py-4 text-base text-gray-300 font-medium">
                {banner.title}
              </td>
              <td className="px-6 py-4 text-base text-gray-400 max-w-xs truncate">
                {banner.description}
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 text-sm bg-blue-600/20 text-blue-400 rounded-full capitalize">
                  {banner.type}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    banner.status === 'active'
                      ? 'bg-green-600/20 text-green-400'
                      : 'bg-gray-600/20 text-gray-400'
                  }`}
                >
                  {banner.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(banner)}
                    title="View"
                  >
                    <Eye className="h-5 w-5 text-emerald-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(banner)}
                    title="Edit"
                  >
                    <Pencil className="h-5 w-5 text-blue-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(banner)}
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
