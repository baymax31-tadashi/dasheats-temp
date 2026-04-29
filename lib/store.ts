import type { FoodItem, Order } from './types'

// In-memory store for demo purposes
// In production, this would be replaced with a database

const foodItems: Map<string, FoodItem> = new Map([
  ['1', {
    id: '1',
    name: 'Butter Chicken',
    description: 'Tender chicken cooked in a creamy tomato-based sauce with butter, cream, and aromatic spices. Served with naan or basmati rice',
    price: 329,
    category: 'main',
    available: true,
    image: '/images/butter-chicken.jpg',
    rating: 4.8,
    prepTime: 20,
    calories: 420,
    spicyLevel: 2,
    isVegetarian: false,
    allergens: ['dairy'],
    createdAt: new Date().toISOString()
  }],
  ['2', {
    id: '2',
    name: 'Paneer Tikka Masala',
    description: 'Succulent cottage cheese cubes in a rich, creamy tomato sauce with bell peppers, onions, and traditional Indian spices',
    price: 299,
    category: 'main',
    available: true,
    image: '/images/paneer-tikka.jpg',
    rating: 4.9,
    prepTime: 18,
    calories: 380,
    spicyLevel: 2,
    isVegetarian: true,
    allergens: ['dairy'],
    createdAt: new Date().toISOString()
  }],
  ['3', {
    id: '3',
    name: 'Biryani - Hyderabadi',
    description: 'Fragrant basmati rice cooked with tender meat or vegetables, aromatic spices, and herbs in the traditional Hyderabadi style',
    price: 349,
    category: 'main',
    available: true,
    image: '/images/biryani.jpg',
    rating: 4.7,
    prepTime: 25,
    calories: 520,
    spicyLevel: 2,
    isVegetarian: false,
    allergens: [],
    createdAt: new Date().toISOString()
  }],
  ['4', {
    id: '4',
    name: 'Samosa - Potato & Peas',
    description: 'Crispy triangular pastry filled with spiced potatoes, green peas, and traditional Indian seasoning. Served with mint chutney',
    price: 79,
    category: 'appetizer',
    available: true,
    image: '/images/samosa.jpg',
    rating: 4.5,
    prepTime: 8,
    calories: 180,
    spicyLevel: 1,
    isVegetarian: true,
    allergens: ['gluten'],
    createdAt: new Date().toISOString()
  }],
  ['5', {
    id: '5',
    name: 'Tandoori Chicken',
    description: 'Succulent chicken marinated in yogurt and tandoori spices, charred in the traditional tandoor oven. Served with lemon and onions',
    price: 399,
    category: 'main',
    available: true,
    image: '/images/tandoori.jpg',
    rating: 4.9,
    prepTime: 22,
    calories: 380,
    spicyLevel: 2,
    isVegetarian: false,
    allergens: ['dairy'],
    createdAt: new Date().toISOString()
  }],
  ['6', {
    id: '6',
    name: 'Dosa - Crispy Rice & Lentil',
    description: 'Thin, crispy pancake made from fermented rice and lentil batter, filled with spiced potatoes and served with sambar and coconut chutney',
    price: 149,
    category: 'main',
    available: true,
    image: '/images/dosa.jpg',
    rating: 4.8,
    prepTime: 12,
    calories: 280,
    spicyLevel: 1,
    isVegetarian: true,
    allergens: ['gluten'],
    createdAt: new Date().toISOString()
  }],
  ['7', {
    id: '7',
    name: 'Chole Bhature',
    description: 'Spiced chickpeas curry paired with deep-fried fluffy wheat bread, topped with mint and served with pickled onions and chutney',
    price: 189,
    category: 'main',
    available: true,
    image: '/images/chole-bhature.jpg',
    rating: 4.6,
    prepTime: 15,
    calories: 450,
    spicyLevel: 3,
    isVegetarian: true,
    allergens: ['gluten'],
    createdAt: new Date().toISOString()
  }],
  ['8', {
    id: '8',
    name: 'Gulab Jamun',
    description: 'Soft, spongy milk solids dumplings soaked in sweet cardamom-infused sugar syrup. A classic Indian dessert served warm',
    price: 129,
    category: 'dessert',
    available: true,
    image: '/images/gulab-jamun.jpg',
    rating: 4.9,
    prepTime: 10,
    calories: 220,
    spicyLevel: 0,
    isVegetarian: true,
    allergens: ['dairy'],
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
  getAllOrders: (): Order[] => Array.from(orders.values()).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ),
  
  getOrder: (id: string): Order | undefined => orders.get(id),
  
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'estimatedDelivery'>): Order => {
    const id = Date.now().toString()
    const estimatedMinutes = 30 + Math.floor(Math.random() * 15)
    const estimatedDelivery = new Date(Date.now() + estimatedMinutes * 60000).toISOString()
    const newOrder: Order = {
      ...order,
      id,
      status: 'pending',
      estimatedDelivery,
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
  },

  // Stats
  getStats: () => {
    const allOrders = Array.from(orders.values())
    const totalRevenue = allOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0)
    const pendingOrders = allOrders.filter(o => o.status === 'pending').length
    const completedOrders = allOrders.filter(o => o.status === 'delivered').length
    
    return {
      totalItems: foodItems.size,
      totalOrders: allOrders.length,
      totalRevenue,
      pendingOrders,
      completedOrders
    }
  }
}
