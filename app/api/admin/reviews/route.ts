import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      averageRating: 4.6,
      totalReviews: 284,
      reviews: [
        {
          id: '1',
          customerName: 'John Doe',
          itemName: 'Margherita Pizza',
          rating: 5,
          comment: 'Absolutely delicious! Fresh ingredients and perfectly cooked.',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          customerName: 'Sarah Smith',
          itemName: 'Chicken Biryani',
          rating: 4,
          comment: 'Great taste, could have been a bit spicier.',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          customerName: 'Mike Johnson',
          itemName: 'Caesar Salad',
          rating: 5,
          comment: 'Fresh and healthy. Delivered on time!',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          customerName: 'Emily Chen',
          itemName: 'Burger Combo',
          rating: 4,
          comment: 'Good quality burger, fries could be crispier.',
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '5',
          customerName: 'Alex Rivera',
          itemName: 'Pasta Carbonara',
          rating: 5,
          comment: 'Authentic Italian taste. Highly recommended!',
          createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
        }
      ]
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
