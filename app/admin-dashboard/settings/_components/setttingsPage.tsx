// ==================== FILE: _components/SettingsPage.tsx ====================
'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import {
  useGetUserProfile,
  useUpdateProfile,
  useUpdateProfileImage,
  useChangePassword,
  UpdateProfileData,
} from '@/lib/api/profileApi'
import { toast } from 'sonner'
import { ProfileImageUpload } from './profileImageUpload'
import { ProfileForm } from './profileForm'
import { PasswordForm } from './passwordForm'

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession()
  const accessToken = session?.user?.accessToken || ''
  const userId = session?.user?.id

  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')

  // Profile states
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')

  // Password states
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const {
    data: profileData,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useGetUserProfile(accessToken, userId)

  console.log('Profile data', profileData)
  console.log('profile image', profileImage)

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile(accessToken, userId, {
      onSuccess: async () => {
        toast.success('Profile updated successfully ✅')
        await refetchProfile()
        await updateSession()
      },
      onError: (error: Error) =>
        toast.error(error.message || 'Failed to update profile ❌'),
    })

  const { mutate: updateProfileImage, isPending: isUpdatingImage } =
    useUpdateProfileImage(accessToken, userId, {
      onSuccess: async () => {
        toast.success('Profile image updated successfully ✅')
        setImageFile(null)
        await refetchProfile()
      },
      onError: (error: Error) =>
        toast.error(error.message || 'Failed to update profile image ❌'),
    })

  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword(accessToken, {
      onSuccess: () => {
        toast.success('Password changed successfully ✅')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      },
      onError: (error: Error) =>
        toast.error(error.message || 'Failed to change password ❌'),
    })

  useEffect(() => {
    if (profileData?.data) {
      const profile = profileData?.data
      const userName = '@' + profile.firstName

      setFirstName(profile?.firstName || '')
      setLastName(profile?.lastName || '')
      setUsername(userName || '')
      setEmail(profile.email || '')
      setPhoneNumber(profile.phoneNumber || '')
      setProfileImage(profile.profileImage || '')
      setImagePreview(profile.profileImage || '')
    }
  }, [profileData])

  const handleImageChange = (file: File) => {
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleUploadProfileImage = () => {
    if (!imageFile) {
      toast.error('Please select an image before uploading')
      return
    }

    const formData = new FormData()
    formData.append('profileImage', imageFile)
    updateProfileImage(formData)
  }

  const handleUpdateProfile = () => {
    const profilePayload: UpdateProfileData = {
      firstName,
      lastName,

      phoneNumber,
    }
    updateProfile(profilePayload)
  }

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    changePassword({ oldPassword, newPassword })
  }

  const handleReset = () => {
    if (activeTab === 'profile') {
      if (profileData?.data) {
        const profile = profileData.data
        const userName = '@' + profile.firstName
        setFirstName(profile.firstName || '')
        setLastName(profile.lastName || '')
        setUsername(userName || '')
        setPhoneNumber(profile.phoneNumber || '')
        setImagePreview(profile.profileImage || '')
        setImageFile(null)
      }
    } else {
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="">
      <Card className="border-none shadow-none">
        <CardTitle className=" text-white pl-5 space-y-2">
          <h2 className="text-3xl font-semibold">Profile Settings</h2>
          <p className="text-sm text-white font-medium">
            Manage your profile settings.
          </p>
        </CardTitle>
        <CardContent className="">
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-2 py-3 font-medium transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'text-white border-b-2 border-slate-100'
                  : 'text-gray-600 hover:text-white'
              }`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-2 py-3 font-medium transition-colors cursor-pointer ${
                activeTab === 'password'
                  ? 'text-white border-b-2 border-slate-100'
                  : 'text-gray-600 hover:text-white'
              }`}
            >
              Change Password
            </button>
          </div>

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <ProfileImageUpload
                imagePreview={imagePreview}
                fullName={firstName}
                isUpdating={isUpdatingImage}
                onImageChange={handleImageChange}
                onUpload={handleUploadProfileImage}
              />

              <ProfileForm
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                username={username}
                setUsername={setUsername}
                email={email}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                isUpdating={isUpdatingProfile}
                onSubmit={handleUpdateProfile}
                onReset={handleReset}
              />
            </div>
          )}

          {activeTab === 'password' && (
            <PasswordForm
              oldPassword={oldPassword}
              setOldPassword={setOldPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              isUpdating={isChangingPassword}
              onSubmit={handleChangePassword}
              onReset={handleReset}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
