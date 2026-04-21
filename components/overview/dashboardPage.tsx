// 'use client'

// import { StatCard } from '@/components/reusable/stat-card'
// import { Users, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { dummyContacts } from '@/lib/data/dummy-data'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import {
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts'

// export default function DashboardPage() {
//   const latestContacts = dummyContacts.slice(0, 4)

//   const revenueData = [
//     { month: 'Jan', subscription: 8400, shop: 6200, total: 14600 },
//     { month: 'Feb', subscription: 9200, shop: 6800, total: 16000 },
//     { month: 'Mar', subscription: 10100, shop: 7400, total: 17500 },
//     { month: 'Apr', subscription: 10800, shop: 7900, total: 18700 },
//     { month: 'May', subscription: 11500, shop: 8400, total: 19900 },
//     { month: 'Jun', subscription: 12456, shop: 8932, total: 21388 },
//   ]

//   const userGrowthData = [
//     { month: 'Jan', users: 1850 },
//     { month: 'Feb', users: 2020 },
//     { month: 'Mar', users: 2180 },
//     { month: 'Apr', users: 2310 },
//     { month: 'May', users: 2420 },
//     { month: 'Jun', users: 2543 },
//   ]

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight text-foreground">
//           Dashboard
//         </h1>
//         <p className="text-foreground mt-2">
//           Welcome to Clinically Manic Admin Dashboard
//         </p>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <StatCard
//           title="Active Users"
//           value="2,543"
//           icon={Users}
//           trend={{ value: 12, isPositive: true }}
//           description="from last month"
//         />
//         <StatCard
//           title="Subscription Revenue"
//           value="$12,456"
//           icon={DollarSign}
//           trend={{ value: 8, isPositive: true }}
//           description="from last month"
//         />
//         <StatCard
//           title="Shop Revenue"
//           value="$8,932"
//           icon={ShoppingBag}
//           trend={{ value: 5, isPositive: true }}
//           description="from last month"
//         />
//         <StatCard
//           title="Total Revenue"
//           value="$21,388"
//           icon={TrendingUp}
//           trend={{ value: 9, isPositive: true }}
//           description="from last month"
//         />
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Revenue Overview</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={revenueData}>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   className="stroke-muted-foreground"
//                   opacity={0.2}
//                 />
//                 <XAxis
//                   dataKey="month"
//                   className="text-xs"
//                   tick={{ fill: 'currentColor' }}
//                   stroke="currentColor"
//                 />
//                 <YAxis
//                   className="text-xs"
//                   tick={{ fill: 'currentColor' }}
//                   stroke="currentColor"
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: 'hsl(var(--popover))',
//                     border: '1px solid hsl(var(--border))',
//                     borderRadius: '8px',
//                     color: 'hsl(var(--popover-foreground))',
//                   }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="subscription"
//                   stackId="1"
//                   stroke="hsl(var(--primary))"
//                   fill="hsl(var(--primary))"
//                   fillOpacity={0.6}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="shop"
//                   stackId="1"
//                   stroke="#10b981"
//                   fill="#10b981"
//                   fillOpacity={0.6}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>User Growth</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={userGrowthData}>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   className="stroke-muted-foreground"
//                   opacity={0.2}
//                 />
//                 <XAxis
//                   dataKey="month"
//                   className="text-xs"
//                   tick={{ fill: 'currentColor' }}
//                   stroke="currentColor"
//                 />
//                 <YAxis
//                   className="text-xs"
//                   tick={{ fill: 'currentColor' }}
//                   stroke="currentColor"
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: 'hsl(var(--popover))',
//                     border: '1px solid hsl(var(--border))',
//                     borderRadius: '8px',
//                     color: 'hsl(var(--popover-foreground))',
//                   }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="users"
//                   stroke="#3b82f6"
//                   strokeWidth={3}
//                   dot={{ fill: '#3b82f6', r: 5 }}
//                   activeDot={{ r: 7, fill: '#3b82f6' }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle>Latest Contact Messages</CardTitle>
//           <Button variant="outline" size="sm" asChild>
//             <Link href="/admin-dashboard/contact-management">View All</Link>
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {latestContacts.map(contact => (
//               <div
//                 key={contact.id}
//                 className="flex items-start justify-between border-b border-border pb-4 last:border-0"
//               >
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2">
//                     <p className="font-medium">{contact.name}</p>
//                     <Badge
//                       variant={
//                         contact.status === 'new' ? 'default' : 'secondary'
//                       }
//                     >
//                       {contact.status}
//                     </Badge>
//                   </div>
//                   <p className="text-sm text-foreground">{contact.email}</p>
//                   <p className="text-base font-medium">{contact.subject}</p>
//                 </div>
//                 <p className="text-sm text-foreground">{contact.createdAt}</p>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
