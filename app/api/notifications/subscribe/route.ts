import { NextRequest, NextResponse } from 'next/server'

// In a real app, you'd store these in a database
const subscriptions = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json()
    
    // Validate subscription object
    if (!subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { error: 'Invalid subscription object' },
        { status: 400 }
      )
    }
    
    // Store subscription (in production, save to database)
    const subscriptionKey = subscription.endpoint
    subscriptions.add(subscriptionKey)
    
    console.log('New push subscription:', subscription)
    
    // In production, you might want to:
    // 1. Save to database with user ID
    // 2. Send welcome notification
    // 3. Set up user preferences
    
    return NextResponse.json({ 
      success: true,
      message: 'Subscription saved successfully' 
    })
    
  } catch (error) {
    console.error('Error saving subscription:', error)
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Push notification subscription endpoint',
    subscriptions: subscriptions.size
  })
}