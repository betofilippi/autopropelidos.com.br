// Simple test script to verify Supabase integration
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testIntegration() {
  console.log('Testing Supabase integration...')
  
  try {
    // Test news query
    console.log('\n1. Testing news query...')
    const { data: newsData, error: newsError } = await supabase
      .from('"autopropelidos.com.br"."news"')
      .select('id, title, category')
      .limit(3)
    
    if (newsError) {
      console.error('News query error:', newsError)
    } else {
      console.log('✅ News data retrieved:', newsData?.length, 'records')
      newsData?.forEach(item => {
        console.log(`   - ${item.title} (${item.category})`)
      })
    }
    
    // Test videos query
    console.log('\n2. Testing videos query...')
    const { data: videosData, error: videosError } = await supabase
      .from('"autopropelidos.com.br"."videos"')
      .select('id, title, category')
      .limit(3)
    
    if (videosError) {
      console.error('Videos query error:', videosError)
    } else {
      console.log('✅ Videos data retrieved:', videosData?.length, 'records')
      videosData?.forEach(item => {
        console.log(`   - ${item.title} (${item.category})`)
      })
    }
    
    console.log('\n✅ Integration test completed successfully!')
    
  } catch (error) {
    console.error('❌ Integration test failed:', error)
  }
}

testIntegration()