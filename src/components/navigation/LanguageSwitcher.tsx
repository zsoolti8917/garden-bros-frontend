'use client'

import { Fragment } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/20/solid'
import type { Locale } from '@/types/content'
import { locales, localeLabels, localeFlags, removeLocaleFromPath } from '@/lib/i18n'

interface LanguageSwitcherProps {
  locale: Locale
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLanguage = (newLocale: Locale) => {
    const currentPath = removeLocaleFromPath(pathname)
    const newPath = `/${newLocale}${currentPath === '/' ? '' : currentPath}`
    router.push(newPath)
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-ring min-h-[44px]">
          <GlobeAltIcon className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">
            {localeFlags[locale]} {localeLabels[locale]}
          </span>
          <span className="sm:hidden">
            {localeFlags[locale]}
          </span>
          <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {locales.map((loc) => (
              <Menu.Item key={loc}>
                {({ active }) => (
                  <button
                    onClick={() => switchLanguage(loc)}
                    className={`group flex w-full items-center px-4 py-2 text-sm transition-colors min-h-[44px] ${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } ${
                      loc === locale ? 'bg-primary-50 text-primary-600' : ''
                    }`}
                  >
                    <span className="mr-3">{localeFlags[loc]}</span>
                    {localeLabels[loc]}
                    {loc === locale && (
                      <span className="ml-auto">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}