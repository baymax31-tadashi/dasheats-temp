import { NextResponse } from 'next/server'

// GET /api/health - Health check endpoint for Kubernetes probes
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'food-order-api',
    version: '1.0.0'
  })
}
