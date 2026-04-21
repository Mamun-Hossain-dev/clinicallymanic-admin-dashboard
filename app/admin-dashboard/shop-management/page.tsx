import React from 'react'
import ShopManagementPage from './_components/shop-management'

const page = () => {
  return (
    <>
      <ShopManagementPage />
    </>
  )
}

export default page

// 'use client'

// import type { ColumnDef } from '@tanstack/react-table'
// import { DataTable } from '@/components/reusable/data-table'
// import { PageHeader } from '@/components/reusable/page-header'
// import { dummyProducts, type Product } from '@/lib/data/dummy-data'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Eye, Pencil, Trash2 } from 'lucide-react'
// import Image from 'next/image'
// import { Plus } from 'lucide-react'

// const columns: ColumnDef<Product>[] = [
//   {
//     accessorKey: 'image',
//     header: 'Image',
//     cell: ({ row }) => (
//       <Image
//         src={row.getValue('image') || '/placeholder.svg'}
//         alt={row.getValue('title')}
//         width={50}
//         height={50}
//         className="rounded-md object-cover"
//       />
//     ),
//   },
//   {
//     accessorKey: 'title',
//     header: 'Title',
//   },
//   {
//     accessorKey: 'category',
//     header: 'Category',
//   },
//   {
//     accessorKey: 'price',
//     header: 'Price',
//     cell: ({ row }) => {
//       const price = Number.parseFloat(row.getValue('price'))
//       const formatted = new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD',
//       }).format(price)
//       return <span className="font-medium">{formatted}</span>
//     },
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status',
//     cell: ({ row }) => {
//       const status = row.getValue('status') as string
//       return (
//         <Badge
//           variant={
//             status === 'active'
//               ? 'default'
//               : status === 'draft'
//               ? 'secondary'
//               : 'outline'
//           }
//         >
//           {status}
//         </Badge>
//       )
//     },
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created At',
//   },
//   {
//     id: 'actions',
//     header: 'Actions',
//     cell: () => (
//       <div className="flex items-center gap-2">
//         <Button variant="ghost" size="icon">
//           <Eye className="h-4 w-4" />
//         </Button>
//         <Button variant="ghost" size="icon">
//           <Pencil className="h-4 w-4" />
//         </Button>
//         <Button variant="ghost" size="icon">
//           <Trash2 className="h-4 w-4" />
//         </Button>
//       </div>
//     ),
//   },
// ]

// export default function ShopManagementPage() {
//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Shop Management"
//         description="Manage your shop products and inventory"
//         action={{
//           label: 'Add Product',
//           onClick: () => console.log('Add product'),
//           icon: <Plus className="mr-2 h-4 w-4" />,
//         }}
//       />
//       <DataTable
//         columns={columns}
//         data={dummyProducts}
//         searchKey="title"
//         searchPlaceholder="Search products..."
//       />
//     </div>
//   )
// }
