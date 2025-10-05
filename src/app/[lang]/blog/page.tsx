import type { Metadata } from 'next'
import type { Locale } from '@/types/content'
import { isValidLocale, getTranslation, t } from '@/lib/i18n'
import { getBlogPosts } from '@/lib/content'
import BlogList from '@/components/blog/BlogList'
import NewsletterForm from '@/components/forms/NewsletterForm'

interface BlogPageProps {
  params: { lang: string }
  searchParams: { category?: string; tag?: string; page?: string }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const dict = getTranslation(locale)

  return {
    title: t(dict, 'blog.meta.title'),
    description: t(dict, 'blog.meta.description'),
    keywords: ['garden blog', 'gardening tips', 'lawn care advice', 'seasonal gardening', 'plant care'],
    openGraph: {
      title: t(dict, 'blog.meta.title'),
      description: t(dict, 'blog.meta.description'),
      type: 'website',
      locale: locale === 'sk' ? 'sk_SK' : locale === 'hu' ? 'hu_HU' : 'en_US',
    },
  }
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const dict = getTranslation(locale)

  const allPosts = await getBlogPosts(locale)
  const selectedCategory = searchParams.category
  const selectedTag = searchParams.tag
  const currentPage = parseInt(searchParams.page || '1', 10)
  const postsPerPage = 12

  // Filter posts
  let filteredPosts = allPosts.filter(post => post.published)

  if (selectedCategory) {
    filteredPosts = filteredPosts.filter(post => post.category === selectedCategory)
  }

  if (selectedTag) {
    filteredPosts = filteredPosts.filter(post =>
      post.tags && post.tags.includes(selectedTag)
    )
  }

  // Pagination
  const totalPosts = filteredPosts.length
  const totalPages = Math.ceil(totalPosts / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage)

  // Get unique categories and tags for filters
  const categories = [...new Set(allPosts.map(post => post.category).filter(Boolean))]
  const allTags = allPosts.flatMap(post => post.tags || [])
  const popularTags = [...new Set(allTags)]
    .map(tag => ({
      tag,
      count: allTags.filter(t => t === tag).length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Featured posts (if on first page and no filters)
  const featuredPosts = currentPage === 1 && !selectedCategory && !selectedTag
    ? allPosts.filter(post => post.featured && post.published).slice(0, 2)
    : []

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 lg:py-24">
        <div className="container-custom text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            {t(dict, 'blog.hero.title')}
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            {t(dict, 'blog.hero.subtitle')}
          </p>
          <a
            href={`#newsletter`}
            className="btn-secondary"
          >
            {t(dict, 'blog.hero.cta')}
          </a>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Filters */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t(dict, 'blog.filters')}:
                  </h2>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`/${locale}/blog${selectedTag ? `?tag=${selectedTag}` : ''}`}
                      className={`px-3 py-1 text-sm rounded-full font-medium transition-colors focus-ring ${
                        !selectedCategory
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t(dict, 'blog.allPosts')}
                    </a>
                    {categories.map(category => (
                      <a
                        key={category}
                        href={`/${locale}/blog?category=${category}${selectedTag ? `&tag=${selectedTag}` : ''}`}
                        className={`px-3 py-1 text-sm rounded-full font-medium transition-colors focus-ring ${
                          selectedCategory === category
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t(dict, `blog.categories.${category}`)}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Results Count */}
                <p className="text-sm text-gray-600">
                  {totalPosts} {t(dict, 'blog.resultsFound')}
                  {currentPage > 1 && (
                    <> • {t(dict, 'blog.page')} {currentPage} {t(dict, 'blog.of')} {totalPages}</>
                  )}
                </p>
              </div>

              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {t(dict, 'blog.featuredPosts')}
                  </h2>
                  <BlogList posts={featuredPosts} locale={locale} />
                </div>
              )}

              {/* Blog Posts */}
              {paginatedPosts.length > 0 ? (
                <div>
                  {featuredPosts.length > 0 && (
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {t(dict, 'blog.latestPosts')}
                    </h2>
                  )}
                  <BlogList posts={paginatedPosts} locale={locale} />
                </div>
              ) : (
                /* No Results */
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      {t(dict, 'blog.noResults.title')}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {t(dict, 'blog.noResults.description')}
                    </p>
                    <a
                      href={`/${locale}/blog`}
                      className="btn-outline"
                    >
                      {t(dict, 'blog.noResults.viewAll')}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Newsletter Signup */}
              <div id="newsletter" className="mb-8 bg-primary-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t(dict, 'blog.newsletter.title')}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t(dict, 'blog.newsletter.description')}
                </p>
                <NewsletterForm locale={locale} compact />
              </div>

              {/* Popular Tags */}
              {popularTags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {t(dict, 'blog.popularTags')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(({ tag, count }) => (
                      <a
                        key={tag}
                        href={`/${locale}/blog?tag=${tag}${selectedCategory ? `&category=${selectedCategory}` : ''}`}
                        className={`inline-flex items-center px-3 py-1 text-sm rounded-full transition-colors focus-ring ${
                          selectedTag === tag
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        #{tag}
                        <span className="ml-1 text-xs opacity-75">({count})</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
