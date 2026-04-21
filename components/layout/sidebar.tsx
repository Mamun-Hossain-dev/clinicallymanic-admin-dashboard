'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ShoppingBag,
  ImageIcon,
  FileText,
  Calendar,
  Tag,
  Users,
  Mail,
  Settings,
  ShoppingBagIcon,
  LogOut,
  ReceiptText,
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const menuItems = [
  {
    title: 'MENU',
    items: [
      {
        title: 'Dashboard',
        href: '/admin-dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      {
        title: 'Shop Management',
        href: '/admin-dashboard/shop-management',
        icon: ShoppingBag,
      },
      {
        title: 'Orders Management',
        href: '/admin-dashboard/orders-management',
        icon: ReceiptText,
      },
      {
        title: 'Banner Management',
        href: '/admin-dashboard/banner-management',
        icon: ImageIcon,
      },
      {
        title: 'Content Management',
        href: '/admin-dashboard/content-management',
        icon: FileText,
      },
      {
        title: 'Events',
        href: '/admin-dashboard/events-management',
        icon: Calendar,
      },
      {
        title: 'Offers',
        href: '/admin-dashboard/offers-management',
        icon: Tag,
      },
    ],
  },
  {
    title: 'USER DATA',
    items: [
      {
        title: 'Subscriptions',
        href: '/admin-dashboard/subscription-management',
        icon: Users,
      },
      {
        title: 'Contacts',
        href: '/admin-dashboard/contact-management',
        icon: Mail,
      },
      {
        title: 'Subscribers',
        href: '/admin-dashboard/subscribers-management',
        icon: Mail,
      },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      {
        title: 'Settings',
        href: '/admin-dashboard/settings',
        icon: Settings,
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/signin',
    })
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link href="/">
          <div className="flex items-center gap-3 pt-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#1a1a1a] flex-shrink-0">
              <Image
                src="/logo.jpeg"
                alt="Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-[15px] font-semibold tracking-widest whitespace-nowrap text-white">
              CLINICALLY MANIC
            </span>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <ScrollArea className="flex-1 px-4 py-4 mt-5">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h4 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              {section.title}
            </h4>
            <div className="space-y-2">
              {section.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-colors',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>

      {/* Logout with Modal */}
      <div className="border-t border-border p-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base text-white transition-colors hover:bg-white/10">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-[#0f0f0f] border border-white/10 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-white/70">
                You will be logged out from the admin dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent text-white border hover:text-white border-white/20 hover:bg-white/10">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleLogout}
                className="bg-white text-black hover:bg-white/90"
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
