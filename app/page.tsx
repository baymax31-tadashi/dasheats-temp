'use client'

import { useState, useCallback, useRef } from 'react'
import useSWR, { mutate } from 'swr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MenuCard } from '@/components/menu-card'
import { OrderCart } from '@/components/order-cart'
import { OrdersList } from '@/components/orders-list'
import { FoodItemForm } from '@/components/food-item-form'
import { HeroSection } from '@/components/hero-section'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminDashboard } from '@/components/admin/dashboard'
import { RestaurantInfo } from '@/components/admin/restaurant-info'
import { Inventory } from '@/components/admin/inventory'
import { Analytics } from '@/components/admin/analytics'
import { Reviews } from '@/components/admin/reviews'
import { OrdersDashboard } from '@/components/admin/orders-dashboard'
import type { FoodItem, Order, OrderItem } from '@/lib/types'
import { Plus, Utensils, Search, Github, LayoutDashboard, Menu, X, Home as HomeIcon, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function RootPage() {
  const { data: menuItems = [], isLoading: menuLoading } = useSWR<FoodItem[]>('/api/menu', fetcher)
  const { data: orders = [], isLoading: ordersLoading } = useSWR<Order[]>('/api/orders', fetcher)
  
  const [cartItems, setCartItems] = useState<OrderItem[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<FoodItem | null>(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [mainTab, setMainTab] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false)
  const [adminActiveTab, setAdminActiveTab] = useState('overview')
  
  const menuRef = useRef<HTMLDivElement>(null)

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...new Set(menuItems.map(item => item.category))]

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

  const placeOrder = useCallback(async (
    customerName: string, 
    customerPhone?: string, 
    customerAddress?: string, 
    notes?: string
  ) => {
    setIsPlacingOrder(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems, customerName, customerPhone, customerAddress, notes })
      })
      if (res.ok) {
        setCartItems([])
        mutate('/api/orders')
        mutate('/api/stats')
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
          mutate('/api/stats')
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
          mutate('/api/stats')
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
        mutate('/api/stats')
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
        mutate('/api/stats')
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
        mutate('/api/stats')
        toast.success('Order deleted!')
      }
    } catch {
      toast.error('Failed to delete order')
    }
  }, [])

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Render Admin Dashboard
  if (mainTab === 'admin') {
    return (
      <main className="min-h-screen flex flex-col md:flex-row bg-background">
        <AdminSidebar 
          activeTab={adminActiveTab}
          onTabChange={setAdminActiveTab}
          onClose={() => setAdminSidebarOpen(false)}
          isOpen={adminSidebarOpen}
        />

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setAdminSidebarOpen(!adminSidebarOpen)}
                >
                  {adminSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                <h1 className="text-xl font-bold">Admin Panel</h1>
              </div>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMainTab('home')}
                className="gap-2"
              >
                <Utensils className="h-4 w-4" />
                Back to Shop
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              {adminActiveTab === 'overview' && <AdminDashboard />}
              {adminActiveTab === 'restaurant' && <RestaurantInfo />}
              {adminActiveTab === 'inventory' && <Inventory />}
              {adminActiveTab === 'orders' && <OrdersDashboard />}
              {adminActiveTab === 'analytics' && <Analytics />}
              {adminActiveTab === 'reviews' && <Reviews />}
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Render Menu Page
  if (mainTab === 'menu') {
    return (
      <main className="min-h-screen">
        <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <Utensils className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">DashEats</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Order Your Favorite Food</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <Button 
                variant={mainTab === 'home' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMainTab('home')}
                className="gap-2"
              >
                <HomeIcon className="h-4 w-4" />
                Home
              </Button>
              <Button 
                variant={mainTab === 'menu' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMainTab('menu')}
                className="gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Menu
              </Button>
              <Button 
                variant={mainTab === 'admin' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMainTab('admin')}
                className="gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </Button>
              <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          
          {mobileMenuOpen && (
            <div className="md:hidden border-t p-4 space-y-3 bg-card">
              <Button 
                variant={mainTab === 'home' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setMainTab('home'); setMobileMenuOpen(false) }}
                className="w-full gap-2"
              >
                <HomeIcon className="h-4 w-4" />
                Home
              </Button>
              <Button 
                variant={mainTab === 'menu' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setMainTab('menu'); setMobileMenuOpen(false) }}
                className="w-full gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Menu
              </Button>
              <Button 
                variant={mainTab === 'admin' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setMainTab('admin'); setMobileMenuOpen(false) }}
                className="w-full gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </Button>
              <Button onClick={() => { setIsFormOpen(true); setMobileMenuOpen(false) }} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
          )}
        </header>

        <div ref={menuRef} className="container mx-auto px-4 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {menuLoading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <Utensils className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-medium">No items found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery || categoryFilter !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'Add some items to your menu'}
                  </p>
                  <Button onClick={() => setIsFormOpen(true)} className="mt-4 gap-2">
                    <Plus className="h-4 w-4" />
                    Add First Item
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredItems.map(item => (
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
            
            <div className="hidden lg:block">
              <OrderCart
                items={cartItems}
                onUpdateQuantity={updateCartQuantity}
                onRemoveItem={removeFromCart}
                onPlaceOrder={placeOrder}
                isLoading={isPlacingOrder}
              />
            </div>
          </div>
          
          <div className="lg:hidden">
            <OrderCart
              items={cartItems}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeFromCart}
              onPlaceOrder={placeOrder}
              isLoading={isPlacingOrder}
            />
          </div>
        </div>

        <footer className="border-t bg-muted/30 mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Utensils className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold">DashEats</span>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Restaurant Management System with CI/CD Pipeline
              </p>
            </div>
          </div>
        </footer>

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

  // Render Home Page (Default)
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Utensils className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">DashEats</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Order Your Favorite Food</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant={mainTab === 'home' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMainTab('home')}
              className="gap-2"
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </Button>
            <Button 
              variant={mainTab === 'menu' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMainTab('menu')}
              className="gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Menu
            </Button>
            <Button 
              variant={mainTab === 'admin' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMainTab('admin')}
              className="gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden border-t p-4 space-y-3 bg-card">
            <Button 
              variant={mainTab === 'home' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setMainTab('home'); setMobileMenuOpen(false) }}
              className="w-full gap-2"
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </Button>
            <Button 
              variant={mainTab === 'menu' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setMainTab('menu'); setMobileMenuOpen(false) }}
              className="w-full gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Menu
            </Button>
            <Button 
              variant={mainTab === 'admin' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setMainTab('admin'); setMobileMenuOpen(false) }}
              className="w-full gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Button>
          </div>
        )}
      </header>

      <HeroSection onScrollToMenu={() => setMainTab('menu')} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Browse Menu</h3>
            <p className="text-muted-foreground">Explore our curated selection of delicious food items from your favorite restaurants.</p>
            <Button onClick={() => setMainTab('menu')} className="mt-4 gap-2">
              View Menu
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Manage Items</h3>
            <p className="text-muted-foreground">Add, edit, and manage your food items with ease through the admin interface.</p>
            <Button onClick={() => setMainTab('admin')} variant="outline" className="mt-4 gap-2">
              Go to Admin
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Dashboard</h3>
            <p className="text-muted-foreground">Get insights into your orders, revenue, and customer satisfaction metrics.</p>
            <Button onClick={() => setMainTab('admin')} variant="outline" className="mt-4 gap-2">
              Analytics
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <footer className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Utensils className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">FoodOrder</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Restaurant Management System with CI/CD Pipeline
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
