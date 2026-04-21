// ============================================
// File: app/shop-management/_components/TableSkeleton.tsx
// ============================================

export const TableSkeleton = () => (
  <div className="space-y-4 animate-pulse p-6">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4 p-4 bg-gray-800/50 rounded-lg">
        <div className="w-16 h-16 bg-gray-700 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
)
