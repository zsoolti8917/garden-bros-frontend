import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { Locale, PortfolioContent } from '@/types/content'
import { getTranslation, t } from '@/lib/i18n'
import { GalleryLazyLoader, getAdaptiveLoadingConfig } from '@/lib/lazy-loading'
import { createImageProps, getLoadingStrategy, COMMON_SIZES } from '@/lib/images'

interface PortfolioGalleryProps {
  portfolio: PortfolioContent[]
  locale: Locale
}

export default function PortfolioGallery({ portfolio, locale }: PortfolioGalleryProps) {
  const dict = getTranslation(locale)
  const galleryRef = useRef<HTMLDivElement>(null)
  const lazyLoaderRef = useRef<GalleryLazyLoader | null>(null)

  useEffect(() => {
    if (galleryRef.current && portfolio.length > 0) {
      const adaptiveConfig = getAdaptiveLoadingConfig()
      lazyLoaderRef.current = new GalleryLazyLoader(galleryRef.current, adaptiveConfig)

      return () => {
        lazyLoaderRef.current?.destroy()
      }
    }
  }, [portfolio])

  useEffect(() => {
    // Update observer when portfolio changes
    if (lazyLoaderRef.current) {
      lazyLoaderRef.current.updateImages()
    }
  }, [portfolio])

  if (portfolio.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          {t(dict, 'portfolio.noItems')}
        </p>
      </div>
    )
  }

  return (
    <div ref={galleryRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {portfolio.map((item, index) => {
        const loadingStrategy = getLoadingStrategy(index, index < 3 ? 'high' : 'normal')
        return (
        <Link
          key={item.slug}
          href={`/${locale}/portfolio/${item.slug}`}
          className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 focus-ring"
        >
          {/* Image */}
          {item.image && (
            <div className="relative h-64 overflow-hidden">
              <Image
                {...createImageProps({
                  src: item.image,
                  alt: item.title,
                  sizes: COMMON_SIZES.gallery,
                  priority: loadingStrategy.priority,
                  fill: true,
                  className: "object-cover group-hover:scale-105 transition-transform duration-500"
                })}
                data-src={item.image}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

              {/* Category Badge */}
              {item.category && (
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 text-xs font-medium bg-white/90 text-gray-900 rounded-full backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
              )}

              {/* Featured Badge */}
              {item.featured && (
                <div className="absolute top-4 right-4">
                  <span className="flex items-center px-2 py-1 text-xs font-medium bg-yellow-500/90 text-white rounded-full backdrop-blur-sm">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {t(dict, 'portfolio.featured')}
                  </span>
                </div>
              )}

              {/* View Icon */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg
                    className="w-4 h-4 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 flex-1">
                {item.title}
              </h3>
              {item.completionDate && (
                <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                  {new Date(item.completionDate).getFullYear()}
                </span>
              )}
            </div>

            {item.excerpt && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {item.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              {item.location && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {item.location}
                </span>
              )}

              {item.client && (
                <span className="text-right">
                  {item.client}
                </span>
              )}
            </div>

            {/* Services Used */}
            {item.services && item.services.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {item.services.slice(0, 3).map((service, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {service}
                  </span>
                ))}
                {item.services.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    +{item.services.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
        )
      })}
    </div>
  )
}