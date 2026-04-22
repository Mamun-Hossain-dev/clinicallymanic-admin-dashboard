'use client'
import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import AuthLayout from './authLayout'
import Link from 'next/link'

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const router = useRouter()
  const { data: session, status } = useSession()

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  React.useEffect(() => {
    const role = String(session?.user?.role ?? '').toUpperCase()

    if (status === 'authenticated' && role === 'ADMIN') {
      router.replace('/admin-dashboard')
      router.refresh()
    }
  }, [router, session?.user?.role, status])

  const onSubmit = async (values: SignInFormData) => {
    try {
      setIsLoading(true)

      const res = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (!res) {
        toast.error('Something went wrong. Please try again.')
        setIsLoading(false)
        return
      }

      if (res.error) {
        // Handle specific error messages
        if (res.error.toLowerCase().includes('credentials')) {
          toast.error('Invalid email or password')
        } else if (res.error.toLowerCase().includes('admin access only')) {
          toast.error('Only admin accounts can sign in here')
        } else if (res.error.toLowerCase().includes('user not found')) {
          toast.error('No account found with this email')
        } else if (res.error.toLowerCase().includes('password')) {
          toast.error('Incorrect password')
        } else {
          toast.error('Invalid credentials. Please try again.')
        }
        setIsLoading(false)
        return
      }

      toast.success('Login successful! 🎉')
      router.replace('/admin-dashboard')
      router.refresh()
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error('Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AuthLayout>
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider">
              CLINICALLY MANIC
            </h1>
            <p className="text-white/80 text-lg sm:text-xl tracking-wide font-serif">
              Welcome Back
            </p>
          </div>

          <Form {...form}>
            <form
              action="#"
              method="post"
              onSubmit={event => {
                event.preventDefault()
                void form.handleSubmit(onSubmit)(event)
              }}
              className="space-y-6"
            >
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
                        disabled={isLoading}
                        autoComplete="email"
                        className="w-full px-6 py-3 bg-transparent border border-white/60 text-white placeholder-white/50 
                        focus:outline-none focus:border-white focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60 text-sm sm:text-base font-serif"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 font-serif text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/90 text-sm tracking-wide font-serif">
                      Password
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          disabled={isLoading}
                          autoComplete="current-password"
                          className="w-full px-6 py-3 pr-12 bg-transparent border border-white/60 text-white placeholder-white/50 
                          focus:outline-none focus:border-white focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60 text-sm sm:text-base font-serif"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    <FormMessage className="text-red-400 font-serif text-sm" />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-white bg-transparent border-white/60 cursor-pointer"
                    tabIndex={-1}
                  />
                  <span className="text-white/80 font-serif">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-white/80 hover:text-white underline font-serif transition-colors"
                  tabIndex={-1}
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full px-10 py-3 bg-transparent border border-white/60 text-white uppercase tracking-widest 
                text-xs sm:text-sm hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 font-normal"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* <p className="text-center text-sm text-white/70 font-serif">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="text-white hover:underline font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </p> */}
            </form>
          </Form>
        </div>
      </AuthLayout>
    </>
  )
}
