import { NextResponse } from 'next/server'

// Mock data - in production this would come from your database
const mockRevenueData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  revenue: Math.floor(Math.random() * 1000) + 500
}))

export async function GET() {
  try {
    return NextResponse.json({
      totalRevenue: 15234.50,
      totalOrders: 487,
      completedOrders: 421,
      activeUsers: 1243,
      avgOrderValue: 31.28,
      deliveryTime: 38,
      avgRating: 4.6,
      revenueData: mockRevenueData
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
