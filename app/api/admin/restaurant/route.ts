import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    // In production, save to database
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update restaurant info' }, { status: 500 })
  }
}
