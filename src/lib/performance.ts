'use client'

import React from 'react'

// Performance optimization utilities for Core Web Vitals

export interface PerformanceMetrics {
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  fcp: number // First Contentful Paint
  ttfb: number // Time to First Byte
}

export interface WebVitalsConfig {
  reportUrl?: string
  enableDevLogging: boolean
  thresholds: {
    lcp: { good: number; poor: number }
    fid: { good: number; poor: number }
    cls: { good: number; poor: number }
    fcp: { good: number; poor: number }
    ttfb: { good: number; poor: number }
  }
}

export const DEFAULT_WEB_VITALS_CONFIG: WebVitalsConfig = {
  enableDevLogging: process.env.NODE_ENV === 'development',
  thresholds: {
    lcp: { good: 2500, poor: 4000 }, // ms
    fid: { good: 100, poor: 300 },   // ms
    cls: { good: 0.1, poor: 0.25 },  // score
    fcp: { good: 1800, poor: 3000 }, // ms
    ttfb: { good: 800, poor: 1800 }  // ms
  }
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitals(config: Partial<WebVitalsConfig> = {}) {
  const finalConfig = { ...DEFAULT_WEB_VITALS_CONFIG, ...config }

  if (typeof window === 'undefined') return

  // Import web-vitals dynamically to reduce bundle size
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS(createMetricHandler('CLS', finalConfig))
    onFID(createMetricHandler('FID', finalConfig))
    onFCP(createMetricHandler('FCP', finalConfig))
    onLCP(createMetricHandler('LCP', finalConfig))
    onTTFB(createMetricHandler('TTFB', finalConfig))
  }).catch(error => {
    console.error('Failed to load web-vitals:', error)
  })
}

/**
 * Create metric handler for Web Vitals
 */
function createMetricHandler(name: keyof PerformanceMetrics, config: WebVitalsConfig) {
  return (metric: any) => {
    const value = metric.value
    const threshold = config.thresholds[name.toLowerCase() as keyof typeof config.thresholds]

    let rating: 'good' | 'needs-improvement' | 'poor' = 'good'
    if (value > threshold.poor) {
      rating = 'poor'
    } else if (value > threshold.good) {
      rating = 'needs-improvement'
    }

    // Log in development
    if (config.enableDevLogging) {
      const color = rating === 'good' ? 'green' : rating === 'needs-improvement' ? 'orange' : 'red'
      console.log(
        `%c${name}: ${value.toFixed(2)} (${rating})`,
        `color: ${color}; font-weight: bold`
      )
    }

    // Report to analytics if configured
    if (config.reportUrl) {
      reportMetric(name, value, rating, config.reportUrl)
    }

    // Track in performance observer if available
    trackCustomMetric(name, value, rating)
  }
}

/**
 * Report metric to analytics endpoint
 */
async function reportMetric(name: string, value: number, rating: string, reportUrl: string) {
  try {
    await fetch(reportUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: name,
        value,
        rating,
        url: window.location.href,
        timestamp: Date.now()
      })
    })
  } catch (error) {
    console.error('Failed to report metric:', error)
  }
}

/**
 * Track custom metric in Performance Observer
 */
function trackCustomMetric(name: string, value: number, rating: string) {
  if ('performance' in window && 'mark' in performance) {
    performance.mark(`web-vital-${name.toLowerCase()}-${rating}`)
  }
}

