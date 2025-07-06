import { NextRequest, NextResponse } from 'next/server'

// In a real app, you'd store these in a database
const subscriptions = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json()
    
    // Validate subscription object
    if (!subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription object' },
        { status: 400 }
      )
    }
    
    // Remove subscription (in production, remove from database)
    const subscriptionKey = subscription.endpoint
    subscriptions.delete(subscriptionKey)
    
    console.log('Removed push subscription:', subscription.endpoint)
    
    return NextResponse.json({ 
      success: true,
      message: 'Subscription removed successfully' 
    })
    
  } catch (error) {
    console.error('Error removing subscription:', error)
    return NextResponse.json(
      { error: 'Failed to remove subscription' },
      { status: 500 }
    )
  }
}