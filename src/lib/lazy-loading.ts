'use client'

// Lazy loading utilities with Intersection Observer for performance optimization

export interface LazyLoadOptions {
  rootMargin?: string
  threshold?: number | number[]
  triggerOnce?: boolean
  placeholder?: string
  fadeInDuration?: number
}

export interface LazyImageElement extends HTMLElement {
  dataset: {
    src?: string
    srcset?: string
    sizes?: string
    loaded?: string
  }
}

/**
 * Default configuration for lazy loading
 */
export const DEFAULT_LAZY_CONFIG: Required<LazyLoadOptions> = {
  rootMargin: '50px',
  threshold: 0.1,
  triggerOnce: true,
  placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4=',
  fadeInDuration: 300
}

/**
 * Create Intersection Observer for lazy loading
 */
export function createLazyLoadObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: LazyLoadOptions = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  const config = { ...DEFAULT_LAZY_CONFIG, ...options }

  return new IntersectionObserver((entries) => {
    entries.forEach(callback)
  }, {
    rootMargin: config.rootMargin,
    threshold: config.threshold
  })
}

/**
 * Lazy load images with fade-in effect
 */
export function lazyLoadImage(
  img: LazyImageElement,
  options: LazyLoadOptions = {}
): void {
  const config = { ...DEFAULT_LAZY_CONFIG, ...options }

  // Skip if already loaded
  if (img.dataset.loaded === 'true') {
    return
  }

  const src = img.dataset.src
  const srcset = img.dataset.srcset
  const sizes = img.dataset.sizes

  if (!src) {
    console.warn('Lazy load image missing data-src attribute')
    return
  }

  // Create new image to preload
  const imageLoader = new Image()

  // Set up fade-in animation
  const fadeIn = () => {
    img.style.transition = `opacity ${config.fadeInDuration}ms ease-in-out`
    img.style.opacity = '1'
    img.dataset.loaded = 'true'
  }

  // Handle successful load
  imageLoader.onload = () => {
    // Update the actual image element
    if (img instanceof HTMLImageElement) {
      img.src = src
      if (srcset) img.srcset = srcset
      if (sizes) img.sizes = sizes
    } else {
      // Handle background images
      img.style.backgroundImage = `url(${src})`
    }

    fadeIn()
  }

  // Handle load error
  imageLoader.onerror = () => {
    console.error(`Failed to load lazy image: ${src}`)
    img.dataset.loaded = 'error'
  }

  // Start loading
  imageLoader.src = src
  if (srcset) imageLoader.srcset = srcset
}

/**
 * Initialize lazy loading for a container
 */
export function initLazyLoading(
  container: HTMLElement | Document = document,
  options: LazyLoadOptions = {}
): () => void {
  const config = { ...DEFAULT_LAZY_CONFIG, ...options }

  // Find all lazy load candidates
  const lazyImages = container.querySelectorAll<LazyImageElement>(
    'img[data-src], [data-src]'
  )

  // Fallback for browsers without Intersection Observer
  if (!('IntersectionObserver' in window)) {
    lazyImages.forEach(img => lazyLoadImage(img, config))
    return () => {} // No cleanup needed
  }

  // Create observer
  const observer = createLazyLoadObserver((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target as LazyImageElement
      lazyLoadImage(img, config)

      if (config.triggerOnce) {
        observer?.unobserve(img)
      }
    }
  }, config)

  if (!observer) {
    return () => {}
  }

  // Start observing
  lazyImages.forEach(img => {
    // Set initial styles
    if (img instanceof HTMLImageElement) {
      img.style.opacity = '0'
      img.src = config.placeholder
    } else {
      img.style.opacity = '0'
      img.style.backgroundImage = `url(${config.placeholder})`
    }

    observer.observe(img)
  })

  // Return cleanup function
  return () => {
    observer.disconnect()
  }
}

/**
 * React hook for lazy loading
 */
export function useLazyLoading(
  ref: React.RefObject<HTMLElement>,
  options: LazyLoadOptions = {}
) {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isInView, setIsInView] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = createLazyLoadObserver((entry) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        if (options.triggerOnce !== false) {
          observer?.unobserve(element)
        }
      } else {
        setIsInView(false)
      }
    }, options)

    if (observer) {
      observer.observe(element)
      return () => observer.disconnect()
    }
  }, [ref, options])

  const load = React.useCallback(() => {
    setIsLoaded(true)
  }, [])

  return { isLoaded, isInView, load }
}

/**
 * Performance-optimized gallery lazy loading
 */
export class GalleryLazyLoader {
  private observer: IntersectionObserver | null = null
  private loadedImages = new Set<string>()
  private preloadQueue: string[] = []
  private isPreloading = false

  constructor(
    private container: HTMLElement,
    private options: LazyLoadOptions = {}
  ) {
    this.init()
  }

