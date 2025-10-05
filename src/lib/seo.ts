'use client'

// SEO utilities for meta tags, structured data, and search optimization

export interface SEOConfig {
  siteName: string
  siteUrl: string
  defaultTitle: string
  defaultDescription: string
  defaultImage: string
  twitterHandle?: string
  facebookAppId?: string
  locale: string
  locales: string[]
}

export interface PageSEO {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product' | 'service'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
  noindex?: boolean
  nofollow?: boolean
  canonical?: string
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface OrganizationSchema {
  name: string
  url: string
  logo: string
  description: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  contactPoint: {
    telephone: string
    contactType: string
    email?: string
  }
  sameAs: string[]
  foundingDate?: string
  numberOfEmployees?: string
}

export interface ServiceSchema {
  name: string
  description: string
  provider: string
  areaServed: string
  serviceType: string
  offers?: {
    price?: string
    priceCurrency?: string
    availability?: string
  }
}

export const DEFAULT_SEO_CONFIG: SEOConfig = {
  siteName: 'Garden Bros',
  siteUrl: 'https://gardenbros.sk',
  defaultTitle: 'Garden Bros - Professional Garden Care Services',
  defaultDescription: 'Professional garden care services in Bratislava and surroundings. Lawn maintenance, garden design, tree services, and landscaping solutions.',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@gardenbros',
  locale: 'sk_SK',
  locales: ['sk_SK', 'hu_HU', 'en_US']
}

/**
 * SEO utility class for managing meta tags and structured data
 */
export class SEOManager {
  private config: SEOConfig

  constructor(config: SEOConfig = DEFAULT_SEO_CONFIG) {
    this.config = config
  }

  /**
   * Generate meta tags for a page
   */
  generateMetaTags(pageSEO: PageSEO): React.ReactElement[] {
    const {
      title,
      description,
      image = this.config.defaultImage,
      url = this.config.siteUrl,
      type = 'website',
      publishedTime,
      modifiedTime,
      author,
      tags,
      noindex = false,
      nofollow = false,
      canonical
    } = pageSEO

    const fullTitle = title.includes(this.config.siteName)
      ? title
      : `${title} | ${this.config.siteName}`

    const fullImageUrl = image.startsWith('http')
      ? image
      : `${this.config.siteUrl}${image}`

    const fullUrl = url.startsWith('http')
      ? url
      : `${this.config.siteUrl}${url}`

    const metaTags: React.ReactElement[] = []

    // Basic meta tags
    metaTags.push(
      React.createElement('title', { key: 'title' }, fullTitle),
      React.createElement('meta', {
        key: 'description',
        name: 'description',
        content: description
      }),
      React.createElement('meta', {
        key: 'image',
        name: 'image',
        content: fullImageUrl
      })
    )

    // Robots meta
    if (noindex || nofollow) {
      const robotsContent = [
        noindex ? 'noindex' : 'index',
        nofollow ? 'nofollow' : 'follow'
      ].join(', ')

      metaTags.push(
        React.createElement('meta', {
          key: 'robots',
          name: 'robots',
          content: robotsContent
        })
      )
    }

    // Canonical URL
    if (canonical) {
      metaTags.push(
        React.createElement('link', {
          key: 'canonical',
          rel: 'canonical',
          href: canonical
        })
      )
    }

    // Open Graph tags
    metaTags.push(
      React.createElement('meta', {
        key: 'og:title',
        property: 'og:title',
        content: fullTitle
      }),
      React.createElement('meta', {
        key: 'og:description',
        property: 'og:description',
        content: description
      }),
      React.createElement('meta', {
        key: 'og:image',
        property: 'og:image',
        content: fullImageUrl
      }),
      React.createElement('meta', {
        key: 'og:url',
        property: 'og:url',
        content: fullUrl
      }),
      React.createElement('meta', {
        key: 'og:type',
        property: 'og:type',
        content: type
      }),
      React.createElement('meta', {
        key: 'og:site_name',
        property: 'og:site_name',
        content: this.config.siteName
      }),
      React.createElement('meta', {
        key: 'og:locale',
        property: 'og:locale',
        content: this.config.locale
      })
    )

    // Additional OG tags for articles
    if (type === 'article') {
      if (publishedTime) {
        metaTags.push(
          React.createElement('meta', {
            key: 'article:published_time',
            property: 'article:published_time',
            content: publishedTime
          })
        )
      }

      if (modifiedTime) {
        metaTags.push(
          React.createElement('meta', {
            key: 'article:modified_time',
            property: 'article:modified_time',
            content: modifiedTime
          })
        )
      }

      if (author) {
        metaTags.push(
          React.createElement('meta', {
            key: 'article:author',
            property: 'article:author',
            content: author
          })
        )
      }

      if (tags) {
        tags.forEach((tag, index) => {
          metaTags.push(
            React.createElement('meta', {
              key: `article:tag:${index}`,
              property: 'article:tag',
              content: tag
            })
          )
        })
      }
    }

    // Twitter Card tags
    metaTags.push(
      React.createElement('meta', {
        key: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image'
      }),
      React.createElement('meta', {
        key: 'twitter:title',
        name: 'twitter:title',
        content: fullTitle
      }),
      React.createElement('meta', {
        key: 'twitter:description',
        name: 'twitter:description',
        content: description
      }),
      React.createElement('meta', {
        key: 'twitter:image',
        name: 'twitter:image',
        content: fullImageUrl
      })
    )

    if (this.config.twitterHandle) {
      metaTags.push(
        React.createElement('meta', {
          key: 'twitter:site',
          name: 'twitter:site',
          content: this.config.twitterHandle
        }),
        React.createElement('meta', {
          key: 'twitter:creator',
          name: 'twitter:creator',
          content: this.config.twitterHandle
        })
      )
    }

    // Facebook App ID
    if (this.config.facebookAppId) {
      metaTags.push(
        React.createElement('meta', {
          key: 'fb:app_id',
          property: 'fb:app_id',
          content: this.config.facebookAppId
        })
      )
    }

    return metaTags
  }

