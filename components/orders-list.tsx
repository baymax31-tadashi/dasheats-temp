'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Order } from '@/lib/types'
import { ClipboardList, Trash2, Clock, Phone, MapPin, User, MessageSquare, ChefHat, CheckCircle, XCircle, Package } from 'lucide-react'

interface OrdersListProps {
  orders: Order[]
  onUpdateStatus: (id: string, status: Order['status']) => void
  onDelete: (id: string) => void
}

const statusConfig: Record<Order['status'], { color: string; icon: React.ReactNode; label: string }> = {
  pending: { 
    color: 'bg-amber-100 text-amber-800 border-amber-200', 
    icon: <Clock className="h-3.5 w-3.5" />,
    label: 'Pending'
  },
  preparing: { 
    color: 'bg-blue-100 text-blue-800 border-blue-200', 
    icon: <ChefHat className="h-3.5 w-3.5" />,
    label: 'Preparing'
  },
  ready: { 
    color: 'bg-green-100 text-green-800 border-green-200', 
    icon: <Package className="h-3.5 w-3.5" />,
    label: 'Ready'
  },
  delivered: { 
    color: 'bg-slate-100 text-slate-600 border-slate-200', 
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    label: 'Delivered'
  },
  cancelled: { 
    color: 'bg-red-100 text-red-800 border-red-200', 
    icon: <XCircle className="h-3.5 w-3.5" />,
    label: 'Cancelled'
  }
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  
  if (isToday) {
    return `Today at ${formatTime(dateString)}`
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function OrdersList({ orders, onUpdateStatus, onDelete }: OrdersListProps) {
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const preparingCount = orders.filter(o => o.status === 'preparing').length
  
  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-1">Orders will appear here when customers place them</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700">Pending</p>
                <p className="text-2xl font-bold text-amber-800">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Preparing</p>
                <p className="text-2xl font-bold text-blue-800">{preparingCount}</p>
              </div>
              <ChefHat className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Ready</p>
                <p className="text-2xl font-bold text-green-800">{orders.filter(o => o.status === 'ready').length}</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Delivered</p>
                <p className="text-2xl font-bold text-slate-700">{orders.filter(o => o.status === 'delivered').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {orders.map((order) => {
          const config = statusConfig[order.status]
          return (
            <Card 
              key={order.id} 
              className={`overflow-hidden transition-all hover:shadow-md ${
                order.status === 'pending' ? 'ring-2 ring-amber-300' : ''
              }`}
            >
              {/* Header */}
              <div className="bg-muted/50 px-4 py-3 flex items-center justify-between border-b">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium">#{order.id.slice(-6)}</span>
                  <Badge className={`${config.color} flex items-center gap-1`}>
                    {config.icon}
                    {config.label}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
              </div>

              <CardContent className="p-4 space-y-4">
                {/* Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{order.customerName}</span>
                  </div>
                  {order.customerPhone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{order.customerPhone}</span>
                    </div>
                  )}
                  {order.customerAddress && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{order.customerAddress}</span>
                    </div>
                  )}
                  {order.notes && (
                    <div className="flex items-start gap-2 text-sm bg-muted p-2 rounded">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">{order.notes}</span>
                    </div>
                  )}
                </div>
                
                {/* Order Items */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
                    Order Items
                  </div>
                  <div className="divide-y">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between px-3 py-2 text-sm">
                        <span>
                          <span className="font-medium">{item.quantity}x</span> {item.foodItemName}
                        </span>
                        <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between px-3 py-2 bg-primary/5 font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Estimated Delivery */}
                {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    <Clock className="h-4 w-4" />
                    <span>Est. delivery: {formatTime(order.estimatedDelivery)}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Select
                    value={order.status}
                    onValueChange={(value) => onUpdateStatus(order.id, value as Order['status'])}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" /> Pending
                        </span>
                      </SelectItem>
                      <SelectItem value="preparing">
                        <span className="flex items-center gap-2">
                          <ChefHat className="h-4 w-4" /> Preparing
                        </span>
                      </SelectItem>
                      <SelectItem value="ready">
                        <span className="flex items-center gap-2">
                          <Package className="h-4 w-4" /> Ready
                        </span>
                      </SelectItem>
                      <SelectItem value="delivered">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" /> Delivered
                        </span>
                      </SelectItem>
                      <SelectItem value="cancelled">
                        <span className="flex items-center gap-2">
                          <XCircle className="h-4 w-4" /> Cancelled
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => onDelete(order.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete order</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
