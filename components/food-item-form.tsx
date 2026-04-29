'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { FoodItem } from '@/lib/types'
import { ImageIcon, Info, Utensils } from 'lucide-react'

interface FoodItemFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<FoodItem, 'id' | 'createdAt'>) => void
  editItem?: FoodItem | null
}

const defaultImages = [
  { label: 'Burger', value: '/images/burger.jpg' },
  { label: 'Pizza', value: '/images/pizza.jpg' },
  { label: 'Pasta', value: '/images/pasta.jpg' },
  { label: 'Salad', value: '/images/salad.jpg' },
  { label: 'Steak', value: '/images/steak.jpg' },
  { label: 'Sushi', value: '/images/sushi.jpg' },
  { label: 'Tacos', value: '/images/tacos.jpg' },
  { label: 'Dessert', value: '/images/dessert.jpg' },
]

export function FoodItemForm({ open, onClose, onSubmit, editItem }: FoodItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    available: true,
    image: '',
    rating: '',
    prepTime: '',
    calories: '',
    spicyLevel: '0',
    isVegetarian: false,
    isVegan: false,
    allergens: ''
  })

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        description: editItem.description,
        price: editItem.price.toString(),
        category: editItem.category,
        available: editItem.available,
        image: editItem.image || '',
        rating: editItem.rating?.toString() || '',
        prepTime: editItem.prepTime?.toString() || '',
        calories: editItem.calories?.toString() || '',
        spicyLevel: editItem.spicyLevel?.toString() || '0',
        isVegetarian: editItem.isVegetarian || false,
        isVegan: editItem.isVegan || false,
        allergens: editItem.allergens?.join(', ') || ''
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'main',
        available: true,
        image: '',
        rating: '',
        prepTime: '',
        calories: '',
        spicyLevel: '0',
        isVegetarian: false,
        isVegan: false,
        allergens: ''
      })
    }
  }, [editItem, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      available: formData.available,
      image: formData.image || undefined,
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
      prepTime: formData.prepTime ? parseInt(formData.prepTime) : undefined,
      calories: formData.calories ? parseInt(formData.calories) : undefined,
      spicyLevel: parseInt(formData.spicyLevel) as 0 | 1 | 2 | 3,
      isVegetarian: formData.isVegetarian,
      isVegan: formData.isVegan,
      allergens: formData.allergens ? formData.allergens.split(',').map(a => a.trim()).filter(Boolean) : undefined
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            {editItem ? 'Edit Food Item' : 'Add New Food Item'}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to {editItem ? 'update' : 'add'} a menu item.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="gap-2">
                <Utensils className="h-4 w-4" />
                Basic
              </TabsTrigger>
              <TabsTrigger value="image" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Image
              </TabsTrigger>
              <TabsTrigger value="details" className="gap-2">
                <Info className="h-4 w-4" />
                Details
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter food item name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the dish, ingredients, and flavors"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appetizer">Appetizer</SelectItem>
                      <SelectItem value="main">Main Course</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                      <SelectItem value="beverage">Beverage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                />
                <Label htmlFor="available">Available for ordering</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="image" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg or /images/food.jpg"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Or select a default image:</Label>
                <div className="grid grid-cols-4 gap-2">
                  {defaultImages.map((img) => (
                    <button
                      key={img.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: img.value })}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        formData.image === img.value ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.value} alt={img.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 text-center">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {formData.image && (
                <div className="space-y-2">
                  <Label>Preview:</Label>
                  <div className="relative h-48 rounded-lg overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prepTime">Prep Time (minutes)</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    min="0"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                    placeholder="15"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    min="0"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    placeholder="500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    placeholder="4.5"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="spicyLevel">Spicy Level</Label>
                  <Select
                    value={formData.spicyLevel}
                    onValueChange={(value) => setFormData({ ...formData, spicyLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Not Spicy</SelectItem>
                      <SelectItem value="1">Mild</SelectItem>
                      <SelectItem value="2">Medium</SelectItem>
                      <SelectItem value="3">Very Spicy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergens">Allergens (comma-separated)</Label>
                <Input
                  id="allergens"
                  value={formData.allergens}
                  onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                  placeholder="gluten, dairy, nuts"
                />
              </div>
              
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isVegetarian"
                    checked={formData.isVegetarian}
                    onCheckedChange={(checked) => setFormData({ ...formData, isVegetarian: checked })}
                  />
                  <Label htmlFor="isVegetarian">Vegetarian</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isVegan"
                    checked={formData.isVegan}
                    onCheckedChange={(checked) => setFormData({ ...formData, isVegan: checked })}
                  />
                  <Label htmlFor="isVegan">Vegan</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editItem ? 'Update Item' : 'Add Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
