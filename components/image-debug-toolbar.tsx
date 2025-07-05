'use client'

import { useState, useEffect } from 'react'

export function ImageDebugToolbar() {
  const [isVisible, setIsVisible] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [imageCount, setImageCount] = useState(0)
  const [loadedCount, setLoadedCount] = useState(0)
  const [errorCount, setErrorCount] = useState(0)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'production') {
      // Check for ?debug=images in URL
      const urlParams = new URLSearchParams(window.location.search)
      setIsVisible(urlParams.get('debug') === 'images')
    }

    // Override console.log to capture image-related logs
    const originalLog = console.log
    console.log = (...args) => {
      const message = args.join(' ')
      if (message.includes('image') || message.includes('Image') || message.includes('thumbnail')) {
        setLogs(prev => [...prev.slice(-20), `${new Date().toLocaleTimeString()}: ${message}`])
      }
      originalLog(...args)
    }

    // Monitor all images on the page
    const monitorImages = () => {
      const images = document.querySelectorAll('img')
      setImageCount(images.length)
      
      let loaded = 0
      let errors = 0
      
      images.forEach(img => {
        if (img.complete) {
          if (img.naturalWidth > 0) {
            loaded++
          } else {
            errors++
          }
        }
      })
      
      setLoadedCount(loaded)
      setErrorCount(errors)
    }

    // Monitor every second
    const interval = setInterval(monitorImages, 1000)
    monitorImages() // Initial check

    return () => {
      clearInterval(interval)
      console.log = originalLog
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg z-50 max-w-md text-xs font-mono">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">Image Debug</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-red-400 hover:text-red-300"
        >
          ✕
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <div className="text-blue-400">{imageCount}</div>
          <div>Total</div>
        </div>
        <div className="text-center">
          <div className="text-green-400">{loadedCount}</div>
          <div>Loaded</div>
        </div>
        <div className="text-center">
          <div className="text-red-400">{errorCount}</div>
          <div>Errors</div>
        </div>
      </div>

      <div className="space-y-1 mb-3">
        <button
          onClick={() => {
            document.body.classList.toggle('debug-images')
          }}
          className="w-full text-left p-1 bg-gray-800 rounded hover:bg-gray-700"
        >
          🎯 Toggle Image Outlines
        </button>
        
        <button
          onClick={() => {
            const images = document.querySelectorAll('img')
            images.forEach(img => {
              img.style.border = '2px solid lime'
              img.style.backgroundColor = 'rgba(0,255,0,0.2)'
            })
          }}
          className="w-full text-left p-1 bg-gray-800 rounded hover:bg-gray-700"
        >
          🟢 Highlight All Images
        </button>
        
        <button
          onClick={() => {
            const images = document.querySelectorAll('img')
            images.forEach(img => {
              if (!img.complete || img.naturalWidth === 0) {
                img.style.border = '3px solid red'
                img.style.backgroundColor = 'rgba(255,0,0,0.3)'
              }
            })
          }}
          className="w-full text-left p-1 bg-gray-800 rounded hover:bg-gray-700"
        >
          🔴 Highlight Broken Images
        </button>
        
        <button
          onClick={() => {
            window.open('/debug-images', '_blank')
          }}
          className="w-full text-left p-1 bg-gray-800 rounded hover:bg-gray-700"
        >
          🔧 Open Debug Page
        </button>
      </div>

      <div className="border-t border-gray-600 pt-2">
        <div className="text-xs mb-1">Recent Logs:</div>
        <div className="h-20 overflow-y-auto space-y-1">
          {logs.slice(-5).map((log, i) => (
            <div key={i} className="text-xs opacity-80">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}