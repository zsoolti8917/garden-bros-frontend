'use client'

import React from 'react'

// Critical CSS utilities for above-the-fold content optimization

export interface CriticalCSSConfig {
  inlineThreshold: number // Maximum size in bytes to inline
  aboveFoldSelectors: string[]
  excludeSelectors: string[]
  deferNonCritical: boolean
}

export const DEFAULT_CRITICAL_CONFIG: CriticalCSSConfig = {
  inlineThreshold: 14000, // 14KB - optimal for first TCP roundtrip
  aboveFoldSelectors: [
    // Layout and navigation
    'body', 'html', '.header', '.nav', '.hero',
    // Typography and base styles
    'h1', 'h2', 'h3', 'p', 'a', 'button',
    // Critical layout components
    '.container', '.grid', '.flex', '.relative', '.absolute',
    // Above-the-fold specific
    '.hero-section', '.banner', '.cta-primary',
    // Loading states
    '.loading', '.skeleton', '.fade-in'
  ],
  excludeSelectors: [
    // Below-the-fold content
    '.footer', '.sidebar', '.modal', '.dropdown',
    // Non-critical animations
    '.slide-in', '.bounce', '.rotate',
    // Large components
    '.gallery', '.carousel', '.accordion-content'
  ],
  deferNonCritical: true
}

/**
 * Extract critical CSS for above-the-fold content
 */
export function extractCriticalCSS(
  cssContent: string,
  config: CriticalCSSConfig = DEFAULT_CRITICAL_CONFIG
): { critical: string; nonCritical: string } {
  if (typeof window === 'undefined') {
    // Server-side: return minimal critical styles
    return {
      critical: getMinimalCriticalCSS(),
      nonCritical: cssContent
    }
  }

  const criticalRules: string[] = []
  const nonCriticalRules: string[] = []

  try {
    // Parse CSS and categorize rules
    const rules = parseCSSRules(cssContent)

    rules.forEach(rule => {
      if (isCriticalRule(rule, config)) {
        criticalRules.push(rule)
      } else {
        nonCriticalRules.push(rule)
      }
    })

    const critical = criticalRules.join('\n')
    const nonCritical = nonCriticalRules.join('\n')

    // Check size threshold
    if (critical.length > config.inlineThreshold) {
      console.warn(`Critical CSS size (${critical.length} bytes) exceeds threshold (${config.inlineThreshold} bytes)`)
    }

    return { critical, nonCritical }
  } catch (error) {
    console.error('Error extracting critical CSS:', error)
    return {
      critical: getMinimalCriticalCSS(),
      nonCritical: cssContent
    }
  }
}

/**
 * Parse CSS content into individual rules
 */
function parseCSSRules(cssContent: string): string[] {
  const rules: string[] = []
  const ruleRegex = /([^{}]+)\{[^{}]*\}/g
  let match

  while ((match = ruleRegex.exec(cssContent)) !== null) {
    rules.push(match[0].trim())
  }

  return rules
}

/**
 * Determine if a CSS rule is critical for above-the-fold content
 */
function isCriticalRule(rule: string, config: CriticalCSSConfig): boolean {
  const selector = rule.split('{')[0].trim()

  // Check if rule matches critical selectors
  const isCritical = config.aboveFoldSelectors.some(criticalSelector => {
    return selector.includes(criticalSelector) ||
           selector.startsWith(criticalSelector) ||
           matchesWildcard(selector, criticalSelector)
  })

  // Check if rule should be excluded
  const isExcluded = config.excludeSelectors.some(excludeSelector => {
    return selector.includes(excludeSelector) ||
           selector.startsWith(excludeSelector)
  })

  return isCritical && !isExcluded
}

/**
 * Simple wildcard matching for CSS selectors
 */
function matchesWildcard(selector: string, pattern: string): boolean {
  if (!pattern.includes('*')) return false

  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*')

  return new RegExp(`^${regexPattern}$`).test(selector)
}

