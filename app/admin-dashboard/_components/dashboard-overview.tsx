'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { StatCard } from '@/components/reusable/stat-card'
import { Users, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { dashboardApi } from '@/lib/api/dashboardApi'

export default function DashboardPage() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken || ''
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  // Generate year options (current year and past 4 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)

  // Fetch Dashboard Overview
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => dashboardApi.getOverview(token),
    enabled: !!token,
  })

  // Fetch Revenue Overview
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-overview', selectedYear],
    queryFn: () => dashboardApi.getRevenueOverview(selectedYear, token),
    enabled: !!token,
  })

  // Fetch User Growth
  const { data: userGrowthData, isLoading: userGrowthLoading } = useQuery({
    queryKey: ['user-growth'],
    queryFn: () => dashboardApi.getUserGrowth(token),
    enabled: !!token,
  })

  // Fetch Latest Contacts
  const { data: latestContacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['latest-contacts'],
    queryFn: () => dashboardApi.getLatestContacts(token),
    enabled: !!token,
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

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Overview Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Revenue Overview</CardTitle>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="px-3 py-1.5 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData || []}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    stroke="#4b5563"
                  />
                  <YAxis
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    stroke="#4b5563"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb',
                    }}
                    formatter={(value: any) => [
                      formatCurrency(value),
                      'Revenue',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            {userGrowthLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    stroke="#4b5563"
                  />
                  <YAxis
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    stroke="#4b5563"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb',
                    }}
                    formatter={(value: any) => [value, 'Users']}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 7, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

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
