// Form submission utilities with error handling and fallback support

export interface SubmissionResult {
  success: boolean
  message: string
  type: 'success' | 'error' | 'maintenance'
}

export interface SubmissionOptions {
  formName: string
  data: Record<string, any>
  fallbackEndpoint?: string
  files?: File[]
}

/**
 * Submit form with fallback support and error handling
 */
export async function submitForm({
  formName,
  data,
  fallbackEndpoint,
  files = []
}: SubmissionOptions): Promise<SubmissionResult> {
  // Check for maintenance mode
  if (isMaintenanceMode()) {
    return {
      success: false,
      message: 'Forms are temporarily unavailable. Please try again later.',
      type: 'maintenance'
    }
  }

  try {
    // Try Netlify Forms first
    const netlifyResult = await submitToNetlify(formName, data, files)
    if (netlifyResult.success) {
      return netlifyResult
    }

    // If Netlify fails and fallback is available, try fallback
    if (fallbackEndpoint) {
      const fallbackResult = await submitToFallback(fallbackEndpoint, data)
      if (fallbackResult.success) {
        return {
          ...fallbackResult,
          message: fallbackResult.message + ' (Backup service used)'
        }
      }
    }

    // If both fail, return maintenance mode
    return {
      success: false,
      message: 'Forms are temporarily unavailable. Please try again later or contact us directly.',
      type: 'maintenance'
    }
  } catch (error) {
    console.error('Form submission error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      type: 'error'
    }
  }
}

/**
 * Submit to Netlify Forms
 */
async function submitToNetlify(
  formName: string,
  data: Record<string, any>,
  files: File[] = []
): Promise<SubmissionResult> {
  try {
    const formData = new FormData()
    formData.append('form-name', formName)

    // Add regular form fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'honeypot' && value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, value.join(', '))
        } else {
          formData.append(key, value.toString())
        }
      }
    })

    // Add files
    files.forEach((file, index) => {
      formData.append(`file${index}`, file)
    })

    const response = await fetch('/', {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      return {
        success: true,
        message: 'Thank you! Your submission has been received.',
        type: 'success'
      }
    } else if (response.status === 429) {
      return {
        success: false,
        message: 'Too many submissions. Please wait a moment and try again.',
        type: 'error'
      }
    } else {
      throw new Error(`Netlify Forms error: ${response.status}`)
    }
  } catch (error) {
    console.error('Netlify Forms submission failed:', error)
    throw error
  }
}

/**
 * Submit to fallback service (Formspree)
 */
async function submitToFallback(
  endpoint: string,
  data: Record<string, any>
): Promise<SubmissionResult> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      return {
        success: true,
        message: 'Thank you! Your submission has been received.',
        type: 'success'
      }
    } else if (response.status === 429) {
      return {
        success: false,
        message: 'Too many submissions. Please wait a moment and try again.',
        type: 'error'
      }
    } else {
      throw new Error(`Fallback service error: ${response.status}`)
    }
  } catch (error) {
    console.error('Fallback submission failed:', error)
    throw error
  }
}

/**
 * Check if the site is in maintenance mode
 */
function isMaintenanceMode(): boolean {
  // Check environment variable
  if (typeof window !== 'undefined') {
    return localStorage.getItem('maintenance-mode') === 'true'
  }
  return process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true'
}

/**
 * Enable maintenance mode
 */
export function enableMaintenanceMode(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('maintenance-mode', 'true')
  }
}

/**
 * Disable maintenance mode
 */
export function disableMaintenanceMode(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('maintenance-mode')
  }
}

/**
 * Rate limiting for form submissions
 */
class FormRateLimit {
  private attempts: Map<string, number[]> = new Map()
  private readonly maxAttempts = 5
  private readonly timeWindow = 15 * 60 * 1000 // 15 minutes

  canSubmit(identifier: string): boolean {
    const now = Date.now()
    const userAttempts = this.attempts.get(identifier) || []

    // Filter out old attempts
    const recentAttempts = userAttempts.filter(
      timestamp => now - timestamp < this.timeWindow
    )

    this.attempts.set(identifier, recentAttempts)
    return recentAttempts.length < this.maxAttempts
  }

  recordAttempt(identifier: string): void {
    const now = Date.now()
    const userAttempts = this.attempts.get(identifier) || []
    userAttempts.push(now)
    this.attempts.set(identifier, userAttempts)
  }

  getTimeUntilReset(identifier: string): number {
    const userAttempts = this.attempts.get(identifier) || []
    if (userAttempts.length === 0) return 0

    const oldestAttempt = Math.min(...userAttempts)
    const resetTime = oldestAttempt + this.timeWindow
    return Math.max(0, resetTime - Date.now())
  }
}

export const formRateLimit = new FormRateLimit()

/**
 * Validate form submission with rate limiting
 */
export function validateSubmission(
  formType: string,
  userIdentifier: string
): { canSubmit: boolean; message?: string; timeUntilReset?: number } {
  // Check rate limiting
  if (!formRateLimit.canSubmit(userIdentifier)) {
    const timeUntilReset = formRateLimit.getTimeUntilReset(userIdentifier)
    const minutesLeft = Math.ceil(timeUntilReset / (60 * 1000))

    return {
      canSubmit: false,
      message: `Too many submissions. Please wait ${minutesLeft} minutes before trying again.`,
      timeUntilReset
    }
  }

  // Check maintenance mode
  if (isMaintenanceMode()) {
    return {
      canSubmit: false,
      message: 'Forms are temporarily unavailable for maintenance. Please try again later.'
    }
  }

  return { canSubmit: true }
}

/**
 * Sanitize form data before submission
 */
export function sanitizeFormData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return
    }

    if (typeof value === 'string') {
      // Basic XSS prevention
      sanitized[key] = value
        .trim()
        .replace(/[<>]/g, '')
        .substring(0, 10000) // Limit length
    } else if (Array.isArray(value)) {
      sanitized[key] = value
        .filter(item => typeof item === 'string')
        .map(item => item.trim().replace(/[<>]/g, ''))
        .slice(0, 50) // Limit array size
    } else if (typeof value === 'boolean') {
      sanitized[key] = value
    } else {
      sanitized[key] = String(value).trim().substring(0, 1000)
    }
  })

  return sanitized
}

/**
 * Get user identifier for rate limiting
 */
export function getUserIdentifier(): string {
  if (typeof window === 'undefined') return 'server'

  // Use a combination of IP simulation and browser fingerprint
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx?.fillText('fingerprint', 2, 2)
  const fingerprint = canvas.toDataURL()

  return btoa(fingerprint).substring(0, 20)
}

/**
 * Log form submission for analytics
 */
export function logFormSubmission(
  formType: string,
  success: boolean,
  error?: string
): void {
  if (typeof window === 'undefined') return

  try {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Form submission:', {
        formType,
        success,
        error,
        timestamp: new Date().toISOString()
      })
    }

    // Could integrate with analytics service here
    // Example: gtag('event', 'form_submit', { form_type: formType, success })
  } catch (err) {
    console.error('Failed to log form submission:', err)
  }
}