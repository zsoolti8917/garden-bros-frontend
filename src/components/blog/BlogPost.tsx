import Image from 'next/image'
import Link from 'next/link'
import type { Locale, BlogPost as BlogPostType } from '@/types/content'
import { getTranslation, t } from '@/lib/i18n'

interface BlogPostProps {
  post: BlogPostType
  locale: Locale
}

export default function BlogPost({ post, locale }: BlogPostProps) {
  const dict = getTranslation(locale)

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
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            href={`/${locale}/blog`}
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
            {t(dict, 'blog.backToBlog')}
          </Link>

          {post.category && (
            <span className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full">
              {post.category}
            </span>
          )}
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            {post.excerpt}
          </p>
        )}

        {/* Post Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          <time dateTime={post.publishedAt} className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(post.publishedAt)}
          </time>

          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {calculateReadTime(post.content)} {t(dict, 'blog.minRead')}
          </span>

          {post.author && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {post.author}
            </span>
          )}

          {post.featured && (
            <span className="flex items-center text-yellow-600 font-medium">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {t(dict, 'blog.featured')}
            </span>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Featured Image */}
      {post.image && (
        <div className="relative h-64 lg:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-8">
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="text-gray-700 leading-relaxed"
        />
      </div>

      {/* Gallery */}
      {post.gallery && post.gallery.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t(dict, 'blog.gallery')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {post.gallery.map((image, index) => (
              <div key={index} className="relative h-48 rounded-lg overflow-hidden group">
                <Image
                  src={image.url}
                  alt={image.alt || `${post.title} - ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {image.caption && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end">
                    <p className="text-white text-sm p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {image.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Services */}
      {post.relatedServices && post.relatedServices.length > 0 && (
        <div className="mb-8 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t(dict, 'blog.relatedServices')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {post.relatedServices.map((service, index) => (
              <Link
                key={index}
                href={`/${locale}/services/${service.slug}`}
                className="flex items-center p-3 bg-white rounded border hover:border-primary-300 hover:shadow-sm transition-all focus-ring"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{service.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{service.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="mb-8 bg-primary-50 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {t(dict, 'blog.newsletter.title')}
        </h2>
        <p className="text-gray-600 mb-4">
          {t(dict, 'blog.newsletter.description')}
        </p>
        <Link
          href={`/${locale}/contact#newsletter`}
          className="btn-primary"
        >
          {t(dict, 'blog.newsletter.subscribe')}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between py-6 border-t border-gray-200">
        <Link
          href={`/${locale}/blog`}
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
          {t(dict, 'blog.allPosts')}
        </Link>

        <Link
          href={`/${locale}/contact`}
          className="text-primary-600 hover:text-primary-700 font-medium focus-ring inline-flex items-center"
        >
          {t(dict, 'blog.getInTouch')}
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
      </nav>

      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.image,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt || post.publishedAt,
            author: {
              "@type": "Organization",
              name: post.author || "Garden Bros"
            },
            publisher: {
              "@type": "Organization",
              name: "Garden Bros"
            },
            keywords: post.tags?.join(', '),
            articleSection: post.category
          })
        }}
      />
    </article>
  )
}