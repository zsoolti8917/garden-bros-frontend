'use client'

import React, { useEffect } from 'react'
import {
  usePerformanceMonitoring,
  PerformanceOptimizer,
  checkPerformanceBudget,
  optimizeImageLoading,
  analyzeBundleSize,
  DEFAULT_WEB_VITALS_CONFIG
} from '@/lib/performance'

interface PerformanceMonitorProps {
  enableDevTools?: boolean
  reportUrl?: string
  enableAnalytics?: boolean
}

export default function PerformanceMonitor({
  enableDevTools = process.env.NODE_ENV === 'development',
  reportUrl,
  enableAnalytics = true
}: PerformanceMonitorProps) {
  // Initialize performance monitoring
  usePerformanceMonitoring({
    ...DEFAULT_WEB_VITALS_CONFIG,
    reportUrl,
    enableDevLogging: enableDevTools
  })

  useEffect(() => {
    // Run performance optimizations after component mount
    const runOptimizations = () => {
      // Optimize image loading
      optimizeImageLoading()

      // Check performance budget in development
      if (enableDevTools) {
        setTimeout(() => {
          checkPerformanceBudget()
          analyzeBundleSize()
        }, 2000)
      }

      // Initialize performance optimizer
      const optimizer = PerformanceOptimizer.getInstance()
      optimizer.init()

      // Send performance data to analytics if enabled
      if (enableAnalytics && typeof window !== 'undefined') {
        sendPerformanceToAnalytics()
      }
    }

    // Run optimizations after the page has loaded
    if (document.readyState === 'complete') {
      runOptimizations()
    } else {
      window.addEventListener('load', runOptimizations)
      return () => window.removeEventListener('load', runOptimizations)
    }
  }, [enableDevTools, enableAnalytics])

  // This component doesn't render anything
  return null
}

/**
 * Send performance metrics to analytics
 */
function sendPerformanceToAnalytics() {
  // Wait for metrics to be available
  setTimeout(() => {
    if (typeof window === 'undefined' || !window.performance) return

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (!navigation) return

    const metrics = {
      // Core Web Vitals will be sent separately by web-vitals library
      ttfb: navigation.responseStart - navigation.requestStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
      loadComplete: navigation.loadEventEnd - navigation.navigationStart,
      url: window.location.pathname
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.group('Performance Metrics')
      console.log('TTFB:', `${metrics.ttfb.toFixed(2)}ms`)
      console.log('DOM Content Loaded:', `${metrics.domContentLoaded.toFixed(2)}ms`)
      console.log('Load Complete:', `${metrics.loadComplete.toFixed(2)}ms`)
      console.groupEnd()
    }

    // In production, you would send to your analytics service
    // Example: gtag('event', 'performance', metrics)
  }, 1000)
}

/**
 * Performance debugging component for development
 */
export function PerformanceDebugger() {
  const [metrics, setMetrics] = React.useState<any>({})
  const [isVisible, setIsVisible] = React.useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const updateMetrics = () => {
      const optimizer = PerformanceOptimizer.getInstance()
      setMetrics(optimizer.getMetrics())
    }

    const interval = setInterval(updateMetrics, 1000)
    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <>
      {/* Floating debug button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        style={{ fontSize: '12px' }}
      >
        ⚡
      </button>

      {/* Debug panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-black/90 text-white p-4 rounded-lg shadow-xl max-w-sm">
          <h3 className="text-sm font-bold mb-2">Performance Metrics</h3>
          <div className="space-y-1 text-xs">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span>{key.toUpperCase()}:</span>
                <span>{typeof value === 'number' ? `${value.toFixed(2)}ms` : 'N/A'}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-gray-600">
            <button
              onClick={() => {
                checkPerformanceBudget()
                analyzeBundleSize()
              }}
              className="text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
            >
              Run Analysis
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Page-specific performance optimization
 */
export function PagePerformanceOptimizer({ pageType }: { pageType: string }) {
  useEffect(() => {
    // Page-specific optimizations
    const optimizations: Record<string, () => void> = {
      homepage: () => {
        // Preload hero image
        const heroImg = new Image()
        heroImg.src = '/images/hero-bg.webp'

        // Defer non-critical animations
        setTimeout(() => {
          document.body.classList.add('animations-ready')
        }, 100)
      },

      portfolio: () => {
        // Optimize gallery loading
        optimizeImageLoading()

        // Implement virtual scrolling for large galleries
        const galleries = document.querySelectorAll('.portfolio-gallery')
        galleries.forEach(gallery => {
          gallery.setAttribute('data-virtual-scroll', 'true')
        })
      },

      blog: () => {
        // Lazy load blog post images
        const blogImages = document.querySelectorAll('.blog-content img')
        blogImages.forEach(img => {
          img.setAttribute('loading', 'lazy')
        })
      },

      contact: () => {
        // Preload form validation scripts
        import('@/lib/validation').then(() => {
          console.log('Form validation scripts preloaded')
        })
      }
    }

    const optimize = optimizations[pageType]
    if (optimize) {
      optimize()
    }
  }, [pageType])

  return null
}

/**
 * Critical resource preloader
 */
export function CriticalResourcePreloader() {
  useEffect(() => {
    // Preload critical resources that aren't handled by Next.js
    const criticalResources = [
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
      { href: '/images/logo.webp', as: 'image' },
      { href: '/api/health', as: 'fetch' } // Health check endpoint
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.href
      link.as = resource.as
      if (resource.type) link.type = resource.type
      if (resource.as === 'font') link.crossOrigin = 'anonymous'

      // Only add if not already present
      if (!document.querySelector(`link[href="${resource.href}"]`)) {
        document.head.appendChild(link)
      }
    })
  }, [])

  return null
}