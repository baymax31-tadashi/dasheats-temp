'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { FoodItem } from '@/lib/types'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface MenuCardProps {
  item: FoodItem
  onAddToOrder: (item: FoodItem) => void
  onEdit: (item: FoodItem) => void
  onDelete: (id: string) => void
}

const categoryColors: Record<string, string> = {
  appetizer: 'bg-amber-100 text-amber-800',
  main: 'bg-emerald-100 text-emerald-800',
  dessert: 'bg-pink-100 text-pink-800',
  beverage: 'bg-sky-100 text-sky-800'
}

export function MenuCard({ item, onAddToOrder, onEdit, onDelete }: MenuCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>
          <Badge className={categoryColors[item.category] || 'bg-muted text-muted-foreground'}>
            {item.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
        <p className="text-xl font-bold text-primary">${item.price.toFixed(2)}</p>
        {!item.available && (
          <Badge variant="destructive" className="mt-2">Unavailable</Badge>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex gap-2">
        <Button 
          size="sm" 
          onClick={() => onAddToOrder(item)} 
          disabled={!item.available}
          className="flex-1"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
        <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => onDelete(item.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
