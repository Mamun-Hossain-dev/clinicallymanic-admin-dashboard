// ============================================
// File: app/shop-management/_components/Pagination.tsx
// ============================================

import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginationMeta } from '@/types/shop'

interface PaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export const Pagination = ({
  meta,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(meta.total / meta.limit)

  return (
    <div className="flex items-center justify-between px-2 py-4 border-t border-gray-700">
      <div className="flex-1 text-base text-gray-300">
        Showing {(meta.page - 1) * meta.limit + 1} to{' '}
        {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} results
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <p className="text-base text-gray-300 font-medium">Rows per page</p>
          <select
            value={meta.limit}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            className="h-9 w-20 bg-gray-800 border border-gray-700 rounded px-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-base font-medium text-gray-300">
            Page {meta.page} of {totalPages}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page === 1}
              className="h-10 w-10 flex items-center justify-center border border-gray-700 rounded hover:bg-blue-600 hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page >= totalPages}
              className="h-10 w-10 flex items-center justify-center border border-gray-700 rounded hover:bg-blue-600 hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
