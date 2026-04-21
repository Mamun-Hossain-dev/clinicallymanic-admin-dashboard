'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

import AuthLayout from '../_components/authLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

/* ==================== SCHEMA ==================== */
const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'At least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ['confirmPassword'],
      })
    }
  })

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

/* ==================== PAGE ==================== */
export function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: async (data: { email: string; newPassword: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      )

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Password reset failed')
      return result
    },
    onSuccess: data => {
      toast.success(data.message || 'Password reset successfully 🔒')
      router.push('/signin')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Something went wrong')
    },
  })

  const onSubmit = (values: ResetPasswordForm) => {
    if (!email) {
      toast.error('Email missing from URL')
      return
    }

    resetPassword({
      email,
      newPassword: values.newPassword,
    })
  }

  return (
    <AuthLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider">
            CLINICALLY MANIC
          </h1>
          <p className="text-white/80 text-lg tracking-wide font-serif">
            Change Password
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 text-sm font-serif">
                    Create New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create new password"
                        disabled={isPending}
                        className="w-full px-6 py-3 pr-12 bg-transparent border border-white/40 text-white placeholder:text-white/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 text-sm font-serif">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      disabled={isPending}
                      className="w-full px-6 py-3 bg-transparent border border-white/40 text-white placeholder:text-white/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full px-10 py-3 bg-transparent border border-white/60 text-white uppercase tracking-widest 
              text-xs sm:text-sm hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 font-normal"
            >
              {isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  )
}
