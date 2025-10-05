'use client'

import { useState } from 'react'
import type { Locale } from '@/types/content'
import { getTranslation, t } from '@/lib/i18n'
import { validateContactForm, type ContactFormData } from '@/lib/validation'
import FormMessages from '@/components/ui/FormMessages'

interface ContactFormProps {
  locale: Locale
  preselectedService?: string
}

export default function ContactForm({ locale, preselectedService }: ContactFormProps) {
  const dict = getTranslation(locale)
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    serviceType: preselectedService || 'consultation',
    message: '',
    propertySize: '',
    urgency: 'medium',
    preferredContact: 'either',
    consent: false,
    honeypot: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'maintenance'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check
    if (formData.honeypot) {
      return // Silent fail for spam
    }

    // Validate form
    const validation = validateContactForm(formData)
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
          'form-name': 'contact',
          ...Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [
              key,
              typeof value === 'boolean' ? value.toString() : value
            ])
          )
        }).toString()
      })

      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage(t(dict, 'forms.contact.success'))

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          serviceType: 'consultation',
          message: '',
          propertySize: '',
          urgency: 'medium',
          preferredContact: 'either',
          consent: false,
          honeypot: ''
        })
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      // Fallback to Formspree or show maintenance message
      try {
        const fallbackResponse = await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })

        if (fallbackResponse.ok) {
          setSubmitStatus('success')
          setSubmitMessage(t(dict, 'forms.contact.success'))
        } else {
          throw new Error('Fallback submission failed')
        }
      } catch (fallbackError) {
        setSubmitStatus('maintenance')
        setSubmitMessage(t(dict, 'forms.contact.maintenance'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <FormMessages
        type="success"
        title={t(dict, 'forms.contact.successTitle')}
        message={submitMessage}
        onRetry={() => setSubmitStatus('idle')}
        locale={locale}
      />
    )
  }

  if (submitStatus === 'maintenance') {
    return (
      <FormMessages
        type="maintenance"
        title={t(dict, 'forms.contact.maintenanceTitle')}
        message={submitMessage}
        onRetry={() => setSubmitStatus('idle')}
        locale={locale}
      />
    )
  }

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

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          {t(dict, 'forms.contact.name')} *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus-ring ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={t(dict, 'forms.contact.namePlaceholder')}
          required
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          {t(dict, 'forms.contact.email')} *
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
          placeholder={t(dict, 'forms.contact.emailPlaceholder')}
          required
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          {t(dict, 'forms.contact.phone')}
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus-ring ${
            errors.phone ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={t(dict, 'forms.contact.phonePlaceholder')}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="mt-1 text-sm text-red-600">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Service Type */}
      <div>
        <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
          {t(dict, 'forms.contact.serviceType')} *
        </label>
        <select
          id="serviceType"
          name="serviceType"
          value={formData.serviceType}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus-ring ${
            errors.serviceType ? 'border-red-300' : 'border-gray-300'
          }`}
          required
        >
          <option value="lawn-care">{t(dict, 'forms.contact.services.lawnCare')}</option>
          <option value="garden-design">{t(dict, 'forms.contact.services.gardenDesign')}</option>
          <option value="tree-services">{t(dict, 'forms.contact.services.treeServices')}</option>
          <option value="maintenance">{t(dict, 'forms.contact.services.maintenance')}</option>
          <option value="consultation">{t(dict, 'forms.contact.services.consultation')}</option>
          <option value="other">{t(dict, 'forms.contact.services.other')}</option>
        </select>
        {errors.serviceType && (
          <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>
        )}
      </div>

      {/* Property Size */}
      <div>
        <label htmlFor="propertySize" className="block text-sm font-medium text-gray-700 mb-2">
          {t(dict, 'forms.contact.propertySize')}
        </label>
        <select
          id="propertySize"
          name="propertySize"
          value={formData.propertySize}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-ring"
        >
          <option value="">{t(dict, 'forms.contact.propertySizePlaceholder')}</option>
          <option value="small">{t(dict, 'forms.contact.propertySizes.small')}</option>
          <option value="medium">{t(dict, 'forms.contact.propertySizes.medium')}</option>
          <option value="large">{t(dict, 'forms.contact.propertySizes.large')}</option>
          <option value="commercial">{t(dict, 'forms.contact.propertySizes.commercial')}</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          {t(dict, 'forms.contact.message')} *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={5}
          className={`w-full px-4 py-3 border rounded-lg focus-ring resize-vertical ${
            errors.message ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={t(dict, 'forms.contact.messagePlaceholder')}
          required
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      {/* Urgency */}
      <div>
        <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
          {t(dict, 'forms.contact.urgency')}
        </label>
        <select
          id="urgency"
          name="urgency"
          value={formData.urgency}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-ring"
        >
          <option value="low">{t(dict, 'forms.contact.urgencyLevels.low')}</option>
          <option value="medium">{t(dict, 'forms.contact.urgencyLevels.medium')}</option>
          <option value="high">{t(dict, 'forms.contact.urgencyLevels.high')}</option>
          <option value="emergency">{t(dict, 'forms.contact.urgencyLevels.emergency')}</option>
        </select>
      </div>

      {/* Preferred Contact */}
      <div>
        <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 mb-2">
          {t(dict, 'forms.contact.preferredContact')}
        </label>
        <select
          id="preferredContact"
          name="preferredContact"
          value={formData.preferredContact}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-ring"
        >
          <option value="email">{t(dict, 'forms.contact.contactMethods.email')}</option>
          <option value="phone">{t(dict, 'forms.contact.contactMethods.phone')}</option>
          <option value="either">{t(dict, 'forms.contact.contactMethods.either')}</option>
        </select>
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
            {t(dict, 'forms.contact.consent')} *
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-1 text-sm text-red-600">
            {errors.consent}
          </p>
        )}
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
            {t(dict, 'forms.contact.submitting')}
          </span>
        ) : (
          t(dict, 'forms.contact.submit')
        )}
      </button>

      {/* Hidden Netlify form field */}
      <input type="hidden" name="form-name" value="contact" />
    </form>
  )
}