'use client'

import { PageHeader } from '@/components/reusable/page-header'
import { Send } from 'lucide-react'
import { useState } from 'react'
import Subscribtion from './subscriber'
import BroadcastEmailModal from '@/components/broadcast-email-modal'

export default function SubscribersManagementPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscribers Management"
        description="Manage newsletter subscribers and send broadcasts"
        action={{
          label: 'Broadcast Email',
          onClick: () => setOpen(true),
          icon: <Send className="mr-2 h-4 w-4" />,
        }}
      />

      <Subscribtion />

      <BroadcastEmailModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}
