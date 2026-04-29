import type { FoodItem, Order } from './types'

// In-memory store for demo purposes
// In production, this would be replaced with a database

const foodItems: Map<string, FoodItem> = new Map([
  ['1', {
    id: '1',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheddar, fresh lettuce, tomato, pickles, and our signature sauce on a toasted brioche bun',
    price: 299,
    category: 'main',
    available: true,
    image: '/images/burger.jpg',
    rating: 4.8,
    prepTime: 15,
    calories: 650,
    spicyLevel: 0,
    isVegetarian: false,
    allergens: ['gluten', 'dairy'],
    createdAt: new Date().toISOString()
  }],
  ['2', {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Hand-tossed pizza with San Marzano tomato sauce, fresh mozzarella, basil, and extra virgin olive oil',
    price: 399,
    category: 'main',
    available: true,
    image: '/images/pizza.jpg',
    rating: 4.9,
    prepTime: 20,
    calories: 850,
    spicyLevel: 0,
    isVegetarian: true,
    allergens: ['gluten', 'dairy'],
    createdAt: new Date().toISOString()
  }],
  ['3', {
    id: '3',
    name: 'Fettuccine Alfredo',
    description: 'Creamy parmesan sauce tossed with fresh fettuccine pasta, topped with parsley and black pepper',
    price: 349,
    category: 'main',
    available: true,
    image: '/images/pasta.jpg',
    rating: 4.7,
    prepTime: 18,
    calories: 720,
    spicyLevel: 0,
    isVegetarian: true,
    allergens: ['gluten', 'dairy'],
    createdAt: new Date().toISOString()
  }],
  ['4', {
    id: '4',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with house-made Caesar dressing, parmesan shavings, and garlic croutons',
    price: 249,
    category: 'appetizer',
    available: true,
    image: '/images/salad.jpg',
    rating: 4.5,
    prepTime: 8,
    calories: 320,
    spicyLevel: 0,
    isVegetarian: true,
    allergens: ['gluten', 'dairy', 'eggs'],
    createdAt: new Date().toISOString()
  }],
  ['5', {
    id: '5',
    name: 'Grilled Ribeye Steak',
    description: 'Prime 12oz ribeye cooked to perfection, served with herb butter, roasted asparagus, and garlic mashed potatoes',
    price: 699,
    category: 'main',
    available: true,
    image: '/images/steak.jpg',
    rating: 4.9,
    prepTime: 25,
    calories: 980,
    spicyLevel: 0,
    isVegetarian: false,
    allergens: ['dairy'],
    createdAt: new Date().toISOString()
  }],
  ['6', {
    id: '6',
    name: 'Sushi Platter',
    description: 'Assorted fresh nigiri and maki rolls including salmon, tuna, yellowtail, and California roll with wasabi and ginger',
    price: 599,
    category: 'main',
    available: true,
    image: '/images/sushi.jpg',
    rating: 4.8,
    prepTime: 15,
    calories: 480,
    spicyLevel: 1,
    isVegetarian: false,
    allergens: ['fish', 'soy', 'gluten'],
    createdAt: new Date().toISOString()
  }],
  ['7', {
    id: '7',
    name: 'Street Tacos',
    description: 'Three authentic corn tortillas with your choice of carne asada, al pastor, or carnitas, topped with fresh cilantro and onions',
    price: 279,
    category: 'main',
    available: true,
    image: '/images/tacos.jpg',
    rating: 4.6,
    prepTime: 12,
    calories: 520,
    spicyLevel: 2,
    isVegetarian: false,
    allergens: [],
    createdAt: new Date().toISOString()
  }],
  ['8', {
    id: '8',
    name: 'Chocolate Lava Cake',
    description: 'Warm molten chocolate cake with a gooey center, served with vanilla bean ice cream and fresh raspberries',
    price: 199,
    category: 'dessert',
    available: true,
    image: '/images/dessert.jpg',
    rating: 4.9,
    prepTime: 12,
    calories: 580,
    spicyLevel: 0,
    isVegetarian: true,
    allergens: ['gluten', 'dairy', 'eggs'],
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
