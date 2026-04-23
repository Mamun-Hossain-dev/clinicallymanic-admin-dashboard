'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { StatCard } from '@/components/reusable/stat-card'
import { Users, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { dashboardApi } from '@/lib/api/dashboardApi'

const DashboardCharts = dynamic(() => import('./dashboard-charts'), {
  loading: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="h-[380px] rounded-lg border border-border bg-card animate-pulse" />
      <div className="h-[380px] rounded-lg border border-border bg-card animate-pulse" />
    </div>
  ),
})

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const token = session?.user?.accessToken || ''
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [loadSecondaryData, setLoadSecondaryData] = useState(false)

  // Generate year options (current year and past 4 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)

  useEffect(() => {
    if (!token) {
      setLoadSecondaryData(false)
      return
    }

    const idleCallback = window.requestIdleCallback?.(() =>
      setLoadSecondaryData(true),
    )

    if (idleCallback) {
      return () => window.cancelIdleCallback?.(idleCallback)
    }

    const timeoutId = window.setTimeout(() => setLoadSecondaryData(true), 250)
    return () => window.clearTimeout(timeoutId)
  }, [token])

  // Fetch Dashboard Overview
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => dashboardApi.getOverview(token),
    enabled: status === 'authenticated' && !!token,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  })

  // Fetch Revenue Overview
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-overview', selectedYear],
    queryFn: () => dashboardApi.getRevenueOverview(selectedYear, token),
    enabled: loadSecondaryData && !!token,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  })

  // Fetch User Growth
  const { data: userGrowthData, isLoading: userGrowthLoading } = useQuery({
    queryKey: ['user-growth'],
    queryFn: () => dashboardApi.getUserGrowth(token),
    enabled: loadSecondaryData && !!token,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  })

  // Fetch Latest Contacts
  const { data: latestContacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['latest-contacts'],
    queryFn: () => dashboardApi.getLatestContacts(token),
    enabled: loadSecondaryData && !!token,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
  })

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format number with commas
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-foreground mt-2">
          Welcome to Clinically Manic Admin Dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Users"
          value={
            overviewLoading ? '...' : formatNumber(overview?.totalUser || 0)
          }
          icon={Users}
          trend={{ value: 0, isPositive: true }}
          description="total registered users"
        />
        <StatCard
          title="Subscription Revenue"
          value={
            overviewLoading
              ? '...'
              : formatCurrency(overview?.subscriptionRevenue || 0)
          }
          icon={DollarSign}
          trend={{ value: 0, isPositive: true }}
          description="from subscriptions"
        />
        <StatCard
          title="Shop Revenue"
          value={
            overviewLoading ? '...' : formatCurrency(overview?.shopRevenue || 0)
          }
          icon={ShoppingBag}
          trend={{ value: 0, isPositive: true }}
          description="from shop sales"
        />
        <StatCard
          title="Total Revenue"
          value={
            overviewLoading
              ? '...'
              : formatCurrency(overview?.totalRevenue || 0)
          }
          icon={TrendingUp}
          trend={{ value: 0, isPositive: true }}
          description="combined earnings"
        />
      </div>

      <DashboardCharts
        selectedYear={selectedYear}
        yearOptions={yearOptions}
        revenueData={revenueData}
        userGrowthData={userGrowthData}
        revenueLoading={revenueLoading}
        userGrowthLoading={userGrowthLoading}
        onYearChange={setSelectedYear}
        formatCurrency={formatCurrency}
      />

      {/* Latest Contact Messages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Latest Contact Messages</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin-dashboard/contact-management">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {contactsLoading ? (
            <div className="flex items-center justify-center h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !latestContacts || latestContacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No contact messages yet
            </div>
          ) : (
            <div className="space-y-4">
              {latestContacts.map(contact => (
                <div
                  key={contact._id}
                  className="flex items-start justify-between border-b border-border pb-4 last:border-0"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{contact.name}</p>
                      <Badge variant={contact.isRead ? 'secondary' : 'default'}>
                        {contact.isRead ? 'Read' : 'New'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {contact.email}
                    </p>
                    <p className="text-base font-medium">{contact.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {contact.message}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                    {formatDate(contact.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
