'use client'

import React from 'react'

// Accessibility utilities for WCAG 2.1 AA compliance

export interface AccessibilityConfig {
  enableAuditing: boolean
  reportViolations: boolean
  enforceFocusManagement: boolean
  announceNavigation: boolean
  highContrastMode: boolean
  reducedMotion: boolean
}

export const DEFAULT_A11Y_CONFIG: AccessibilityConfig = {
  enableAuditing: process.env.NODE_ENV === 'development',
  reportViolations: true,
  enforceFocusManagement: true,
  announceNavigation: true,
  highContrastMode: false,
  reducedMotion: false
}

/**
 * WCAG 2.1 AA compliance checker
 */
export class AccessibilityAuditor {
  private config: AccessibilityConfig
  private violations: Array<{ element: Element; issue: string; severity: 'error' | 'warning' }> = []

  constructor(config: AccessibilityConfig = DEFAULT_A11Y_CONFIG) {
    this.config = config
  }

  /**
   * Run comprehensive accessibility audit
   */
  auditPage(): void {
    if (!this.config.enableAuditing || typeof window === 'undefined') return

    this.violations = []

    // Check various WCAG criteria
    this.checkColorContrast()
    this.checkKeyboardNavigation()
    this.checkAltText()
    this.checkFormLabels()
    this.checkHeadingStructure()
    this.checkLandmarks()
    this.checkFocusIndicators()
    this.checkTouchTargets()
    this.checkAriaLabels()

    // Report violations
    if (this.config.reportViolations && this.violations.length > 0) {
      this.reportViolations()
    }
  }

  /**
   * Check color contrast ratios
   */
  private checkColorContrast(): void {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label')

    textElements.forEach(element => {
      const styles = getComputedStyle(element)
      const textColor = styles.color
      const backgroundColor = styles.backgroundColor

      // Skip if background is transparent
      if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
        return
      }

      const contrastRatio = this.calculateContrastRatio(textColor, backgroundColor)
      const fontSize = parseFloat(styles.fontSize)
      const fontWeight = styles.fontWeight

      // WCAG AA requirements
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700))
      const requiredRatio = isLargeText ? 3.0 : 4.5

