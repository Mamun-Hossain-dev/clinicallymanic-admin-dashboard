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
import { useSession } from 'next-auth/react'
import Image from 'next/image'

type AddOfferModalProps = {
  open: boolean
  onClose: () => void
  onAdded: () => void
}

export default function AddOfferModal({
  open,
  onClose,
  onAdded,
}: AddOfferModalProps) {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [discount, setDiscount] = React.useState('')
  const [validUntil, setValidUntil] = React.useState('')
  const [status, setStatus] = React.useState<'active' | 'inactive'>('active')
  const [thumbnail, setThumbnail] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const { data: session } = useSession()
  const token = (session?.user as { accessToken?: string })?.accessToken

  // Reset form whenever modal opens
  React.useEffect(() => {
    if (open) {
      setTitle('')
      setDescription('')
      setDiscount('')
      setValidUntil('')
      setStatus('active')
      setThumbnail(null)
      setPreview(null)
    }
  }, [open])

  // Update image preview whenever a thumbnail is selected
  React.useEffect(() => {
    if (!thumbnail) {
      setPreview(null)
      return
    }
    const objectUrl = URL.createObjectURL(thumbnail)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [thumbnail])

  const handleAdd = async () => {
    if (!title || !description || !discount || !validUntil || !status) {
      toast.error('Please fill all fields')
      return
    }

    if (!thumbnail) {
      toast.error('Please select a thumbnail image')
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

      // Thumbnail as file
      formData.append('thumbnail', thumbnail)

      // All other data as JSON string under "data" key
      const offerData = {
        title,
        description,
        discount: discountNum,
        validUntil: new Date(validUntil).toISOString(),
        status,
      }

      formData.append('data', JSON.stringify(offerData))

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Failed to add offer')
      }

      const result = await res.json()
      toast.success('Offer added successfully!')
      onAdded()
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Failed to add offer. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gray-900 rounded-lg p-6 border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Add New Offer
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="text-gray-200">Title</Label>
            <Input
              className="bg-gray-800 text-white border border-gray-700"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Offer title"
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-200">Description</Label>
            <Textarea
              className="bg-gray-800 text-white border border-gray-700 resize-none"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Offer description"
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
              placeholder="25"
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
            <Label className="text-gray-200">Thumbnail</Label>
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
          <Button onClick={handleAdd} disabled={loading}>
            {loading ? 'Adding...' : 'Add Offer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
