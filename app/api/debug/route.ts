import { NextResponse } from 'next/server'
import { createBrowserClient } from '@supabase/ssr'

export async function GET() {
  try {
    // Create client with explicit configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    // Test 1: Client with custom schema in config
    const supabase1 = createBrowserClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        db: {
          schema: 'autopropelidos.com.br'
        }
      }
    )
    
    const { data: news1, error: error1 } = await supabase1
      .from('news')
      .select('*')
      .limit(1)
    
    // Test 2: Client without schema config, explicit in query
    const supabase2 = createBrowserClient(
      supabaseUrl,
      supabaseAnonKey
    )
    
    const { data: news2, error: error2 } = await supabase2
      .schema('autopropelidos.com.br')
      .from('news')
      .select('*')
      .limit(1)
    
    // Test 3: Try RPC call
    const { data: rpcData, error: rpcError } = await supabase1
      .rpc('get_news_count', {})
      .single()
    
    // Test 4: Direct REST API call
    const headers = {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
    
    const restResponse = await fetch(
      `${supabaseUrl}/rest/v1/news?select=*&limit=1`,
      { headers }
    )
    const restData = await restResponse.json()
    
    // Test 5: Check env vars
    const envCheck = {
      hasUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseAnonKey,
      urlStart: supabaseUrl.substring(0, 30),
      keyStart: supabaseAnonKey.substring(0, 50)
    }
    
    return NextResponse.json({
      test1_with_schema_config: {
        success: !error1,
        data: news1,
        error: error1?.message,
        details: error1
      },
      test2_explicit_schema: {
        success: !error2,
        data: news2,
        error: error2?.message,
        details: error2
      },
      test3_rpc: {
        success: !rpcError,
        data: rpcData,
        error: rpcError?.message
      },
      test4_rest_api: {
        status: restResponse.status,
        data: restData,
        ok: restResponse.ok
      },
      env: envCheck,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}