export interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
  createdAt: string
}

export interface Order {
  id: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  customerName: string
  createdAt: string
}

export interface OrderItem {
  foodItemId: string
  foodItemName: string
  quantity: number
  price: number
}

export type FoodCategory = 'appetizer' | 'main' | 'dessert' | 'beverage'
