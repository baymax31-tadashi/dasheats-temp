'use client'

import { LayoutDashboard, UtensilsCrossed, TrendingUp, Users, ShoppingBag, Settings, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onClose?: () => void
  isOpen?: boolean
}

export function AdminSidebar({ activeTab, onTabChange, onClose, isOpen = true }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'restaurant', label: 'Restaurant Info', icon: UtensilsCrossed },
    { id: 'inventory', label: 'Inventory', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Users },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed md:relative md:block z-40 w-64 h-screen bg-card border-r transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-sm">DashEats</h2>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => {
                  onTabChange(item.id)
                  onClose?.()
                }}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
