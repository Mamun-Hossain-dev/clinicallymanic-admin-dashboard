// ============================================
// File: lib/hooks/useContacts.ts
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contactApi } from '@/lib/api/contactApi'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import type { ApiResponse, Contact } from '@/types/contact'

export const useContacts = (page: number, limit: number) => {
  return useQuery<ApiResponse<Contact[]>>({
    queryKey: ['contacts', page, limit],
    queryFn: () => contactApi.getAll(page, limit),
  })
}

export const useContact = (id: string) => {
  return useQuery<ApiResponse<Contact>>({
    queryKey: ['contact', id],
    queryFn: () => contactApi.getById(id),
    enabled: !!id,
  })
}

export const useDeleteContact = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  return useMutation({
    mutationFn: (id: string) => {
      const token = session?.user?.accessToken || ''
      return contactApi.delete(id, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast.success('Contact deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete contact. Please try again.')
    },
  })
}
