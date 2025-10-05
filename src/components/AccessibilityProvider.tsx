'use client'

import React, { useEffect } from 'react'
import {
  AccessibilityAuditor,
  FocusManager,
  useAccessibility,
  DEFAULT_A11Y_CONFIG,
  type AccessibilityConfig
} from '@/lib/accessibility'

interface AccessibilityProviderProps {
  children: React.ReactNode
  config?: Partial<AccessibilityConfig>
  enableAudit?: boolean
}

export default function AccessibilityProvider({
  children,
  config,
  enableAudit = process.env.NODE_ENV === 'development'
}: AccessibilityProviderProps) {
  const finalConfig = { ...DEFAULT_A11Y_CONFIG, ...config, enableAuditing: enableAudit }

  // Use accessibility hook
  useAccessibility(finalConfig)

  useEffect(() => {
    // Run accessibility audit after component mount
    if (enableAudit) {
      setTimeout(() => {
        const auditor = new AccessibilityAuditor(finalConfig)
        auditor.auditPage()
      }, 1000) // Wait for page to fully render
    }

    // Set up global keyboard navigation
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      // Skip to main content (common accessibility pattern)
      if (e.altKey && e.key === 'm') {
        e.preventDefault()
        const main = document.querySelector('main, [role="main"]') as HTMLElement
        if (main) {
          main.focus()
          main.scrollIntoView({ behavior: 'smooth' })
        }
      }

      // Skip to navigation
      if (e.altKey && e.key === 'n') {
        e.preventDefault()
        const nav = document.querySelector('nav, [role="navigation"]') as HTMLElement
        if (nav) {
          const firstLink = nav.querySelector('a, button') as HTMLElement
          if (firstLink) {
            firstLink.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeydown)

    return () => {
      document.removeEventListener('keydown', handleGlobalKeydown)
    }
  }, [enableAudit, finalConfig])

  return (
    <>
      {/* Skip links for keyboard navigation */}
      <div className="sr-only focus:not-sr-only">
        <a
          href="#main-content"
          className="fixed top-0 left-0 z-50 p-2 bg-blue-600 text-white rounded focus:relative focus:z-auto"
        >
          Skip to main content
        </a>
        <a
          href="#navigation"
          className="fixed top-0 left-20 z-50 p-2 bg-blue-600 text-white rounded focus:relative focus:z-auto"
        >
          Skip to navigation
        </a>
      </div>

      {/* ARIA live regions for announcements */}
      <div
        id="aria-live-polite"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <div
        id="aria-live-assertive"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />

      {children}

      {/* Accessibility debugging in development */}
      {enableAudit && <AccessibilityDebugger />}
    </>
  )
}

/**
 * Accessibility debugging component
 */
function AccessibilityDebugger() {
  const [violations, setViolations] = React.useState<any[]>([])
  const [isVisible, setIsVisible] = React.useState(false)

  const runAudit = React.useCallback(() => {
    const auditor = new AccessibilityAuditor()
    auditor.auditPage()
    setViolations(auditor.getViolations())
  }, [])

  useEffect(() => {
    // Run initial audit
    setTimeout(runAudit, 1000)

    // Re-run audit when DOM changes
    const observer = new MutationObserver(() => {
      clearTimeout(window.a11yAuditTimeout)
      window.a11yAuditTimeout = setTimeout(runAudit, 500)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    })

    return () => {
      observer.disconnect()
      clearTimeout(window.a11yAuditTimeout)
    }
  }, [runAudit])

  if (process.env.NODE_ENV !== 'development') return null

  const errors = violations.filter(v => v.severity === 'error')
  const warnings = violations.filter(v => v.severity === 'warning')

  return (
    <>
      {/* Floating accessibility button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        style={{ fontSize: '12px' }}
        aria-label="Toggle accessibility debugger"
      >
        ♿
      </button>

      {/* Debug panel */}
      {isVisible && (
        <div className="fixed bottom-16 left-4 z-50 bg-black/90 text-white p-4 rounded-lg shadow-xl max-w-sm max-h-96 overflow-y-auto">
          <h3 className="text-sm font-bold mb-2">Accessibility Audit</h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Errors:</span>
              <span className={errors.length > 0 ? 'text-red-400' : 'text-green-400'}>
                {errors.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Warnings:</span>
              <span className={warnings.length > 0 ? 'text-yellow-400' : 'text-green-400'}>
                {warnings.length}
              </span>
            </div>
          </div>

          {violations.length > 0 && (
            <div className="mt-3 pt-2 border-t border-gray-600">
              <h4 className="text-xs font-semibold mb-1">Issues:</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {violations.slice(0, 5).map((violation, index) => (
                  <div key={index} className="text-xs">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      violation.severity === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-gray-300">{violation.issue}</span>
                  </div>
                ))}
                {violations.length > 5 && (
                  <div className="text-xs text-gray-400">
                    +{violations.length - 5} more issues
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-3 pt-2 border-t border-gray-600">
            <button
              onClick={runAudit}
              className="text-xs bg-purple-600 px-2 py-1 rounded hover:bg-purple-700"
            >
              Re-run Audit
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Accessibility-enhanced button component
 */
export function AccessibleButton({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
  [key: string]: any
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  }

  const sizeClasses = {
    small: 'px-3 py-2 text-sm min-h-[36px]',
    medium: 'px-4 py-2 text-base min-h-[44px]',
    large: 'px-6 py-3 text-lg min-h-[48px]'
  }

  const disabledClasses = 'opacity-50 cursor-not-allowed'

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled || loading ? disabledClasses : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {loading && <span className="sr-only">Loading...</span>}
      {children}
    </button>
  )
}

/**
 * Accessibility-enhanced form field component
 */
export function AccessibleFormField({
  label,
  error,
  required = false,
  children,
  helpText,
  id
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactElement
  helpText?: string
  id?: string
}) {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`
  const errorId = `${fieldId}-error`
  const helpId = `${fieldId}-help`

  const enhancedChild = React.cloneElement(children, {
    id: fieldId,
    'aria-describedby': [
      error ? errorId : '',
      helpText ? helpId : '',
      children.props['aria-describedby']
    ].filter(Boolean).join(' '),
    'aria-invalid': error ? 'true' : undefined,
    'aria-required': required ? 'true' : undefined
  })

  return (
    <div className="space-y-1">
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </label>

      {enhancedChild}

      {helpText && (
        <p id={helpId} className="text-sm text-gray-500">
          {helpText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}

// Extend window type for TypeScript
declare global {
  interface Window {
    a11yAuditTimeout: number
  }
}