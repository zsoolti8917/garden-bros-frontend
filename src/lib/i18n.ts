import type { Locale } from '@/types/content'

// Supported locales configuration
export const locales: Locale[] = ['sk', 'hu', 'en']
export const defaultLocale: Locale = 'sk'

// Locale labels for UI
export const localeLabels: Record<Locale, string> = {
  sk: 'Slovenčina',
  hu: 'Magyar',
  en: 'English',
}

// Locale flags for UI
export const localeFlags: Record<Locale, string> = {
  sk: '🇸🇰',
  hu: '🇭🇺',
  en: '🇬🇧',
}

// Check if locale is valid
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

// Get locale from path or use default
export function getLocaleFromPath(path: string): Locale {
  const segments = path.split('/')
  const possibleLocale = segments[1]

  if (isValidLocale(possibleLocale)) {
    return possibleLocale
  }

  return defaultLocale
}

// Generate paths for all locales
export function generateLocalePaths(path: string): string[] {
  return locales.map(locale => `/${locale}${path}`)
}

// Remove locale from path
export function removeLocaleFromPath(path: string): string {
  const segments = path.split('/')
  if (segments.length > 1 && isValidLocale(segments[1])) {
    return '/' + segments.slice(2).join('/')
  }
  return path
}

// Add locale to path
export function addLocaleToPath(path: string, locale: Locale): string {
  const cleanPath = removeLocaleFromPath(path)
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`
}

// Get alternate locale URLs for SEO
export function getAlternateUrls(path: string, baseUrl: string = ''): Record<Locale, string> {
  const cleanPath = removeLocaleFromPath(path)

  return locales.reduce((acc, locale) => {
    acc[locale] = `${baseUrl}/${locale}${cleanPath === '/' ? '' : cleanPath}`
    return acc
  }, {} as Record<Locale, string>)
}

// Dictionary type for translations
export interface Dictionary {
  [key: string]: string | Dictionary
}

// Navigation items structure
export interface NavItem {
  href: string
  label: string
  children?: NavItem[]
}

// Common translations
export const translations: Record<Locale, Dictionary> = {
  sk: {
    nav: {
      home: 'Domov',
      services: 'Služby',
      portfolio: 'Portfólio',
      blog: 'Blog',
      about: 'O nás',
      contact: 'Kontakt',
    },
    common: {
      readMore: 'Čítať viac',
      loadMore: 'Načítať viac',
      backToTop: 'Späť na vrch',
      search: 'Hľadať',
      featured: 'Odporúčané',
      recent: 'Najnovšie',
      all: 'Všetky',
      category: 'Kategória',
      date: 'Dátum',
      author: 'Autor',
      tags: 'Štítky',
      share: 'Zdieľať',
      close: 'Zavrieť',
      menu: 'Menu',
    },
    services: {
      title: 'Naše služby',
      subtitle: 'Komplexná starostlivosť o vaše zelené priestory',
      categories: {
        'lawn-care': 'Údržba trávnikov',
        'garden-design': 'Návrh záhrad',
        'tree-services': 'Stromové služby',
        'maintenance': 'Údržba',
      },
    },
    portfolio: {
      title: 'Naše práce',
      subtitle: 'Pozrite si realizované projekty',
      before: 'Pred',
      after: 'Po',
      gallery: 'Galéria',
      testimonial: 'Referencie',
      location: 'Miesto',
      completed: 'Dokončené',
    },
    contact: {
      title: 'Kontaktujte nás',
      subtitle: 'Radi vám poradíme s vašou záhradou',
      form: {
        name: 'Meno',
        email: 'Email',
        phone: 'Telefón',
        message: 'Správa',
        serviceType: 'Typ služby',
        submit: 'Odoslať',
        sending: 'Odosiela sa...',
        success: 'Správa bola úspešne odoslaná!',
        error: 'Nastala chyba pri odosielaní správy.',
      },
    },
    footer: {
      company: 'Garden Bros s.r.o.',
      description: 'Profesionálna starostlivosť o záhrady v Bratislave a okolí',
      quickLinks: 'Rýchle odkazy',
      contact: 'Kontakt',
      social: 'Sociálne siete',
      rights: 'Všetky práva vyhradené',
    },
  },
  hu: {
    nav: {
      home: 'Főoldal',
      services: 'Szolgáltatások',
      portfolio: 'Portfólió',
      blog: 'Blog',
      about: 'Rólunk',
      contact: 'Kapcsolat',
    },
    common: {
      readMore: 'Tovább olvasom',
      loadMore: 'Több betöltése',
      backToTop: 'Vissza a tetejére',
      search: 'Keresés',
      featured: 'Kiemelt',
      recent: 'Legfrissebb',
      all: 'Összes',
      category: 'Kategória',
      date: 'Dátum',
      author: 'Szerző',
      tags: 'Címkék',
      share: 'Megosztás',
      close: 'Bezárás',
      menu: 'Menü',
    },
    services: {
      title: 'Szolgáltatásaink',
      subtitle: 'Teljes körű gondoskodás a zöld területekről',
      categories: {
        'lawn-care': 'Gyep karbantartás',
        'garden-design': 'Kerttervezés',
        'tree-services': 'Fa szolgáltatások',
        'maintenance': 'Karbantartás',
      },
    },
    portfolio: {
      title: 'Munkáink',
      subtitle: 'Tekintse meg megvalósított projektjeinket',
      before: 'Előtte',
      after: 'Utána',
      gallery: 'Galéria',
      testimonial: 'Referenciák',
      location: 'Helyszín',
      completed: 'Befejezve',
    },
    contact: {
      title: 'Kapcsolat',
      subtitle: 'Szívesen segítünk kertjével kapcsolatos kérdéseiben',
      form: {
        name: 'Név',
        email: 'Email',
        phone: 'Telefon',
        message: 'Üzenet',
        serviceType: 'Szolgáltatás típusa',
        submit: 'Küldés',
        sending: 'Küldés...',
        success: 'Az üzenet sikeresen elküldve!',
        error: 'Hiba történt az üzenet küldése során.',
      },
    },
    footer: {
      company: 'Garden Bros s.r.o.',
      description: 'Professzionális kertgondozás Pozsonyban és környékén',
      quickLinks: 'Gyors linkek',
      contact: 'Kapcsolat',
      social: 'Közösségi média',
      rights: 'Minden jog fenntartva',
    },
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      portfolio: 'Portfolio',
      blog: 'Blog',
      about: 'About',
      contact: 'Contact',
    },
    common: {
      readMore: 'Read more',
      loadMore: 'Load more',
      backToTop: 'Back to top',
      search: 'Search',
      featured: 'Featured',
      recent: 'Recent',
      all: 'All',
      category: 'Category',
      date: 'Date',
      author: 'Author',
      tags: 'Tags',
      share: 'Share',
      close: 'Close',
      menu: 'Menu',
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive care for your green spaces',
      categories: {
        'lawn-care': 'Lawn Care',
        'garden-design': 'Garden Design',
        'tree-services': 'Tree Services',
        'maintenance': 'Maintenance',
      },
    },
    portfolio: {
      title: 'Our Work',
      subtitle: 'See our completed projects',
      before: 'Before',
      after: 'After',
      gallery: 'Gallery',
      testimonial: 'Testimonials',
      location: 'Location',
      completed: 'Completed',
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'We are happy to help with your garden',
      form: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        message: 'Message',
        serviceType: 'Service Type',
        submit: 'Submit',
        sending: 'Sending...',
        success: 'Message sent successfully!',
        error: 'An error occurred while sending the message.',
      },
    },
    footer: {
      company: 'Garden Bros s.r.o.',
      description: 'Professional garden care in Bratislava and surroundings',
      quickLinks: 'Quick Links',
      contact: 'Contact',
      social: 'Social Media',
      rights: 'All rights reserved',
    },
  },
}

// Get translation function
export function getTranslation(locale: Locale): Dictionary {
  return translations[locale] || translations[defaultLocale]
}

// Get nested translation value
export function t(dict: Dictionary, key: string): string {
  const keys = key.split('.')
  let value: string | Dictionary = dict

  for (const k of keys) {
    if (typeof value === 'object' && value[k]) {
      value = value[k]
    } else {
      return key // Return key if translation not found
    }
  }

  return typeof value === 'string' ? value : key
}

// Navigation configuration
export function getNavigation(locale: Locale): NavItem[] {
  const dict = getTranslation(locale)

  return [
    {
      href: `/${locale}`,
      label: t(dict, 'nav.home'),
    },
    {
      href: `/${locale}/services`,
      label: t(dict, 'nav.services'),
    },
    {
      href: `/${locale}/portfolio`,
      label: t(dict, 'nav.portfolio'),
    },
    {
      href: `/${locale}/blog`,
      label: t(dict, 'nav.blog'),
    },
    {
      href: `/${locale}/about`,
      label: t(dict, 'nav.about'),
    },
    {
      href: `/${locale}/contact`,
      label: t(dict, 'nav.contact'),
    },
  ]
}