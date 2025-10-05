import Link from 'next/link'
import Image from 'next/image'
import type { Locale, ServiceInformation } from '@/types/content'
import { getTranslation, t } from '@/lib/i18n'

interface ServicesListProps {
  services: ServiceInformation[]
  locale: Locale
}

export default function ServicesList({ services, locale }: ServicesListProps) {
  const dict = getTranslation(locale)

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          {t(dict, 'services.noServices')}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service) => (
        <div
          key={service.slug}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          {service.image && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {service.title}
              </h3>
              {service.category && (
                <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                  {service.category}
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">
              {service.excerpt}
            </p>

            {service.price && (
              <div className="mb-4">
                <span className="text-lg font-bold text-primary-600">
                  {service.price}
                </span>
                {service.priceNote && (
                  <span className="text-sm text-gray-500 ml-2">
                    {service.priceNote}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Link
                href={`/${locale}/services/${service.slug}`}
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

              {service.featured && (
                <span className="flex items-center text-yellow-600 text-sm font-medium">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {t(dict, 'services.featured')}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}