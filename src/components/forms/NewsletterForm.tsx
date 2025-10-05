'use client'

import { useState } from 'react'
import type { Locale } from '@/types/content'
import { getTranslation, t } from '@/lib/i18n'
import { validateNewsletterForm, type NewsletterFormData } from '@/lib/validation'
import FormMessages from '@/components/ui/FormMessages'

interface NewsletterFormProps {
  locale: Locale
  compact?: boolean
}

export default function NewsletterForm({ locale, compact = false }: NewsletterFormProps) {
  const dict = getTranslation(locale)

  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    name: '',
    interests: [],
    consent: false,
    honeypot: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'maintenance'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check
    if (formData.honeypot) {
      return // Silent fail for spam
    }

    // Validate form
    const validation = validateNewsletterForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Try Netlify Forms first
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'newsletter',
          ...Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [
              key,
              key === 'interests'
                ? value.join(', ')
                : typeof value === 'boolean'
                ? value.toString()
                : value
            ])
          )
        }).toString()
      })

      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage(t(dict, 'forms.newsletter.success'))

        // Reset form
        setFormData({
          email: '',
          name: '',
          interests: [],
          consent: false,
          honeypot: ''
        })
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      // Fallback to Formspree
      try {
        const fallbackResponse = await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_NEWSLETTER_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })

        if (fallbackResponse.ok) {
          setSubmitStatus('success')
          setSubmitMessage(t(dict, 'forms.newsletter.success'))
        } else {
          throw new Error('Fallback submission failed')
        }
      } catch (fallbackError) {
        setSubmitStatus('maintenance')
        setSubmitMessage(t(dict, 'forms.newsletter.maintenance'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <FormMessages
        type="success"
        title={t(dict, 'forms.newsletter.successTitle')}
        message={submitMessage}
        onRetry={() => setSubmitStatus('idle')}
        locale={locale}
        compact={compact}
      />
    )
  }

  if (submitStatus === 'maintenance') {
    return (
      <FormMessages
        type="maintenance"
        title={t(dict, 'forms.newsletter.maintenanceTitle')}
        message={submitMessage}
        onRetry={() => setSubmitStatus('idle')}
        locale={locale}
        compact={compact}
      />
    )
  }

  if (compact) {
    // Compact inline form
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" noValidate>
        {/* Honeypot field */}
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleInputChange}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="flex-1">
          <label htmlFor="email" className="sr-only">
            {t(dict, 'forms.newsletter.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus-ring ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={t(dict, 'forms.newsletter.emailPlaceholder')}
            required
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-lg font-medium transition-colors focus-ring whitespace-nowrap ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t(dict, 'forms.newsletter.subscribing')}
            </span>
          ) : (
            t(dict, 'forms.newsletter.subscribe')
          )}
        </button>

        {/* Hidden fields for compact form */}
        <input type="hidden" name="form-name" value="newsletter" />
        <input type="hidden" name="consent" value="true" />
      </form>
    )
  }

  // Full form
  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot field */}
      <input
        type="text"
        name="honeypot"
        value={formData.honeypot}
        onChange={handleInputChange}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          {t(dict, 'forms.newsletter.email')} *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus-ring ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={t(dict, 'forms.newsletter.emailPlaceholder')}
          required
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      {/* Name (optional) */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          {t(dict, 'forms.newsletter.name')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-ring"
          placeholder={t(dict, 'forms.newsletter.namePlaceholder')}
        />
      </div>

      {/* Interests */}
      <div>
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-3">
            {t(dict, 'forms.newsletter.interests')}
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'lawn-care',
              'garden-design',
              'seasonal-tips',
              'plant-care',
              'landscaping'
            ].map(interest => (
              <label key={interest} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.interests.includes(interest)}
                  onChange={(e) => handleInterestChange(interest, e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus-ring border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  {t(dict, `forms.newsletter.interestOptions.${interest}`)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Consent */}
      <div>
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleInputChange}
            className={`mt-1 h-4 w-4 text-primary-600 focus-ring border-gray-300 rounded ${
              errors.consent ? 'border-red-300' : ''
            }`}
            required
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <span className="text-sm text-gray-700">
            {t(dict, 'forms.newsletter.consent')} *
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-1 text-sm text-red-600">
            {errors.consent}
          </p>
        )}
      </div>

      {/* Newsletter Benefits */}
      <div className="bg-primary-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-primary-900 mb-2">
          {t(dict, 'forms.newsletter.benefitsTitle')}
        </h4>
        <ul className="text-sm text-primary-800 space-y-1">
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {t(dict, 'forms.newsletter.benefit1')}
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {t(dict, 'forms.newsletter.benefit2')}
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {t(dict, 'forms.newsletter.benefit3')}
          </li>
        </ul>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors focus-ring ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t(dict, 'forms.newsletter.subscribing')}
          </span>
        ) : (
          t(dict, 'forms.newsletter.subscribe')
        )}
      </button>

      {/* Privacy Notice */}
      <p className="text-xs text-gray-500 text-center">
        {t(dict, 'forms.newsletter.privacy')}
      </p>

      {/* Hidden Netlify form field */}
      <input type="hidden" name="form-name" value="newsletter" />
    </form>
  )
}