/**
 * Get minimal critical CSS for immediate rendering
 */
function getMinimalCriticalCSS(): string {
  return `
    /* Critical CSS for immediate rendering */
    html, body {
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
    }

    .hero, .header {
      display: block;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .grid {
      display: grid;
    }

    .flex {
      display: flex;
    }

    .hidden {
      display: none;
    }

    .loading {
      opacity: 0.5;
    }

    .fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `.trim()
}

/**
 * Inline critical CSS in document head
 */
export function inlineCriticalCSS(criticalCSS: string): void {
  if (typeof window === 'undefined') return

  const existingStyle = document.getElementById('critical-css')
  if (existingStyle) {
    existingStyle.remove()
  }

  const style = document.createElement('style')
  style.id = 'critical-css'
  style.textContent = criticalCSS
  document.head.insertBefore(style, document.head.firstChild)
}

/**
 * Defer loading of non-critical CSS
 */
export function deferNonCriticalCSS(href: string): void {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'style'
  link.href = href
  link.onload = () => {
    link.rel = 'stylesheet'
  }
  document.head.appendChild(link)

  // Fallback for browsers that don't support preload
  const noscript = document.createElement('noscript')
  const fallbackLink = document.createElement('link')
  fallbackLink.rel = 'stylesheet'
  fallbackLink.href = href
  noscript.appendChild(fallbackLink)
  document.head.appendChild(noscript)
}

/**
 * Performance monitoring for CSS loading
 */
export function measureCSSPerformance(): {
  criticalTime: number
  totalTime: number
} {
  if (typeof window === 'undefined' || !window.performance) {
    return { criticalTime: 0, totalTime: 0 }
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]

  const criticalTime = navigation.domContentLoadedEventEnd - navigation.navigationStart
  const cssResources = resources.filter(resource =>
    resource.name.includes('.css') || resource.initiatorType === 'css'
  )
  const totalTime = Math.max(...cssResources.map(r => r.responseEnd)) - navigation.navigationStart

  return { criticalTime, totalTime }
}

/**
 * React hook for critical CSS management
 */
export function useCriticalCSS(criticalCSS?: string) {
  if (typeof window === 'undefined') return

  React.useEffect(() => {
    if (criticalCSS) {
      inlineCriticalCSS(criticalCSS)
    }

    // Measure performance in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        const metrics = measureCSSPerformance()
        console.log('CSS Performance:', metrics)
      }, 1000)
    }
  }, [criticalCSS])
}

/**
 * CSS optimization strategies for different page types
 */
export const CSS_STRATEGIES = {
  homepage: {
    ...DEFAULT_CRITICAL_CONFIG,
    aboveFoldSelectors: [
      ...DEFAULT_CRITICAL_CONFIG.aboveFoldSelectors,
      '.hero-section', '.featured-services', '.cta-section'
    ]
  },

  services: {
    ...DEFAULT_CRITICAL_CONFIG,
    aboveFoldSelectors: [
      ...DEFAULT_CRITICAL_CONFIG.aboveFoldSelectors,
      '.services-header', '.service-card', '.pricing-table'
    ]
  },

  portfolio: {
    ...DEFAULT_CRITICAL_CONFIG,
    aboveFoldSelectors: [
      ...DEFAULT_CRITICAL_CONFIG.aboveFoldSelectors,
      '.portfolio-header', '.gallery-grid', '.filter-buttons'
    ]
  },

  blog: {
    ...DEFAULT_CRITICAL_CONFIG,
    aboveFoldSelectors: [
      ...DEFAULT_CRITICAL_CONFIG.aboveFoldSelectors,
      '.blog-header', '.post-preview', '.article-meta'
    ]
  }
} as const

/**
 * Get CSS strategy for specific page type
 */
export function getCSSStrategy(pageType: keyof typeof CSS_STRATEGIES): CriticalCSSConfig {
  return CSS_STRATEGIES[pageType] || DEFAULT_CRITICAL_CONFIG
}