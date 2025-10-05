import type { Metadata } from 'next'
import type { Locale } from '@/types/content'
import { isValidLocale, getTranslation, t } from '@/lib/i18n'
import { getBusinessInfo } from '@/lib/content'
import ContactForm from '@/components/forms/ContactForm'
import QuoteForm from '@/components/forms/QuoteForm'
import NewsletterForm from '@/components/forms/NewsletterForm'

interface ContactPageProps {
  params: { lang: string }
  searchParams: { form?: string; service?: string; portfolio?: string }
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const dict = getTranslation(locale)

  return {
    title: t(dict, 'contact.meta.title'),
    description: t(dict, 'contact.meta.description'),
    keywords: ['contact', 'garden services', 'quote', 'consultation', 'Bratislava'],
    openGraph: {
      title: t(dict, 'contact.meta.title'),
      description: t(dict, 'contact.meta.description'),
      type: 'website',
      locale: locale === 'sk' ? 'sk_SK' : locale === 'hu' ? 'hu_HU' : 'en_US',
    },
  }
}

export default async function ContactPage({ params, searchParams }: ContactPageProps) {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const dict = getTranslation(locale)

  const businessInfo = await getBusinessInfo()
  const formType = searchParams.form || 'contact'
  const preselectedService = searchParams.service
  const preselectedPortfolio = searchParams.portfolio

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 lg:py-24">
        <div className="container-custom text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            {formType === 'quote'
              ? t(dict, 'contact.quote.hero.title')
              : t(dict, 'contact.hero.title')
            }
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            {formType === 'quote'
              ? t(dict, 'contact.quote.hero.subtitle')
              : t(dict, 'contact.hero.subtitle')
            }
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-8 h-fit">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t(dict, 'contact.info.title')}
                </h2>

                {businessInfo && (
                  <div className="space-y-6">
                    {/* Address */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {t(dict, 'contact.info.address')}
                        </h3>
                        <p className="text-gray-600">{businessInfo.address}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {t(dict, 'contact.info.phone')}
                        </h3>
                        <a
                          href={`tel:${businessInfo.phone}`}
                          className="text-primary-600 hover:text-primary-700 focus-ring"
                        >
                          {businessInfo.phone}
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {t(dict, 'contact.info.email')}
                        </h3>
                        <a
                          href={`mailto:${businessInfo.email}`}
                          className="text-primary-600 hover:text-primary-700 focus-ring"
                        >
                          {businessInfo.email}
                        </a>
                      </div>
                    </div>

                    {/* Operating Hours */}
                    {businessInfo.operatingHours && (
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {t(dict, 'contact.info.hours')}
                          </h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Po-Pi:</span>
                              <span>{businessInfo.operatingHours.monday}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>So:</span>
                              <span>{businessInfo.operatingHours.saturday}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Ne:</span>
                              <span>{businessInfo.operatingHours.sunday}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Social Media */}
                {businessInfo?.socialMedia && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      {t(dict, 'contact.info.social')}
                    </h3>
                    <div className="flex space-x-4">
                      {businessInfo.socialMedia.facebook && (
                        <a
                          href={businessInfo.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors focus-ring"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                      )}
                      {businessInfo.socialMedia.instagram && (
                        <a
                          href={businessInfo.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-pink-600 text-white rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors focus-ring"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.354-1.057-2.354-2.354 0-1.297 1.057-2.354 2.354-2.354 1.297 0 2.354 1.057 2.354 2.354 0 1.297-1.057 2.354-2.354 2.354zm7.718 0c-1.297 0-2.354-1.057-2.354-2.354 0-1.297 1.057-2.354 2.354-2.354 1.297 0 2.354 1.057 2.354 2.354 0 1.297-1.057 2.354-2.354 2.354z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">
                          {t(dict, 'contact.info.emergency')}
                        </h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          {t(dict, 'contact.info.emergencyText')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2">
              {/* Form Tabs */}
              <div className="mb-8">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <a
                      href={`/${locale}/contact`}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        formType === 'contact'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {t(dict, 'contact.tabs.contact')}
                    </a>
                    <a
                      href={`/${locale}/contact?form=quote`}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        formType === 'quote'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {t(dict, 'contact.tabs.quote')}
                    </a>
                  </nav>
                </div>
              </div>

              {/* Form Content */}
              <div className="bg-white">
                {formType === 'quote' ? (
                  <div>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t(dict, 'contact.quote.title')}
                      </h2>
                      <p className="text-gray-600">
                        {t(dict, 'contact.quote.description')}
                      </p>
                    </div>
                    <QuoteForm
                      locale={locale}
                      preselectedServices={preselectedService ? [preselectedService] : []}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t(dict, 'contact.form.title')}
                      </h2>
                      <p className="text-gray-600">
                        {t(dict, 'contact.form.description')}
                      </p>
                      {preselectedService && (
                        <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                          <p className="text-sm text-primary-800">
                            {t(dict, 'contact.form.preselected')}: {preselectedService}
                          </p>
                        </div>
                      )}
                    </div>
                    <ContactForm
                      locale={locale}
                      preselectedService={preselectedService}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t(dict, 'contact.newsletter.title')}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t(dict, 'contact.newsletter.description')}
            </p>
            <div className="bg-white rounded-lg p-8 shadow-md">
              <NewsletterForm locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t(dict, 'contact.faq.title')}
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t(dict, 'contact.faq.q1.question')}
                </h3>
                <p className="text-gray-700">
                  {t(dict, 'contact.faq.q1.answer')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t(dict, 'contact.faq.q2.question')}
                </h3>
                <p className="text-gray-700">
                  {t(dict, 'contact.faq.q2.answer')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t(dict, 'contact.faq.q3.question')}
                </h3>
                <p className="text-gray-700">
                  {t(dict, 'contact.faq.q3.answer')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t(dict, 'contact.faq.q4.question')}
                </h3>
                <p className="text-gray-700">
                  {t(dict, 'contact.faq.q4.answer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: t(dict, 'contact.meta.title'),
            description: t(dict, 'contact.meta.description'),
            url: `https://gardenbros.sk/${locale}/contact`,
            mainEntity: {
              "@type": "Organization",
              name: "Garden Bros",
              ...(businessInfo && {
                address: {
                  "@type": "PostalAddress",
                  streetAddress: businessInfo.address,
                  addressCountry: "SK"
                },
                telephone: businessInfo.phone,
                email: businessInfo.email,
                ...(businessInfo.operatingHours && {
                  openingHours: [
                    `Mo-Fr ${businessInfo.operatingHours.monday}`,
                    `Sa ${businessInfo.operatingHours.saturday}`,
                    `Su ${businessInfo.operatingHours.sunday}`
                  ]
                })
              })
            }
          })
        }}
      />
    </div>
  )
}