'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import type { Locale } from '@/types/content'
import { getNavigation, getTranslation, t, localeLabels, localeFlags } from '@/lib/i18n'
import LanguageSwitcher from './LanguageSwitcher'

interface HeaderProps {
  locale: Locale
}

export default function Header({ locale }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const navigation = getNavigation(locale)
  const dict = getTranslation(locale)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4 lg:py-6">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href={`/${locale}`} className="focus-ring">
              <span className="sr-only">Garden Bros</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GB</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Garden Bros</span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 focus-ring px-3 py-2 rounded ${
                  pathname === item.href
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Language switcher and mobile menu button */}
          <div className="flex lg:flex-1 lg:justify-end items-center space-x-4">
            <LanguageSwitcher locale={locale} />

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="focus-ring -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 min-h-[44px] min-w-[44px]"
                onClick={() => setMobileMenuOpen(true)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">{t(dict, 'common.menu')}</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden" id="mobile-menu">
            <div className="fixed inset-0 z-50" />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link href={`/${locale}`} className="focus-ring -m-1.5 p-1.5">
                  <span className="sr-only">Garden Bros</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">GB</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">Garden Bros</span>
                  </div>
                </Link>
                <button
                  type="button"
                  className="focus-ring -m-2.5 rounded-md p-2.5 text-gray-700 min-h-[44px] min-w-[44px]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">{t(dict, 'common.close')}</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors duration-200 min-h-[44px] flex items-center ${
                          pathname === item.href
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-gray-900 hover:bg-gray-50'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}