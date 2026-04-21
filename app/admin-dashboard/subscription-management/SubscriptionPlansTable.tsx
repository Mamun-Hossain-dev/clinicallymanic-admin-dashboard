'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import EditSubscriptionModal from './EditSubscriptionModal'

/* ---------------- Types ---------------- */
type Subscription = {
  _id: string
  name: 'exclusive' | 'basic'
  type: 'monthly' | 'yearly' | 'weekly'
  price: number
  status: 'active' | 'inactive'
  features: string[]
  totalSubscribedUsers?: string[]
}

/* ---------------- Component ---------------- */
export default function SubscriptionPlansTable() {
  const { data: session } = useSession()
  const token = (session?.user as { accessToken?: string })?.accessToken
  const queryClient = useQueryClient()

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null)

  const page = 1
  const limit = 10

  /* ---------- GET subscriptions ---------- */
  const { data, isLoading, isError } = useQuery({
    queryKey: ['subscriptions', page],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      if (!res.ok) throw new Error('Failed to fetch subscriptions')
      return res.json()
    },
  })

  /* ---------- DELETE mutation ---------- */
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!res.ok) throw new Error('Delete failed')
      return res.json()
    },
    onSuccess: () => {
      toast.success('Subscription deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      setDeleteId(null)
    },
    onError: () => {
      toast.error('Failed to delete subscription')
    },
  })

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-4 border-white border-t-transparent animate-spin" />
          <p className="text-white text-sm">Loading subscriptions...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
        <p className="text-red-400">Failed to load subscription plans</p>
      </div>
    )
  }

  const subscriptions: Subscription[] = data?.data ?? []

  return (
    <>
      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-900">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Duration
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Features
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Subscribers
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {subscriptions.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  No subscription plans found
                </td>
              </tr>
            )}

            {subscriptions.map(plan => (
              <tr
                key={plan._id}
                className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-300 font-medium capitalize">
                  {plan.name}
                </td>

                <td className="px-6 py-4 text-gray-300 font-semibold">
                  ${plan.price}
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-full capitalize border border-blue-700">
                    {plan.type}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-400 max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {plan.features.slice(0, 2).map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex px-2 py-1 rounded-md bg-gray-800 text-xs text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                    {plan.features.length > 2 && (
                      <span className="inline-flex px-2 py-1 rounded-md bg-gray-800 text-xs text-gray-400">
                        +{plan.features.length - 2} more
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-300">
                  {plan.totalSubscribedUsers?.length || 0}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full capitalize ${
                      plan.status === 'active'
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-700'
                        : 'bg-red-600/20 text-red-400 border border-red-700'
                    }`}
                  >
                    {plan.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedSubscription(plan)
                        setEditOpen(true)
                      }}
                      className="hover:bg-gray-800"
                    >
                      <Pencil className="h-4 w-4 text-blue-400" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeleteId(plan._id)
                        setDeleteName(plan.name)
                      }}
                      className="hover:bg-gray-800"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {token && selectedSubscription && (
        <EditSubscriptionModal
          open={editOpen}
          onClose={() => {
            setEditOpen(false)
            setSelectedSubscription(null)
          }}
          subscription={selectedSubscription}
          token={token}
          onUpdated={() =>
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
          }
        />
      )}

      {/* DELETE MODAL */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-gray-900 border border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete subscription?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-white">{deleteName}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
              className="bg-gray-800 text-white hover:bg-gray-700 border-gray-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
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
