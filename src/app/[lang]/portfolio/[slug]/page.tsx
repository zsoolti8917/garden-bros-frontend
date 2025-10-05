import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Locale } from '@/types/content'
import { isValidLocale, getTranslation, t } from '@/lib/i18n'
import { getPortfolioBySlug, getPortfolio } from '@/lib/content'
import PortfolioItem from '@/components/portfolio/PortfolioItem'

interface PortfolioItemPageProps {
  params: { lang: string; slug: string }
}

export async function generateStaticParams() {
  const portfolio = await getPortfolio('sk') // Use default locale for generation

  return portfolio.map(item => ({
    slug: item.slug
  }))
}

export async function generateMetadata({ params }: PortfolioItemPageProps): Promise<Metadata> {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const item = await getPortfolioBySlug(params.slug, locale)

  if (!item) {
    return {
      title: 'Portfolio Item Not Found',
      description: 'The requested portfolio item could not be found.'
    }
  }

  return {
    title: `${item.title} - Garden Bros Portfolio`,
    description: item.excerpt || item.description?.substring(0, 160),
    keywords: [
      item.title,
      item.category,
      'garden transformation',
      'landscaping project',
      'Bratislava',
      'before after'
    ].filter(Boolean),
    openGraph: {
      title: `${item.title} - Garden Bros Portfolio`,
      description: item.excerpt || item.description?.substring(0, 160),
      type: 'website',
      locale: locale === 'sk' ? 'sk_SK' : locale === 'hu' ? 'hu_HU' : 'en_US',
      images: item.image ? [
        {
          url: item.image,
          width: 1200,
          height: 630,
          alt: item.title
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${item.title} - Garden Bros Portfolio`,
      description: item.excerpt || item.description?.substring(0, 160),
      images: item.image ? [item.image] : [],
    }
  }
}

export default async function PortfolioItemPage({ params }: PortfolioItemPageProps) {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const dict = getTranslation(locale)

  const item = await getPortfolioBySlug(params.slug, locale)

  if (!item) {
    notFound()
  }

  // Get related portfolio items (same category, different slug)
  const allPortfolio = await getPortfolio(locale)
  const relatedItems = allPortfolio
    .filter(p => p.category === item.category && p.slug !== item.slug)
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
              <a href={`/${locale}/portfolio`} className="hover:text-primary-600 focus-ring">
                {t(dict, 'common.portfolio')}
              </a>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium truncate">
              {item.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Portfolio Item Detail */}
      <main className="py-8 lg:py-12">
        <div className="container-custom">
          <PortfolioItem item={item} locale={locale} />
        </div>
      </main>

      {/* Related Portfolio Items */}
      {relatedItems.length > 0 && (
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t(dict, 'portfolio.relatedProjects')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedItems.map(relatedItem => (
                <a
                  key={relatedItem.slug}
                  href={`/${locale}/portfolio/${relatedItem.slug}`}
                  className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 focus-ring"
                >
                  {relatedItem.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={relatedItem.image}
                        alt={relatedItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {relatedItem.category && (
                        <div className="absolute top-4 left-4">
                          <span className="px-2 py-1 text-xs font-medium bg-white/90 text-gray-900 rounded-full backdrop-blur-sm">
                            {t(dict, `portfolio.categories.${relatedItem.category}`)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 flex-1">
                        {relatedItem.title}
                      </h3>
                      {relatedItem.completionDate && (
                        <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                          {new Date(relatedItem.completionDate).getFullYear()}
                        </span>
                      )}
                    </div>
                    {relatedItem.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {relatedItem.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      {relatedItem.location && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {relatedItem.location}
                        </span>
                      )}
                      <span className="text-primary-600 font-medium">
                        {t(dict, 'common.viewProject')}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {t(dict, 'portfolio.item.cta.title')}
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            {t(dict, 'portfolio.item.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${locale}/contact?portfolio=${item.slug}`}
              className="btn-secondary"
            >
              {t(dict, 'portfolio.item.cta.similar')}
            </a>
            <a
              href={`/${locale}/contact?form=quote`}
              className="btn-outline-white"
            >
              {t(dict, 'portfolio.item.cta.quote')}
            </a>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <a
              href={`/${locale}/portfolio`}
              className="text-primary-600 hover:text-primary-700 font-medium focus-ring inline-flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
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
              {t(dict, 'portfolio.backToPortfolio')}
            </a>

            <div className="flex items-center space-x-4">
              <a
                href={`/${locale}/services`}
                className="text-gray-600 hover:text-primary-600 font-medium focus-ring"
              >
                {t(dict, 'portfolio.viewServices')}
              </a>
              <a
                href={`/${locale}/contact`}
                className="btn-primary"
              >
                {t(dict, 'portfolio.getStarted')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: item.title,
            description: item.description || item.excerpt,
            image: item.image,
            creator: {
              "@type": "Organization",
              name: "Garden Bros",
              address: {
                "@type": "PostalAddress",
                addressCountry: "SK",
                addressLocality: "Bratislava"
              }
            },
            ...(item.completionDate && {
              datePublished: item.completionDate
            }),
            ...(item.client && {
              sponsor: {
                "@type": "Organization",
                name: item.client
              }
            }),
            ...(item.location && {
              locationCreated: {
                "@type": "Place",
                name: item.location
              }
            }),
            category: item.category,
            keywords: [item.category, 'garden transformation', 'landscaping'].filter(Boolean).join(', ')
          })
        }}
      />
    </div>
  )
}