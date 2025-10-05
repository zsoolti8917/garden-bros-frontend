'use client'

import React, { useEffect } from 'react'
import {
  MobileValidator,
  MobileUtils,
  useMobileValidation,
  useResponsive,
  MobileOptimized,
  DEFAULT_MOBILE_CONFIG,
  type MobileValidationConfig,
  type TouchTargetViolation,
  type ViewportIssue
} from '@/lib/mobile-validation'

interface MobileValidatorComponentProps {
  config?: Partial<MobileValidationConfig>
  enableOptimizations?: boolean
}

export default function MobileValidatorComponent({
  config,
  enableOptimizations = true
}: MobileValidatorComponentProps) {
  // Use mobile validation hook
  const validationResults = useMobileValidation(config)
  const responsive = useResponsive()

  useEffect(() => {
    if (enableOptimizations) {
      // Apply mobile optimizations
      MobileUtils.optimizeTouchInteractions()
      MobileUtils.setupResponsiveImages()

      // Log current device info in development
      if (process.env.NODE_ENV === 'development') {
        console.group('📱 Mobile Device Info')
        console.log('Is Mobile:', MobileUtils.isMobile())
        console.log('Is Touch Device:', MobileUtils.isTouchDevice())
        console.log('Current Breakpoint:', MobileUtils.getCurrentBreakpoint())
        console.log('Responsive State:', responsive)
        console.groupEnd()
      }
    }
  }, [enableOptimizations, responsive])

  // This component doesn't render anything
  return null
}

/**
 * Mobile validation debugger for development
 */
