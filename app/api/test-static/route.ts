import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    // Test accessing the placeholder.svg file directly
    const publicPath = join(process.cwd(), 'public', 'placeholder.svg')
    const fileContent = await readFile(publicPath, 'utf-8')
    
    return NextResponse.json({
      success: true,
      message: 'Static file access test',
      data: {
        file_exists: true,
        file_size: fileContent.length,
        file_preview: fileContent.substring(0, 200) + '...',
        public_path: publicPath,
        static_urls_to_test: [
          '/placeholder.svg',
          '/placeholder.jpg',
          '/images/news-placeholder.jpg',
          '/images/video-placeholder.jpg'
        ]
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to access static files'
    }, { status: 500 })
  }
}