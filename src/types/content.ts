// Content Entity Types based on data-model.md

export interface ServiceInformation {
  id: string
  title: string
  description: string
  pricing?: string
  availability?: string
  category: ServiceCategory
  featured: boolean
  images: string[]
  slug: string
  metaTitle?: string
  metaDescription?: string
  locale: Locale
}

export interface PortfolioContent {
  id: string
  title: string
  description: string
  beforeImages: string[]
  afterImages: string[]
  galleryImages?: string[]
  clientTestimonial?: string
  completionDate: string
  serviceCategory: string
  featured: boolean
  location?: string
  slug: string
  locale: Locale
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishDate: string
  lastModified?: string
  tags: string[]
  featuredImage: string
  published: boolean
  slug: string
  metaTitle?: string
  metaDescription?: string
  locale: Locale
}

export interface BusinessInformation {
  companyName: string
  description: string
  address: string
  phone: string
  email: string
  operatingHours: OperatingHours
  socialMedia: SocialMedia
  logo: string
}

export interface TeamMember {
  name: string
  position: string
  bio?: string
  photo?: string
  email?: string
}

export interface TeamMembers {
  teamMembers: TeamMember[]
}

// Supporting Types
export type ServiceCategory =
  | 'lawn-care'
  | 'garden-design'
  | 'tree-services'
  | 'maintenance'

export type Locale = 'sk' | 'hu' | 'en'

export interface OperatingHours {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}

export interface SocialMedia {
  facebook?: string
  instagram?: string
  linkedin?: string
}

// Content with Frontmatter
export interface ContentWithMatter<T> {
  content: string
  data: T
  slug: string
  filePath: string
}

// Multilingual Content Structure
export interface MultilingualContent<T> {
  sk?: T
  hu?: T
  en?: T
}

// Page Props
export interface PageProps {
  params: {
    locale: Locale
    slug?: string
  }
}

// SEO Meta
export interface SEOMeta {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  openGraph?: {
    title: string
    description: string
    image?: string
    type?: string
  }
}