import { NextResponse } from 'next/server'

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // In production, delete from database
    return NextResponse.json({ success: true, id: params.id })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
