import Link from 'next/link'
import type { Locale } from '@/types/content'
import { getTranslation, t, getNavigation } from '@/lib/i18n'
import { getBusinessInfo } from '@/lib/content'

interface FooterProps {
  locale: Locale
}

export default async function Footer({ locale }: FooterProps) {
  const dict = getTranslation(locale)
  const navigation = getNavigation(locale)
  const businessInfo = await getBusinessInfo()

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        {/* Main footer content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">GB</span>
                </div>
                <span className="text-2xl font-bold">Garden Bros</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                {t(dict, 'footer.description')}
              </p>

              {businessInfo && (
                <div className="space-y-2 text-gray-300">
                  <p>{businessInfo.address}</p>
                  <p>
                    <a
                      href={`tel:${businessInfo.phone}`}
                      className="hover:text-primary-400 transition-colors focus-ring"
                    >
                      {businessInfo.phone}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`mailto:${businessInfo.email}`}
                      className="hover:text-primary-400 transition-colors focus-ring"
                    >
                      {businessInfo.email}
                    </a>
                  </p>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">{t(dict, 'footer.quickLinks')}</h3>
              <ul className="space-y-3">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors focus-ring inline-block py-1"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h3 className="text-lg font-semibold mb-6">{t(dict, 'footer.social')}</h3>
              {businessInfo?.socialMedia && (
                <div className="space-y-3">
                  {businessInfo.socialMedia.facebook && (
                    <a
                      href={businessInfo.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-primary-400 transition-colors focus-ring py-1"
                    >
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </a>
                  )}
                  {businessInfo.socialMedia.instagram && (
                    <a
                      href={businessInfo.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-primary-400 transition-colors focus-ring py-1"
                    >
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.354-1.057-2.354-2.354 0-1.297 1.057-2.354 2.354-2.354 1.297 0 2.354 1.057 2.354 2.354 0 1.297-1.057 2.354-2.354 2.354zm7.718 0c-1.297 0-2.354-1.057-2.354-2.354 0-1.297 1.057-2.354 2.354-2.354 1.297 0 2.354 1.057 2.354 2.354 0 1.297-1.057 2.354-2.354 2.354z"/>
                      </svg>
                      Instagram
                    </a>
                  )}
                  {businessInfo.socialMedia.linkedin && (
                    <a
                      href={businessInfo.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-primary-400 transition-colors focus-ring py-1"
                    >
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              )}

              {/* Operating Hours */}
              {businessInfo?.operatingHours && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">
                    {t(dict, 'footer.operatingHours')}
                  </h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div className="flex justify-between">
                      <span>Po-Pi:</span>
                      <span>{businessInfo.operatingHours.monday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>So:</span>
                      <span>{businessInfo.operatingHours.saturday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ne:</span>
                      <span>{businessInfo.operatingHours.sunday}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} {t(dict, 'footer.company')}. {t(dict, 'footer.rights')}.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link
                href={`/${locale}/privacy`}
                className="hover:text-primary-400 transition-colors focus-ring"
              >
                Privacy Policy
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="hover:text-primary-400 transition-colors focus-ring"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}