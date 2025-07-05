'use client'

import { useState } from 'react'
import Image from 'next/image'
import { OptimizedImage } from '@/components/ui/optimized-image'

export default function DebugImagesPage() {
  const [logs, setLogs] = useState<string[]>([])
  
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(`[${timestamp}] ${message}`)
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Image Loading Debug Page</h1>
      
      {/* Debug Console */}
      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Debug Console</h2>
        <div className="h-40 overflow-y-auto bg-black text-green-400 p-2 font-mono text-sm">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
        <button 
          onClick={() => setLogs([])}
          className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Clear Console
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Test 1: Regular HTML img tag */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">1. Regular HTML img tag</h3>
          <img
            src="/placeholder.svg"
            alt="Test image with regular img tag"
            className="w-full h-32 border-2 border-blue-500"
            onLoad={() => addLog('Regular img: onLoad triggered')}
            onError={(e) => addLog(`Regular img: onError - ${e.currentTarget.src}`)}
          />
          <p className="text-sm mt-2">Direct img tag with placeholder.svg</p>
        </div>

        {/* Test 2: Next.js Image component */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">2. Next.js Image component</h3>
          <div className="relative w-full h-32 border-2 border-green-500">
            <Image
              src="/placeholder.svg"
              alt="Test image with Next.js Image"
              fill
              className="object-cover"
              onLoad={() => addLog('Next.js Image: onLoad triggered')}
              onError={() => addLog('Next.js Image: onError triggered')}
            />
          </div>
          <p className="text-sm mt-2">Next.js Image with fill prop</p>
        </div>

        {/* Test 3: OptimizedImage component */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">3. OptimizedImage component</h3>
          <div className="w-full h-32 border-2 border-purple-500">
            <OptimizedImage
              src="/placeholder.svg"
              alt="Test image with OptimizedImage"
              fill
              onLoad={() => addLog('OptimizedImage: onLoad triggered')}
              onError={() => addLog('OptimizedImage: onError triggered')}
            />
          </div>
          <p className="text-sm mt-2">Custom OptimizedImage component</p>
        </div>

        {/* Test 4: External image */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">4. External image URL</h3>
          <img
            src="https://via.placeholder.com/300x200/4f46e5/ffffff?text=External+Image"
            alt="External test image"
            className="w-full h-32 border-2 border-red-500"
            onLoad={() => addLog('External img: onLoad triggered')}
            onError={(e) => addLog(`External img: onError - ${e.currentTarget.src}`)}
          />
          <p className="text-sm mt-2">External placeholder service</p>
        </div>

        {/* Test 5: Local image with full path */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">5. Full path local image</h3>
          <img
            src="/images/news-placeholder.jpg"
            alt="Local image with full path"
            className="w-full h-32 border-2 border-yellow-500"
            onLoad={() => addLog('Local full path: onLoad triggered')}
            onError={(e) => addLog(`Local full path: onError - ${e.currentTarget.src}`)}
          />
          <p className="text-sm mt-2">Local image from /public/images/</p>
        </div>

        {/* Test 6: Broken image URL */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">6. Broken image (should fallback)</h3>
          <img
            src="/nonexistent-image.jpg"
            alt="Broken image test"
            className="w-full h-32 border-2 border-gray-500"
            onLoad={() => addLog('Broken img: onLoad triggered (unexpected!)')}
            onError={(e) => {
              addLog(`Broken img: onError triggered, falling back to placeholder`)
              e.currentTarget.src = '/placeholder.svg'
            }}
          />
          <p className="text-sm mt-2">Broken URL with fallback to placeholder</p>
        </div>

        {/* Test 7: Image with opacity states */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">7. Opacity-based loading</h3>
          <div className="relative">
            <img
              src="/placeholder.svg"
              alt="Image with opacity loading"
              className="w-full h-32 border-2 border-indigo-500 opacity-0 transition-opacity duration-300"
              onLoad={(e) => {
                addLog('Opacity img: onLoad triggered, setting opacity-100')
                e.currentTarget.classList.remove('opacity-0')
                e.currentTarget.classList.add('opacity-100')
              }}
              onError={() => addLog('Opacity img: onError triggered')}
            />
            <div className="absolute inset-0 bg-gray-200 animate-pulse" style={{display: 'none'}} />
          </div>
          <p className="text-sm mt-2">Testing opacity-based loading pattern</p>
        </div>

        {/* Test 8: CSS background image */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">8. CSS background image</h3>
          <div 
            className="w-full h-32 border-2 border-pink-500 bg-cover bg-center"
            style={{backgroundImage: 'url(/placeholder.svg)'}}
            onLoad={() => addLog('CSS background: onLoad triggered')}
          />
          <p className="text-sm mt-2">CSS background-image property</p>
        </div>

        {/* Test 9: SVG as inline */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">9. Inline SVG</h3>
          <svg 
            className="w-full h-32 border-2 border-teal-500" 
            viewBox="0 0 400 300" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            onLoad={() => addLog('Inline SVG: onLoad triggered')}
          >
            <rect width="400" height="300" fill="#f3f4f6"/>
            <g opacity="0.5">
              <path d="M200 120L240 160H160L200 120Z" fill="#9ca3af"/>
              <circle cx="170" cy="140" r="8" fill="#9ca3af"/>
              <rect x="160" y="180" width="80" height="4" rx="2" fill="#9ca3af"/>
              <rect x="160" y="190" width="60" height="4" rx="2" fill="#9ca3af"/>
            </g>
          </svg>
          <p className="text-sm mt-2">Inline SVG content</p>
        </div>
      </div>

      {/* Browser and Network Info */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Browser & Network Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>User Agent:</strong>
            <div className="break-all">{navigator.userAgent}</div>
          </div>
          <div>
            <strong>Connection:</strong>
            <div>Online: {navigator.onLine ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      {/* Manual Tests */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Manual Tests</h2>
        <div className="space-y-2">
          <button
            onClick={() => {
              const link = document.createElement('a')
              link.href = '/placeholder.svg'
              link.target = '_blank'
              link.click()
              addLog('Manual: Opened placeholder.svg in new tab')
            }}
            className="block w-full text-left p-2 bg-white dark:bg-gray-800 border rounded hover:bg-gray-50"
          >
            🔗 Test direct access to /placeholder.svg
          </button>
          
          <button
            onClick={() => {
              fetch('/placeholder.svg')
                .then(response => {
                  addLog(`Manual: Fetch /placeholder.svg - Status: ${response.status}, OK: ${response.ok}`)
                  return response.text()
                })
                .then(text => {
                  addLog(`Manual: SVG content length: ${text.length} characters`)
                })
                .catch(error => {
                  addLog(`Manual: Fetch error - ${error.message}`)
                })
            }}
            className="block w-full text-left p-2 bg-white dark:bg-gray-800 border rounded hover:bg-gray-50"
          >
            🌐 Test fetch() request to placeholder.svg
          </button>

          <button
            onClick={() => {
              const img = new Image()
              img.onload = () => addLog(`Manual: Image() constructor - onload: ${img.width}x${img.height}`)
              img.onerror = () => addLog('Manual: Image() constructor - onerror')
              img.src = '/placeholder.svg'
            }}
            className="block w-full text-left p-2 bg-white dark:bg-gray-800 border rounded hover:bg-gray-50"
          >
            🖼️ Test Image() constructor
          </button>
        </div>
      </div>
    </div>
  )
}