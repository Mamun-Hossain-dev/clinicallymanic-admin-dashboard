// ============================================
// File: app/shop-management/_components/NoDataFound.tsx
// ============================================

import Image from 'next/image'

export const NoDataFound = ({
  message = 'No items found',
}: {
  message?: string
}) => (
  <div className="flex flex-col items-center justify-center py-16">
    <Image
      src="/404.png"
      alt="No data"
      width={256}
      height={256}
      className="opacity-50"
      priority={false}
    />
    <p className="text-lg text-gray-400 mt-4">{message}</p>
  </div>
)
