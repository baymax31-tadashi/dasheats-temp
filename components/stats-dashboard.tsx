'use client'

import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { Utensils, ShoppingBag, DollarSign, Clock, TrendingUp } from 'lucide-react'

interface Stats {
  totalItems: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function StatsDashboard() {
  const { data: stats } = useSWR<Stats>('/api/stats', fetcher, {
    refreshInterval: 5000
  })

  if (!stats) return null

  const statsItems = [
    {
      label: 'Menu Items',
      value: stats.totalItems,
      icon: Utensils,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      label: 'Pending',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      label: 'Completed',
      value: stats.completedOrders,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statsItems.map((item) => (
        <Card key={item.label} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-xl font-bold">{item.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
