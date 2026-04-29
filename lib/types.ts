export interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
  image?: string
  rating?: number
  prepTime?: number // in minutes
  calories?: number
  spicyLevel?: 0 | 1 | 2 | 3
  isVegetarian?: boolean
  isVegan?: boolean
  allergens?: string[]
  createdAt: string
}

export interface Order {
  id: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  customerName: string
  customerPhone?: string
  customerAddress?: string
  notes?: string
  estimatedDelivery?: string
  createdAt: string
}

export interface OrderItem {
  foodItemId: string
  foodItemName: string
  quantity: number
  price: number
}

export type FoodCategory = 'appetizer' | 'main' | 'dessert' | 'beverage'
