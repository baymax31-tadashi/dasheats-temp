'use client'

import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Check, X } from 'lucide-react'
import type { FoodItem } from '@/lib/types'
import { useState } from 'react'
import { toast } from 'sonner'

interface InventoryItem extends FoodItem {
  stock?: number
  reorderLevel?: number
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function Inventory() {
  const { data: items = [] } = useSWR<InventoryItem[]>('/api/menu', fetcher)
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({})

  const handleStockUpdate = async (itemId: string) => {
    try {
      const res = await fetch(`/api/menu/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          stock: stockUpdates[itemId] 
        })
      })
      if (res.ok) {
        toast.success('Stock updated successfully!')
        setStockUpdates({ ...stockUpdates, [itemId]: 0 })
      } else {
        toast.error('Failed to update stock')
      }
    } catch {
      toast.error('Failed to update stock')
    }
  }

  const lowStockItems = items.filter(item => (item.stock ?? 0) < (item.reorderLevel ?? 10))

  return (
    <div className="space-y-6">
      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-900">Low Stock Alert</p>
              <p className="text-sm text-amber-700">{lowStockItems.length} items are running low on stock</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory List */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Menu Item Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No items in menu</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Stock: <span className={item.stock! < item.reorderLevel! ? 'text-destructive' : 'text-green-600'}>
                          {item.stock ?? 0}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">Reorder at: {item.reorderLevel ?? 10}</p>
                    </div>

                    {item.stock! < item.reorderLevel! && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Low Stock
                      </Badge>
                    )}

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        placeholder="New stock"
                        value={stockUpdates[item.id] ?? ''}
                        onChange={(e) => setStockUpdates({ 
                          ...stockUpdates, 
                          [item.id]: parseInt(e.target.value) || 0 
                        })}
                        className="w-24"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleStockUpdate(item.id)}
                        disabled={!stockUpdates[item.id]}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
