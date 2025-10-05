// Image optimization utilities for build-time processing

export interface ImageMetadata {
  src: string
  width: number
  height: number
  alt: string
  placeholder?: string
  blurDataURL?: string
}

export interface ResponsiveImageConfig {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
  quality?: number
  className?: string
  fill?: boolean
  width?: number
  height?: number
}

// Responsive image breakpoints
export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// Device pixel ratios for high-DPI displays
export const DEVICE_PIXEL_RATIOS = [1, 2, 3] as const

// Image quality settings
export const IMAGE_QUALITY = {
  low: 30,
  medium: 75,
  high: 90,
  max: 95,
} as const

/**
 * Generate responsive image sizes attribute for different use cases
 */
export function generateSizes(config: {
  mobile?: string
  tablet?: string
  desktop?: string
  default?: string
}): string {
  const {
    mobile = '100vw',
    tablet = '50vw',
    desktop = '33vw',
    default: defaultSize = '100vw'
  } = config

  return [
    `(max-width: ${BREAKPOINTS.sm}px) ${mobile}`,
    `(max-width: ${BREAKPOINTS.lg}px) ${tablet}`,
    `(min-width: ${BREAKPOINTS.lg + 1}px) ${desktop}`,
    defaultSize
  ].join(', ')
}

/**
 * Common size configurations for different components
 */
export const COMMON_SIZES = {
  hero: generateSizes({ mobile: '100vw', tablet: '100vw', desktop: '100vw' }),
  card: generateSizes({ mobile: '100vw', tablet: '50vw', desktop: '33vw' }),
  gallery: generateSizes({ mobile: '100vw', tablet: '50vw', desktop: '25vw' }),
  thumbnail: generateSizes({ mobile: '25vw', tablet: '20vw', desktop: '15vw' }),
  full: '100vw',
  half: '50vw',
  third: '33vw',
  quarter: '25vw',
}

/**
 * Generate a low-quality placeholder for blur effect
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  // Create a simple SVG blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect width="100%" height="100%" fill="url(#gradient)" opacity="0.3"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d1d5db;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>
  `

  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Optimize image path for different formats and sizes
 */
export function optimizeImagePath(
  src: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'jpg' | 'png'
  } = {}
): string {
  if (!src || src.startsWith('data:') || src.startsWith('blob:')) {
    return src
  }

  // For external URLs, return as-is (they should be optimized at source)
  if (src.startsWith('http')) {
    return src
  }

  // For local images, we rely on Next.js Image component optimization
  // In a real implementation, you might want to add build-time optimization here
  return src
}

/**
 * Get optimal image dimensions for different use cases
 */
export function getOptimalDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight?: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight

  if (!maxHeight) {
    maxHeight = maxWidth / aspectRatio
  }

  const widthRatio = maxWidth / originalWidth
  const heightRatio = maxHeight / originalHeight
  const ratio = Math.min(widthRatio, heightRatio)

  return {
    width: Math.round(originalWidth * ratio),
    height: Math.round(originalHeight * ratio)
  }
}

/**
 * Check if image should be eagerly loaded (priority)
 */
export function shouldPreload(
  index: number,
  viewportPosition: 'above-fold' | 'below-fold' = 'below-fold'
): boolean {
  // Preload first few images that are above the fold
  if (viewportPosition === 'above-fold') {
    return index < 3
  }

  // For below-fold content, only preload the first image
  return index === 0
}

/**
 * Generate srcSet for responsive images
 */
export function generateSrcSet(
  baseSrc: string,
  widths: number[] = [640, 768, 1024, 1280, 1920]
): string {
  return widths
    .map(width => {
      const optimizedSrc = optimizeImagePath(baseSrc, { width })
      return `${optimizedSrc} ${width}w`
    })
    .join(', ')
}

/**
 * Lazy loading configuration
 */
export const LAZY_LOADING_CONFIG = {
  rootMargin: '50px',
  threshold: 0.1,
  // Preload images when they're 50px away from viewport
}

/**
 * Image loading strategy based on position and importance
 */
export function getLoadingStrategy(
  position: number,
  importance: 'critical' | 'high' | 'normal' | 'low' = 'normal'
): {
  priority: boolean
  loading: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
} {
  // Critical images (hero, above-fold)
  if (importance === 'critical' || position === 0) {
    return {
      priority: true,
      loading: 'eager',
      fetchPriority: 'high'
    }
  }

  // High importance images (first few cards)
  if (importance === 'high' || position <= 2) {
    return {
      priority: false,
      loading: 'lazy',
      fetchPriority: 'high'
    }
  }

  // Normal and low importance images
  return {
    priority: false,
    loading: 'lazy',
    fetchPriority: importance === 'low' ? 'low' : 'auto'
  }
}

/**
 * Helper to create optimized image props for Next.js Image component
 */
export function createImageProps(config: ResponsiveImageConfig) {
  const {
    src,
    alt,
    sizes = COMMON_SIZES.card,
    priority = false,
    quality = IMAGE_QUALITY.high,
    className = '',
    fill = false,
    width,
    height
  } = config

  const baseProps = {
    src: optimizeImagePath(src, { quality }),
    alt,
    sizes,
    quality,
    className: `transition-opacity duration-300 ${className}`,
    placeholder: 'blur' as const,
    blurDataURL: generateBlurDataURL(),
    ...(priority && { priority: true }),
  }

  if (fill) {
    return {
      ...baseProps,
      fill: true,
    }
  }

  if (width && height) {
    return {
      ...baseProps,
      width,
      height,
    }
  }

  // Default dimensions if not specified
  return {
    ...baseProps,
    width: 800,
    height: 600,
  }
}

/**
 * Image format detection and optimization
 */
export function getSupportedFormat(): 'avif' | 'webp' | 'jpg' {
  if (typeof window === 'undefined') {
    return 'webp' // Default for SSR
  }

  // Check AVIF support
  const avifCanvas = document.createElement('canvas')
  if (avifCanvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
    return 'avif'
  }

  // Check WebP support
  const webpCanvas = document.createElement('canvas')
  if (webpCanvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return 'webp'
  }

  return 'jpg'
}

/**
 * Performance monitoring for images
 */
export function trackImagePerformance(src: string, startTime: number) {
  if (typeof window === 'undefined' || !window.performance) {
    return
  }

  const endTime = performance.now()
  const loadTime = endTime - startTime

  // Log slow loading images in development
  if (process.env.NODE_ENV === 'development' && loadTime > 1000) {
    console.warn(`Slow image loading detected: ${src} took ${loadTime.toFixed(2)}ms`)
  }

  // Could integrate with analytics here
  // Example: gtag('event', 'image_load', { load_time: loadTime, image_src: src })
}

/**
 * Preload critical images
 */
export function preloadCriticalImages(images: string[]) {
  if (typeof window === 'undefined') return

  images.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.fetchPriority = 'high'
    document.head.appendChild(link)
  })
}

/**
 * Image cache utilities
 */
export class ImageCache {
  private static cache = new Map<string, Promise<HTMLImageElement>>()

  static preload(src: string): Promise<HTMLImageElement> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })

    this.cache.set(src, promise)
    return promise
  }

  static clear() {
    this.cache.clear()
  }

  static has(src: string): boolean {
    return this.cache.has(src)
  }
}