'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Utensils, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Zap, 
  BarChart3 
} from 'lucide-react'

interface HomeScreenProps {
  stats?: {
    totalOrders: number
    totalRevenue: number
    activeUsers: number
    completedOrders: number
  }
  onNavigate: (tab: string) => void
}

export function HomeScreen({ stats, onNavigate }: HomeScreenProps) {
  const defaultStats = {
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    completedOrders: 0
  }

  const data = stats || defaultStats

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold text-balance">
                Welcome to <span className="text-primary">DashEats</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Your all-in-one restaurant management platform. Manage menus, track orders, and grow your business.
              </p>
            </div>
            <div className="flex gap-4 flex-wrap pt-4">
              <Button size="lg" onClick={() => onNavigate('menu')} className="gap-2">
                <Utensils className="h-5 w-5" />
                View Menu
              </Button>
              <Button size="lg" variant="outline" onClick={() => onNavigate('orders')} className="gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Check Orders
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Quick Stats</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">Total Orders</span>
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{data.totalOrders}</p>
            <p className="text-xs text-muted-foreground">All time</p>
          </Card>

          <Card className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">Revenue</span>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">₹{data.totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Total generated</p>
          </Card>

          <Card className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">Completed</span>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">{data.completedOrders}</p>
            <p className="text-xs text-muted-foreground">Orders completed</p>
          </Card>

          <Card className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">Customers</span>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">{data.activeUsers}</p>
            <p className="text-xs text-muted-foreground">Unique customers</p>
          </Card>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Utensils className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Menu Management</h3>
            <p className="text-muted-foreground">
              Easily add, edit, and organize your menu items. Manage pricing, descriptions, and categories.
            </p>
            <Button variant="ghost" className="w-full" onClick={() => onNavigate('menu')}>
              Manage Menu →
            </Button>
          </Card>

          <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Order Tracking</h3>
            <p className="text-muted-foreground">
              Track customer orders in real-time. Update status and manage delivery with ease.
            </p>
            <Button variant="ghost" className="w-full" onClick={() => onNavigate('orders')}>
              View Orders →
            </Button>
          </Card>

          <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Analytics & Reports</h3>
            <p className="text-muted-foreground">
              Get detailed insights into sales, popular items, and customer feedback.
            </p>
            <Button variant="ghost" className="w-full" onClick={() => onNavigate('admin')}>
              View Analytics →
            </Button>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Grow Your Business?</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Access the full admin panel to manage your restaurant, view detailed analytics, and optimize your operations.
            </p>
            <Button size="lg" onClick={() => onNavigate('admin')} className="gap-2">
              <BarChart3 className="h-5 w-5" />
              Go to Admin Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
