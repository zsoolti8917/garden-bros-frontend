import Image from 'next/image'
import Link from 'next/link'
import type { Locale, ServiceInformation } from '@/types/content'
import { getTranslation, t } from '@/lib/i18n'

interface ServiceDetailProps {
  service: ServiceInformation
  locale: Locale
}

export default function ServiceDetail({ service, locale }: ServiceDetailProps) {
  const dict = getTranslation(locale)

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            href={`/${locale}/services`}
            className="text-primary-600 hover:text-primary-700 font-medium focus-ring inline-flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t(dict, 'services.backToServices')}
          </Link>

          {service.category && (
            <span className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full">
              {service.category}
            </span>
          )}
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {service.title}
        </h1>

        {service.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed">
            {service.excerpt}
          </p>
        )}
      </header>

      {/* Main Image */}
      {service.image && (
        <div className="relative h-64 lg:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Service Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          {/* Description */}
          {service.description && (
            <div className="prose prose-lg max-w-none mb-8">
              <div
                dangerouslySetInnerHTML={{ __html: service.description }}
                className="text-gray-700 leading-relaxed"
              />
            </div>
          )}

          {/* Benefits */}
          {service.benefits && service.benefits.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t(dict, 'services.benefits')}
              </h2>
              <ul className="space-y-3">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary-600 mt-1 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Process */}
          {service.process && service.process.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t(dict, 'services.process')}
              </h2>
              <div className="space-y-4">
                {service.process.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
            {/* Pricing */}
            {service.price && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t(dict, 'services.pricing')}
                </h3>
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {service.price}
                </div>
                {service.priceNote && (
                  <p className="text-sm text-gray-600">{service.priceNote}</p>
                )}
              </div>
            )}

            {/* Duration */}
            {service.duration && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t(dict, 'services.duration')}
                </h3>
                <p className="text-gray-700">{service.duration}</p>
              </div>
            )}

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t(dict, 'services.features')}
                </h3>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <svg
                        className="w-4 h-4 text-primary-600 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="space-y-3">
              <Link
                href={`/${locale}/contact?service=${service.slug}`}
                className="btn-primary w-full text-center block"
              >
                {t(dict, 'services.getQuote')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="btn-outline w-full text-center block"
              >
                {t(dict, 'services.contact')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {service.gallery && service.gallery.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t(dict, 'services.gallery')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.gallery.map((image, index) => (
              <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alt || `${service.title} - ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.excerpt || service.description,
            image: service.image,
            provider: {
              "@type": "Organization",
              name: "Garden Bros"
            },
            ...(service.price && {
              offers: {
                "@type": "Offer",
                price: service.price.replace(/[^\d.,]/g, ''),
                priceCurrency: "EUR"
              }
            })
          })
        }}
      />
    </article>
  )
}