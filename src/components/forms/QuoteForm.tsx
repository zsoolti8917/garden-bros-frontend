'use client'

import { useState, useRef } from 'react'
import type { Locale } from '@/types/content'
import { getTranslation, t } from '@/lib/i18n'
import { validateQuoteForm, type QuoteFormData } from '@/lib/validation'
import FormMessages from '@/components/ui/FormMessages'

interface QuoteFormProps {
  locale: Locale
  preselectedServices?: string[]
}

export default function QuoteForm({ locale, preselectedServices = [] }: QuoteFormProps) {
  const dict = getTranslation(locale)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceTypes: preselectedServices,
    projectDescription: '',
    budget: '',
    timeline: '3-months',
    propertyImages: [],
    consent: false,
    honeypot: ''
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
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

  const handleServiceTypeChange = (serviceType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: checked
        ? [...prev.serviceTypes, serviceType]
        : prev.serviceTypes.filter(s => s !== serviceType)
    }))

    if (errors.serviceTypes) {
      setErrors(prev => ({
        ...prev,
        serviceTypes: ''
      }))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
      return isValidType && isValidSize
    })

    if (validFiles.length !== files.length) {
      setErrors(prev => ({
        ...prev,
        propertyImages: t(dict, 'forms.quote.imageError')
      }))
    } else {
      setErrors(prev => ({
        ...prev,
        propertyImages: ''
      }))
    }

    setUploadedFiles(prev => [...prev, ...validFiles].slice(0, 10)) // Max 10 files
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check
    if (formData.honeypot) {
      return // Silent fail for spam
    }

    // Validate form
    const validation = validateQuoteForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('form-name', 'quote')

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'serviceTypes') {
          submitData.append(key, value.join(', '))
        } else if (key !== 'propertyImages') {
          submitData.append(key, typeof value === 'boolean' ? value.toString() : value)
        }
      })

      // Add files
      uploadedFiles.forEach((file, index) => {
        submitData.append(`propertyImage${index}`, file)
      })

      // Try Netlify Forms first
      const response = await fetch('/', {
        method: 'POST',
        body: submitData
      })

      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage(t(dict, 'forms.quote.success'))

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          serviceTypes: [],
          projectDescription: '',
          budget: '',
          timeline: '3-months',
          propertyImages: [],
          consent: false,
          honeypot: ''
        })
        setUploadedFiles([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      // Fallback to Formspree (without file upload)
      try {
        const fallbackData = {
          ...formData,
          propertyImages: uploadedFiles.map(f => f.name).join(', ') // Just file names
        }

        const fallbackResponse = await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_QUOTE_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fallbackData)
        })

        if (fallbackResponse.ok) {
          setSubmitStatus('success')
          setSubmitMessage(t(dict, 'forms.quote.successNoImages'))
        } else {
          throw new Error('Fallback submission failed')
        }
      } catch (fallbackError) {
        setSubmitStatus('maintenance')
        setSubmitMessage(t(dict, 'forms.quote.maintenance'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <FormMessages
        type="success"
        title={t(dict, 'forms.quote.successTitle')}
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
        title={t(dict, 'forms.quote.maintenanceTitle')}
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

      {/* Contact Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t(dict, 'forms.quote.contactInfo')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {t(dict, 'forms.quote.name')} *
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
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t(dict, 'forms.quote.email')} *
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
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              {t(dict, 'forms.quote.phone')} *
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
              required
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              {t(dict, 'forms.quote.address')} *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus-ring ${
                errors.address ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={t(dict, 'forms.quote.addressPlaceholder')}
              required
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t(dict, 'forms.quote.projectDetails')}
        </h3>

        {/* Service Types */}
        <div className="mb-6">
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-3">
              {t(dict, 'forms.quote.serviceTypes')} *
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                'lawn-care',
                'garden-design',
                'tree-services',
                'maintenance',
                'landscaping',
                'irrigation'
              ].map(serviceType => (
                <label key={serviceType} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.serviceTypes.includes(serviceType)}
                    onChange={(e) => handleServiceTypeChange(serviceType, e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus-ring border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {t(dict, `forms.quote.services.${serviceType}`)}
                  </span>
                </label>
              ))}
            </div>
            {errors.serviceTypes && (
              <p className="mt-2 text-sm text-red-600">{errors.serviceTypes}</p>
            )}
          </fieldset>
        </div>

        {/* Project Description */}
        <div className="mb-6">
          <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
            {t(dict, 'forms.quote.projectDescription')} *
          </label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleInputChange}
            rows={5}
            className={`w-full px-4 py-3 border rounded-lg focus-ring resize-vertical ${
              errors.projectDescription ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={t(dict, 'forms.quote.projectDescriptionPlaceholder')}
            required
          />
          {errors.projectDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.projectDescription}</p>
          )}
        </div>

        {/* Budget and Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Budget */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              {t(dict, 'forms.quote.budget')}
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-ring"
            >
              <option value="">{t(dict, 'forms.quote.budgetPlaceholder')}</option>
              <option value="under-1000">{t(dict, 'forms.quote.budgetRanges.under1000')}</option>
              <option value="1000-5000">{t(dict, 'forms.quote.budgetRanges.1000to5000')}</option>
              <option value="5000-10000">{t(dict, 'forms.quote.budgetRanges.5000to10000')}</option>
              <option value="10000-25000">{t(dict, 'forms.quote.budgetRanges.10000to25000')}</option>
              <option value="25000-plus">{t(dict, 'forms.quote.budgetRanges.25000plus')}</option>
              <option value="discuss">{t(dict, 'forms.quote.budgetRanges.discuss')}</option>
            </select>
          </div>

          {/* Timeline */}
          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
              {t(dict, 'forms.quote.timeline')} *
            </label>
            <select
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus-ring ${
                errors.timeline ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="asap">{t(dict, 'forms.quote.timelines.asap')}</option>
              <option value="1-month">{t(dict, 'forms.quote.timelines.1month')}</option>
              <option value="3-months">{t(dict, 'forms.quote.timelines.3months')}</option>
              <option value="6-months">{t(dict, 'forms.quote.timelines.6months')}</option>
              <option value="flexible">{t(dict, 'forms.quote.timelines.flexible')}</option>
            </select>
            {errors.timeline && (
              <p className="mt-1 text-sm text-red-600">{errors.timeline}</p>
            )}
          </div>
        </div>
      </div>

      {/* Property Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t(dict, 'forms.quote.propertyImages')}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*"
            className="hidden"
          />
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            {t(dict, 'forms.quote.uploadInstructions')}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-ring"
          >
            {t(dict, 'forms.quote.selectFiles')}
          </button>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {t(dict, 'forms.quote.uploadedFiles')} ({uploadedFiles.length}/10)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded border overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 focus-ring"
                  >
                    ×
                  </button>
                  <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {errors.propertyImages && (
          <p className="mt-1 text-sm text-red-600">{errors.propertyImages}</p>
        )}
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
          />
          <span className="text-sm text-gray-700">
            {t(dict, 'forms.quote.consent')} *
          </span>
        </label>
        {errors.consent && (
          <p className="mt-1 text-sm text-red-600">{errors.consent}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-4 px-6 rounded-lg font-medium transition-colors focus-ring ${
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
            {t(dict, 'forms.quote.submitting')}
          </span>
        ) : (
          t(dict, 'forms.quote.submit')
        )}
      </button>

      {/* Hidden Netlify form field */}
      <input type="hidden" name="form-name" value="quote" />
    </form>
  )
}