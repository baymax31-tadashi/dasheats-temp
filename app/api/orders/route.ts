import { NextResponse } from 'next/server'
import { store } from '@/lib/store'

// GET /api/orders - Get all orders
export async function GET() {
  const orders = store.getAllOrders()
  return NextResponse.json(orders)
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, customerName } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    if (!customerName) {
      return NextResponse.json(
        { error: 'Customer name is required' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: { price: number; quantity: number }) => {
      return sum + (item.price * item.quantity)
    }, 0)

    const newOrder = store.createOrder({
      items,
      customerName,
      totalAmount
    })

    return NextResponse.json(newOrder, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
