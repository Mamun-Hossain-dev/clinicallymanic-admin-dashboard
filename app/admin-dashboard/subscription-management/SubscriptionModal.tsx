'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export default function AddSubscriptionModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [name, setName] = useState('exclusive')
  const [type, setType] = useState('monthly')
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState('active')
  const [featureInput, setFeatureInput] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const { data: session } = useSession()
  const token = (session?.user as { accessToken?: string })?.accessToken
  const queryClient = useQueryClient()

  const createPlan = useMutation({
    mutationFn: async (body: {
      name: string
      type: string
      price: number
      status: string
      features: string[]
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      )

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to create plan')
      }

      return res.json()
    },
    onSuccess: () => {
      toast.success('Subscription plan created successfully!')
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      resetForm()
      onClose()
    },
    onError: (error: any) => {
      toast.error(
        error.message ||
          'Failed to create subscription plan. Please try again.',
      )
    },
  })

  const resetForm = () => {
    setName('exclusive')
    setType('monthly')
    setPrice('')
    setStatus('active')
    setFeatureInput('')
    setFeatures([])
  }

  const removeFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature))
  }

  const addFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()])
      setFeatureInput('')
    }
  }

  const handleSubmit = () => {
    if (!name || !price || features.length === 0) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validation for basic plan
    if (name === 'basic' && type !== 'weekly') {
      toast.error('Basic plan can only be weekly')
      return
    }

    if (name === 'basic' && Number(price) !== 0) {
      toast.error('Basic plan must be free ($0)')
      return
    }

    createPlan.mutate({
      name,
      type,
      price: Number(price),
      status,
      features,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-gray-900 rounded-lg p-6 border border-gray-800">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-semibold">
            Add Subscription Plan
          </DialogTitle>
        </DialogHeader>

        {/* BODY */}
        <div className="space-y-6 pt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-gray-200 text-sm font-medium">
              Plan Type
            </Label>

            <Select
              value={name}
              onValueChange={val => {
                setName(val)
                if (val === 'basic') {
                  setType('weekly')
                  setPrice('0')
                }
              }}
            >
              <SelectTrigger className="bg-gray-800 text-white border w-full border-gray-700">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>

              <SelectContent className="bg-gray-800 text-white border border-gray-700">
                <SelectItem value="exclusive">Exclusive</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-200 text-sm font-medium">
                Billing Type
              </Label>
              <Select
                value={type}
                onValueChange={setType}
                disabled={name === 'basic'}
              >
                <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-700 disabled:opacity-50">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white">
                  {name === 'basic' ? (
                    <SelectItem value="weekly">Weekly</SelectItem>
                  ) : (
                    <>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200 text-sm font-medium">Price</Label>
              <Input
                type="number"
                placeholder="999"
                value={price}
                disabled={name === 'basic'}
                className="bg-gray-800 text-white border border-gray-700 disabled:opacity-50"
                onChange={e => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-gray-200 text-sm font-medium">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label className="text-gray-200 text-sm font-medium">
              Features
            </Label>

            <div className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <div className="flex flex-wrap items-center gap-2">
                {features.map((feature, index) => (
                  <span
                    key={`${feature}-${index}`}
                    className="flex items-center gap-1 rounded-md bg-gray-700 px-2 py-1 text-sm text-white"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation()
                        removeFeature(feature)
                      }}
                      className="opacity-60 hover:opacity-100 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {/* Input */}
                <input
                  value={featureInput}
                  onChange={e => setFeatureInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault()
                      addFeature()
                    }

                    if (
                      e.key === 'Backspace' &&
                      !featureInput &&
                      features.length
                    ) {
                      setFeatures(features.slice(0, -1))
                    }
                  }}
                  placeholder="Add feature"
                  className="flex-1 min-w-[140px] bg-transparent text-sm outline-none placeholder-gray-400 text-white"
                />

                {/* Plus icon */}
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation()
                    addFeature()
                  }}
                  className="rounded-md p-1 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Press Enter, comma, Backspace or click + to manage features
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="mt-6 border-t border-gray-800 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createPlan.isPending}>
            {createPlan.isPending ? 'Creating...' : 'Create Plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
