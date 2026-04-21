'use client'

import { useState, useEffect } from 'react'
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

const FEATURE_OPTIONS = [
  'PREMIUM_CONTENT',
  'AI_CHAT_ACCESS',
  'UNLIMITED_EVENTS',
  'PRIORITY_SUPPORT',
  'ADVANCED_ANALYTICS',
  'CUSTOM_BRANDING',
  'EXPORT_DATA',
] as const

/* ---------------- Types ---------------- */
type Subscription = {
  _id: string
  name: 'exclusive' | 'basic'
  type: 'monthly' | 'yearly' | 'weekly'
  price: number
  status: 'active' | 'inactive'
  features: string[]
}

type Props = {
  open: boolean
  onClose: () => void
  subscription: Subscription | null
  token: string
  onUpdated?: () => void
}

/* ---------------- Component ---------------- */
export default function EditSubscriptionModal({
  open,
  onClose,
  subscription,
  token,
  onUpdated,
}: Props) {
  const [name, setName] = useState<'exclusive' | 'basic'>('basic')
  const [type, setType] = useState<'monthly' | 'yearly' | 'weekly'>('yearly')
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [featureInput, setFeatureInput] =
    useState<(typeof FEATURE_OPTIONS)[number]>('PREMIUM_CONTENT')
  const [features, setFeatures] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (subscription) {
      setName(subscription.name)
      setType(subscription.type)
      setPrice(String(subscription.price))
      setStatus(subscription.status)
      setFeatures(subscription.features || [])
      setFeatureInput('PREMIUM_CONTENT')
    }
  }, [subscription])

  const addFeature = () => {
    if (!featureInput) return
    if (!features.includes(featureInput)) {
      setFeatures([...features, featureInput])
    }
  }

  const removeFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature))
  }

  const handleSubmit = async () => {
    if (!subscription) return

    // Validation for basic plan
    if (name === 'basic' && type !== 'weekly') {
      toast.error('Basic plan can only be weekly')
      return
    }

    if (name === 'basic' && Number(price) !== 0) {
      toast.error('Basic plan must be free ($0)')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/plans/${subscription._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            interval: type.toUpperCase(),
            price: Number(price),
            isActive: status === 'active',
            features,
          }),
        },
      )

      if (!res.ok) throw new Error('Failed to update subscription')

      const result = await res.json()
      toast.success('Subscription updated successfully!')
      onUpdated?.()
      onClose()
    } catch {
      toast.error('Failed to update subscription. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!subscription) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-gray-900 rounded-lg p-6 border border-gray-800">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-semibold">
            Edit Subscription
          </DialogTitle>
        </DialogHeader>

        {/* BODY */}
        <div className="space-y-6 pt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-gray-200 text-sm font-medium">
              Plan Name
            </Label>

            <Select
              value={name}
              onValueChange={v => {
                setName(v as 'exclusive' | 'basic')
                if (v === 'basic') {
                  setType('weekly')
                  setPrice('0')
                }
              }}
            >
              <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-700">
                <SelectValue placeholder="Select plan name" />
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
                onValueChange={v => setType(v as any)}
                disabled={name === 'basic'}
              >
                <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-700 disabled:opacity-50">
                  <SelectValue />
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
                className="bg-gray-800 text-white border border-gray-700 placeholder-gray-500 disabled:opacity-50"
                value={price}
                disabled={name === 'basic'}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-gray-200 text-sm font-medium">Status</Label>
            <Select value={status} onValueChange={v => setStatus(v as any)}>
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
                {features.map(feature => (
                  <span
                    key={feature}
                    className="flex items-center gap-1 rounded-md bg-gray-700 px-2 py-1 text-sm text-white"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="opacity-60 hover:opacity-100 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                <select
                  value={featureInput}
                  onChange={e =>
                    setFeatureInput(
                      e.target.value as (typeof FEATURE_OPTIONS)[number],
                    )
                  }
                  className="flex-1 min-w-[180px] bg-transparent text-sm outline-none text-white"
                >
                  {FEATURE_OPTIONS.map(feature => (
                    <option key={feature} value={feature} className="bg-gray-800">
                      {feature}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={addFeature}
                  className="ml-auto rounded-md p-1 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Select from backend-supported feature flags and click +
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="mt-6 border-t border-gray-800 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
