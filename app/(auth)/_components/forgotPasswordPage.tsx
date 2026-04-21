// ==================== FORGOT PASSWORD PAGE ====================
'use client'
import React from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import AuthLayout from './authLayout'

const forgotSchema = z.object({
  email: z.string().email('Invalid email'),
})

export function ForgotPasswordPage() {
  const router = useRouter()

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  const { mutate: sendOtp, isPending } = useMutation({
    mutationFn: async (data: { email: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      )
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Failed to send OTP')
      return result
    },
    onSuccess: (_, variables) => {
      toast.success('OTP sent successfully 📩')
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`)
    },

    onError: (error: any) => {
      toast.error(error.message || 'Failed to send OTP')
    },
  })

  const onSubmit = (values: z.infer<typeof forgotSchema>) => {
    sendOtp(values)
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider">
            CLINICALLY MANIC
          </h1>
          <p className="text-white/80 text-lg sm:text-xl tracking-wide font-serif">
            Forgot Password
          </p>
        </div>

        <Form {...form}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 text-sm tracking-wide font-serif">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      disabled={isPending}
                      className="w-full px-6 py-3 bg-transparent border border-white/60 text-white placeholder-white/50 
                      focus:outline-none focus:border-white focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60 text-sm sm:text-base font-serif"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 font-serif text-sm" />
                </FormItem>
              )}
            />

            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
              className="w-full px-10 py-3 bg-transparent border border-white/60 text-white uppercase tracking-widest 
              text-xs sm:text-sm hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 font-normal"
            >
              {isPending ? (
                <>
                  Sending OTP <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                'Send OTP'
              )}
            </Button>

            <p className="text-center text-sm text-white/70 font-serif">
              Remember your password?{' '}
              <Link
                href="/signin"
                className="text-white hover:underline font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </AuthLayout>
  )
}
