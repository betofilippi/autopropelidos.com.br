import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'

// Configure web-push with VAPID keys
// In production, store these securely in environment variables
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || 'demo-public-key',
  privateKey: process.env.VAPID_PRIVATE_KEY || 'demo-private-key',
  subject: process.env.VAPID_SUBJECT || 'mailto:admin@autopropelidos.com.br'
}

webpush.setVapidDetails(
  vapidKeys.subject,
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

// In a real app, you'd get these from a database
const mockSubscriptions = [
  // Example subscription format - in production, get from database
  /*
  {
    endpoint: 'https://fcm.googleapis.com/fcm/send/...',
    keys: {
      p256dh: 'key...',
      auth: 'auth...'
    }
  }
  */
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, url, image, tag, urgent = false } = body
    
    // Validate required fields
    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      )
    }
    
    // Create notification payload
    const payload = JSON.stringify({
      title,
      body: message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      image: image || '/images/placeholder-news.jpg',
      url: url || '/',
      tag: tag || 'autopropelidos-news',
      timestamp: Date.now(),
      requireInteraction: urgent,
      actions: [
        {
          action: 'open',
          title: 'Abrir',
          icon: '/icons/icon-96x96.png'
        },
        {
          action: 'dismiss',
          title: 'Dispensar'
        }
      ]
    })
    
    // Send notifications to all subscriptions
    const sendPromises = mockSubscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription, payload, {
          urgency: urgent ? 'high' : 'normal',
          TTL: 24 * 60 * 60 // 24 hours
        })
        return { success: true, endpoint: subscription.endpoint }
      } catch (error) {
        console.error('Failed to send notification to:', subscription.endpoint, error)
        return { success: false, endpoint: subscription.endpoint, error: error.message }
      }
    })
    
    const results = await Promise.allSettled(sendPromises)
    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length
    
    console.log(`Sent ${successful}/${mockSubscriptions.length} notifications`)
    
    return NextResponse.json({
      success: true,
      message: `Notification sent to ${successful} subscribers`,
      details: {
        total: mockSubscriptions.length,
        successful,
        failed: mockSubscriptions.length - successful
      }
    })
    
  } catch (error) {
    console.error('Error sending notifications:', error)
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    )
  }
}

// Test notification endpoint
export async function GET() {
  try {
    // Send a test notification
    const testPayload = JSON.stringify({
      title: '🚀 Portal Autopropelidos',
      body: 'Notificação de teste - Sistema funcionando perfeitamente!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      image: '/images/placeholder-news.jpg',
      url: '/',
      tag: 'test-notification',
      timestamp: Date.now(),
      actions: [
        {
          action: 'open',
          title: 'Abrir Portal'
        }
      ]
    })
    
    // In a real app, you'd send to actual subscriptions
    console.log('Test notification payload:', testPayload)
    
    return NextResponse.json({
      success: true,
      message: 'Test notification prepared',
      payload: JSON.parse(testPayload),
      info: 'In production, this would be sent to all subscribers'
    })
    
  } catch (error) {
    console.error('Error preparing test notification:', error)
    return NextResponse.json(
      { error: 'Failed to prepare test notification' },
      { status: 500 }
    )
  }
}

// Helper function to send breaking news notifications
export async function sendBreakingNews(newsItem: {
  title: string
  description: string
  url: string
  image?: string
}) {
  try {
    const payload = JSON.stringify({
      title: `🚨 ${newsItem.title}`,
      body: newsItem.description,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      image: newsItem.image || '/images/placeholder-news.jpg',
      url: newsItem.url,
      tag: 'breaking-news',
      timestamp: Date.now(),
      requireInteraction: true,
      vibrate: [100, 50, 100],
      actions: [
        {
          action: 'open',
          title: 'Ler Notícia',
          icon: '/icons/icon-96x96.png'
        },
        {
          action: 'dismiss',
          title: 'Dispensar'
        }
      ]
    })
    
    // Send to all subscribers
    const sendPromises = mockSubscriptions.map(subscription =>
      webpush.sendNotification(subscription, payload, {
        urgency: 'high',
        TTL: 6 * 60 * 60 // 6 hours for breaking news
      })
    )
    
    await Promise.allSettled(sendPromises)
    console.log('Breaking news notification sent')
    
  } catch (error) {
    console.error('Failed to send breaking news notification:', error)
  }
}