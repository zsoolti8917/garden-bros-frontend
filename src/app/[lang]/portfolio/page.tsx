import type { Metadata } from 'next'
import type { Locale } from '@/types/content'
import { isValidLocale, getTranslation, t } from '@/lib/i18n'
import { getPortfolio } from '@/lib/content'
import PortfolioGallery from '@/components/portfolio/PortfolioGallery'

interface PortfolioPageProps {
  params: { lang: string }
  searchParams: { category?: string; year?: string }
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const dict = getTranslation(locale)

  return {
    title: t(dict, 'portfolio.meta.title'),
    description: t(dict, 'portfolio.meta.description'),
    keywords: ['garden portfolio', 'landscaping projects', 'before after', 'Bratislava', 'garden transformation'],
    openGraph: {
      title: t(dict, 'portfolio.meta.title'),
      description: t(dict, 'portfolio.meta.description'),
      type: 'website',
      locale: locale === 'sk' ? 'sk_SK' : locale === 'hu' ? 'hu_HU' : 'en_US',
    },
  }
}

export default async function PortfolioPage({ params, searchParams }: PortfolioPageProps) {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const dict = getTranslation(locale)

  const allPortfolio = await getPortfolio(locale)
  const selectedCategory = searchParams.category
  const selectedYear = searchParams.year

  // Filter portfolio items
  let filteredPortfolio = allPortfolio

  if (selectedCategory) {
    filteredPortfolio = filteredPortfolio.filter(item => item.category === selectedCategory)
  }

  if (selectedYear) {
    filteredPortfolio = filteredPortfolio.filter(item => {
      if (!item.completionDate) return false
      const year = new Date(item.completionDate).getFullYear().toString()
      return year === selectedYear
    })
  }

  // Get unique categories and years for filters
  const categories = [...new Set(allPortfolio.map(item => item.category).filter(Boolean))]
  const years = [...new Set(
    allPortfolio
      .map(item => item.completionDate ? new Date(item.completionDate).getFullYear().toString() : null)
      .filter(Boolean)
  )].sort((a, b) => parseInt(b!) - parseInt(a!))

  // Separate featured and regular items
  const featuredItems = filteredPortfolio.filter(item => item.featured)
  const regularItems = filteredPortfolio.filter(item => !item.featured)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 lg:py-24">
        <div className="container-custom text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            {t(dict, 'portfolio.hero.title')}
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            {t(dict, 'portfolio.hero.subtitle')}
          </p>
          <a
            href={`/${locale}/contact?form=quote`}
            className="btn-secondary"
          >
            {t(dict, 'portfolio.hero.cta')}
          </a>
        </div>
      </section>

      {/* Portfolio Content */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          {/* Filters */}
          {(categories.length > 0 || years.length > 0) && (
            <div className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Filter */}
                {categories.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      {t(dict, 'portfolio.filterByCategory')}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`/${locale}/portfolio${selectedYear ? `?year=${selectedYear}` : ''}`}
                        className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors focus-ring ${
                          !selectedCategory
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t(dict, 'portfolio.allCategories')}
                      </a>
                      {categories.map(category => (
                        <a
                          key={category}
                          href={`/${locale}/portfolio?category=${category}${selectedYear ? `&year=${selectedYear}` : ''}`}
                          className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors focus-ring ${
                            selectedCategory === category
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {t(dict, `portfolio.categories.${category}`)}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Year Filter */}
                {years.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      {t(dict, 'portfolio.filterByYear')}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`/${locale}/portfolio${selectedCategory ? `?category=${selectedCategory}` : ''}`}
                        className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors focus-ring ${
                          !selectedYear
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t(dict, 'portfolio.allYears')}
                      </a>
                      {years.map(year => (
                        <a
                          key={year}
                          href={`/${locale}/portfolio?year=${year}${selectedCategory ? `&category=${selectedCategory}` : ''}`}
                          className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors focus-ring ${
                            selectedYear === year
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {year}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-gray-600">
              {selectedCategory || selectedYear ? (
                <>
                  {filteredPortfolio.length} {t(dict, 'portfolio.filteredResults')}
                  {selectedCategory && (
                    <> {t(dict, 'portfolio.in')} "{t(dict, `portfolio.categories.${selectedCategory}`)}"</>
                  )}
                  {selectedYear && (
                    <> {t(dict, 'portfolio.from')} {selectedYear}</>
                  )}
                </>
              ) : (
                <>
                  {filteredPortfolio.length} {t(dict, 'portfolio.totalProjects')}
                </>
              )}
            </p>

            {/* View Toggle - could add grid/list view toggle here */}
          </div>

          {/* Featured Projects */}
          {featuredItems.length > 0 && !selectedCategory && !selectedYear && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {t(dict, 'portfolio.featuredProjects')}
              </h2>
              <PortfolioGallery portfolio={featuredItems} locale={locale} />
            </div>
          )}

          {/* All Projects */}
          {filteredPortfolio.length > 0 ? (
            <div>
              {featuredItems.length > 0 && !selectedCategory && !selectedYear && (
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  {t(dict, 'portfolio.allProjects')}
                </h2>
              )}
              <PortfolioGallery
                portfolio={featuredItems.length > 0 && !selectedCategory && !selectedYear ? regularItems : filteredPortfolio}
                locale={locale}
              />
            </div>
          ) : (
            /* No Results */
            <div className="text-center py-16">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {t(dict, 'portfolio.noResults.title')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t(dict, 'portfolio.noResults.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`/${locale}/portfolio`}
                    className="btn-outline"
                  >
                    {t(dict, 'portfolio.noResults.viewAll')}
                  </a>
                  <a
                    href={`/${locale}/contact`}
                    className="btn-primary"
                  >
                    {t(dict, 'portfolio.noResults.contact')}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {t(dict, 'portfolio.process.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t(dict, 'portfolio.process.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t(dict, 'portfolio.process.step1.title')}
              </h3>
              <p className="text-gray-600">
                {t(dict, 'portfolio.process.step1.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t(dict, 'portfolio.process.step2.title')}
              </h3>
              <p className="text-gray-600">
                {t(dict, 'portfolio.process.step2.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t(dict, 'portfolio.process.step3.title')}
              </h3>
              <p className="text-gray-600">
                {t(dict, 'portfolio.process.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {t(dict, 'portfolio.cta.title')}
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            {t(dict, 'portfolio.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${locale}/contact?form=quote`}
              className="btn-secondary"
            >
              {t(dict, 'portfolio.cta.quote')}
            </a>
            <a
              href={`/${locale}/services`}
              className="btn-outline-white"
            >
              {t(dict, 'portfolio.cta.services')}
            </a>
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
            description: t(dict, 'portfolio.meta.description'),
            url: `https://gardenbros.sk/${locale}/portfolio`,
            workExample: allPortfolio.slice(0, 10).map(item => ({
              "@type": "CreativeWork",
              name: item.title,
              description: item.excerpt,
              image: item.image,
              ...(item.completionDate && {
                datePublished: item.completionDate
              })
            }))
          })
        }}
      />
    </div>
  )
}