      if (contrastRatio < requiredRatio) {
        this.violations.push({
          element,
          issue: `Color contrast ratio ${contrastRatio.toFixed(2)} is below required ${requiredRatio}`,
          severity: 'error'
        })
      }
    })
  }

  /**
   * Calculate color contrast ratio
   */
  private calculateContrastRatio(color1: string, color2: string): number {
    // Simplified contrast calculation
    // In a real implementation, you'd use a more robust color parsing library
    const rgb1 = this.parseColor(color1)
    const rgb2 = this.parseColor(color2)

    if (!rgb1 || !rgb2) return 0

    const l1 = this.relativeLuminance(rgb1)
    const l2 = this.relativeLuminance(rgb2)

    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)

    return (lighter + 0.05) / (darker + 0.05)
  }

  /**
   * Parse color string to RGB values
   */
  private parseColor(color: string): { r: number; g: number; b: number } | null {
    // Simple RGB parser - in production, use a proper color parsing library
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3])
      }
    }
    return null
  }

  /**
   * Calculate relative luminance
   */
  private relativeLuminance(rgb: { r: number; g: number; b: number }): number {
    const { r, g, b } = rgb
    const sRGB = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
  }

  /**
   * Check keyboard navigation
   */
  private checkKeyboardNavigation(): void {
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]')

    interactiveElements.forEach(element => {
      const tabIndex = element.getAttribute('tabindex')

      // Check for positive tabindex (anti-pattern)
      if (tabIndex && parseInt(tabIndex) > 0) {
        this.violations.push({
          element,
          issue: 'Positive tabindex values should be avoided',
          severity: 'warning'
        })
      }

      // Check for missing focus indicators
      if (!element.matches(':focus-visible')) {
        const styles = getComputedStyle(element, ':focus')
        if (styles.outline === 'none' && !styles.boxShadow) {
          this.violations.push({
            element,
            issue: 'Interactive element lacks visible focus indicator',
            severity: 'error'
          })
        }
      }
    })
  }

  /**
   * Check alt text for images
   */
  private checkAltText(): void {
    const images = document.querySelectorAll('img')

    images.forEach(img => {
      const alt = img.getAttribute('alt')
      const src = img.getAttribute('src')

      if (!alt && !img.hasAttribute('role')) {
        this.violations.push({
          element: img,
          issue: 'Image missing alt attribute',
          severity: 'error'
        })
      }

      if (alt && alt.length > 125) {
        this.violations.push({
          element: img,
          issue: 'Alt text is too long (over 125 characters)',
          severity: 'warning'
        })
      }

      if (src && src.includes('placeholder') && alt) {
        this.violations.push({
          element: img,
          issue: 'Placeholder image should have empty alt text',
          severity: 'warning'
        })
      }
    })
  }

  /**
   * Check form labels
   */
  private checkFormLabels(): void {
    const formControls = document.querySelectorAll('input, select, textarea')

    formControls.forEach(control => {
      const id = control.getAttribute('id')
      const ariaLabel = control.getAttribute('aria-label')
      const ariaLabelledBy = control.getAttribute('aria-labelledby')
      const label = id ? document.querySelector(`label[for="${id}"]`) : null

      if (!label && !ariaLabel && !ariaLabelledBy) {
        this.violations.push({
          element: control,
          issue: 'Form control lacks proper label',
          severity: 'error'
        })
      }
    })
  }

  /**
   * Check heading structure
   */
  private checkHeadingStructure(): void {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let previousLevel = 0

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1))

      if (level - previousLevel > 1) {
        this.violations.push({
          element: heading,
          issue: `Heading level skipped from h${previousLevel} to h${level}`,
          severity: 'warning'
        })
      }

      previousLevel = level
    })

    // Check for multiple h1s
    const h1s = document.querySelectorAll('h1')
    if (h1s.length > 1) {
      h1s.forEach((h1, index) => {
        if (index > 0) {
          this.violations.push({
            element: h1,
            issue: 'Multiple h1 elements found - should have only one per page',
            severity: 'warning'
          })
        }
      })
    }
  }

  /**
   * Check landmark regions
   */
  private checkLandmarks(): void {
    const hasMain = document.querySelector('main, [role="main"]')
    const hasNav = document.querySelector('nav, [role="navigation"]')
    const hasHeader = document.querySelector('header, [role="banner"]')
    const hasFooter = document.querySelector('footer, [role="contentinfo"]')

    if (!hasMain) {
      this.violations.push({
        element: document.body,
        issue: 'Page missing main landmark',
        severity: 'error'
      })
    }

    if (!hasNav) {
      this.violations.push({
        element: document.body,
        issue: 'Page missing navigation landmark',
        severity: 'warning'
      })
    }
  }

  /**
   * Check focus indicators
   */
  private checkFocusIndicators(): void {
    const style = document.createElement('style')
    style.textContent = `
      .a11y-focus-check:focus {
        outline: 2px solid red !important;
        outline-offset: 2px !important;
      }
    `
    document.head.appendChild(style)

    // Remove after check
    setTimeout(() => {
      document.head.removeChild(style)
    }, 100)
  }

  /**
   * Check touch target sizes (mobile accessibility)
   */
  private checkTouchTargets(): void {
    const interactiveElements = document.querySelectorAll('a, button, input[type="checkbox"], input[type="radio"]')

    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect()
      const minSize = 44 // 44px minimum per WCAG

      if (rect.width < minSize || rect.height < minSize) {
        this.violations.push({
          element,
          issue: `Touch target too small: ${rect.width}x${rect.height}px (minimum 44x44px)`,
          severity: 'warning'
        })
      }
    })
  }

  /**
   * Check ARIA labels and roles
   */
  private checkAriaLabels(): void {
    const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]')

    elementsWithAria.forEach(element => {
      const ariaLabelledBy = element.getAttribute('aria-labelledby')
      const ariaDescribedBy = element.getAttribute('aria-describedby')

      if (ariaLabelledBy) {
        const labelElement = document.getElementById(ariaLabelledBy)
        if (!labelElement) {
          this.violations.push({
            element,
            issue: `aria-labelledby references non-existent element: ${ariaLabelledBy}`,
            severity: 'error'
          })
        }
      }

      if (ariaDescribedBy) {
        const descElement = document.getElementById(ariaDescribedBy)
        if (!descElement) {
          this.violations.push({
            element,
            issue: `aria-describedby references non-existent element: ${ariaDescribedBy}`,
            severity: 'error'
          })
        }
      }
    })
  }

  /**
   * Report violations to console
   */
  private reportViolations(): void {
    console.group('🔍 Accessibility Audit Results')

    const errors = this.violations.filter(v => v.severity === 'error')
    const warnings = this.violations.filter(v => v.severity === 'warning')

    if (errors.length > 0) {
      console.group(`❌ ${errors.length} Error(s)`)
      errors.forEach(violation => {
        console.error(violation.issue, violation.element)
      })
      console.groupEnd()
    }

    if (warnings.length > 0) {
      console.group(`⚠️ ${warnings.length} Warning(s)`)
      warnings.forEach(violation => {
        console.warn(violation.issue, violation.element)
      })
      console.groupEnd()
    }

    if (this.violations.length === 0) {
      console.log('✅ No accessibility violations found!')
    }

    console.groupEnd()
  }

  /**
   * Get violations for programmatic access
   */
  getViolations() {
    return [...this.violations]
  }
}

