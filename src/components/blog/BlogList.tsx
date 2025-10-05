import Link from 'next/link'
import Image from 'next/image'
import type { Locale, BlogPost } from '@/types/content'
import { getTranslation, t } from '@/lib/i18n'

interface BlogListProps {
  posts: BlogPost[]
  locale: Locale
}

export default function BlogList({ posts, locale }: BlogListProps) {
  const dict = getTranslation(locale)

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          {t(dict, 'blog.noPosts')}
        </p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.trim().split(/\s+/).length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return readTime
  }

  return (
    <div className="space-y-8">
      {posts.map((post, index) => (
        <article
          key={post.slug}
          className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${
            index === 0 ? 'lg:flex lg:items-center' : ''
          }`}
        >
          {/* Featured post layout (first post) */}
          {index === 0 ? (
            <>
              {post.image && (
                <div className="lg:w-1/2 relative h-64 lg:h-80">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              <div className="lg:w-1/2 p-8">
                <div className="flex items-center space-x-4 mb-4">
                  {post.category && (
                    <span className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full">
                      {post.category}
                    </span>
                  )}
                  {post.featured && (
                    <span className="flex items-center text-yellow-600 text-sm font-medium">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {t(dict, 'blog.featured')}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 line-clamp-2">
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="hover:text-primary-600 transition-colors focus-ring"
                  >
                    {post.title}
                  </Link>
                </h2>

                {post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                  <span>
                    {calculateReadTime(post.content)} {t(dict, 'blog.minRead')}
                  </span>
                </div>

                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="text-primary-600 hover:text-primary-700 font-medium focus-ring inline-flex items-center"
                >
                  {t(dict, 'common.readMore')}
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            /* Regular post layout */
            <>
              {post.image && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center space-x-4 mb-3">
                  {post.category && (
                    <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                      {post.category}
                    </span>
                  )}
                  {post.featured && (
                    <span className="flex items-center text-yellow-600 text-xs font-medium">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {t(dict, 'blog.featured')}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="hover:text-primary-600 transition-colors focus-ring"
                  >
                    {post.title}
                  </Link>
                </h3>

                {post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                    <span>
                      {calculateReadTime(post.content)} {t(dict, 'blog.minRead')}
                    </span>
                  </div>

                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="text-primary-600 hover:text-primary-700 font-medium focus-ring inline-flex items-center text-sm"
                  >
                    {t(dict, 'common.readMore')}
                    <svg
                      className="w-3 h-3 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.slice(0, 4).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 4 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        +{post.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </article>
      ))}
    </div>
  )
}