'use client'

import { PageHeader } from '@/components/reusable/page-header'
import { Plus } from 'lucide-react'

import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import AddOfferModal from './addOfferModal'
import OffersTable from './offersPlansTable'

export default function OffersManagementPage() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offers Management"
        description="Manage special offers and discounts"
        action={{
          label: 'Add Offer',
          onClick: () => setOpen(true),
          icon: <Plus className="mr-2 h-4 w-4" />,
        }}
      />
      <AddOfferModal
        open={open}
        onClose={() => setOpen(false)}
        onAdded={() => queryClient.invalidateQueries({ queryKey: ['offers'] })}
      />
      <OffersTable />
    </div>
  )
}
