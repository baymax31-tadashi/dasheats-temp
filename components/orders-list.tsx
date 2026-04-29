'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Order } from '@/lib/types'
import { ClipboardList, Trash2 } from 'lucide-react'

interface OrdersListProps {
  orders: Order[]
  onUpdateStatus: (id: string, status: Order['status']) => void
  onDelete: (id: string) => void
}

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
}

export function OrdersList({ orders, onUpdateStatus, onDelete }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No orders yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Orders ({orders.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  Order #{order.id.slice(-6)}
                </p>
              </div>
              <Badge className={statusColors[order.status]}>
                {order.status}
              </Badge>
            </div>
            
            <div className="text-sm space-y-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.quantity}x {item.foodItemName}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={order.status}
                onValueChange={(value) => onUpdateStatus(order.id, value as Order['status'])}
              >
                <SelectTrigger className="flex-1">
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
                size="icon"
                variant="outline"
                onClick={() => onDelete(order.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
