import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/types/content'
import { isValidLocale, getTranslation, t } from '@/lib/i18n'
import { getServices, getPortfolio } from '@/lib/content'

interface PageProps {
  params: { lang: string }
}

export default async function HomePage({ params }: PageProps) {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const dict = getTranslation(locale)

  const services = await getServices(locale)
  const portfolio = await getPortfolio(locale)

  const featuredServices = services.slice(0, 3)
  const featuredPortfolio = portfolio.slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container-custom py-24 lg:py-32">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t(dict, 'home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl">
              {t(dict, 'home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/contact`}
                className="btn-primary text-center"
              >
                {t(dict, 'home.hero.cta.primary')}
              </Link>
              <Link
                href={`/${locale}/services`}
                className="btn-secondary text-center"
              >
                {t(dict, 'home.hero.cta.secondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t(dict, 'home.services.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t(dict, 'home.services.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.map((service) => (
                <div
                  key={service.slug}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  {service.image && (
                    <div className="relative h-48">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {service.excerpt}
                    </p>
                    <Link
                      href={`/${locale}/services/${service.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium focus-ring inline-block"
                    >
                      {t(dict, 'common.readMore')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href={`/${locale}/services`}
                className="btn-outline"
              >
                {t(dict, 'home.services.viewAll')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Portfolio */}
      {featuredPortfolio.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t(dict, 'home.portfolio.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t(dict, 'home.portfolio.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPortfolio.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${locale}/portfolio/${item.slug}`}
                  className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 focus-ring"
                >
                  {item.image && (
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href={`/${locale}/portfolio`}
                className="btn-outline"
              >
                {t(dict, 'home.portfolio.viewAll')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {t(dict, 'home.cta.title')}
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            {t(dict, 'home.cta.subtitle')}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="btn-secondary"
          >
            {t(dict, 'home.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  )
}
