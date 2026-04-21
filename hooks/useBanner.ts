// ============================================
// File: lib/hooks/useBanners.ts
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bannerApi } from '@/lib/api/bannerApi'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import type { ApiResponse, Banner } from '@/types/banner'

export const useBanners = (page: number, limit: number) => {
  return useQuery<ApiResponse<Banner[]>>({
    queryKey: ['banners', page, limit],
    queryFn: () => bannerApi.getAll(page, limit),
  })
}

export const useBanner = (id: string) => {
  return useQuery<ApiResponse<Banner>>({
    queryKey: ['banner', id],
    queryFn: () => bannerApi.getById(id),
    enabled: !!id,
  })
}

export const useCreateBanner = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  return useMutation({
    mutationFn: (formData: FormData) => {
      const token = session?.user?.accessToken || ''
      return bannerApi.create(formData, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
    },
  })
}

export const useUpdateBanner = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => {
      const token = session?.user?.accessToken || ''
      return bannerApi.update(id, formData, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
    },
  })
}

export const useDeleteBanner = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  return useMutation({
    mutationFn: (id: string) => {
      const token = session?.user?.accessToken || ''
      return bannerApi.delete(id, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
    },
  })
}
