import { NextRequest, NextResponse } from 'next/server'
import { HealthMonitoringService } from '@/lib/services/health-monitoring'
import { createAdminClient } from '@/lib/supabase/admin'

const healthMonitor = new HealthMonitoringService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const check = searchParams.get('check') || 'basic'
    const format = searchParams.get('format') || 'json'

    let healthData

    switch (check) {
      case 'basic':
        healthData = await healthMonitor.getBasicHealth()
        break
      
      case 'detailed':
        healthData = await healthMonitor.getDetailedHealth()
        break
      
      case 'database':
        healthData = await healthMonitor.getDatabaseHealth()
        break
      
      case 'external':
        healthData = await healthMonitor.getExternalServicesHealth()
        break
      
      case 'performance':
        healthData = await healthMonitor.getPerformanceMetrics()
        break
      
      case 'full':
        healthData = await healthMonitor.getFullHealthCheck()
        break
      
      default:
        return NextResponse.json({
          error: 'Invalid check type',
          availableChecks: ['basic', 'detailed', 'database', 'external', 'performance', 'full']
        }, { status: 400 })
    }

    // Format response
    if (format === 'prometheus') {
      const prometheusMetrics = healthMonitor.formatPrometheusMetrics(healthData)
      return new NextResponse(prometheusMetrics, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      })
    }

    // Set appropriate HTTP status based on overall health
    const status = healthData.status === 'healthy' ? 200 : 
                  healthData.status === 'degraded' ? 206 : 503

    return NextResponse.json(healthData, { status })

  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Admin authentication required for health actions
    const apiKey = request.headers.get('x-api-key')
    if (!apiKey || apiKey !== process.env.HEALTH_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, params } = body

    let result

    switch (action) {
      case 'run_diagnostics':
        result = await healthMonitor.runDiagnostics()
        break
      
      case 'reset_metrics':
        result = await healthMonitor.resetMetrics()
        break
      
      case 'set_alert_threshold':
        result = await healthMonitor.setAlertThreshold(params.metric, params.threshold)
        break
      
      case 'trigger_alert':
        result = await healthMonitor.triggerAlert(params.level, params.message, params.details)
        break
      
      case 'maintenance_mode':
        result = await healthMonitor.setMaintenanceMode(params.enabled, params.message)
        break
      
      default:
        return NextResponse.json({
          error: 'Invalid action',
          availableActions: ['run_diagnostics', 'reset_metrics', 'set_alert_threshold', 'trigger_alert', 'maintenance_mode']
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Health action error:', error)
    return NextResponse.json({
      error: 'Health action failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    if (!apiKey || apiKey !== process.env.HEALTH_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { config } = body

    const result = await healthMonitor.updateConfig(config)

    return NextResponse.json({
      success: true,
      message: 'Health monitoring configuration updated',
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Health config update error:', error)
    return NextResponse.json({
      error: 'Failed to update health configuration',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}