// ==================== VERIFY EMAIL PAGE ====================

'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Clock } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

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
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import AuthLayout from './authLayout'

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

export function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const router = useRouter()

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  })

  const [timeLeft, setTimeLeft] = useState(120)
  const inputRefs = useRef<HTMLInputElement[]>([])

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number,
    field: any,
  ) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    const newValue =
      field.value.substring(0, i) + val + field.value.substring(i + 1)
    field.onChange(newValue)
    if (val && i < 5) inputRefs.current[i + 1]?.focus()
    if (!val && i > 0) inputRefs.current[i - 1]?.focus()
  }

  const { mutate: verifyOtp, isPending } = useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      )
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Verification failed')
      return result
    },
    onSuccess: () => {
      toast.success('Email verified successfully!')
      router.push(`/reset-password?email=${encodeURIComponent(email || '')}`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Invalid OTP')
    },
  })

  const { mutate: resendOtp, isPending: isResending } = useMutation({
    mutationFn: async () => {
      if (!email) throw new Error('Email not found')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forget-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        },
      )
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Failed to resend OTP')
      return result
    },
    onSuccess: () => {
      toast.success('OTP resent successfully 📩')
      setTimeLeft(120)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to resend OTP')
    },
  })

  const onSubmit = (values: z.infer<typeof otpSchema>) => {
    if (!email) {
      toast.error('Email missing from URL')
      return
    }
    verifyOtp({ email, otp: values.otp })
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <AuthLayout>
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider">
            CLINICALLY MANIC
          </h1>
          <p className="text-white/80 text-lg sm:text-xl tracking-wide font-serif">
            Verify Email
          </p>
          <p className="text-white/60 text-sm font-serif">
            Enter OTP sent to your email
          </p>
        </div>

        <Form {...form}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2 md:gap-3 justify-between">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Input
                          key={i}
                          ref={el => {
                            if (el) inputRefs.current[i] = el
                          }}
                          maxLength={1}
                          className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold bg-transparent border-2 border-white/60 
                          text-white focus:border-white focus-visible:ring-0 focus-visible:ring-offset-0 font-serif"
                          value={field.value[i] || ''}
                          onChange={e => handleChange(e, i, field)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 font-serif text-sm text-center" />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-white/70 font-serif">
                <Clock size={16} />
                <span>
                  {minutes.toString().padStart(2, '0')}:
                  {seconds.toString().padStart(2, '0')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => resendOtp()}
                disabled={timeLeft > 0 || isResending}
                className={`font-serif ${
                  timeLeft > 0
                    ? 'text-white/40 cursor-not-allowed'
                    : 'text-white underline hover:text-white/80'
                }`}
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </button>
            </div>

            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
              className="w-full px-10 py-3 bg-transparent border border-white/60 text-white uppercase tracking-widest 
              text-xs sm:text-sm hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 font-normal"
            >
              {isPending ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </Form>
      </div>
    </AuthLayout>
  )
}
