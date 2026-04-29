import { NextResponse } from 'next/server'
import { store } from '@/lib/store'

// GET /api/menu/[id] - Get a specific food item
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const item = store.getFoodItem(id)
  
  if (!item) {
    return NextResponse.json(
      { error: 'Food item not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(item)
}

// PUT /api/menu/[id] - Update a food item
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updated = store.updateFoodItem(id, body)
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Food item not found' },
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

// DELETE /api/menu/[id] - Delete a food item
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const deleted = store.deleteFoodItem(id)
  
  if (!deleted) {
    return NextResponse.json(
      { error: 'Food item not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json({ message: 'Food item deleted successfully' })
}
