'use client'

import type { Locale } from '@/types/content'
import { getTranslation, t } from '@/lib/i18n'

interface FormMessagesProps {
  type: 'success' | 'error' | 'maintenance'
  title: string
  message: string
  onRetry?: () => void
  locale: Locale
  compact?: boolean
}

export default function FormMessages({
  type,
  title,
  message,
  onRetry,
  locale,
  compact = false
}: FormMessagesProps) {
  const dict = getTranslation(locale)

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg
            className={`${compact ? 'h-6 w-6' : 'h-12 w-12'} text-green-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case 'error':
        return (
          <svg
            className={`${compact ? 'h-6 w-6' : 'h-12 w-12'} text-red-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        )
      case 'maintenance':
        return (
          <svg
            className={`${compact ? 'h-6 w-6' : 'h-12 w-12'} text-yellow-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            />
          </svg>
        )
    }
  }

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          title: 'text-green-800',
          message: 'text-green-700',
          button: 'bg-green-600 hover:bg-green-700 text-white'
        }
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          title: 'text-red-800',
          message: 'text-red-700',
          button: 'bg-red-600 hover:bg-red-700 text-white'
        }
      case 'maintenance':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          button: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        }
    }
  }

  const colors = getColorClasses()

  if (compact) {
    return (
      <div className={`rounded-md border p-4 ${colors.container}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${colors.title}`}>{title}</h3>
            <p className={`mt-1 text-sm ${colors.message}`}>{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className={`mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${colors.button} focus-ring`}
              >
                {t(dict, 'forms.messages.tryAgain')}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border p-8 text-center ${colors.container}`}>
      <div className="flex justify-center mb-4">{getIcon()}</div>

      <h2 className={`text-xl font-semibold mb-3 ${colors.title}`}>{title}</h2>

      <p className={`text-base mb-6 max-w-md mx-auto ${colors.message}`}>
        {message}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className={`px-6 py-3 rounded-lg font-medium transition-colors focus-ring ${colors.button}`}
          >
            {t(dict, 'forms.messages.tryAgain')}
          </button>
        )}

        {type === 'maintenance' && (
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@gardenbros.sk'}`}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus-ring"
          >
            {t(dict, 'forms.messages.contactDirect')}
          </a>
        )}

        {type === 'error' && (
          <a
            href={`/${locale}/contact`}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus-ring"
          >
            {t(dict, 'forms.messages.contactPage')}
          </a>
        )}
      </div>

      {type === 'success' && (
        <div className="mt-6 pt-6 border-t border-green-200">
          <p className="text-sm text-green-600 mb-3">
            {t(dict, 'forms.messages.whatsNext')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`/${locale}/services`}
              className="text-sm text-green-700 hover:text-green-800 underline focus-ring"
            >
              {t(dict, 'forms.messages.browseServices')}
            </a>
            <a
              href={`/${locale}/portfolio`}
              className="text-sm text-green-700 hover:text-green-800 underline focus-ring"
            >
              {t(dict, 'forms.messages.viewPortfolio')}
            </a>
          </div>
        </div>
      )}

      {/* Support Information */}
      {(type === 'error' || type === 'maintenance') && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">
            {t(dict, 'forms.messages.needHelp')}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center text-xs text-gray-600">
            <span>
              {t(dict, 'forms.messages.phone')}: +421 123 456 789
            </span>
            <span className="hidden sm:inline">•</span>
            <span>
              {t(dict, 'forms.messages.email')}: info@gardenbros.sk
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// Loading state component for forms
interface FormLoadingProps {
  message?: string
  compact?: boolean
}

export function FormLoading({ message = 'Submitting...', compact = false }: FormLoadingProps) {
  return (
    <div className={`flex items-center justify-center ${compact ? 'p-4' : 'p-8'}`}>
      <div className="flex items-center space-x-3">
        <svg
          className={`animate-spin ${compact ? 'h-5 w-5' : 'h-8 w-8'} text-primary-600`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
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
        <span className={`text-gray-700 ${compact ? 'text-sm' : 'text-base'}`}>
          {message}
        </span>
      </div>
    </div>
  )
}

// Progress indicator for multi-step forms
interface FormProgressProps {
  currentStep: number
  totalSteps: number
  stepLabels?: string[]
  locale: Locale
}

export function FormProgress({ currentStep, totalSteps, stepLabels, locale }: FormProgressProps) {
  const dict = getTranslation(locale)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>
          {t(dict, 'forms.progress.step')} {currentStep} {t(dict, 'forms.progress.of')} {totalSteps}
        </span>
        <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {stepLabels && (
        <div className="flex justify-between mt-2">
          {stepLabels.map((label, index) => (
            <span
              key={index}
              className={`text-xs ${
                index < currentStep
                  ? 'text-primary-600 font-medium'
                  : index === currentStep - 1
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-400'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}