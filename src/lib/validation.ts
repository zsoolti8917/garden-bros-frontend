// Form validation utilities based on form schemas
// Implements validation rules from contracts/form-schema.json

export interface ContactFormData {
  name: string
  email: string
  phone: string
  serviceType: string
  message: string
  propertySize: string
  urgency: string
  preferredContact: string
  consent: boolean
  honeypot: string
}

export interface QuoteFormData {
  name: string
  email: string
  phone: string
  address: string
  serviceTypes: string[]
  projectDescription: string
  budget: string
  timeline: string
  propertyImages: string[]
  consent: boolean
  honeypot: string
}

export interface NewsletterFormData {
  email: string
  name: string
  interests: string[]
  consent: boolean
  honeypot: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Phone validation regex (matches form schema pattern)
const PHONE_REGEX = /^[+]?[1-9]?[0-9]{7,15}$/

// Validation messages (can be extended with i18n)
const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  consent: 'You must agree to continue',
  minItems: (min: number) => `Please select at least ${min} option${min > 1 ? 's' : ''}`,
  invalidChoice: 'Please select a valid option'
}

/**
 * Validates contact form data according to form schema
 */
export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: Record<string, string> = {}

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = VALIDATION_MESSAGES.required
  } else if (data.name.trim().length < 2) {
    errors.name = VALIDATION_MESSAGES.minLength(2)
  } else if (data.name.trim().length > 100) {
    errors.name = VALIDATION_MESSAGES.maxLength(100)
  }

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.email = VALIDATION_MESSAGES.required
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = VALIDATION_MESSAGES.email
  }

  // Phone validation (optional)
  if (data.phone && data.phone.trim().length > 0) {
    if (!PHONE_REGEX.test(data.phone.trim())) {
      errors.phone = VALIDATION_MESSAGES.phone
    }
  }

  // Service type validation
  const validServiceTypes = [
    'lawn-care',
    'garden-design',
    'tree-services',
    'maintenance',
    'consultation',
    'other'
  ]
  if (!data.serviceType || !validServiceTypes.includes(data.serviceType)) {
    errors.serviceType = VALIDATION_MESSAGES.required
  }

  // Message validation
  if (!data.message || data.message.trim().length === 0) {
    errors.message = VALIDATION_MESSAGES.required
  } else if (data.message.trim().length < 10) {
    errors.message = VALIDATION_MESSAGES.minLength(10)
  } else if (data.message.trim().length > 1000) {
    errors.message = VALIDATION_MESSAGES.maxLength(1000)
  }

  // Property size validation (optional)
  if (data.propertySize) {
    const validPropertySizes = ['small', 'medium', 'large', 'commercial']
    if (!validPropertySizes.includes(data.propertySize)) {
      errors.propertySize = VALIDATION_MESSAGES.invalidChoice
    }
  }

  // Urgency validation
  const validUrgencyLevels = ['low', 'medium', 'high', 'emergency']
  if (!data.urgency || !validUrgencyLevels.includes(data.urgency)) {
    errors.urgency = VALIDATION_MESSAGES.required
  }

  // Preferred contact validation
  const validContactMethods = ['email', 'phone', 'either']
  if (!data.preferredContact || !validContactMethods.includes(data.preferredContact)) {
    errors.preferredContact = VALIDATION_MESSAGES.required
  }

  // Consent validation
  if (!data.consent) {
    errors.consent = VALIDATION_MESSAGES.consent
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates quote form data according to form schema
 */
export function validateQuoteForm(data: QuoteFormData): ValidationResult {
  const errors: Record<string, string> = {}

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = VALIDATION_MESSAGES.required
  } else if (data.name.trim().length < 2) {
    errors.name = VALIDATION_MESSAGES.minLength(2)
  } else if (data.name.trim().length > 100) {
    errors.name = VALIDATION_MESSAGES.maxLength(100)
  }

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.email = VALIDATION_MESSAGES.required
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = VALIDATION_MESSAGES.email
  }

  // Phone validation (required for quotes)
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = VALIDATION_MESSAGES.required
  } else if (!PHONE_REGEX.test(data.phone.trim())) {
    errors.phone = VALIDATION_MESSAGES.phone
  }

  // Address validation
  if (!data.address || data.address.trim().length === 0) {
    errors.address = VALIDATION_MESSAGES.required
  } else if (data.address.trim().length < 10) {
    errors.address = VALIDATION_MESSAGES.minLength(10)
  } else if (data.address.trim().length > 200) {
    errors.address = VALIDATION_MESSAGES.maxLength(200)
  }

  // Service types validation
  const validServiceTypes = [
    'lawn-care',
    'garden-design',
    'tree-services',
    'maintenance',
    'landscaping',
    'irrigation'
  ]
  if (!data.serviceTypes || data.serviceTypes.length === 0) {
    errors.serviceTypes = VALIDATION_MESSAGES.minItems(1)
  } else if (data.serviceTypes.some(type => !validServiceTypes.includes(type))) {
    errors.serviceTypes = VALIDATION_MESSAGES.invalidChoice
  }

  // Project description validation
  if (!data.projectDescription || data.projectDescription.trim().length === 0) {
    errors.projectDescription = VALIDATION_MESSAGES.required
  } else if (data.projectDescription.trim().length < 20) {
    errors.projectDescription = VALIDATION_MESSAGES.minLength(20)
  } else if (data.projectDescription.trim().length > 2000) {
    errors.projectDescription = VALIDATION_MESSAGES.maxLength(2000)
  }

  // Budget validation (optional)
  if (data.budget) {
    const validBudgetRanges = [
      'under-1000',
      '1000-5000',
      '5000-10000',
      '10000-25000',
      '25000-plus',
      'discuss'
    ]
    if (!validBudgetRanges.includes(data.budget)) {
      errors.budget = VALIDATION_MESSAGES.invalidChoice
    }
  }

  // Timeline validation
  const validTimelines = ['asap', '1-month', '3-months', '6-months', 'flexible']
  if (!data.timeline || !validTimelines.includes(data.timeline)) {
    errors.timeline = VALIDATION_MESSAGES.required
  }

  // Property images validation (optional, max 10)
  if (data.propertyImages && data.propertyImages.length > 10) {
    errors.propertyImages = 'Maximum 10 images allowed'
  }

  // Consent validation
  if (!data.consent) {
    errors.consent = VALIDATION_MESSAGES.consent
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates newsletter form data according to form schema
 */
export function validateNewsletterForm(data: NewsletterFormData): ValidationResult {
  const errors: Record<string, string> = {}

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.email = VALIDATION_MESSAGES.required
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = VALIDATION_MESSAGES.email
  }

  // Name validation (optional)
  if (data.name && data.name.trim().length > 0) {
    if (data.name.trim().length < 2) {
      errors.name = VALIDATION_MESSAGES.minLength(2)
    } else if (data.name.trim().length > 100) {
      errors.name = VALIDATION_MESSAGES.maxLength(100)
    }
  }

  // Interests validation (optional)
  if (data.interests && data.interests.length > 0) {
    const validInterests = [
      'lawn-care',
      'garden-design',
      'seasonal-tips',
      'plant-care',
      'landscaping'
    ]
    if (data.interests.some(interest => !validInterests.includes(interest))) {
      errors.interests = VALIDATION_MESSAGES.invalidChoice
    }
  }

  // Consent validation
  if (!data.consent) {
    errors.consent = VALIDATION_MESSAGES.consent
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Sanitizes form input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .substring(0, 2000) // Limit length
}

/**
 * Validates file upload constraints
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Only image files are allowed' }
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' }
  }

  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  if (!allowedExtensions.includes(extension)) {
    return { valid: false, error: 'File type not supported' }
  }

  return { valid: true }
}

/**
 * Rate limiting helper for form submissions
 */
export class FormRateLimit {
  private submissions: Map<string, number[]> = new Map()
  private readonly maxSubmissions: number
  private readonly timeWindow: number // in milliseconds

  constructor(maxSubmissions = 3, timeWindowMinutes = 10) {
    this.maxSubmissions = maxSubmissions
    this.timeWindow = timeWindowMinutes * 60 * 1000
  }

  canSubmit(identifier: string): boolean {
    const now = Date.now()
    const userSubmissions = this.submissions.get(identifier) || []

    // Filter out old submissions
    const recentSubmissions = userSubmissions.filter(
      timestamp => now - timestamp < this.timeWindow
    )

    // Update the map
    this.submissions.set(identifier, recentSubmissions)

    return recentSubmissions.length < this.maxSubmissions
  }

  recordSubmission(identifier: string): void {
    const now = Date.now()
    const userSubmissions = this.submissions.get(identifier) || []
    userSubmissions.push(now)
    this.submissions.set(identifier, userSubmissions)
  }

  cleanup(): void {
    const now = Date.now()
    for (const [identifier, submissions] of this.submissions.entries()) {
      const recentSubmissions = submissions.filter(
        timestamp => now - timestamp < this.timeWindow
      )
      if (recentSubmissions.length === 0) {
        this.submissions.delete(identifier)
      } else {
        this.submissions.set(identifier, recentSubmissions)
      }
    }
  }
}

// Export a singleton rate limiter
export const formRateLimit = new FormRateLimit()

// Clean up rate limiter every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    formRateLimit.cleanup()
  }, 10 * 60 * 1000)
}