'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

import Image from 'next/image'
import EditOfferModal from './editOfferModal'

export default function OffersTable() {
  const { data: session } = useSession()
  const token = (session?.user as { accessToken?: string })?.accessToken
  const queryClient = useQueryClient()

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteTitle, setDeleteTitle] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<any>({})

  const page = 1
  const limit = 10

  /* ---------- GET offers ---------- */
  const { data, isLoading, isError } = useQuery({
    queryKey: ['offers', page],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offer?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (!res.ok) throw new Error('Failed to fetch offers')
      return res.json()
    },
  })

  /* ---------- DELETE mutation ---------- */
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offer/${id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } },
      )
      if (!res.ok) throw new Error('Delete failed')
      return res.json()
    },
    onSuccess: () => {
      toast.success('Offer deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      setDeleteId(null)
    },
    onError: () => toast.error('Failed to delete offer'),
  })

  if (isLoading)
    return (
      <div className="rounded-xl border p-6 text-center text-muted-foreground">
        Loading offers...
      </div>
    )

  if (isError)
    return (
      <div className="rounded-xl border p-6 text-center text-destructive">
        Failed to load offers
      </div>
    )

  const offers = data?.data ?? []

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
                Discount
              </th>
              <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                Valid Until
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
            {offers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-gray-400">
                  No offers found
                </td>
              </tr>
            )}

            {offers.map((offer: any) => (
              <tr
                key={offer._id}
                className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <Image
                    src={offer.thumbnail || '/placeholder.svg'}
                    alt={offer.title}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </td>
                <td className="px-6 py-4 text-gray-300 font-medium">
                  {offer.title}
                </td>
                <td className="px-6 py-4 text-gray-400 max-w-xs truncate">
                  {offer.description}
                </td>
                <td className="px-6 py-4 text-gray-300 font-semibold">
                  {offer.discount}%
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {new Date(offer.validUntil).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full capitalize ${
                      offer.status === 'active'
                        ? 'bg-emerald-600/20 text-emerald-400'
                        : 'bg-red-600/20 text-red-400'
                    }`}
                  >
                    {offer.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedOffer(offer)
                        setEditOpen(true)
                      }}
                    >
                      <Pencil className="h-5 w-5 text-blue-400" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeleteId(offer._id)
                        setDeleteTitle(offer.title)
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
      <EditOfferModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        offer={selectedOffer}
        token={token!}
        onUpdated={() =>
          queryClient.invalidateQueries({ queryKey: ['offers'] })
        }
      />

      {/* DELETE MODAL */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete offer?</AlertDialogTitle>
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
