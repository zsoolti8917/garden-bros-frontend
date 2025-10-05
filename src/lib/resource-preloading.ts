'use client'

import React from 'react'

// Resource preloading utilities for performance optimization

export interface PreloadResource {
  href: string
  as: 'style' | 'script' | 'font' | 'image' | 'fetch' | 'document'
  type?: string
  crossorigin?: 'anonymous' | 'use-credentials'
  fetchpriority?: 'high' | 'low' | 'auto'
  media?: string
  rel?: 'preload' | 'prefetch' | 'dns-prefetch' | 'preconnect'
}

export interface PreloadConfig {
  fonts: PreloadResource[]
  images: PreloadResource[]
  scripts: PreloadResource[]
  styles: PreloadResource[]
  external: PreloadResource[]
}

/**
 * Default preload configuration for Garden Bros website
 */
export const DEFAULT_PRELOAD_CONFIG: PreloadConfig = {
  fonts: [
    {
      href: '/_next/static/media/inter-latin.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous',
      fetchpriority: 'high'
    }
  ],
  images: [
    {
      href: '/images/hero-bg.webp',
      as: 'image',
      fetchpriority: 'high'
    },
    {
      href: '/images/logo.webp',
      as: 'image',
      fetchpriority: 'high'
    },
    {
      href: '/images/services/featured-service.webp',
      as: 'image',
      fetchpriority: 'high'
    }
  ],
  scripts: [
    {
      href: '/_next/static/chunks/main.js',
      as: 'script',
      fetchpriority: 'high'
    }
  ],
  styles: [
    {
      href: '/_next/static/css/app/globals.css',
      as: 'style',
      fetchpriority: 'high'
    }
  ],
  external: [
    {
      href: 'https://admin.gardenbros.sk',
      as: 'fetch',
      rel: 'dns-prefetch'
    },
    {
      href: 'https://images.pexels.com',
      as: 'fetch',
      rel: 'dns-prefetch'
    },
    {
      href: 'https://images.unsplash.com',
      as: 'fetch',
      rel: 'dns-prefetch'
    },
    {
      href: 'https://api.netlify.com',
      as: 'fetch',
      rel: 'preconnect',
      crossorigin: 'anonymous'
    }
  ]
}

/**
 * Page-specific preload configurations
 */
export const PAGE_PRELOAD_CONFIGS = {
  homepage: {
    ...DEFAULT_PRELOAD_CONFIG,
    images: [
      ...DEFAULT_PRELOAD_CONFIG.images,
      {
        href: '/images/featured-portfolio-1.webp',
        as: 'image',
        fetchpriority: 'high'
      },
      {
        href: '/images/featured-portfolio-2.webp',
        as: 'image',
        fetchpriority: 'high'
      }
    ]
  },

  services: {
    ...DEFAULT_PRELOAD_CONFIG,
    images: [
      ...DEFAULT_PRELOAD_CONFIG.images,
      {
        href: '/images/services/lawn-care.webp',
        as: 'image',
        fetchpriority: 'high'
      },
      {
        href: '/images/services/garden-design.webp',
        as: 'image',
        fetchpriority: 'high'
      }
    ]
  },

  portfolio: {
    ...DEFAULT_PRELOAD_CONFIG,
    images: [
      ...DEFAULT_PRELOAD_CONFIG.images,
      {
        href: '/images/portfolio/gallery-preview-1.webp',
        as: 'image',
        fetchpriority: 'high'
      },
      {
        href: '/images/portfolio/gallery-preview-2.webp',
        as: 'image',
        fetchpriority: 'high'
      },
      {
        href: '/images/portfolio/gallery-preview-3.webp',
        as: 'image',
        fetchpriority: 'high'
      }
    ]
  },

  blog: {
    ...DEFAULT_PRELOAD_CONFIG,
    images: [
      ...DEFAULT_PRELOAD_CONFIG.images,
      {
        href: '/images/blog/latest-post.webp',
        as: 'image',
        fetchpriority: 'high'
      }
    ]
  },

  contact: {
    ...DEFAULT_PRELOAD_CONFIG,
    scripts: [
      ...DEFAULT_PRELOAD_CONFIG.scripts,
      {
        href: '/_next/static/chunks/contact-form.js',
        as: 'script',
        fetchpriority: 'high'
      }
    ]
  }
} as const

/**
 * Preload resources in the document head
 */
export function preloadResources(config: PreloadConfig): void {
  if (typeof window === 'undefined') return

  const allResources = [
    ...config.fonts,
    ...config.images,
    ...config.scripts,
    ...config.styles,
    ...config.external
  ]

  allResources.forEach(resource => {
    createPreloadLink(resource)
  })
}

/**
 * Create and append a preload link element
 */