export function MobileValidationDebugger() {
  const [isVisible, setIsVisible] = React.useState(false)
  const [validationResults, setValidationResults] = React.useState<{
    touchTargetViolations: TouchTargetViolation[]
    viewportIssues: ViewportIssue[]
    overall: 'pass' | 'warning' | 'fail'
  }>({ touchTargetViolations: [], viewportIssues: [], overall: 'pass' })

  const responsive = useResponsive()

  const runValidation = React.useCallback(() => {
    const validator = new MobileValidator()
    const results = validator.validateMobile()
    setValidationResults(results)
  }, [])

  useEffect(() => {
    // Run initial validation
    setTimeout(runValidation, 1000)

    // Re-run on window resize
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
  }, [runValidation])

  if (process.env.NODE_ENV !== 'development') return null

  const { touchTargetViolations, viewportIssues, overall } = validationResults

  const statusColor = {
    pass: 'text-green-400',
    warning: 'text-yellow-400',
    fail: 'text-red-400'
  }[overall]

  const statusIcon = {
    pass: '✅',
    warning: '⚠️',
    fail: '❌'
  }[overall]

  return (
    <>
      {/* Floating mobile validation button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-20 left-4 z-50 bg-pink-600 text-white p-2 rounded-full shadow-lg hover:bg-pink-700 transition-colors"
        style={{ fontSize: '12px' }}
        aria-label="Toggle mobile validation debugger"
      >
        📱
      </button>

      {/* Debug panel */}
      {isVisible && (
        <div className="fixed bottom-32 left-4 z-50 bg-black/90 text-white p-4 rounded-lg shadow-xl max-w-sm max-h-96 overflow-y-auto">
          <h3 className="text-sm font-bold mb-2">Mobile Validation</h3>

          {/* Overall status */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span>{statusIcon}</span>
              <span className={`text-sm font-medium ${statusColor}`}>
                {overall.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Device info */}
          <div className="mb-3 text-xs">
            <div className="mb-1 font-semibold">Device Info:</div>
            <div>Breakpoint: {responsive.breakpoint}</div>
            <div>Mobile: {MobileUtils.isMobile() ? 'Yes' : 'No'}</div>
            <div>Touch: {responsive.isTouch ? 'Yes' : 'No'}</div>
            <div>Screen: {window.innerWidth}x{window.innerHeight}</div>
          </div>

          {/* Touch target violations */}
          {touchTargetViolations.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-semibold mb-1">
                Touch Target Issues ({touchTargetViolations.length}):
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {touchTargetViolations.slice(0, 3).map((violation, index) => (
                  <div key={index} className="text-xs">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      violation.severity === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-gray-300">
                      {violation.actual.width}x{violation.actual.height}px
                      (req: {violation.required}px)
                    </span>
                  </div>
                ))}
                {touchTargetViolations.length > 3 && (
                  <div className="text-xs text-gray-400">
                    +{touchTargetViolations.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Viewport issues */}
          {viewportIssues.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-semibold mb-1">
                Viewport Issues ({viewportIssues.length}):
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {viewportIssues.slice(0, 3).map((issue, index) => (
                  <div key={index} className="text-xs">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      issue.severity === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-gray-300">{issue.message}</span>
                  </div>
                ))}
                {viewportIssues.length > 3 && (
                  <div className="text-xs text-gray-400">
                    +{viewportIssues.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 border-t border-gray-600">
            <button
              onClick={runValidation}
              className="text-xs bg-pink-600 px-2 py-1 rounded hover:bg-pink-700 mr-2"
            >
              Re-validate
            </button>
            <button
              onClick={() => {
                const violations = touchTargetViolations.map(v => ({
                  element: v.element.tagName,
                  size: `${v.actual.width}x${v.actual.height}`,
                  required: v.required
                }))
                console.log('Touch Target Violations:', violations)
                console.log('Viewport Issues:', viewportIssues)
              }}
              className="text-xs bg-gray-600 px-2 py-1 rounded hover:bg-gray-700"
            >
              Log Details
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Responsive container component
 */
export function ResponsiveContainer({
  children,
  className = '',
  maxWidth = '1200px'
}: {
  children: React.ReactNode
  className?: string
  maxWidth?: string
}) {
  const responsive = useResponsive()

  const containerClasses = [
    'mx-auto px-4',
    responsive.isMobile ? 'px-4' : responsive.isTablet ? 'px-6' : 'px-8',
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      className={containerClasses}
      style={{ maxWidth }}
      data-breakpoint={responsive.breakpoint}
    >
      {children}
    </div>
  )
}

/**
 * Touch-optimized button component
 */
export function TouchButton({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  ...props
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  className?: string
  [key: string]: any
}) {
  const responsive = useResponsive()

  // Ensure minimum touch target size
  const touchOptimizedSize = responsive.isTouch ? 'large' : size

  const sizeClasses = {
    small: 'px-3 py-2 text-sm min-h-[36px] min-w-[36px]',
    medium: 'px-4 py-3 text-base min-h-[44px] min-w-[44px]',
    large: 'px-6 py-4 text-lg min-h-[48px] min-w-[48px]'
  }

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100'
  }

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'

  const touchClasses = responsive.isTouch ? 'touch-action-manipulation select-none' : ''

  const allClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[touchOptimizedSize],
    touchClasses,
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      className={allClasses}
      onClick={onClick}
      disabled={disabled}
      style={{
        // Ensure touch targets are properly sized
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent'
      }}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Mobile-optimized layout component
 */
export function MobileLayout({
  children,
  header,
  footer,
  sidebar
}: {
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  sidebar?: React.ReactNode
}) {
  const responsive = useResponsive()

  if (responsive.isMobile) {
    // Mobile: Stack layout
    return (
      <div className="flex flex-col min-h-screen">
        {header && <header className="flex-shrink-0">{header}</header>}
        <main className="flex-1 flex flex-col">
          <div className="flex-1">{children}</div>
          {sidebar && (
            <aside className="border-t border-gray-200 bg-gray-50 p-4">
              {sidebar}
            </aside>
          )}
        </main>
        {footer && <footer className="flex-shrink-0">{footer}</footer>}
      </div>
    )
  }

  // Desktop/Tablet: Side-by-side layout
  return (
    <div className="flex flex-col min-h-screen">
      {header && <header className="flex-shrink-0">{header}</header>}
      <div className="flex-1 flex">
        <main className="flex-1">{children}</main>
        {sidebar && (
          <aside className="w-64 border-l border-gray-200 bg-gray-50 p-4">
            {sidebar}
          </aside>
        )}
      </div>
      {footer && <footer className="flex-shrink-0">{footer}</footer>}
    </div>
  )
}

// Export the main component as default
export { MobileOptimized }