// ==================== FILE: _components/ProfileForm.tsx ====================
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface ProfileFormProps {
  firstName: string
  setFirstName: (value: string) => void
  lastName: string
  setLastName: (value: string) => void
  username: string
  setUsername: (value: string) => void
  email: string
  phoneNumber: string
  setPhoneNumber: (value: string) => void
  isUpdating: boolean
  onSubmit: () => void
  onReset: () => void
}

export function ProfileForm({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  setUsername,
  username,
  email,
  phoneNumber,
  setPhoneNumber,
  isUpdating,
  onSubmit,
  onReset,
}: ProfileFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName" className="text-white">
            First Name
          </Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="Enter your first name"
            className="mt-1 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>

        <div>
          <Label htmlFor="lastName" className="text-white">
            Last Name
          </Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder="Enter your last name"
            className="mt-1 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input
            id="email"
            value={email}
            disabled
            readOnly
            className="mt-1 bg-[#0a0a0a] border-gray-800 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <Label htmlFor="username" className="text-white">
            Username
          </Label>
          <Input
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="mt-1 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-white">
            Phone Number
          </Label>
          <Input
            id="phone"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder="Admin"
            className="mt-1 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={onSubmit}
          disabled={isUpdating}
          className="min-w-[140px] bg-white text-black hover:bg-gray-200"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Profile'
          )}
        </Button>
        <Button
          type="button"
          className="border border-gray-600 rounded-sm font-normal text-gray-300 hover:bg-gray-800"
          variant="ghost"
          onClick={onReset}
          disabled={isUpdating}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