  /**
   * Generate organization structured data
   */
  generateOrganizationSchema(org: OrganizationSchema): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: org.name,
      url: org.url,
      logo: {
        '@type': 'ImageObject',
        url: org.logo
      },
      description: org.description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: org.address.streetAddress,
        addressLocality: org.address.addressLocality,
        addressRegion: org.address.addressRegion,
        postalCode: org.address.postalCode,
        addressCountry: org.address.addressCountry
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: org.contactPoint.telephone,
        contactType: org.contactPoint.contactType,
        ...(org.contactPoint.email && { email: org.contactPoint.email })
      },
      sameAs: org.sameAs,
      ...(org.foundingDate && { foundingDate: org.foundingDate }),
      ...(org.numberOfEmployees && { numberOfEmployees: org.numberOfEmployees })
    }
  }

  /**
   * Generate local business structured data
   */
  generateLocalBusinessSchema(business: OrganizationSchema & {
    openingHours?: string[]
    priceRange?: string
    aggregateRating?: {
      ratingValue: number
      reviewCount: number
    }
  }): object {
    const baseSchema = this.generateOrganizationSchema(business)

    return {
      ...baseSchema,
      '@type': 'LocalBusiness',
      ...(business.openingHours && { openingHours: business.openingHours }),
      ...(business.priceRange && { priceRange: business.priceRange }),
      ...(business.aggregateRating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: business.aggregateRating.ratingValue,
          reviewCount: business.aggregateRating.reviewCount
        }
      })
    }
  }

  /**
   * Generate service structured data
   */
  generateServiceSchema(service: ServiceSchema): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      description: service.description,
      provider: {
        '@type': 'Organization',
        name: service.provider
      },
      areaServed: service.areaServed,
      serviceType: service.serviceType,
      ...(service.offers && {
        offers: {
          '@type': 'Offer',
          ...(service.offers.price && { price: service.offers.price }),
          ...(service.offers.priceCurrency && { priceCurrency: service.offers.priceCurrency }),
          ...(service.offers.availability && { availability: service.offers.availability })
        }
      })
    }
  }

  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${this.config.siteUrl}${item.url}`
      }))
    }
  }

  /**
   * Generate FAQ structured data
   */
  generateFAQSchema(faqs: Array<{ question: string; answer: string }>): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  }

  /**
   * Generate article structured data
   */
  generateArticleSchema(article: {
    headline: string
    description: string
    image: string
    author: string
    publishedDate: string
    modifiedDate?: string
    url: string
  }): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.headline,
      description: article.description,
      image: article.image.startsWith('http') ? article.image : `${this.config.siteUrl}${article.image}`,
      author: {
        '@type': 'Person',
        name: article.author
      },
      publisher: {
        '@type': 'Organization',
        name: this.config.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${this.config.siteUrl}/images/logo.png`
        }
      },
      datePublished: article.publishedDate,
      ...(article.modifiedDate && { dateModified: article.modifiedDate }),
      url: article.url.startsWith('http') ? article.url : `${this.config.siteUrl}${article.url}`
    }
  }

  /**
   * Generate website structured data
   */
  generateWebsiteSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.config.siteName,
      url: this.config.siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.config.siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  }
}

