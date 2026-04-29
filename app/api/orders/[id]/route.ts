import { NextResponse } from 'next/server'
import { store } from '@/lib/store'

// GET /api/orders/[id] - Get a specific order
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const order = store.getOrder(id)
  
  if (!order) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(order)
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    const updated = store.updateOrderStatus(id, status)
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const deleted = store.deleteOrder(id)
  
  if (!deleted) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json({ message: 'Order deleted successfully' })
}
