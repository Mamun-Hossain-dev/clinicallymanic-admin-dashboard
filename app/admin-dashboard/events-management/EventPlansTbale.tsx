'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import EditEventModal from './EventPlansEdite'
import Image from 'next/image'

export default function EventsTable() {
  const { data: session } = useSession()
  const token = (session?.user as { accessToken?: string })?.accessToken
  const queryClient = useQueryClient()

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteTitle, setDeleteTitle] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>({})

  const page = 1
  const limit = 10

  /* ---------- GET events ---------- */
  const { data, isLoading, isError } = useQuery({
    queryKey: ['events', page],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) throw new Error('Failed to fetch events')
      return res.json()
    },
  })

  /* ---------- DELETE mutation ---------- */
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event/${id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) throw new Error('Delete failed')
      return res.json()
    },
    onSuccess: () => {
      toast.success('Event deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['events'] })
      setDeleteId(null)
    },
    onError: () => toast.error('Failed to delete event'),
  })

  if (isLoading)
    return (
      <div className="rounded-xl border p-6 text-center text-muted-foreground">
        Loading events...
      </div>
    )

  if (isError)
    return (
      <div className="rounded-xl border p-6 text-center text-destructive">
        Failed to load events
      </div>
    )

  const events = data?.data ?? []

  return (
    <>
      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                Image
              </th>
              <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                Title
              </th>
              <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                Description
              </th>
              <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                Location
              </th>
              <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                Date
              </th>
              <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                Status
              </th>
              <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {events.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-6 text-center text-gray-400"
                >
                  No events found
                </td>
              </tr>
            )}

            {events.map((event: any) => (
              <tr
                key={event._id}
                className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-300 font-medium capitalize">
                 <Image
                    src={event.thumbnail || '/placeholder.svg'}
                    alt={event.title}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                </td>
                <td className="px-6 py-4 text-gray-300 font-medium capitalize">
                  {event.title}
                </td>
                <td className="px-6 py-4 text-gray-400 max-w-xs truncate">
                  {event.description}
                </td>
                <td className="px-6 py-4 text-gray-300">{event.location}</td>
                <td className="px-6 py-4 text-gray-300">
                  {new Date(event.date).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full capitalize ${
                      event.status === 'upcoming'
                        ? 'bg-blue-600/20 text-blue-400'
                        : event.status === 'ongoing'
                        ? 'bg-amber-600/20 text-amber-400'
                        : 'bg-emerald-600/20 text-emerald-400'
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedEvent(event)
                        setEditOpen(true)
                      }}
                    >
                      <Pencil className="h-5 w-5 text-blue-400" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeleteId(event._id)
                        setDeleteTitle(event.title)
                      }}
                    >
                      <Trash2 className="h-5 w-5 text-red-400" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      <EditEventModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        event={selectedEvent}
        token={token!}
        onUpdated={() => queryClient.invalidateQueries({ queryKey: ['events'] })}
      />

      {/* DELETE MODAL */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold">{deleteTitle}</span>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (deleteId) deleteMutation.mutate(deleteId)
              }}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
