import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import type {
  ServiceInformation,
  PortfolioContent,
  BlogPost,
  BusinessInformation,
  TeamMembers,
  ContentWithMatter,
  Locale,
} from '@/types/content'

const contentDirectory = path.join(process.cwd(), 'content')

// Generic content fetching function
export async function getContentBySlug<T>(
  contentType: string,
  slug: string,
  locale: Locale
): Promise<ContentWithMatter<T> | null> {
  try {
    const fullPath = path.join(contentDirectory, contentType, locale, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // Process markdown content
    const processedContent = await remark().use(html).process(content)
    const contentHtml = processedContent.toString()

    return {
      content: contentHtml,
      data: data as T,
      slug,
      filePath: fullPath,
    }
  } catch (error) {
    console.error(`Error reading content: ${contentType}/${locale}/${slug}`, error)
    return null
  }
}

// Get all content slugs for a content type and locale
export function getContentSlugs(contentType: string, locale: Locale): string[] {
  try {
    const fullPath = path.join(contentDirectory, contentType, locale)

    if (!fs.existsSync(fullPath)) {
      return []
    }

    const fileNames = fs.readdirSync(fullPath)
    return fileNames
      .filter((name) => name.endsWith('.md'))
      .map((name) => name.replace(/\.md$/, ''))
  } catch (error) {
    console.error(`Error reading content directory: ${contentType}/${locale}`, error)
    return []
  }
}

// Get all content items for a content type and locale
export async function getAllContent<T>(
  contentType: string,
  locale: Locale
): Promise<ContentWithMatter<T>[]> {
  const slugs = getContentSlugs(contentType, locale)
  const allContent = await Promise.all(
    slugs.map((slug) => getContentBySlug<T>(contentType, slug, locale))
  )

  return allContent
    .filter((content): content is ContentWithMatter<T> => content !== null)
    .sort((a, b) => {
      // Sort by date if available, otherwise by title
      const aDate = (a.data as any).publishDate || (a.data as any).completionDate
      const bDate = (b.data as any).publishDate || (b.data as any).completionDate

      if (aDate && bDate) {
        return new Date(bDate).getTime() - new Date(aDate).getTime()
      }

      const aTitle = (a.data as any).title || ''
      const bTitle = (b.data as any).title || ''
      return aTitle.localeCompare(bTitle)
    })
}

// Service-specific functions
export async function getService(slug: string, locale: Locale): Promise<ContentWithMatter<ServiceInformation> | null> {
  return getContentBySlug<ServiceInformation>('services', slug, locale)
}

export async function getAllServices(locale: Locale): Promise<ContentWithMatter<ServiceInformation>[]> {
  return getAllContent<ServiceInformation>('services', locale)
}

export async function getFeaturedServices(locale: Locale): Promise<ContentWithMatter<ServiceInformation>[]> {
  const allServices = await getAllServices(locale)
  return allServices.filter((service) => service.data.featured)
}

// Portfolio-specific functions
export async function getPortfolioItem(slug: string, locale: Locale): Promise<ContentWithMatter<PortfolioContent> | null> {
  return getContentBySlug<PortfolioContent>('portfolio', slug, locale)
}

export async function getAllPortfolio(locale: Locale): Promise<ContentWithMatter<PortfolioContent>[]> {
  return getAllContent<PortfolioContent>('portfolio', locale)
}

export async function getFeaturedPortfolio(locale: Locale): Promise<ContentWithMatter<PortfolioContent>[]> {
  const allPortfolio = await getAllPortfolio(locale)
  return allPortfolio.filter((item) => item.data.featured)
}

// Blog-specific functions
export async function getBlogPost(slug: string, locale: Locale): Promise<ContentWithMatter<BlogPost> | null> {
  return getContentBySlug<BlogPost>('blog', slug, locale)
}

export async function getAllBlogPosts(locale: Locale): Promise<ContentWithMatter<BlogPost>[]> {
  const allPosts = await getAllContent<BlogPost>('blog', locale)
  return allPosts.filter((post) => post.data.published)
}

export async function getBlogPostsByTag(tag: string, locale: Locale): Promise<ContentWithMatter<BlogPost>[]> {
  const allPosts = await getAllBlogPosts(locale)
  return allPosts.filter((post) =>
    post.data.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase())
  )
}

// Business information functions
export async function getBusinessInfo(): Promise<BusinessInformation | null> {
  try {
    const fullPath = path.join(contentDirectory, 'business', 'company-info.md')

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return data as BusinessInformation
  } catch (error) {
    console.error('Error reading business information:', error)
    return null
  }
}

export async function getTeamMembers(): Promise<TeamMembers | null> {
  try {
    const fullPath = path.join(contentDirectory, 'business', 'team-members.md')

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return data as TeamMembers
  } catch (error) {
    console.error('Error reading team members:', error)
    return null
  }
}

// Utility functions
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function excerpt(content: string, length: number = 150): string {
  const textContent = content.replace(/<[^>]*>/g, '') // Remove HTML tags
  if (textContent.length <= length) return textContent
  return textContent.slice(0, length).replace(/\s+\S*$/, '') + '...'
}

// Search functionality
export async function searchContent(
  query: string,
  locale: Locale,
  contentTypes: string[] = ['services', 'portfolio', 'blog']
): Promise<{
  services: ContentWithMatter<ServiceInformation>[]
  portfolio: ContentWithMatter<PortfolioContent>[]
  blog: ContentWithMatter<BlogPost>[]
}> {
  const results = {
    services: [] as ContentWithMatter<ServiceInformation>[],
    portfolio: [] as ContentWithMatter<PortfolioContent>[],
    blog: [] as ContentWithMatter<BlogPost>[],
  }

  const searchTerm = query.toLowerCase()

  if (contentTypes.includes('services')) {
    const services = await getAllServices(locale)
    results.services = services.filter(
      (service) =>
        service.data.title.toLowerCase().includes(searchTerm) ||
        service.data.description.toLowerCase().includes(searchTerm)
    )
  }

  if (contentTypes.includes('portfolio')) {
    const portfolio = await getAllPortfolio(locale)
    results.portfolio = portfolio.filter(
      (item) =>
        item.data.title.toLowerCase().includes(searchTerm) ||
        item.data.description.toLowerCase().includes(searchTerm)
    )
  }

  if (contentTypes.includes('blog')) {
    const blog = await getAllBlogPosts(locale)
    results.blog = blog.filter(
      (post) =>
        post.data.title.toLowerCase().includes(searchTerm) ||
        post.data.excerpt.toLowerCase().includes(searchTerm) ||
        post.data.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    )
  }

  return results
}