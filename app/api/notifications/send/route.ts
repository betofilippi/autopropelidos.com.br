import { NextRequest, NextResponse } from 'next/server'
// import webpush from 'web-push' // Temporariamente comentado

// Configure web-push with VAPID keys
// In production, store these securely in environment variables
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || 'demo-public-key',
  privateKey: process.env.VAPID_PRIVATE_KEY || 'demo-private-key',
  subject: process.env.VAPID_SUBJECT || 'mailto:admin@autopropelidos.com.br'
}

// webpush.setVapidDetails(
//   vapidKeys.subject,
//   vapidKeys.publicKey,
//   vapidKeys.privateKey
// )

export async function POST(request: NextRequest) {
  try {
    const { title, message, image, url, urgent = false, tag } = await request.json()
    
    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      )
    }
    
    // Temporariamente retornando sucesso sem enviar notificações
    return NextResponse.json({
      success: true,
      message: 'Notification service temporarily disabled',
      sent: 0,
      failed: 0
    })
    
  } catch (error) {
    console.error('Error sending notifications:', error)
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Notification API is running',
    endpoints: {
      send: '/api/notifications/send'
    },
    note: 'Currently disabled due to missing dependencies'
  })
}