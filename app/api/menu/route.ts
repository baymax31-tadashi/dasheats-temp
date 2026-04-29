import { NextResponse } from 'next/server'
import { store } from '@/lib/store'

// GET /api/menu - Get all food items
export async function GET() {
  const items = store.getAllFoodItems()
  return NextResponse.json(items)
}

// POST /api/menu - Add a new food item
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, price, category, available = true } = body

    if (!name || !description || price === undefined || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, category' },
        { status: 400 }
      )
    }

    const newItem = store.addFoodItem({
      name,
      description,
      price: Number(price),
      category,
      available
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
