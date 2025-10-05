'use client'

import React from 'react'

// Mobile responsiveness validation utilities

export interface MobileValidationConfig {
  enableValidation: boolean
  minTouchTargetSize: number
  reportViolations: boolean
  checkViewportMeta: boolean
  validateBreakpoints: boolean
}

export const DEFAULT_MOBILE_CONFIG: MobileValidationConfig = {
  enableValidation: process.env.NODE_ENV === 'development',
  minTouchTargetSize: 44, // 44px minimum per WCAG
  reportViolations: true,
  checkViewportMeta: true,
  validateBreakpoints: true
}

export interface TouchTargetViolation {
  element: Element
  actual: { width: number; height: number }
  required: number
  severity: 'error' | 'warning'
}

export interface ViewportIssue {
  type: 'missing' | 'incorrect' | 'insufficient-width'
  message: string
  severity: 'error' | 'warning'
}

/**
 * Mobile responsiveness validator
 */
export class MobileValidator {
  private config: MobileValidationConfig
  private touchTargetViolations: TouchTargetViolation[] = []
  private viewportIssues: ViewportIssue[] = []

  constructor(config: MobileValidationConfig = DEFAULT_MOBILE_CONFIG) {
    this.config = config
  }

  /**
   * Run comprehensive mobile validation
   */
  validateMobile(): {
    touchTargetViolations: TouchTargetViolation[]
    viewportIssues: ViewportIssue[]
    overall: 'pass' | 'warning' | 'fail'
  } {
    if (!this.config.enableValidation || typeof window === 'undefined') {
      return { touchTargetViolations: [], viewportIssues: [], overall: 'pass' }
    }

    this.touchTargetViolations = []
    this.viewportIssues = []

    // Run validations
    this.validateTouchTargets()
    this.validateViewportMeta()
    this.validateResponsiveDesign()

    // Determine overall status
    const hasErrors = this.touchTargetViolations.some(v => v.severity === 'error') ||
                     this.viewportIssues.some(v => v.severity === 'error')
    const hasWarnings = this.touchTargetViolations.some(v => v.severity === 'warning') ||
                       this.viewportIssues.some(v => v.severity === 'warning')

    const overall = hasErrors ? 'fail' : hasWarnings ? 'warning' : 'pass'

    // Report violations
    if (this.config.reportViolations) {
      this.reportViolations()
    }

    return {
      touchTargetViolations: this.touchTargetViolations,
      viewportIssues: this.viewportIssues,
      overall
    }
  }

