"use client"
import { DataTable } from "@/components/reusable/data-table"
import { PageHeader } from "@/components/reusable/page-header"
import { dummySubscriptions} from "@/lib/data/dummy-data"
import { Plus } from "lucide-react"
import SubscriptionPlansTable from "./SubscriptionPlansTable"
import AddSubscriptionModal from "./SubscriptionModal"
import { useState } from "react"

export default function SubscriptionManagementPage() {
   const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Management"
        description="Manage subscription plans and pricing"
        action={{
          label: "Add Subscription",
          onClick: () => setOpen(true),
          icon: <Plus className="mr-2 h-4 w-4" />,
        }}
      />
      <AddSubscriptionModal open={open} onClose={() => setOpen(false)} />
     <SubscriptionPlansTable/>
    </div>
  )
}
