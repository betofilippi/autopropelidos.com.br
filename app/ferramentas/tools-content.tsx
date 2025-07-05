'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from 'next/link'
import { SkeletonTool } from '@/components/ui/skeletons'
import { cn } from '@/lib/utils'
import React from 'react'

interface Tool {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  href: string
  features: string[]
}

interface ToolsContentProps {
  tools: Tool[]
}

export function ToolsContent({ tools }: ToolsContentProps) {
  const [loading, setLoading] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {loading ? (
        // Show skeletons while loading
        Array.from({ length: 6 }).map((_, i) => (
          <SkeletonTool key={i} />
        ))
      ) : (
        tools.map((tool, index) => (
          <Card 
            key={tool.id} 
            className={cn(
              "group hover:shadow-xl transition-all duration-300 border-2",
              "hover:border-blue-200 transform hover:-translate-y-1",
              "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
            )}
            onMouseEnter={() => setHoveredCard(tool.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <CardHeader className="text-center pb-4">
              <div 
                className={cn(
                  "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-transform duration-300",
                  tool.color,
                  hoveredCard === tool.id && "scale-110"
                )}
              >
                {tool.icon}
              </div>
              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                {tool.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                {tool.description}
              </p>
              
              <div className="space-y-3 mb-6">
                {tool.features.map((feature, featureIndex) => (
                  <div 
                    key={featureIndex} 
                    className="flex items-center text-sm opacity-0 animate-fade-in"
                    style={{
                      animationDelay: `${(index * 100) + (featureIndex * 50)}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link
                href={tool.href}
                className={cn(
                  "block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium",
                  "hover:bg-blue-700 transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "transform hover:scale-105 active:scale-95"
                )}
                aria-label={`Acessar ferramenta ${tool.title}`}
              >
                Acessar Ferramenta
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}