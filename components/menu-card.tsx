'use client'

import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { FoodItem } from '@/lib/types'
import { Plus, Pencil, Trash2, Clock, Flame, Star, Leaf } from 'lucide-react'

interface MenuCardProps {
  item: FoodItem
  onAddToOrder: (item: FoodItem) => void
  onEdit: (item: FoodItem) => void
  onDelete: (id: string) => void
}

const categoryColors: Record<string, string> = {
  appetizer: 'bg-amber-500 text-white',
  main: 'bg-primary text-primary-foreground',
  dessert: 'bg-pink-500 text-white',
  beverage: 'bg-sky-500 text-white'
}

const spicyLabels = ['Mild', 'Medium', 'Spicy', 'Very Spicy']

export function MenuCard({ item, onAddToOrder, onEdit, onDelete }: MenuCardProps) {
  return (
    <Card className="group overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 rounded-2xl border-0 bg-card">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        
        {/* Category Badge */}
        <Badge className={`absolute top-3 left-3 ${categoryColors[item.category] || 'bg-muted text-muted-foreground'}`}>
          {item.category}
        </Badge>
        
        {/* Rating Badge */}
        {item.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span>{item.rating.toFixed(1)}</span>
          </div>
        )}
        
        {/* Unavailable Overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm px-4 py-1">
              Currently Unavailable
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-tight text-balance">{item.name}</h3>
          <span className="text-xl font-bold text-primary whitespace-nowrap">
            ₹{item.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
        
        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 text-xs">
          {item.prepTime && (
            <div className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              <span>{item.prepTime} min</span>
            </div>
          )}
          {item.calories && (
            <div className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded-full">
              <Flame className="h-3 w-3" />
              <span>{item.calories} cal</span>
            </div>
          )}
          {item.isVegetarian && (
            <div className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-full">
              <Leaf className="h-3 w-3" />
              <span>Veg</span>
            </div>
          )}
          {item.spicyLevel !== undefined && item.spicyLevel > 0 && (
            <div className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-full">
              {'🌶️'.repeat(item.spicyLevel)}
              <span className="ml-1">{spicyLabels[item.spicyLevel]}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          size="sm" 
          onClick={() => onAddToOrder(item)} 
          disabled={!item.available}
          className="flex-1 gap-2"
        >
          <Plus className="h-4 w-4" />
          Add to Cart
        </Button>
        <Button size="sm" variant="outline" onClick={() => onEdit(item)} className="px-3">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button size="sm" variant="outline" onClick={() => onDelete(item.id)} className="px-3 hover:bg-destructive hover:text-destructive-foreground">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
