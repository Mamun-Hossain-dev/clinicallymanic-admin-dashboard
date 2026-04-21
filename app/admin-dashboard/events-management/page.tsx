"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/reusable/data-table"
import { PageHeader } from "@/components/reusable/page-header"
import { dummyEvents, type Event } from "@/lib/data/dummy-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Plus } from "lucide-react"
import EventsTable from "./EventPlansTbale"
import { useState } from "react"
import AddEventModal from "./AddEventModal"


export default function EventsManagementPage() {
   const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events Management"
        description="Manage events and special occasions"
        action={{
          label: "Add Event",
          onClick: () => setOpen(true),
          icon: <Plus className="mr-2 h-4 w-4" />,
        }}
      />
      <AddEventModal open={open} onClose={() => setOpen(false)} />
      <EventsTable />
      
      {/* <DataTable columns={columns} data={dummyEvents} searchKey="title" searchPlaceholder="Search events..." /> */}
    </div>
  )
}
