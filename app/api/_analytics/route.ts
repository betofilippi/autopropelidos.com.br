import { NextRequest, NextResponse } from 'next/server'

// Mock analytics functions for hybrid mode
const mockAnalytics = {
  dashboard: {
    totalViews: 125430,
    uniqueVisitors: 45230,
    bounceRate: 0.35,
    avgSessionDuration: 185000,
    topPages: [
      { path: '/', views: 25430 },
      { path: '/resolucao-996', views: 18230 },
      { path: '/noticias', views: 12340 }
    ]
  },
  traffic: {
    pageViews: [
      { date: '2024-01-01', views: 1500 },
      { date: '2024-01-02', views: 1800 },
      { date: '2024-01-03', views: 2100 }
    ],
    sources: [
      { source: 'organic', percentage: 65 },
      { source: 'direct', percentage: 25 },
      { source: 'social', percentage: 10 }
    ]
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || 'dashboard'
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    let result
    switch (action) {
      case 'dashboard':
        result = mockAnalytics.dashboard
        break
      case 'traffic':
        result = mockAnalytics.traffic
        break
      default:
        result = mockAnalytics.dashboard
    }
    
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        timestamp: new Date().toISOString(),
        responseTime,
        cached: false,
        action
      }
    })
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics data',
      metadata: {
        timestamp: new Date().toISOString(),
        responseTime
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = body.action
    
    switch (action) {
      case 'track_event':
        return NextResponse.json({
          success: true,
          message: 'Event tracked successfully',
          timestamp: new Date().toISOString()
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          timestamp: new Date().toISOString()
        }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid request body',
      timestamp: new Date().toISOString()
    }, { status: 400 })
  }
}