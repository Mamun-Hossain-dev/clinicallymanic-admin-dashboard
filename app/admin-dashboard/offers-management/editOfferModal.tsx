'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import Image from 'next/image'

type Offer = {
  _id: string
  title: string
  description: string
  discount: number
  validUntil: string
  status: 'active' | 'inactive'
  thumbnail?: string
}

type EditOfferModalProps = {
  open: boolean
  onClose: () => void
  offer: Offer
  token: string
  onUpdated: () => void
}

export default function EditOfferModal({
  open,
  onClose,
  offer,
  token,
  onUpdated,
}: EditOfferModalProps) {
  const [title, setTitle] = useState(offer.title || '')
  const [description, setDescription] = useState(offer.description || '')
  const [discount, setDiscount] = useState(offer.discount?.toString() || '')
  const [validUntil, setValidUntil] = useState(
    offer.validUntil
      ? new Date(offer.validUntil).toISOString().slice(0, 16)
      : '',
  )
  const [status, setStatus] = useState<'active' | 'inactive'>(
    offer.status || 'active',
  )
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(offer.thumbnail || null)
  const [loading, setLoading] = useState(false)

  // Reset form when modal opens or offer changes
  useEffect(() => {
    if (open && offer) {
      setTitle(offer.title || '')
      setDescription(offer.description || '')
      setDiscount(offer.discount?.toString() || '')
      setValidUntil(
        offer.validUntil
          ? new Date(offer.validUntil).toISOString().slice(0, 16)
          : '',
      )
      setStatus(offer.status || 'active')
      setThumbnail(null)
      setPreview(offer.thumbnail || null)
    }
  }, [open, offer])

  // Preview for newly selected thumbnail
  useEffect(() => {
    if (!thumbnail) {
      return
    }
    const objectUrl = URL.createObjectURL(thumbnail)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [thumbnail])

  const handleUpdate = async () => {
    if (!title || !description || !discount || !validUntil || !status) {
      toast.error('Please fill all fields')
      return
    }

    const discountNum = parseFloat(discount)
    if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
      toast.error('Discount must be between 0 and 100')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()

      // Only append thumbnail if a new file is selected
      if (thumbnail) {
        formData.append('thumbnail', thumbnail)
      }

      // Always send data as JSON string
      const offerData = {
        title,
        description,
        discount: discountNum,
        validUntil: new Date(validUntil).toISOString(),
        status,
      }

      formData.append('data', JSON.stringify(offerData))

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offer/${offer._id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Failed to update offer')
      }

      const result = await res.json()
      toast.success('Offer updated successfully!')
      onUpdated()
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update offer. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gray-900 rounded-lg p-6 border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Edit Offer</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="text-gray-200">Title</Label>
            <Input
              className="bg-gray-800 text-white border border-gray-700"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-200">Description</Label>
            <Textarea
              className="bg-gray-800 text-white border border-gray-700 resize-none"
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-200">Discount (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              className="bg-gray-800 text-white border border-gray-700"
              value={discount}
              onChange={e => setDiscount(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-200">Valid Until</Label>
            <Input
              type="datetime-local"
              className="bg-gray-800 text-white border border-gray-700"
              value={validUntil}
              onChange={e => setValidUntil(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-200">Status</Label>
            <Select
              value={status}
              onValueChange={val => setStatus(val as 'active' | 'inactive')}
              disabled={loading}
            >
              <SelectTrigger className="bg-gray-800 text-white border border-gray-700">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-200">
              Thumbnail (leave empty to keep current)
            </Label>
            <Input
              type="file"
              accept="image/*"
              className="bg-gray-800 text-white border border-gray-700"
              onChange={e => {
                if (e.target.files?.[0]) setThumbnail(e.target.files[0])
              }}
              disabled={loading}
            />
            {thumbnail && (
              <p className="text-sm text-gray-400">{thumbnail.name}</p>
            )}
            {preview && (
              <Image
                width={200}
                height={200}
                src={preview}
                alt="Thumbnail Preview"
                className="mt-2 w-40 h-40 object-cover rounded border border-gray-700"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-800">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update Offer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
