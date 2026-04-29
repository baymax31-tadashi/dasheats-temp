'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type { OrderItem } from '@/lib/types'
import { Minus, Plus, ShoppingCart, Trash2, CreditCard, Clock } from 'lucide-react'
import { useState } from 'react'

interface OrderCartProps {
  items: OrderItem[]
  onUpdateQuantity: (foodItemId: string, quantity: number) => void
  onRemoveItem: (foodItemId: string) => void
  onPlaceOrder: (customerName: string, customerPhone?: string, customerAddress?: string, notes?: string) => void
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
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08
  const deliveryFee = subtotal > 50 ? 0 : 4.99
  const total = subtotal + tax + deliveryFee
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customerName.trim() && items.length > 0) {
      onPlaceOrder(customerName.trim(), customerPhone.trim() || undefined, customerAddress.trim() || undefined, notes.trim() || undefined)
      setCustomerName('')
      setCustomerPhone('')
      setCustomerAddress('')
      setNotes('')
      setShowDetails(false)
    }
  }

  return (
    <Card className="sticky top-6 shadow-lg">
      <CardHeader className="bg-primary/5 rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <span>Your Order</span>
          </div>
          {itemCount > 0 && (
            <span className="bg-primary text-primary-foreground text-sm px-2 py-0.5 rounded-full">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Add delicious items from the menu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.foodItemId} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.foodItemName}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{item.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 rounded-full"
                    onClick={() => onUpdateQuantity(item.foodItemId, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 rounded-full"
                    onClick={() => onUpdateQuantity(item.foodItemId, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={() => onRemoveItem(item.foodItemId)}
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
              </div>
            ))}
            
            <Separator className="my-4" />
            
            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (8%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span>₹{deliveryFee.toFixed(2)}</span>
                )}
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-muted-foreground text-center py-1 bg-muted rounded">
                  Add ₹{(50 - subtotal).toFixed(2)} more for free delivery
                </p>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Estimated Time */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
              <Clock className="h-4 w-4" />
              <span>Estimated delivery: 30-45 min</span>
            </div>
          </div>
        )}
      </CardContent>
      {items.length > 0 && (
        <CardFooter className="flex-col">
          <form onSubmit={handleSubmit} className="w-full space-y-3">
            <div className="space-y-1">
              <Label htmlFor="customerName">Your Name *</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            
            {!showDetails ? (
              <Button 
                type="button" 
                variant="link" 
                className="p-0 h-auto text-sm"
                onClick={() => setShowDetails(true)}
              >
                + Add delivery details
              </Button>
            ) : (
              <>
                <div className="space-y-1">
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="customerAddress">Delivery Address</Label>
                  <Input
                    id="customerAddress"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="123 Main St, City, State"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="notes">Special Instructions</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or allergies?"
                    rows={2}
                  />
                </div>
              </>
            )}
            
            <Button type="submit" className="w-full gap-2 h-12 text-base" disabled={isLoading || !customerName.trim()}>
              <CreditCard className="h-5 w-5" />
              {isLoading ? 'Processing...' : `Place Order - ₹${total.toFixed(2)}`}
            </Button>
          </form>
        </CardFooter>
      )}
    </Card>
  )
}
