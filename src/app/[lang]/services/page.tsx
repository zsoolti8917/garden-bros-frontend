import type { Metadata } from 'next'
import type { Locale } from '@/types/content'
import { isValidLocale, getTranslation, t } from '@/lib/i18n'
import { getServices } from '@/lib/content'
import ServicesList from '@/components/services/ServicesList'

interface ServicesPageProps {
  params: { lang: string }
  searchParams: { category?: string }
}

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const dict = getTranslation(locale)

  return {
    title: t(dict, 'services.meta.title'),
    description: t(dict, 'services.meta.description'),
    keywords: ['lawn care', 'garden design', 'tree services', 'landscaping', 'Bratislava'],
    openGraph: {
      title: t(dict, 'services.meta.title'),
      description: t(dict, 'services.meta.description'),
      type: 'website',
      locale: locale === 'sk' ? 'sk_SK' : locale === 'hu' ? 'hu_HU' : 'en_US',
    },
  }
}

export default async function ServicesPage({ params, searchParams }: ServicesPageProps) {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const dict = getTranslation(locale)

  const allServices = await getServices(locale)
  const selectedCategory = searchParams.category

  // Filter services by category if specified
  const filteredServices = selectedCategory
    ? allServices.filter(service => service.category === selectedCategory)
    : allServices

  // Get unique categories for filter
  const categories = [...new Set(allServices.map(service => service.category).filter(Boolean))]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 lg:py-24">
        <div className="container-custom text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            {t(dict, 'services.hero.title')}
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            {t(dict, 'services.hero.subtitle')}
          </p>
          <a
            href={`/${locale}/contact`}
            className="btn-secondary"
          >
            {t(dict, 'services.hero.cta')}
          </a>
        </div>
      </section>

      {/* Services Content */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t(dict, 'services.filterByCategory')}
              </h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`/${locale}/services`}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors focus-ring ${
                    !selectedCategory
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t(dict, 'services.allServices')}
                </a>
                {categories.map(category => (
                  <a
                    key={category}
                    href={`/${locale}/services?category=${category}`}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors focus-ring ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t(dict, `services.categories.${category}`)}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="mb-8">
            <p className="text-gray-600">
              {selectedCategory ? (
                <>
                  {filteredServices.length} {t(dict, 'services.resultsIn')} "{t(dict, `services.categories.${selectedCategory}`)}"
                </>
              ) : (
                <>
                  {filteredServices.length} {t(dict, 'services.totalServices')}
                </>
              )}
            </p>
          </div>

          {/* Services List */}
          <ServicesList services={filteredServices} locale={locale} />

          {/* No Results */}
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {t(dict, 'services.noResults.title')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t(dict, 'services.noResults.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`/${locale}/services`}
                    className="btn-outline"
                  >
                    {t(dict, 'services.noResults.viewAll')}
                  </a>
                  <a
                    href={`/${locale}/contact`}
                    className="btn-primary"
                  >
                    {t(dict, 'services.noResults.contact')}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {t(dict, 'services.cta.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t(dict, 'services.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${locale}/contact`}
              className="btn-primary"
            >
              {t(dict, 'services.cta.contact')}
            </a>
            <a
              href={`/${locale}/contact?form=quote`}
              className="btn-outline"
            >
              {t(dict, 'services.cta.quote')}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t(dict, 'services.faq.title')}
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t(dict, 'services.faq.q1.question')}
                </h3>
                <p className="text-gray-700">
                  {t(dict, 'services.faq.q1.answer')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t(dict, 'services.faq.q2.question')}
                </h3>
                <p className="text-gray-700">
                  {t(dict, 'services.faq.q2.answer')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t(dict, 'services.faq.q3.question')}
                </h3>
                <p className="text-gray-700">
                  {t(dict, 'services.faq.q3.answer')}
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
            "@type": "Organization",
            name: "Garden Bros",
            description: t(dict, 'services.meta.description'),
            url: `https://gardenbros.sk/${locale}/services`,
            address: {
              "@type": "PostalAddress",
              addressCountry: "SK",
              addressLocality: "Bratislava"
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+421-123-456-789",
              contactType: "customer service"
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Garden Services",
              itemListElement: allServices.map((service, index) => ({
                "@type": "Offer",
                position: index + 1,
                name: service.title,
                description: service.excerpt,
                category: service.category
              }))
            }
          })
        }}
      />
    </div>
  )
}