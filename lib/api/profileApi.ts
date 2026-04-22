import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// ==================== TYPES ====================
export type UserProfile = {
  _id: string
  userId: string
  firstName?: string
  lastName?: string
  email: string
  bio?: string
  phoneNumber?: string
  profileImage?: string
  fileType?: string
  uploadedAt?: string
}

export interface ProfileResponse {
  success: boolean
  message: string
  data: UserProfile
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  // username?: string
  bio?: string
  phoneNumber?: string
}

export interface ChangePasswordData {
  oldPassword: string
  newPassword: string
}

// ==================== HELPER ====================
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    const formattedError = new Error(
      error.message || 'Something went wrong',
    ) as Error & { status?: number }
    formattedError.status = response.status
    throw formattedError
  }
  return response.json()
}

// ==================== GET USER PROFILE ====================
export const useGetUserProfile = (accessToken: string, userId?: string) => {
  return useQuery<ProfileResponse>({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const response = await handleResponse<ProfileResponse>(res)
      return {
        ...response,
        data: {
          ...response.data,
          _id: response.data._id || (response.data as any).id,
        },
      }
    },
    enabled: !!accessToken && !!userId,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  })
}

// ==================== UPDATE PROFILE ====================
export const useUpdateProfile = (
  accessToken: string,
  userId?: string,
  options?: any,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      })

      return handleResponse<ProfileResponse>(res)
    },
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      options?.onSuccess?.(response)
    },
    onError: error => {
      options?.onError?.(error)
    },
  })
}

// ==================== UPDATE PROFILE IMAGE ====================
export const useUpdateProfileImage = (
  accessToken: string,
  userId?: string,
  options?: any,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      })

      const response = await handleResponse<ProfileResponse>(res)
      return {
        ...response,
        data: {
          ...response.data,
          _id: response.data._id || (response.data as any).id,
        },
      }
    },
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      options?.onSuccess?.(response)
    },
    onError: error => {
      options?.onError?.(error)
    },
  })
}

// ==================== CHANGE PASSWORD ====================
export const useChangePassword = (accessToken: string, options?: any) => {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      })

      return handleResponse<{ success: boolean; message: string }>(res)
    },
    onSuccess: () => {
      options?.onSuccess?.()
    },
    onError: error => {
      options?.onError?.(error)
    },
  })
}
