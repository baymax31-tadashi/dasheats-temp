'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { OrderItem } from '@/lib/types'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface OrderCartProps {
  items: OrderItem[]
  onUpdateQuantity: (foodItemId: string, quantity: number) => void
  onRemoveItem: (foodItemId: string) => void
  onPlaceOrder: (customerName: string) => void
  isLoading?: boolean
}

export function OrderCart({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onPlaceOrder,
  isLoading 
}: OrderCartProps) {
  const [customerName, setCustomerName] = useState('')
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customerName.trim() && items.length > 0) {
      onPlaceOrder(customerName.trim())
      setCustomerName('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Your Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Your cart is empty. Add items from the menu.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.foodItemId} className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.foodItemName}</p>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => onUpdateQuantity(item.foodItemId, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => onUpdateQuantity(item.foodItemId, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive"
                    onClick={() => onRemoveItem(item.foodItemId)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </CardContent>
      {items.length > 0 && (
        <CardFooter>
          <form onSubmit={handleSubmit} className="w-full space-y-3">
            <div className="space-y-1">
              <Label htmlFor="customerName">Your Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !customerName.trim()}>
              {isLoading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </form>
        </CardFooter>
      )}
    </Card>
  )
}
