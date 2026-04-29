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
  }],
  ['9', {
    id: '9',
    name: 'Palak Paneer',
    description: 'Cottage cheese cubes cooked in a smooth spinach curry with cream and spices. A nutritious and delicious vegetarian dish',
    price: 279,
    category: 'main',
    available: true,
    image: '/images/palak-paneer.jpg',
    rating: 4.7,
    prepTime: 18,
    calories: 350,
    spicyLevel: 1,
    isVegetarian: true,
    allergens: ['dairy'],
    createdAt: new Date().toISOString()
  }],
  ['10', {
    id: '10',
    name: 'Chicken Tikka Masala',
    description: 'Tender chunks of chicken marinated in yogurt and spices, cooked in a creamy tomato sauce with bell peppers',
    price: 319,
    category: 'main',
    available: true,
    image: '/images/chicken-tikka-masala.jpg',
    rating: 4.8,
    prepTime: 20,
    calories: 400,
    spicyLevel: 2,
    isVegetarian: false,
    allergens: ['dairy'],
    createdAt: new Date().toISOString()
  }],
  ['11', {
    id: '11',
    name: 'Aloo Gobi',
    description: 'Potatoes and cauliflower florets stir-fried with onions, tomatoes, and traditional Indian spices. A dry vegetable curry',
    price: 149,
    category: 'main',
    available: true,
    image: '/images/aloo-gobi.jpg',
    rating: 4.6,
    prepTime: 15,
    calories: 220,
    spicyLevel: 1,
    isVegetarian: true,
    allergens: [],
    createdAt: new Date().toISOString()
  }],
  ['12', {
    id: '12',
    name: 'Dal Makhani',
    description: 'Black lentils and kidney beans cooked overnight, finished with cream, butter, and aromatic spices. Rich and creamy',
    price: 199,
    category: 'main',
    available: true,
    image: '/images/dal-makhani.jpg',
    rating: 4.8,
    prepTime: 20,
    calories: 320,
    spicyLevel: 1,
    isVegetarian: true,
    allergens: ['dairy'],
    createdAt: new Date().toISOString()
  }],
  ['13', {
    id: '13',
    name: 'Onion Bhaji',
    description: 'Thinly sliced onions mixed with gram flour and spices, deep-fried until golden and crispy. Served with mint chutney',
    price: 99,
    category: 'appetizer',
    available: true,
    image: '/images/onion-bhaji.jpg',
    rating: 4.5,
    prepTime: 10,
    calories: 200,
    spicyLevel: 1,
    isVegetarian: true,
    allergens: ['gluten'],
    createdAt: new Date().toISOString()
  }],
  ['14', {
    id: '14',
    name: 'Spring Rolls - Vegetable',
    description: 'Crispy rolls filled with cabbage, carrots, and other fresh vegetables. Served with sweet and spicy dipping sauce',
    price: 129,
    category: 'appetizer',
    available: true,
    image: '/images/spring-rolls.jpg',
    rating: 4.6,
    prepTime: 10,
    calories: 250,
    spicyLevel: 0,
    isVegetarian: true,
    allergens: ['gluten'],
    createdAt: new Date().toISOString()
  }],
  ['15', {
    id: '15',
    name: 'Mango Lassi',
    description: 'Refreshing yogurt-based drink blended with fresh mango pulp, cardamom, and a touch of sweetness',
    price: 79,
    category: 'beverage',
    available: true,
    image: '/images/mango-lassi.jpg',
    rating: 4.7,
    prepTime: 5,
    calories: 150,
    spicyLevel: 0,
    isVegetarian: true,
    allergens: ['dairy'],
    createdAt: new Date().toISOString()
  }],
  ['16', {
    id: '16',
    name: 'Masala Chai',
    description: 'Traditional Indian spiced tea brewed with cardamom, cloves, cinnamon, and ginger. Served with milk and sugar',
    price: 49,
    category: 'beverage',
    available: true,
    image: '/images/masala-chai.jpg',
    rating: 4.8,
    prepTime: 5,
    calories: 80,
    spicyLevel: 1,
    isVegetarian: true,
    allergens: ['dairy'],
    createdAt: new Date().toISOString()
  }],
  ['17', {
    id: '17',
    name: 'Rogan Josh',
    description: 'Tender lamb pieces cooked in a fragrant tomato-based curry with yogurt, aromatic spices, and slow cooking',
    price: 399,
    category: 'main',
    available: true,
    image: '/images/rogan-josh.jpg',
    rating: 4.8,
    prepTime: 25,
    calories: 420,
    spicyLevel: 2,
    isVegetarian: false,
    allergens: ['dairy'],
    createdAt: new Date().toISOString()
  }],
  ['18', {
    id: '18',
    name: 'Idli - Rice Cake',
    description: 'Soft and fluffy steamed rice cakes made from fermented rice and lentil batter. Served with sambar and chutney',
    price: 99,
    category: 'main',
    available: true,
    image: '/images/idli.jpg',
    rating: 4.7,
    prepTime: 10,
    calories: 150,
    spicyLevel: 0,
    isVegetarian: true,
    allergens: ['gluten'],
    createdAt: new Date().toISOString()
  }],
  ['19', {
    id: '19',
    name: 'Vada - Lentil Fritter',
    description: 'Golden, crispy fried lentil fritters with a fluffy interior. Served with sambar and coconut chutney',
    price: 89,
    category: 'appetizer',
    available: true,
    image: '/images/vada.jpg',
    rating: 4.6,
    prepTime: 10,
    calories: 180,
    spicyLevel: 1,
    isVegetarian: true,
    allergens: ['gluten'],
    createdAt: new Date().toISOString()
  }],
  ['20', {
    id: '20',
    name: 'Fish Curry - Coastal Style',
    description: 'Fresh fish cooked in a coconut-based curry with aromatic spices, curry leaves, and a hint of tamarind',
    price: 349,
    category: 'main',
    available: true,
    image: '/images/fish-curry.jpg',
    rating: 4.7,
    prepTime: 20,
    calories: 320,
    spicyLevel: 2,
    isVegetarian: false,
    allergens: ['fish', 'coconut'],
    createdAt: new Date().toISOString()
  }],
  ['21', {
    id: '21',
    name: 'Kheer - Rice Pudding',
    description: 'Creamy rice pudding made with basmati rice, condensed milk, and aromatic spices. Topped with dried fruits and nuts',
    price: 109,
    category: 'dessert',
    available: true,
    image: '/images/kheer.jpg',
    rating: 4.8,
    prepTime: 15,
    calories: 280,
    spicyLevel: 0,
    isVegetarian: true,
    allergens: ['dairy', 'nuts'],
    createdAt: new Date().toISOString()
  }],
  ['22', {
    id: '22',
    name: 'Rasgulla - Cheese Balls',
    description: 'Spongy cottage cheese balls dipped in light sugar syrup. A classic Bengali sweet dessert served chilled',
    price: 119,
    category: 'dessert',
    available: true,
    image: '/images/rasgulla.jpg',
    rating: 4.8,
    prepTime: 10,
    calories: 200,
    spicyLevel: 0,
    isVegetarian: true,
    allergens: ['dairy'],
    createdAt: new Date().toISOString()
  }],
  ['23', {
    id: '23',
    name: 'Naan - Garlic & Butter',
    description: 'Soft, fluffy Indian bread baked in a traditional tandoor oven, topped with garlic, butter, and herbs',
    price: 59,
    category: 'bread',
    available: true,
    image: '/images/garlic-naan.jpg',
    rating: 4.9,
    prepTime: 8,
    calories: 220,
    spicyLevel: 0,
    isVegetarian: true,
    allergens: ['dairy', 'gluten'],
    createdAt: new Date().toISOString()
  }],
  ['24', {
    id: '24',
    name: 'Roti - Whole Wheat',
    description: 'Traditional whole wheat flatbread cooked on a griddle with a light touch of ghee. Simple and nutritious',
    price: 29,
    category: 'bread',
    available: true,
    image: '/images/roti.jpg',
    rating: 4.8,
    prepTime: 5,
    calories: 100,
    spicyLevel: 0,
    isVegetarian: true,
    allergens: ['gluten'],
    createdAt: new Date().toISOString()
  }],
  ['25', {
    id: '25',
    name: 'Jalebi - Orange Swirl',
    description: 'Bright orange, sweet crispy spiral pastries made with flour and soaked in sugar syrup. Traditional festive sweet',
    price: 89,
    category: 'dessert',
    available: true,
    image: '/images/jalebi.jpg',
    rating: 4.6,
    prepTime: 12,
    calories: 250,
    spicyLevel: 0,
    isVegetarian: true,
    allergens: ['gluten'],
    createdAt: new Date().toISOString()
  }],
  ['26', {
    id: '26',
    name: 'Vegetable Biryani',
    description: 'Aromatic basmati rice layered with mixed vegetables, herbs, and spices. A fragrant vegetarian rice dish',
    price: 229,
    category: 'main',
    available: true,
    image: '/images/veg-biryani.jpg',
    rating: 4.7,
    prepTime: 22,
    calories: 450,
    spicyLevel: 1,
    isVegetarian: true,
    allergens: [],
    createdAt: new Date().toISOString()
  }],
  ['27', {
    id: '27',
    name: 'Shrimp Biryani',
    description: 'Fragrant basmati rice cooked with succulent shrimp, herbs, and aromatic spices in the traditional style',
    price: 379,
    category: 'main',
    available: true,
    image: '/images/shrimp-biryani.jpg',
    rating: 4.8,
    prepTime: 24,
    calories: 480,
    spicyLevel: 2,
    isVegetarian: false,
    allergens: ['shellfish'],
    createdAt: new Date().toISOString()
  }],
  ['28', {
    id: '28',
    name: 'Paneer Naan',
    description: 'Soft naan bread stuffed with spiced cottage cheese and herbs, baked in a tandoor oven',
    price: 119,
    category: 'bread',
    available: true,
    image: '/images/paneer-naan.jpg',
    rating: 4.8,
    prepTime: 10,
    calories: 280,
    spicyLevel: 1,
    isVegetarian: true,
    allergens: ['dairy', 'gluten'],
    createdAt: new Date().toISOString()
  }],
  ['29', {
    id: '29',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice layered with tender chicken pieces, herbs, and traditional biryani spices. Slow-cooked to perfection',
    price: 349,
    category: 'main',
    available: true,
    image: '/images/chicken-biryani.jpg',
    rating: 4.9,
    prepTime: 24,
    calories: 500,
    spicyLevel: 2,
    isVegetarian: false,
    allergens: [],
    createdAt: new Date().toISOString()
  }],
  ['30', {
    id: '30',
    name: 'Shahi Tukda - Royal Dessert',
    description: 'Layers of crispy bread, dry fruits, and cream soaked in cardamom-infused milk. A royal Mughlai dessert',
    price: 159,
    category: 'dessert',
    available: true,
    image: '/images/shahi-tukda.jpg',
    rating: 4.9,
    prepTime: 12,
    calories: 420,
    spicyLevel: 0,
    isVegetarian: true,
    allergens: ['dairy', 'gluten', 'nuts'],
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
