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
    const { items, customerName, customerPhone, customerAddress, notes } = body

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

    // Calculate total amount with tax and delivery
    const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => {
      return sum + (item.price * item.quantity)
    }, 0)
    const tax = subtotal * 0.08
    const deliveryFee = subtotal > 50 ? 0 : 4.99
    const totalAmount = subtotal + tax + deliveryFee

    const newOrder = store.createOrder({
      items,
      customerName,
      customerPhone,
      customerAddress,
      notes,
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
