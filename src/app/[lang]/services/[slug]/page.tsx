import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Locale } from '@/types/content'
import { isValidLocale, getTranslation, t } from '@/lib/i18n'
import { getServiceBySlug, getServices } from '@/lib/content'
import ServiceDetail from '@/components/services/ServiceDetail'

interface ServicePageProps {
  params: { lang: string; slug: string }
}

export async function generateStaticParams() {
  const services = await getServices('sk') // Use default locale for generation

  return services.map(service => ({
    slug: service.slug
  }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const service = await getServiceBySlug(params.slug, locale)

  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.'
    }
  }

  return {
    title: `${service.title} - Garden Bros`,
    description: service.excerpt || service.description?.substring(0, 160),
    keywords: [
      service.title,
      service.category,
      'garden services',
      'Bratislava',
      'landscaping'
    ].filter(Boolean),
    openGraph: {
      title: `${service.title} - Garden Bros`,
      description: service.excerpt || service.description?.substring(0, 160),
      type: 'website',
      locale: locale === 'sk' ? 'sk_SK' : locale === 'hu' ? 'hu_HU' : 'en_US',
      images: service.image ? [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: service.title
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} - Garden Bros`,
      description: service.excerpt || service.description?.substring(0, 160),
      images: service.image ? [service.image] : [],
    }
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const dict = getTranslation(locale)

  const service = await getServiceBySlug(params.slug, locale)

  if (!service) {
    notFound()
  }

  // Get related services (same category, different slug)
  const allServices = await getServices(locale)
  const relatedServices = allServices
    .filter(s => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="bg-gray-50 py-4">
        <div className="container-custom">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <a href={`/${locale}`} className="hover:text-primary-600 focus-ring">
                {t(dict, 'common.home')}
              </a>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <a href={`/${locale}/services`} className="hover:text-primary-600 focus-ring">
                {t(dict, 'common.services')}
              </a>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium truncate">
              {service.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Service Detail */}
      <main className="py-8 lg:py-12">
        <div className="container-custom">
          <ServiceDetail service={service} locale={locale} />
        </div>
      </main>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t(dict, 'services.relatedServices')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedServices.map(relatedService => (
                <div
                  key={relatedService.slug}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  {relatedService.image && (
                    <div className="relative h-48">
                      <img
                        src={relatedService.image}
                        alt={relatedService.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {relatedService.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {relatedService.excerpt}
                    </p>
                    {relatedService.price && (
                      <div className="mb-4">
                        <span className="text-lg font-bold text-primary-600">
                          {relatedService.price}
                        </span>
                      </div>
                    )}
                    <a
                      href={`/${locale}/services/${relatedService.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium focus-ring inline-flex items-center"
                    >
                      {t(dict, 'common.learnMore')}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {t(dict, 'services.detail.cta.title')}
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            {t(dict, 'services.detail.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${locale}/contact?service=${service.slug}`}
              className="btn-secondary"
            >
              {t(dict, 'services.detail.cta.contact')}
            </a>
            <a
              href={`/${locale}/contact?form=quote&service=${service.slug}`}
              className="btn-outline-white"
            >
              {t(dict, 'services.detail.cta.quote')}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ for this service */}
      {service.faq && service.faq.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                {t(dict, 'services.detail.faq.title')}
              </h2>
              <div className="space-y-8">
                {service.faq.map((faqItem, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faqItem.question}
                    </h3>
                    <p className="text-gray-700">
                      {faqItem.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.description || service.excerpt,
            image: service.image,
            provider: {
              "@type": "Organization",
              name: "Garden Bros",
              address: {
                "@type": "PostalAddress",
                addressCountry: "SK",
                addressLocality: "Bratislava"
              },
              telephone: "+421-123-456-789"
            },
            areaServed: {
              "@type": "Place",
              name: "Bratislava, Slovakia"
            },
            category: service.category,
            ...(service.price && {
              offers: {
                "@type": "Offer",
                price: service.price.replace(/[^\d.,]/g, ''),
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock"
              }
            }),
            ...(service.benefits && {
              additionalProperty: service.benefits.map(benefit => ({
                "@type": "PropertyValue",
                name: "Benefit",
                value: benefit
              }))
            })
          })
        }}
      />
    </div>
  )
}