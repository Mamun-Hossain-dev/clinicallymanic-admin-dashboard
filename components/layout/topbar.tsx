'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useGetUserProfile } from '@/lib/api/profileApi'

export function Topbar() {
  const { data: session, status } = useSession()
  const accessToken = session?.user?.accessToken || ''
  const userId = session?.user?.id
  const { data: profileData } = useGetUserProfile(accessToken, userId)

  //  not authenticated → signin
  if (status === 'unauthenticated') {
    return (
      <div className="flex h-16 items-center justify-end px-6">
        <Link
          href="/signin"
          className="text-sm text-muted-foreground hover:underline"
        >
          Sign in
        </Link>
      </div>
    )
  }

  //  loading state (optional)
  if (status === 'loading') {
    return <div className="h-16" />
  }

  const profileImage =
    profileData?.data?.profileImage ||
    session?.user?.profileImage ||
    '/placeholder-user.jpg'
  const userName = session?.user?.name || 'Admin'

  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-card  py-8 pr-10">
      <div className="flex flex-1" />

      {/* <h3 className="text-3xl text-white">{session?.user?.name || '@admin'}</h3> */}

      {/* Avatar → Settings */}
      <Link href="/admin-dashboard/settings">
        <div className="relative h-12 w-12 rounded-full border-2 border-white overflow-hidden cursor-pointer">
          <Image
            src={profileImage}
            alt={userName}
            fill
            className="object-cover"
            sizes="50px"
          />
        </div>
      </Link>
    </div>
  )
}
