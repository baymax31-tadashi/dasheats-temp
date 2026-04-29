import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      topItems: [
        { name: 'Margherita Pizza', orders: 324, revenue: 2592 },
        { name: 'Chicken Biryani', orders: 287, revenue: 2303 },
        { name: 'Caesar Salad', orders: 213, revenue: 1703 },
        { name: 'Burger Combo', orders: 198, revenue: 1782 },
        { name: 'Pasta Carbonara', orders: 176, revenue: 1760 }
      ],
      ordersByHour: [
        { hour: '10 AM', orders: 12 },
        { hour: '11 AM', orders: 34 },
        { hour: '12 PM', orders: 78 },
        { hour: '1 PM', orders: 95 },
        { hour: '2 PM', orders: 67 },
        { hour: '3 PM', orders: 45 },
        { hour: '4 PM', orders: 32 },
        { hour: '5 PM', orders: 28 },
        { hour: '6 PM', orders: 89 },
        { hour: '7 PM', orders: 112 },
        { hour: '8 PM', orders: 98 },
        { hour: '9 PM', orders: 76 }
      ],
      ordersByDay: [
        { day: 'Mon', orders: 487, revenue: 3892 },
        { day: 'Tue', orders: 523, revenue: 4184 },
        { day: 'Wed', orders: 512, revenue: 4096 },
        { day: 'Thu', orders: 598, revenue: 4784 },
        { day: 'Fri', orders: 687, revenue: 5496 },
        { day: 'Sat', orders: 752, revenue: 6016 },
        { day: 'Sun', orders: 643, revenue: 5144 }
      ],
      categoryDistribution: [
        { category: 'Pizza', value: 28 },
        { category: 'Indian', value: 22 },
        { category: 'Salads', value: 15 },
        { category: 'Burgers', value: 18 },
        { category: 'Pasta', value: 17 }
      ]
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
