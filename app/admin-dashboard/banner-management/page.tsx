// 'use client'

// import type { ColumnDef } from '@tanstack/react-table'
// import { DataTable } from '@/components/reusable/data-table'
// import { PageHeader } from '@/components/reusable/page-header'
// import { dummyBanners, type Banner } from '@/lib/data/dummy-data'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Pencil, Trash2 } from 'lucide-react'
// import Image from 'next/image'
// import { Plus } from 'lucide-react'

// const columns: ColumnDef<Banner>[] = [
//   {
//     accessorKey: 'image',
//     header: 'Image',
//     cell: ({ row }) => (
//       <Image
//         src={row.getValue('image') || '/placeholder.svg'}
//         alt={row.getValue('title')}
//         width={50}
//         height={30}
//         className="rounded-md object-cover"
//       />
//     ),
//   },
//   {
//     accessorKey: 'title',
//     header: 'Title',
//   },
//   {
//     accessorKey: 'type',
//     header: 'Type',
//     cell: ({ row }) => <Badge variant="outline">{row.getValue('type')}</Badge>,
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status',
//     cell: ({ row }) => {
//       const status = row.getValue('status') as string
//       return (
//         <Badge variant={status === 'active' ? 'default' : 'secondary'}>
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
//           <Pencil className="h-4 w-4" />
//         </Button>
//         <Button variant="ghost" size="icon">
//           <Trash2 className="h-4 w-4" />
//         </Button>
//       </div>
//     ),
//   },
// ]

// export default function BannerManagementPage() {
//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Banner Management"
//         description="Manage banners and promotional content"
//         action={{
//           label: 'Add Banner',
//           onClick: () => console.log('Add banner'),
//           icon: <Plus className="mr-2 h-4 w-4" />,
//         }}
//       />
//       <DataTable
//         columns={columns}
//         data={dummyBanners}
//         searchKey="title"
//         searchPlaceholder="Search banners..."
//       />
//     </div>
//   )
// }

import React from 'react'
import BannerManagementPage from './_components/banner-management'

const page = () => {
  return (
    <div>
      <BannerManagementPage />
    </div>
  )
}

export default page