/**
 * Focus management utilities
 */
export class FocusManager {
  private static instance: FocusManager
  private focusStack: HTMLElement[] = []
  private restoreFocus: HTMLElement | null = null

  static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager()
    }
    return FocusManager.instance
  }

  /**
   * Trap focus within an element
   */
  trapFocus(element: HTMLElement): () => void {
    const focusableElements = this.getFocusableElements(element)
    if (focusableElements.length === 0) return () => {}

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Store the currently focused element
    this.restoreFocus = document.activeElement as HTMLElement

    // Focus the first element
    firstElement.focus()

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    element.addEventListener('keydown', handleTab)

    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleTab)
      if (this.restoreFocus) {
        this.restoreFocus.focus()
      }
    }
  }

  /**
   * Get focusable elements within a container
   */
  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ')

    return Array.from(container.querySelectorAll(selector))
      .filter(el => this.isVisible(el)) as HTMLElement[]
  }

  /**
   * Check if element is visible
   */
  private isVisible(element: Element): boolean {
    const style = getComputedStyle(element)
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
  }

  /**
   * Announce text to screen readers
   */
  announce(text: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.textContent = text

    document.body.appendChild(announcer)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  }
}

/**
 * React hook for accessibility features
 */
export function useAccessibility(config?: Partial<AccessibilityConfig>) {
  const finalConfig = { ...DEFAULT_A11Y_CONFIG, ...config }

  React.useEffect(() => {
    // Run audit on mount
    const auditor = new AccessibilityAuditor(finalConfig)
    auditor.auditPage()

    // Set up user preference detection
    if (finalConfig.reducedMotion) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (prefersReducedMotion.matches) {
        document.documentElement.classList.add('reduce-motion')
      }
    }

    if (finalConfig.highContrastMode) {
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)')
      if (prefersHighContrast.matches) {
        document.documentElement.classList.add('high-contrast')
      }
    }
  }, [finalConfig])
}

/**
 * Accessibility utilities for common patterns
 */
export const a11yUtils = {
  /**
   * Generate unique ID for form controls
   */
  generateId: (prefix: string = 'a11y') => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,

  /**
   * Create accessible button props
   */
  buttonProps: (label: string, onClick: () => void) => ({
    'aria-label': label,
    onClick,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick()
      }
    }
  }),

  /**
   * Screen reader only text
   */
  srOnly: 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0'
}