  /**
   * Validate touch target sizes
   */
  private validateTouchTargets(): void {
    const interactiveElements = document.querySelectorAll([
      'a', 'button', 'input[type="button"]', 'input[type="submit"]',
      'input[type="reset"]', 'input[type="checkbox"]', 'input[type="radio"]',
      'select', 'textarea', '[role="button"]', '[role="link"]',
      '[role="checkbox"]', '[role="radio"]', '[tabindex]:not([tabindex="-1"])'
    ].join(', '))

    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect()
      const computedStyle = getComputedStyle(element)

      // Skip if element is hidden
      if (rect.width === 0 && rect.height === 0) return
      if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') return

      // Check minimum touch target size
      const minSize = this.config.minTouchTargetSize
      const width = Math.max(rect.width, parseFloat(computedStyle.minWidth) || 0)
      const height = Math.max(rect.height, parseFloat(computedStyle.minHeight) || 0)

      if (width < minSize || height < minSize) {
        // Determine severity based on how far below minimum
        const shortfall = Math.min(minSize - width, minSize - height)
        const severity = shortfall > 10 ? 'error' : 'warning'

        this.touchTargetViolations.push({
          element,
          actual: { width: Math.round(width), height: Math.round(height) },
          required: minSize,
          severity
        })
      }
    })
  }

  /**
   * Validate viewport meta tag
   */
  private validateViewportMeta(): void {
    if (!this.config.checkViewportMeta) return

    const viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement

    if (!viewportMeta) {
      this.viewportIssues.push({
        type: 'missing',
        message: 'Missing viewport meta tag',
        severity: 'error'
      })
      return
    }

    const content = viewportMeta.content
    if (!content) {
      this.viewportIssues.push({
        type: 'incorrect',
        message: 'Viewport meta tag has no content',
        severity: 'error'
      })
      return
    }

    // Check for required viewport properties
    const requiredProperties = ['width=device-width', 'initial-scale=1']
    const missingProperties = requiredProperties.filter(prop => !content.includes(prop))

    if (missingProperties.length > 0) {
      this.viewportIssues.push({
        type: 'incorrect',
        message: `Viewport meta missing: ${missingProperties.join(', ')}`,
        severity: 'warning'
      })
    }

    // Check for problematic properties
    if (content.includes('user-scalable=no')) {
      this.viewportIssues.push({
        type: 'incorrect',
        message: 'Viewport meta disables user scaling (accessibility issue)',
        severity: 'warning'
      })
    }

    if (content.includes('maximum-scale=1')) {
      this.viewportIssues.push({
        type: 'incorrect',
        message: 'Viewport meta limits maximum scale (accessibility issue)',
        severity: 'warning'
      })
    }
  }

  /**
   * Validate responsive design
   */
  private validateResponsiveDesign(): void {
    if (!this.config.validateBreakpoints) return

    const breakpoints = [
      { name: 'mobile', width: 360 },
      { name: 'tablet', width: 768 },
      { name: 'desktop', width: 1024 }
    ]

    // Check for horizontal scrollbars at different breakpoints
    const originalWidth = window.innerWidth
    const body = document.body
    const html = document.documentElement

    breakpoints.forEach(breakpoint => {
      // Simulate viewport width (simplified check)
      const scrollWidth = Math.max(
        body.scrollWidth,
        body.offsetWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth
      )

      if (scrollWidth > breakpoint.width + 20) { // 20px tolerance
        this.viewportIssues.push({
          type: 'insufficient-width',
          message: `Content overflows at ${breakpoint.name} breakpoint (${breakpoint.width}px)`,
          severity: 'warning'
        })
      }
    })
  }

  /**
   * Report validation violations
   */
  private reportViolations(): void {
    if (this.touchTargetViolations.length === 0 && this.viewportIssues.length === 0) {
      console.log('📱 Mobile validation: All checks passed!')
      return
    }

    console.group('📱 Mobile Responsiveness Validation')

    if (this.touchTargetViolations.length > 0) {
      console.group(`👆 Touch Target Issues (${this.touchTargetViolations.length})`)
      this.touchTargetViolations.forEach(violation => {
        const level = violation.severity === 'error' ? 'error' : 'warn'
        console[level](
          `Element ${violation.actual.width}x${violation.actual.height}px (required: ${violation.required}px)`,
          violation.element
        )
      })
      console.groupEnd()
    }

    if (this.viewportIssues.length > 0) {
      console.group(`📐 Viewport Issues (${this.viewportIssues.length})`)
      this.viewportIssues.forEach(issue => {
        const level = issue.severity === 'error' ? 'error' : 'warn'
        console[level](issue.message)
      })
      console.groupEnd()
    }

    console.groupEnd()
  }

  /**
   * Get validation results for programmatic access
   */
  getResults() {
    return {
      touchTargetViolations: [...this.touchTargetViolations],
      viewportIssues: [...this.viewportIssues]
    }
  }
}

/**
 * Mobile-specific utilities
 */
