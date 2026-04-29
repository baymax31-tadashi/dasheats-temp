'use client'

import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Order } from '@/lib/types'
import { 
  Clock, Phone, MapPin, User, MessageSquare, ChefHat, CheckCircle, 
  XCircle, Package, Search, Trash2 
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const statusConfig: Record<Order['status'], { color: string; icon: React.ReactNode; label: string; bgColor: string }> = {
  pending: { 
    color: 'text-amber-800',
    bgColor: 'bg-amber-100',
    icon: <Clock className="h-3.5 w-3.5" />,
    label: 'Pending'
  },
  preparing: { 
    color: 'text-blue-800',
    bgColor: 'bg-blue-100',
    icon: <ChefHat className="h-3.5 w-3.5" />,
    label: 'Preparing'
  },
  ready: { 
    color: 'text-green-800',
    bgColor: 'bg-green-100',
    icon: <Package className="h-3.5 w-3.5" />,
    label: 'Ready'
  },
  delivered: { 
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    label: 'Delivered'
  },
  cancelled: { 
    color: 'text-red-800',
    bgColor: 'bg-red-100',
    icon: <XCircle className="h-3.5 w-3.5" />,
    label: 'Cancelled'
  }
}

export function OrdersDashboard() {
  const { data: orders = [] } = useSWR<Order[]>('/api/orders', fetcher, {
    refreshInterval: 5000
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerPhone?.includes(searchQuery) ?? false)
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = async (id: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        toast.success('Order status updated!')
      } else {
        toast.error('Failed to update order')
      }
    } catch {
      toast.error('Failed to update order')
    }
  }

  const handleDeleteOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Order deleted!')
      } else {
        toast.error('Failed to delete order')
      }
    } catch {
      toast.error('Failed to delete order')
    }
  }

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Preparing</p>
            <p className="text-2xl font-bold text-blue-600">{stats.preparing}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Ready</p>
            <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Delivered</p>
            <p className="text-2xl font-bold text-slate-600">{stats.delivered}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-4">
          <CardTitle>All Orders</CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, order ID, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">No orders found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredOrders.map((order) => {
                const config = statusConfig[order.status]
                return (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-mono text-sm font-medium">#{order.id.slice(-6)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${config.bgColor} ${config.color} flex items-center gap-1`}>
                        {config.icon}
                        {config.label}
                      </Badge>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{order.customerName}</span>
                      </div>
                      {order.customerPhone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{order.customerPhone}</span>
                        </div>
                      )}
                      {order.customerAddress && (
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5" />
                          <span className="line-clamp-2">{order.customerAddress}</span>
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    <div className="bg-muted/50 rounded p-2 mb-4 text-sm">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.quantity}x {item.foodItemName}</span>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t mt-2 pt-2 font-bold flex justify-between">
                        <span>Total</span>
                        <span className="text-primary">${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="flex gap-2 mb-4 text-sm bg-muted p-2 rounded">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{order.notes}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Select value={order.status} onValueChange={(value) => handleUpdateStatus(order.id, value as Order['status'])}>
                        <SelectTrigger className="flex-1 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground p-0"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