  private init() {
    const config = { ...DEFAULT_LAZY_CONFIG, ...this.options }

    this.observer = createLazyLoadObserver((entry) => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target as LazyImageElement)
        this.preloadNearbyImages(entry.target as LazyImageElement)
      }
    }, config)

    if (this.observer) {
      this.observeImages()
    }
  }

  private observeImages() {
    const images = this.container.querySelectorAll<LazyImageElement>(
      'img[data-src], [data-src]'
    )

    images.forEach(img => {
      if (this.observer) {
        this.observer.observe(img)
      }
    })
  }

  private loadImage(img: LazyImageElement) {
    const src = img.dataset.src
    if (!src || this.loadedImages.has(src)) return

    this.loadedImages.add(src)
    lazyLoadImage(img, this.options)

    if (this.options.triggerOnce !== false && this.observer) {
      this.observer.unobserve(img)
    }
  }

  private preloadNearbyImages(currentImg: LazyImageElement) {
    // Find nearby images to preload
    const allImages = Array.from(
      this.container.querySelectorAll<LazyImageElement>('img[data-src], [data-src]')
    )

    const currentIndex = allImages.indexOf(currentImg)
    const preloadRange = 2 // Preload 2 images before and after

    for (let i = Math.max(0, currentIndex - preloadRange);
         i <= Math.min(allImages.length - 1, currentIndex + preloadRange);
         i++) {
      const img = allImages[i]
      const src = img.dataset.src

      if (src && !this.loadedImages.has(src)) {
        this.preloadQueue.push(src)
      }
    }

    this.processPreloadQueue()
  }

  private async processPreloadQueue() {
    if (this.isPreloading || this.preloadQueue.length === 0) return

    this.isPreloading = true

    while (this.preloadQueue.length > 0) {
      const src = this.preloadQueue.shift()
      if (src && !this.loadedImages.has(src)) {
        await this.preloadImage(src)
        // Small delay to prevent blocking
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    }

    this.isPreloading = false
  }

  private preloadImage(src: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        this.loadedImages.add(src)
        resolve()
      }
      img.onerror = () => resolve() // Continue even if preload fails
      img.src = src
    })
  }

  public updateImages() {
    if (this.observer) {
      this.observeImages()
    }
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    this.loadedImages.clear()
    this.preloadQueue.length = 0
  }
}

/**
 * Virtual scrolling for large image galleries
 */
export class VirtualGallery {
  private itemHeight: number
  private bufferSize: number
  private visibleRange = { start: 0, end: 0 }

  constructor(
    private container: HTMLElement,
    private items: any[],
    itemHeight: number = 300,
    bufferSize: number = 5
  ) {
    this.itemHeight = itemHeight
    this.bufferSize = bufferSize
    this.init()
  }

  private init() {
    this.container.style.height = `${this.items.length * this.itemHeight}px`
    this.container.style.position = 'relative'
    this.updateVisibleItems()

    // Listen for scroll events
    const scrollContainer = this.getScrollContainer()
    scrollContainer.addEventListener('scroll', this.handleScroll.bind(this))
  }

  private getScrollContainer(): HTMLElement {
    let element = this.container.parentElement
    while (element) {
      const style = getComputedStyle(element)
      if (style.overflow === 'auto' || style.overflow === 'scroll') {
        return element
      }
      element = element.parentElement
    }
    return document.documentElement
  }

  private handleScroll() {
    requestAnimationFrame(() => {
      this.updateVisibleItems()
    })
  }

  private updateVisibleItems() {
    const scrollContainer = this.getScrollContainer()
    const scrollTop = scrollContainer.scrollTop
    const containerHeight = scrollContainer.clientHeight

    const startIndex = Math.floor(scrollTop / this.itemHeight) - this.bufferSize
    const endIndex = Math.ceil((scrollTop + containerHeight) / this.itemHeight) + this.bufferSize

    this.visibleRange = {
      start: Math.max(0, startIndex),
      end: Math.min(this.items.length - 1, endIndex)
    }

    this.renderVisibleItems()
  }

  private renderVisibleItems() {
    // This would be implemented with your specific rendering logic
    // The key is to only render items within visibleRange
    const event = new CustomEvent('virtualGalleryUpdate', {
      detail: { visibleRange: this.visibleRange, items: this.items }
    })
    this.container.dispatchEvent(event)
  }

  public getVisibleRange() {
    return this.visibleRange
  }

  public destroy() {
    const scrollContainer = this.getScrollContainer()
    scrollContainer.removeEventListener('scroll', this.handleScroll.bind(this))
  }
}

/**
 * Adaptive loading based on network conditions
 */
export function getAdaptiveLoadingConfig(): LazyLoadOptions {
  if (typeof navigator === 'undefined') {
    return DEFAULT_LAZY_CONFIG
  }

  // Check for reduced data preference
  if ('connection' in navigator) {
    const connection = (navigator as any).connection

    if (connection) {
      // Slow connection - more aggressive lazy loading
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        return {
          ...DEFAULT_LAZY_CONFIG,
          rootMargin: '10px',
          threshold: 0.5,
          fadeInDuration: 150
        }
      }

      // Fast connection - less aggressive lazy loading
      if (connection.effectiveType === '4g') {
        return {
          ...DEFAULT_LAZY_CONFIG,
          rootMargin: '100px',
          threshold: 0.1,
          fadeInDuration: 500
        }
      }
    }
  }

  return DEFAULT_LAZY_CONFIG
}