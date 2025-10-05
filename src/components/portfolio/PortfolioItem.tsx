import Image from 'next/image'
import Link from 'next/link'
import type { Locale, PortfolioContent } from '@/types/content'
import { getTranslation, t } from '@/lib/i18n'

interface PortfolioItemProps {
  item: PortfolioContent
  locale: Locale
}

export default function PortfolioItem({ item, locale }: PortfolioItemProps) {
  const dict = getTranslation(locale)

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            href={`/${locale}/portfolio`}
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
            {t(dict, 'portfolio.backToPortfolio')}
          </Link>

          {item.category && (
            <span className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full">
              {item.category}
            </span>
          )}
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {item.title}
        </h1>

        {item.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            {item.excerpt}
          </p>
        )}

        {/* Project Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          {item.client && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">
                {t(dict, 'portfolio.client')}
              </dt>
              <dd className="text-gray-900">{item.client}</dd>
            </div>
          )}

          {item.location && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">
                {t(dict, 'portfolio.location')}
              </dt>
              <dd className="text-gray-900">{item.location}</dd>
            </div>
          )}

          {item.completionDate && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">
                {t(dict, 'portfolio.completed')}
              </dt>
              <dd className="text-gray-900">
                {new Date(item.completionDate).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </dd>
            </div>
          )}
        </div>
      </header>

      {/* Main Image */}
      {item.image && (
        <div className="relative h-64 lg:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          {/* Description */}
          {item.description && (
            <div className="prose prose-lg max-w-none mb-8">
              <div
                dangerouslySetInnerHTML={{ __html: item.description }}
                className="text-gray-700 leading-relaxed"
              />
            </div>
          )}

          {/* Challenges */}
          {item.challenges && item.challenges.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t(dict, 'portfolio.challenges')}
              </h2>
              <ul className="space-y-3">
                {item.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-orange-600 mt-1 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Solutions */}
          {item.solutions && item.solutions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t(dict, 'portfolio.solutions')}
              </h2>
              <ul className="space-y-3">
                {item.solutions.map((solution, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
            {/* Services Used */}
            {item.services && item.services.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t(dict, 'portfolio.servicesUsed')}
                </h3>
                <ul className="space-y-2">
                  {item.services.map((service, index) => (
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
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Project Duration */}
            {item.duration && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t(dict, 'portfolio.duration')}
                </h3>
                <p className="text-gray-700">{item.duration}</p>
              </div>
            )}

            {/* Project Size */}
            {item.projectSize && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t(dict, 'portfolio.projectSize')}
                </h3>
                <p className="text-gray-700">{item.projectSize}</p>
              </div>
            )}

            {/* CTA */}
            <div className="space-y-3">
              <Link
                href={`/${locale}/contact?portfolio=${item.slug}`}
                className="btn-primary w-full text-center block"
              >
                {t(dict, 'portfolio.similarProject')}
              </Link>
              <Link
                href={`/${locale}/services`}
                className="btn-outline w-full text-center block"
              >
                {t(dict, 'portfolio.viewServices')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {item.gallery && item.gallery.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t(dict, 'portfolio.projectGallery')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {item.gallery.map((image, index) => (
              <div key={index} className="relative h-48 rounded-lg overflow-hidden group">
                <Image
                  src={image.url}
                  alt={image.alt || `${item.title} - ${index + 1}`}
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

      {/* Testimonial */}
      {item.testimonial && (
        <div className="mb-8 bg-primary-50 rounded-lg p-6">
          <blockquote className="text-lg text-gray-700 italic mb-4">
            "{item.testimonial.quote}"
          </blockquote>
          <cite className="text-sm text-gray-600 not-italic">
            — {item.testimonial.author}
            {item.testimonial.position && `, ${item.testimonial.position}`}
          </cite>
        </div>
      )}

      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: item.title,
            description: item.excerpt || item.description,
            image: item.image,
            creator: {
              "@type": "Organization",
              name: "Garden Bros"
            },
            ...(item.completionDate && {
              datePublished: item.completionDate
            }),
            ...(item.client && {
              sponsor: {
                "@type": "Organization",
                name: item.client
              }
            })
          })
        }}
      />
    </article>
  )
}