function createPreloadLink(resource: PreloadResource): void {
  // Check if link already exists
  const existing = document.querySelector(`link[href="${resource.href}"]`)
  if (existing) return

  const link = document.createElement('link')
  link.rel = resource.rel || 'preload'
  link.href = resource.href

  if (resource.as) link.as = resource.as
  if (resource.type) link.type = resource.type
  if (resource.crossorigin) link.crossOrigin = resource.crossorigin
  if (resource.fetchpriority) (link as any).fetchPriority = resource.fetchpriority
  if (resource.media) link.media = resource.media

  document.head.appendChild(link)
}

/**
 * Preload critical above-the-fold images
 */
export function preloadCriticalImages(images: string[]): void {
  if (typeof window === 'undefined') return

  images.forEach((src, index) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.fetchPriority = index < 3 ? 'high' : 'auto'
    document.head.appendChild(link)
  })
}

/**
 * Setup DNS prefetch for external domains
 */
export function setupDNSPrefetch(domains: string[]): void {
  if (typeof window === 'undefined') return

  domains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = domain
    document.head.appendChild(link)
  })
}

/**
 * Setup preconnect for external resources that require connections
 */
export function setupPreconnect(origins: Array<{ href: string; crossorigin?: boolean }>): void {
  if (typeof window === 'undefined') return

  origins.forEach(origin => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = origin.href
    if (origin.crossorigin) link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

/**
 * Preload resources based on user interaction
 */
export function preloadOnInteraction(
  trigger: HTMLElement,
  resources: PreloadResource[],
  eventType: 'hover' | 'focus' | 'click' = 'hover'
): void {
  if (typeof window === 'undefined') return

  let isPreloaded = false

  const handleInteraction = () => {
    if (isPreloaded) return
    isPreloaded = true

    resources.forEach(resource => {
      createPreloadLink(resource)
    })
  }

  const eventMap = {
    hover: 'mouseenter',
    focus: 'focus',
    click: 'click'
  }

  trigger.addEventListener(eventMap[eventType], handleInteraction, { once: true })
}

/**
 * Intelligent resource preloading based on network conditions
 */
export function adaptivePreload(config: PreloadConfig): PreloadConfig {
  if (typeof navigator === 'undefined') {
    return config
  }

  // Check network conditions
  const connection = (navigator as any).connection
  if (!connection) return config

  // Reduce preloading on slow connections
  if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
    return {
      fonts: config.fonts, // Always preload fonts
      images: config.images.slice(0, 2), // Limit images
      scripts: config.scripts.slice(0, 1), // Limit scripts
      styles: config.styles, // Always preload styles
      external: config.external.filter(r => r.rel === 'dns-prefetch') // Only DNS prefetch
    }
  }

  // Enhanced preloading on fast connections
  if (connection.effectiveType === '4g') {
    return {
      ...config,
      images: [...config.images, ...getAdditionalImages()],
    }
  }

  return config
}

/**
 * Get additional images to preload on fast connections
 */
function getAdditionalImages(): PreloadResource[] {
  return [
    {
      href: '/images/team/team-photo.webp',
      as: 'image',
      fetchpriority: 'low'
    },
    {
      href: '/images/gallery/thumb-1.webp',
      as: 'image',
      fetchpriority: 'low'
    }
  ]
}

/**
 * Monitor preload performance
 */
export function monitorPreloadPerformance(): void {
  if (typeof window === 'undefined' || !window.performance) return

  setTimeout(() => {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const preloadedResources = entries.filter(entry =>
      document.querySelector(`link[href="${entry.name}"][rel="preload"]`)
    )

    console.group('Resource Preload Performance')
    preloadedResources.forEach(entry => {
      console.log(`${entry.name}: ${Math.round(entry.duration)}ms`)
    })
    console.groupEnd()

    // Track slow preloads
    const slowPreloads = preloadedResources.filter(entry => entry.duration > 500)
    if (slowPreloads.length > 0) {
      console.warn('Slow preloads detected:', slowPreloads.map(e => e.name))
    }
  }, 2000)
}

/**
 * React hook for resource preloading
 */
export function useResourcePreloading(
  pageType: keyof typeof PAGE_PRELOAD_CONFIGS,
  customConfig?: Partial<PreloadConfig>
) {
  if (typeof window === 'undefined') return

  React.useEffect(() => {
    const baseConfig = PAGE_PRELOAD_CONFIGS[pageType] || DEFAULT_PRELOAD_CONFIG
    const finalConfig = customConfig ? { ...baseConfig, ...customConfig } : baseConfig

    // Apply adaptive preloading
    const adaptedConfig = adaptivePreload(finalConfig)

    // Preload resources
    preloadResources(adaptedConfig)

    // Monitor performance in development
    if (process.env.NODE_ENV === 'development') {
      monitorPreloadPerformance()
    }
  }, [pageType, customConfig])
}