/**
 * SEO validation utilities
 */
export class SEOValidator {
  /**
   * Validate page SEO elements
   */
  static validatePageSEO(): {
    title: { valid: boolean; issues: string[] }
    description: { valid: boolean; issues: string[] }
    headings: { valid: boolean; issues: string[] }
    images: { valid: boolean; issues: string[] }
    links: { valid: boolean; issues: string[] }
  } {
    const issues = {
      title: { valid: true, issues: [] as string[] },
      description: { valid: true, issues: [] as string[] },
      headings: { valid: true, issues: [] as string[] },
      images: { valid: true, issues: [] as string[] },
      links: { valid: true, issues: [] as string[] }
    }

    // Validate title
    const title = document.querySelector('title')?.textContent || ''
    if (!title) {
      issues.title.valid = false
      issues.title.issues.push('Missing page title')
    } else {
      if (title.length < 30) {
        issues.title.valid = false
        issues.title.issues.push('Title too short (minimum 30 characters)')
      }
      if (title.length > 60) {
        issues.title.valid = false
        issues.title.issues.push('Title too long (maximum 60 characters)')
      }
    }

    // Validate meta description
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
    if (!description) {
      issues.description.valid = false
      issues.description.issues.push('Missing meta description')
    } else {
      if (description.length < 120) {
        issues.description.valid = false
        issues.description.issues.push('Description too short (minimum 120 characters)')
      }
      if (description.length > 160) {
        issues.description.valid = false
        issues.description.issues.push('Description too long (maximum 160 characters)')
      }
    }

    // Validate heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const h1s = document.querySelectorAll('h1')

    if (h1s.length === 0) {
      issues.headings.valid = false
      issues.headings.issues.push('Missing H1 tag')
    } else if (h1s.length > 1) {
      issues.headings.valid = false
      issues.headings.issues.push('Multiple H1 tags found')
    }

    // Check heading hierarchy
    let previousLevel = 0
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1))
      if (level - previousLevel > 1) {
        issues.headings.valid = false
        issues.headings.issues.push(`Heading hierarchy skipped from H${previousLevel} to H${level}`)
      }
      previousLevel = level
    })

    // Validate images
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      if (!img.getAttribute('alt')) {
        issues.images.valid = false
        issues.images.issues.push('Image missing alt attribute')
      }
    })

    // Validate links
    const links = document.querySelectorAll('a')
    links.forEach(link => {
      const href = link.getAttribute('href')
      if (!href || href === '#') {
        issues.links.valid = false
        issues.links.issues.push('Link missing or invalid href')
      }

      if (link.textContent?.trim() === '') {
        issues.links.valid = false
        issues.links.issues.push('Link has no text content')
      }
    })

    return issues
  }

  /**
   * Check for duplicate content issues
   */
  static checkDuplicateContent(): string[] {
    const issues: string[] = []

    // Check for duplicate titles
    const titles = Array.from(document.querySelectorAll('title'))
    if (titles.length > 1) {
      issues.push('Multiple title tags found')
    }

    // Check for duplicate meta descriptions
    const descriptions = Array.from(document.querySelectorAll('meta[name="description"]'))
    if (descriptions.length > 1) {
      issues.push('Multiple meta description tags found')
    }

    return issues
  }
}

/**
 * Default Garden Bros organization schema
 */
export const GARDEN_BROS_ORGANIZATION: OrganizationSchema = {
  name: 'Garden Bros',
  url: 'https://gardenbros.sk',
  logo: 'https://gardenbros.sk/images/logo.png',
  description: 'Professional garden care services in Bratislava and surroundings. Lawn maintenance, garden design, tree services, and landscaping solutions.',
  address: {
    streetAddress: 'Hlavná 123',
    addressLocality: 'Bratislava',
    addressRegion: 'Bratislava Region',
    postalCode: '81101',
    addressCountry: 'SK'
  },
  contactPoint: {
    telephone: '+421123456789',
    contactType: 'Customer Service',
    email: 'info@gardenbros.sk'
  },
  sameAs: [
    'https://www.facebook.com/gardenbros',
    'https://www.instagram.com/gardenbros',
    'https://www.linkedin.com/company/gardenbros'
  ],
  foundingDate: '2020-01-01',
  numberOfEmployees: '5-10'
}