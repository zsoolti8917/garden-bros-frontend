'use client'

import React, { useEffect } from 'react'
import {
  preloadResources,
  setupDNSPrefetch,
  setupPreconnect,
  PAGE_PRELOAD_CONFIGS,
  DEFAULT_PRELOAD_CONFIG,
  adaptivePreload,
  monitorPreloadPerformance,
  type PreloadConfig
} from '@/lib/resource-preloading'

interface ResourcePreloaderProps {
  pageType?: keyof typeof PAGE_PRELOAD_CONFIGS
  customConfig?: Partial<PreloadConfig>
  enableMonitoring?: boolean
}

export default function ResourcePreloader({
  pageType,
  customConfig,
  enableMonitoring = process.env.NODE_ENV === 'development'
}: ResourcePreloaderProps) {
  useEffect(() => {
    const initializePreloading = async () => {
      try {
        // Get base configuration
        const baseConfig = pageType
          ? PAGE_PRELOAD_CONFIGS[pageType]
          : DEFAULT_PRELOAD_CONFIG

        // Merge with custom configuration
        const finalConfig = customConfig
          ? { ...baseConfig, ...customConfig }
          : baseConfig

        // Apply adaptive preloading based on network conditions
        const adaptedConfig = adaptivePreload(finalConfig)

        // Setup DNS prefetch for external domains
        const externalDomains = [
          'https://admin.gardenbros.sk',
          'https://images.pexels.com',
          'https://images.unsplash.com',
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com'
        ]
        setupDNSPrefetch(externalDomains)

        // Setup preconnect for critical external resources
        setupPreconnect([
          { href: 'https://api.netlify.com', crossorigin: true },
          { href: 'https://formspree.io', crossorigin: true },
          { href: 'https://fonts.gstatic.com', crossorigin: true }
        ])

        // Preload critical resources
        preloadResources(adaptedConfig)

        // Performance monitoring
        if (enableMonitoring) {
          monitorPreloadPerformance()
        }

        // Log preloading completion in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`Resource preloading initialized for ${pageType || 'default'} page`)
          console.log('Preloaded resources:', {
            fonts: adaptedConfig.fonts.length,
            images: adaptedConfig.images.length,
            scripts: adaptedConfig.scripts.length,
            styles: adaptedConfig.styles.length,
            external: adaptedConfig.external.length
          })
        }
      } catch (error) {
        console.error('Failed to initialize resource preloading:', error)
      }
    }

    initializePreloading()
  }, [pageType, customConfig, enableMonitoring])

  // This component doesn't render anything
  return null
}

/**
 * Page-specific resource preloader components
 */
export function HomepagePreloader() {
  return (
    <ResourcePreloader
      pageType="homepage"
      customConfig={{
        images: [
          {
            href: '/images/hero-garden.webp',
            as: 'image',
            fetchpriority: 'high'
          },
          {
            href: '/images/featured-service-1.webp',
            as: 'image',
            fetchpriority: 'high'
          },
          {
            href: '/images/featured-service-2.webp',
            as: 'image',
            fetchpriority: 'high'
          }
        ]
      }}
    />
  )
}

export function ServicesPreloader() {
  return (
    <ResourcePreloader
      pageType="services"
      customConfig={{
        images: [
          {
            href: '/images/services/hero-services.webp',
            as: 'image',
            fetchpriority: 'high'
          }
        ]
      }}
    />
  )
}

export function PortfolioPreloader() {
  return (
    <ResourcePreloader
      pageType="portfolio"
      customConfig={{
        images: [
          {
            href: '/images/portfolio/hero-portfolio.webp',
            as: 'image',
            fetchpriority: 'high'
          }
        ]
      }}
    />
  )
}

export function BlogPreloader() {
  return (
    <ResourcePreloader
      pageType="blog"
      customConfig={{
        images: [
          {
            href: '/images/blog/hero-blog.webp',
            as: 'image',
            fetchpriority: 'high'
          }
        ]
      }}
    />
  )
}

export function ContactPreloader() {
  return (
    <ResourcePreloader
      pageType="contact"
      customConfig={{
        scripts: [
          {
            href: '/_next/static/chunks/contact-validation.js',
            as: 'script',
            fetchpriority: 'high'
          }
        ]
      }}
    />
  )
}