export class MobileUtils {
  /**
   * Detect if device is mobile
   */
  static isMobile(): boolean {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent)
  }

  /**
   * Detect if device supports touch
   */
  static isTouchDevice(): boolean {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  /**
   * Get current breakpoint
   */
  static getCurrentBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop'

    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  /**
   * Check if element is in viewport
   */
  static isInViewport(element: Element, threshold: number = 0): boolean {
    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    const windowWidth = window.innerWidth || document.documentElement.clientWidth

    return (
      rect.top + rect.height * threshold < windowHeight &&
      rect.bottom - rect.height * threshold > 0 &&
      rect.left + rect.width * threshold < windowWidth &&
      rect.right - rect.width * threshold > 0
    )
  }

  /**
   * Optimize touch interactions
   */
  static optimizeTouchInteractions(): void {
    if (typeof window === 'undefined') return

    // Add touch-action CSS for better touch performance
    const style = document.createElement('style')
    style.textContent = `
      /* Optimize touch scrolling */
      * {
        -webkit-overflow-scrolling: touch;
      }

      /* Prevent double-tap zoom on buttons and links */
      button, a, input[type="button"], input[type="submit"] {
        touch-action: manipulation;
      }

      /* Improve scroll performance */
      body {
        touch-action: pan-y;
      }

      /* Ensure minimum touch targets */
      button, a, input[type="button"], input[type="submit"],
      input[type="checkbox"], input[type="radio"] {
        min-height: 44px;
        min-width: 44px;
      }
    `
    document.head.appendChild(style)
  }

  /**
   * Setup responsive images for mobile
   */
  static setupResponsiveImages(): void {
    if (typeof window === 'undefined') return

    const images = document.querySelectorAll('img[data-src-mobile]')
    images.forEach(img => {
      const mobileImg = img as HTMLImageElement
      const mobileSrc = mobileImg.dataset.srcMobile
      const desktopSrc = mobileImg.src

      if (mobileSrc && this.isMobile()) {
        mobileImg.src = mobileSrc
      }
    })
  }
}

/**
 * React hook for mobile validation
 */
export function useMobileValidation(config?: Partial<MobileValidationConfig>) {
  const [validationResults, setValidationResults] = React.useState<{
    touchTargetViolations: TouchTargetViolation[]
    viewportIssues: ViewportIssue[]
    overall: 'pass' | 'warning' | 'fail'
  }>({ touchTargetViolations: [], viewportIssues: [], overall: 'pass' })

  React.useEffect(() => {
    const finalConfig = { ...DEFAULT_MOBILE_CONFIG, ...config }

    const runValidation = () => {
      const validator = new MobileValidator(finalConfig)
      const results = validator.validateMobile()
      setValidationResults(results)
    }

    // Run initial validation
    setTimeout(runValidation, 1000)

    // Re-run on resize
    let resizeTimeout: number
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(runValidation, 500)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [config])

  return validationResults
}

/**
 * Mobile-optimized component wrapper
 */
export function MobileOptimized({
  children,
  className = '',
  touchOptimized = true
}: {
  children: React.ReactNode
  className?: string
  touchOptimized?: boolean
}) {
  React.useEffect(() => {
    if (touchOptimized) {
      MobileUtils.optimizeTouchInteractions()
      MobileUtils.setupResponsiveImages()
    }
  }, [touchOptimized])

  const isMobile = typeof window !== 'undefined' && MobileUtils.isMobile()
  const isTouch = typeof window !== 'undefined' && MobileUtils.isTouchDevice()

  const mobileClasses = [
    className,
    isMobile ? 'mobile-optimized' : '',
    isTouch ? 'touch-optimized' : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={mobileClasses} data-mobile={isMobile} data-touch={isTouch}>
      {children}
    </div>
  )
}

/**
 * Responsive breakpoint utilities
 */
export const breakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  touch: '(hover: none) and (pointer: coarse)'
}

/**
 * Media query hook
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [query])

  return matches
}

/**
 * Responsive hook for different breakpoints
 */
export function useResponsive() {
  const isMobile = useMediaQuery(breakpoints.mobile)
  const isTablet = useMediaQuery(breakpoints.tablet)
  const isDesktop = useMediaQuery(breakpoints.desktop)
  const isTouch = useMediaQuery(breakpoints.touch)

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouch,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  }
}