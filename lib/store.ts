import type { FoodItem, Order } from './types'

// In-memory store for demo purposes
// In production, this would be replaced with a database

const foodItems: Map<string, FoodItem> = new Map([
  ['1', {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with fresh lettuce, tomato, and our special sauce',
    price: 12.99,
    category: 'main',
    available: true,
    createdAt: new Date().toISOString()
  }],
  ['2', {
    id: '2',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with parmesan, croutons, and Caesar dressing',
    price: 9.99,
    category: 'appetizer',
    available: true,
    createdAt: new Date().toISOString()
  }],
  ['3', {
    id: '3',
    name: 'Chocolate Cake',
    description: 'Rich chocolate layer cake with ganache frosting',
    price: 7.99,
    category: 'dessert',
    available: true,
    createdAt: new Date().toISOString()
  }],
  ['4', {
    id: '4',
    name: 'Fresh Lemonade',
    description: 'Freshly squeezed lemonade with mint',
    price: 4.99,
    category: 'beverage',
    available: true,
    createdAt: new Date().toISOString()
  }]
])

const orders: Map<string, Order> = new Map()

export const store = {
  // Food Items
  getAllFoodItems: (): FoodItem[] => Array.from(foodItems.values()),
  
  getFoodItem: (id: string): FoodItem | undefined => foodItems.get(id),
  
  addFoodItem: (item: Omit<FoodItem, 'id' | 'createdAt'>): FoodItem => {
    const id = Date.now().toString()
    const newItem: FoodItem = {
      ...item,
      id,
      createdAt: new Date().toISOString()
    }
    foodItems.set(id, newItem)
    return newItem
  },
  
  updateFoodItem: (id: string, updates: Partial<Omit<FoodItem, 'id' | 'createdAt'>>): FoodItem | null => {
    const existing = foodItems.get(id)
    if (!existing) return null
    const updated = { ...existing, ...updates }
    foodItems.set(id, updated)
    return updated
  },
  
  deleteFoodItem: (id: string): boolean => {
    return foodItems.delete(id)
  },

  // Orders
  getAllOrders: (): Order[] => Array.from(orders.values()),
  
  getOrder: (id: string): Order | undefined => orders.get(id),
  
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const id = Date.now().toString()
    const newOrder: Order = {
      ...order,
      id,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    orders.set(id, newOrder)
    return newOrder
  },
  
  updateOrderStatus: (id: string, status: Order['status']): Order | null => {
    const existing = orders.get(id)
    if (!existing) return null
    const updated = { ...existing, status }
    orders.set(id, updated)
    return updated
  },
  
  deleteOrder: (id: string): boolean => {
    return orders.delete(id)
  }
}
