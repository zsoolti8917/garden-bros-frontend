import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Locale } from '@/types/content'
import { isValidLocale, getTranslation, t } from '@/lib/i18n'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/content'
import BlogPost from '@/components/blog/BlogPost'

interface BlogPostPageProps {
  params: { lang: string; slug: string }
}

export async function generateStaticParams() {
  const posts = await getBlogPosts('sk') // Use default locale for generation

  return posts.map(post => ({
    slug: post.slug
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const post = await getBlogPostBySlug(params.slug, locale)

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  return {
    title: `${post.title} - Garden Bros Blog`,
    description: post.excerpt || post.content?.substring(0, 160),
    keywords: [
      post.title,
      post.category,
      'garden blog',
      'gardening tips',
      ...(post.tags || [])
    ].filter(Boolean),
    openGraph: {
      title: `${post.title} - Garden Bros Blog`,
      description: post.excerpt || post.content?.substring(0, 160),
      type: 'article',
      locale: locale === 'sk' ? 'sk_SK' : locale === 'hu' ? 'hu_HU' : 'en_US',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author || 'Garden Bros'],
      section: post.category,
      tags: post.tags,
      images: post.image ? [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} - Garden Bros Blog`,
      description: post.excerpt || post.content?.substring(0, 160),
      images: post.image ? [post.image] : [],
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const dict = getTranslation(locale)

  const post = await getBlogPostBySlug(params.slug, locale)

  if (!post || !post.published) {
    notFound()
  }

  // Get related posts (same category or tags, different slug)
  const allPosts = await getBlogPosts(locale)
  const relatedPosts = allPosts
    .filter(p =>
      p.published &&
      p.slug !== post.slug && (
        p.category === post.category ||
        (post.tags && p.tags && p.tags.some(tag => post.tags!.includes(tag)))
      )
    )
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
              <a href={`/${locale}/blog`} className="hover:text-primary-600 focus-ring">
                {t(dict, 'common.blog')}
              </a>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium truncate">
              {post.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Blog Post */}
      <main className="py-8 lg:py-12">
        <div className="container-custom">
          <BlogPost post={post} locale={locale} />
        </div>
      </main>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t(dict, 'blog.relatedPosts')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(relatedPost => (
                <article
                  key={relatedPost.slug}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  {relatedPost.image && (
                    <div className="relative h-48">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover"
                      />
                      {relatedPost.category && (
                        <div className="absolute top-4 left-4">
                          <span className="px-2 py-1 text-xs font-medium bg-white/90 text-gray-900 rounded-full backdrop-blur-sm">
                            {t(dict, `blog.categories.${relatedPost.category}`)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <time dateTime={relatedPost.publishedAt}>
                        {new Date(relatedPost.publishedAt).toLocaleDateString(locale)}
                      </time>
                      {relatedPost.author && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{relatedPost.author}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      <a
                        href={`/${locale}/blog/${relatedPost.slug}`}
                        className="hover:text-primary-600 transition-colors focus-ring"
                      >
                        {relatedPost.title}
                      </a>
                    </h3>

                    {relatedPost.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                    )}

                    <a
                      href={`/${locale}/blog/${relatedPost.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium focus-ring inline-flex items-center text-sm"
                    >
                      {t(dict, 'common.readMore')}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>

                    {/* Tags */}
                    {relatedPost.tags && relatedPost.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {relatedPost.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {relatedPost.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            +{relatedPost.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Navigation */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <a
              href={`/${locale}/blog`}
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
              {t(dict, 'blog.backToBlog')}
            </a>

            <div className="flex items-center space-x-4">
              <a
                href={`/${locale}/services`}
                className="text-gray-600 hover:text-primary-600 font-medium focus-ring"
              >
                {t(dict, 'blog.viewServices')}
              </a>
              <a
                href={`/${locale}/contact`}
                className="btn-primary"
              >
                {t(dict, 'blog.getStarted')}
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
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.image,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt || post.publishedAt,
            author: {
              "@type": "Organization", // or "Person" if individual author
              name: post.author || "Garden Bros"
            },
            publisher: {
              "@type": "Organization",
              name: "Garden Bros"
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://gardenbros.sk/${locale}/blog/${post.slug}`
            },
            keywords: post.tags?.join(', '),
            articleSection: post.category,
            inLanguage: locale,
            url: `https://gardenbros.sk/${locale}/blog/${post.slug}`
          })
        }}
      />
    </div>
  )
}