'use client'

import { useState, useCallback } from 'react'
import useSWR, { mutate } from 'swr'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MenuCard } from '@/components/menu-card'
import { OrderCart } from '@/components/order-cart'
import { OrdersList } from '@/components/orders-list'
import { FoodItemForm } from '@/components/food-item-form'
import type { FoodItem, Order, OrderItem } from '@/lib/types'
import { Plus, Utensils } from 'lucide-react'
import { toast } from 'sonner'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Home() {
  const { data: menuItems = [], isLoading: menuLoading } = useSWR<FoodItem[]>('/api/menu', fetcher)
  const { data: orders = [], isLoading: ordersLoading } = useSWR<Order[]>('/api/orders', fetcher)
  
  const [cartItems, setCartItems] = useState<OrderItem[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<FoodItem | null>(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const addToCart = useCallback((item: FoodItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.foodItemId === item.id)
      if (existing) {
        return prev.map(i => 
          i.foodItemId === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, {
        foodItemId: item.id,
        foodItemName: item.name,
        quantity: 1,
        price: item.price
      }]
    })
    toast.success(`Added ${item.name} to cart`)
  }, [])

  const updateCartQuantity = useCallback((foodItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(i => i.foodItemId !== foodItemId))
    } else {
      setCartItems(prev => prev.map(i => 
        i.foodItemId === foodItemId ? { ...i, quantity } : i
      ))
    }
  }, [])

  const removeFromCart = useCallback((foodItemId: string) => {
    setCartItems(prev => prev.filter(i => i.foodItemId !== foodItemId))
  }, [])

  const placeOrder = useCallback(async (customerName: string) => {
    setIsPlacingOrder(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems, customerName })
      })
      if (res.ok) {
        setCartItems([])
        mutate('/api/orders')
        toast.success('Order placed successfully!')
      } else {
        toast.error('Failed to place order')
      }
    } catch {
      toast.error('Failed to place order')
    }
    setIsPlacingOrder(false)
  }, [cartItems])

  const handleAddOrUpdateItem = useCallback(async (data: Omit<FoodItem, 'id' | 'createdAt'>) => {
    try {
      if (editItem) {
        const res = await fetch(`/api/menu/${editItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (res.ok) {
          mutate('/api/menu')
          toast.success('Item updated successfully!')
        }
      } else {
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (res.ok) {
          mutate('/api/menu')
          toast.success('Item added successfully!')
        }
      }
    } catch {
      toast.error('Failed to save item')
    }
    setEditItem(null)
  }, [editItem])

  const handleDeleteItem = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' })
      if (res.ok) {
        mutate('/api/menu')
        toast.success('Item deleted successfully!')
      }
    } catch {
      toast.error('Failed to delete item')
    }
  }, [])

  const handleUpdateOrderStatus = useCallback(async (id: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        mutate('/api/orders')
        toast.success('Order status updated!')
      }
    } catch {
      toast.error('Failed to update order')
    }
  }, [])

  const handleDeleteOrder = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
      if (res.ok) {
        mutate('/api/orders')
        toast.success('Order deleted!')
      }
    } catch {
      toast.error('Failed to delete order')
    }
  }, [])

  return (
    <main className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">FoodOrder</h1>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {menuLoading ? (
                  <p className="text-muted-foreground">Loading menu...</p>
                ) : menuItems.length === 0 ? (
                  <p className="text-muted-foreground">No items in the menu. Add some!</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {menuItems.map(item => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        onAddToOrder={addToCart}
                        onEdit={(item) => {
                          setEditItem(item)
                          setIsFormOpen(true)
                        }}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <OrderCart
                  items={cartItems}
                  onUpdateQuantity={updateCartQuantity}
                  onRemoveItem={removeFromCart}
                  onPlaceOrder={placeOrder}
                  isLoading={isPlacingOrder}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            {ordersLoading ? (
              <p className="text-muted-foreground">Loading orders...</p>
            ) : (
              <OrdersList
                orders={orders}
                onUpdateStatus={handleUpdateOrderStatus}
                onDelete={handleDeleteOrder}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <FoodItemForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditItem(null)
        }}
        onSubmit={handleAddOrUpdateItem}
        editItem={editItem}
      />
    </main>
  )
}
