// ============================================
// File 4: app/shop-management/_components/shop-table.tsx
// ============================================
import { Pencil, Trash2, Eye } from 'lucide-react'
import type { Shop } from '@/types/shop'
import Image from 'next/image'

interface ShopTableProps {
  shops: Shop[]
  onEdit: (shop: Shop) => void
  onDelete: (shop: Shop) => void
  onView: (shop: Shop) => void
}

export const ShopTable = ({
  shops,
  onEdit,
  onDelete,
  onView,
}: ShopTableProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

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
              Name
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Price
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Type
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Categories
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
          {shops.map(shop => (
            <tr
              key={shop._id}
              className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-6 py-4">
                <Image
                  src={shop.images[0] || '/placeholder.png'}
                  alt={shop.title}
                  width={64}
                  height={64}
                  className="object-cover rounded"
                />
              </td>
              <td className="px-6 py-4 text-base text-gray-300">
                {shop.title}
              </td>
              <td className="px-6 py-4 text-base text-gray-300">
                {shop.name || '-'}
              </td>
              <td className="px-6 py-4 text-base text-gray-300 font-medium">
                {formatPrice(shop.price)}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    shop.type.toLowerCase() === 'exclusive'
                      ? 'bg-purple-600/20 text-purple-400'
                      : shop.type.toLowerCase() === 'clothing'
                      ? 'bg-blue-600/20 text-blue-400'
                      : shop.type.toLowerCase() === 'shoes'
                      ? 'bg-green-600/20 text-green-400'
                      : 'bg-gray-600/20 text-gray-400'
                  }`}
                >
                  {shop.type}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {shop.categories.map(cat => (
                    <span
                      key={cat}
                      className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    shop.status === 'active'
                      ? 'bg-green-600/20 text-green-400'
                      : 'bg-gray-600/20 text-gray-400'
                  }`}
                >
                  {shop.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(shop)}
                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                    title="View"
                  >
                    <Eye className="h-5 w-5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => onEdit(shop)}
                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-5 w-5 text-blue-400" />
                  </button>
                  <button
                    onClick={() => onDelete(shop)}
                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5 text-red-400" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