/**
 * Performance optimization utilities
 */
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private observers: PerformanceObserver[] = []
  private metrics: Partial<PerformanceMetrics> = {}

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer()
    }
    return PerformanceOptimizer.instance
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    if (typeof window === 'undefined') return

    this.setupResourceObserver()
    this.setupNavigationObserver()
    this.setupLongTaskObserver()
    this.optimizeInitialLoad()
  }

  /**
   * Setup resource timing observer
   */
  private setupResourceObserver() {
    if (!('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          this.analyzeResourceTiming(entry as PerformanceResourceTiming)
        }
      })
    })

    observer.observe({ entryTypes: ['resource'] })
    this.observers.push(observer)
  }

  /**
   * Setup navigation timing observer
   */
  private setupNavigationObserver() {
    if (!('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          this.analyzeNavigationTiming(entry as PerformanceNavigationTiming)
        }
      })
    })

    observer.observe({ entryTypes: ['navigation'] })
    this.observers.push(observer)
  }

  /**
   * Setup long task observer
   */
  private setupLongTaskObserver() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`)
          }
        })
      })

      observer.observe({ entryTypes: ['longtask'] })
      this.observers.push(observer)
    } catch (error) {
      // Long task API not supported
    }
  }

  /**
   * Analyze resource timing for slow resources
   */
  private analyzeResourceTiming(entry: PerformanceResourceTiming) {
    const slowThreshold = 1000 // 1 second

    if (entry.duration > slowThreshold) {
      console.warn(`Slow resource: ${entry.name} (${entry.duration.toFixed(2)}ms)`)

      // Suggest optimizations
      if (entry.name.includes('.css')) {
        console.log('💡 Consider: CSS optimization, critical CSS inlining')
      } else if (entry.name.includes('.js')) {
        console.log('💡 Consider: JavaScript code splitting, tree shaking')
      } else if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
        console.log('💡 Consider: Image optimization, lazy loading, WebP/AVIF format')
      }
    }
  }

  /**
   * Analyze navigation timing
   */
  private analyzeNavigationTiming(entry: PerformanceNavigationTiming) {
    const ttfb = entry.responseStart - entry.requestStart
    const domComplete = entry.domComplete - entry.navigationStart
    const loadComplete = entry.loadEventEnd - entry.navigationStart

    if (process.env.NODE_ENV === 'development') {
      console.group('Navigation Timing')
      console.log(`TTFB: ${ttfb.toFixed(2)}ms`)
      console.log(`DOM Complete: ${domComplete.toFixed(2)}ms`)
      console.log(`Load Complete: ${loadComplete.toFixed(2)}ms`)
      console.groupEnd()
    }

    // Store metrics
    this.metrics.ttfb = ttfb
  }

  /**
   * Optimize initial page load
   */
  private optimizeInitialLoad() {
    // Defer non-critical JavaScript
    this.deferNonCriticalJS()

    // Optimize font loading
    this.optimizeFontLoading()

    // Preload critical resources
    this.preloadCriticalResources()
  }

  /**
   * Defer non-critical JavaScript execution
   */
  private deferNonCriticalJS() {
    // Move non-critical scripts to load after page is ready
    document.addEventListener('DOMContentLoaded', () => {
      const nonCriticalScripts = document.querySelectorAll('script[data-defer]')
      nonCriticalScripts.forEach(script => {
        const newScript = document.createElement('script')
        newScript.src = script.getAttribute('src') || ''
        newScript.async = true
        document.head.appendChild(newScript)
      })
    })
  }

  /**
   * Optimize font loading to prevent layout shifts
   */
  private optimizeFontLoading() {
    // Use font-display: swap for custom fonts
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
    `
    document.head.appendChild(style)
  }

  /**
   * Preload critical resources
   */
  private preloadCriticalResources() {
    const criticalResources = [
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
      { href: '/images/hero-bg.webp', as: 'image' }
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.href
      link.as = resource.as
      if (resource.type) link.type = resource.type
      if (resource.as === 'font') link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }

  /**
   * Cleanup performance observers
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitoring(config?: Partial<WebVitalsConfig>) {
  React.useEffect(() => {
    // Initialize Web Vitals
    initWebVitals(config)

    // Initialize performance optimizer
    const optimizer = PerformanceOptimizer.getInstance()
    optimizer.init()

    return () => {
      optimizer.cleanup()
    }
  }, [config])
}

/**
 * Component-level performance optimization
 */
export function optimizeComponent(ComponentName: string) {
  return function <T extends React.ComponentType<any>>(Component: T): T {
    const OptimizedComponent = React.memo(Component)
    OptimizedComponent.displayName = `Optimized(${ComponentName})`
    return OptimizedComponent as T
  }
}

/**
 * Image optimization utilities
 */
export function optimizeImageLoading() {
  if (typeof window === 'undefined') return

  // Use Intersection Observer for lazy loading images
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        }
      })
    },
    { rootMargin: '50px' }
  )

  // Observe all lazy images
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img)
  })
}

/**
 * Bundle size analyzer (development only)
 */
export function analyzeBundleSize() {
  if (process.env.NODE_ENV !== 'development') return

  // Analyze webpack chunks
  if (window.__webpack_require__) {
    console.group('Bundle Analysis')
    console.log('Webpack chunks:', Object.keys(window.__webpack_require__.cache || {}))
    console.groupEnd()
  }
}

/**
 * Performance budget checker
 */
export function checkPerformanceBudget() {
  if (typeof window === 'undefined') return

  const budget = {
    maxJSSize: 244 * 1024, // 244KB for JS
    maxCSSSize: 50 * 1024,  // 50KB for CSS
    maxImageSize: 500 * 1024, // 500KB for images
    maxTotalSize: 1.5 * 1024 * 1024 // 1.5MB total
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  const sizes = {
    js: 0,
    css: 0,
    images: 0,
    total: 0
  }

  resources.forEach(resource => {
    const size = resource.transferSize || 0
    sizes.total += size

    if (resource.name.includes('.js')) {
      sizes.js += size
    } else if (resource.name.includes('.css')) {
      sizes.css += size
    } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
      sizes.images += size
    }
  })

  console.group('Performance Budget')
  console.log(`JS: ${(sizes.js / 1024).toFixed(1)}KB / ${(budget.maxJSSize / 1024).toFixed(1)}KB`)
  console.log(`CSS: ${(sizes.css / 1024).toFixed(1)}KB / ${(budget.maxCSSSize / 1024).toFixed(1)}KB`)
  console.log(`Images: ${(sizes.images / 1024).toFixed(1)}KB / ${(budget.maxImageSize / 1024).toFixed(1)}KB`)
  console.log(`Total: ${(sizes.total / 1024).toFixed(1)}KB / ${(budget.maxTotalSize / 1024).toFixed(1)}KB`)
  console.groupEnd()

  // Check budget violations
  if (sizes.js > budget.maxJSSize) {
    console.warn('❌ JavaScript budget exceeded')
  }
  if (sizes.css > budget.maxCSSSize) {
    console.warn('❌ CSS budget exceeded')
  }
  if (sizes.images > budget.maxImageSize) {
    console.warn('❌ Image budget exceeded')
  }
  if (sizes.total > budget.maxTotalSize) {
    console.warn('❌ Total size budget exceeded')
  }
}