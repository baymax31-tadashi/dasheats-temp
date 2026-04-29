'use client'

import { useState, useCallback, useRef } from 'react'
import useSWR, { mutate } from 'swr'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MenuCard } from '@/components/menu-card'
import { OrderCart } from '@/components/order-cart'
import { OrdersList } from '@/components/orders-list'
import { FoodItemForm } from '@/components/food-item-form'
import { HeroSection } from '@/components/hero-section'
import { StatsDashboard } from '@/components/stats-dashboard'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminDashboard } from '@/components/admin/dashboard'
import { RestaurantInfo } from '@/components/admin/restaurant-info'
import { Inventory } from '@/components/admin/inventory'
import { Analytics } from '@/components/admin/analytics'
import { Reviews } from '@/components/admin/reviews'
import { OrdersDashboard } from '@/components/admin/orders-dashboard'
import type { FoodItem, Order, OrderItem } from '@/lib/types'
import { Plus, Utensils, Search, Github, LayoutDashboard, Menu, X } from 'lucide-react'
import { toast } from 'sonner'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Home() {
  const { data: menuItems = [], isLoading: menuLoading } = useSWR<FoodItem[]>('/api/menu', fetcher)
  const { data: orders = [], isLoading: ordersLoading } = useSWR<Order[]>('/api/orders', fetcher)
  
  const [cartItems, setCartItems] = useState<OrderItem[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<FoodItem | null>(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAdmin, setShowAdmin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false)
  const [adminActiveTab, setAdminActiveTab] = useState('overview')
  
  const menuRef = useRef<HTMLDivElement>(null)

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Filter menu items
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
  if (showAdmin) {
    return (
      <main className="min-h-screen flex flex-col md:flex-row bg-background">
        {/* Admin Sidebar */}
        <AdminSidebar 
          activeTab={adminActiveTab}
          onTabChange={setAdminActiveTab}
          onClose={() => setAdminSidebarOpen(false)}
          isOpen={adminSidebarOpen}
        />

        {/* Admin Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
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
                onClick={() => setShowAdmin(false)}
                className="gap-2"
              >
                <Utensils className="h-4 w-4" />
                Back to Shop
              </Button>
            </div>
          </header>

          {/* Admin Content Area */}
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

  // Render Customer Shop
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Utensils className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">FoodOrder</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Order Your Favorite Food</p>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAdmin(true)}
              className="gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Mode
            </Button>
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
          
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t p-4 space-y-3 bg-card">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => { setShowAdmin(true); setMobileMenuOpen(false) }}
              className="w-full gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Mode
            </Button>
            <Button onClick={() => { setIsFormOpen(true); setMobileMenuOpen(false) }} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <HeroSection onScrollToMenu={scrollToMenu} />

      {/* Main Content */}
      <div ref={menuRef} className="container mx-auto px-4 py-8">
        <Tabs defaultValue="menu" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="menu" className="gap-2">
                <Utensils className="h-4 w-4" />
                Menu ({menuItems.length})
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2 relative">
                Orders
                {orders.filter(o => o.status === 'pending').length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {orders.filter(o => o.status === 'pending').length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            {/* Cart Badge for Mobile */}
            {cartItemCount > 0 && (
              <div className="sm:hidden fixed bottom-4 right-4 z-50">
                <Button size="lg" className="rounded-full shadow-lg gap-2 pr-5">
                  <span className="bg-primary-foreground text-primary h-6 w-6 rounded-full flex items-center justify-center text-sm font-bold">
                    {cartItemCount}
                  </span>
                  View Cart
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="menu" className="space-y-6">
            {/* Search and Filter */}
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
              {/* Menu Grid */}
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
              
              {/* Cart Sidebar */}
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
            
            {/* Mobile Cart */}
            <div className="lg:hidden">
              <OrderCart
                items={cartItems}
                onUpdateQuantity={updateCartQuantity}
                onRemoveItem={removeFromCart}
                onPlaceOrder={placeOrder}
                isLoading={isPlacingOrder}
              />
            </div>
          </TabsContent>

          <TabsContent value="orders">
            {ordersLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
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

      {/* Footer */}
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
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Built with Next.js</span>
              <span>|</span>
              <span>Docker + Kubernetes</span>
              <span>|</span>
              <span>Jenkins CI/CD</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Food Item Form Modal */}
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
