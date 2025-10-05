# Data Model: Static Website Migration

**Phase 1 Output** | **Date**: 2025-10-04 | **Feature**: Static Website Migration

## Content Entities

### 1. Service Information
**Fields**:
- `id`: Unique identifier (string)
- `title`: Service name (multilingual)
- `description`: Service description (multilingual, markdown)
- `pricing`: Pricing information (multilingual)
- `availability`: Seasonal availability (string)
- `category`: Service category (enum)
- `featured`: Featured service flag (boolean)
- `images`: Array of image references
- `slug`: URL slug (multilingual)
- `metaTitle`: SEO title (multilingual)
- `metaDescription`: SEO description (multilingual)

**Relationships**:
- One-to-many with Portfolio Content (services can have multiple portfolio examples)
- Many-to-many with Business Information (services linked to team members)

**Validation Rules**:
- Title required in all supported languages (SK, HU, EN)
- Description max 500 words per language
- Pricing must include currency
- Category must be from predefined list
- Images must be optimized and include alt text

### 2. Portfolio Content
**Fields**:
- `id`: Unique identifier (string)
- `title`: Project title (multilingual)
- `description`: Project description (multilingual, markdown)
- `beforeImages`: Array of before images
- `afterImages`: Array of after images
- `galleryImages`: Additional project images
- `clientTestimonial`: Client quote (multilingual)
- `completionDate`: Project completion date
- `serviceCategory`: Related service category
- `featured`: Featured project flag (boolean)
- `location`: Project location (optional)
- `slug`: URL slug (multilingual)

**Relationships**:
- Many-to-one with Service Information
- One-to-many with images (before/after/gallery)

**Validation Rules**:
- At least one before and one after image required
- Images must include responsive variants
- Completion date cannot be future
- Featured projects limited to maximum 6

### 3. Blog Posts
**Fields**:
- `id`: Unique identifier (string)
- `title`: Post title (multilingual)
- `content`: Post content (multilingual, markdown)
- `excerpt`: Post excerpt (multilingual)
- `author`: Author information (reference to Business Information)
- `publishDate`: Publication date
- `lastModified`: Last modification date
- `tags`: Array of tags (multilingual)
- `featuredImage`: Main post image
- `published`: Publication status (boolean)
- `slug`: URL slug (multilingual)
- `metaTitle`: SEO title (multilingual)
- `metaDescription`: SEO description (multilingual)

**Relationships**:
- Many-to-one with Business Information (author)
- Many-to-many with tags

**Validation Rules**:
- Title required in all languages
- Content minimum 300 words
- Excerpt maximum 150 words
- Publish date cannot be future
- Featured image required for published posts

### 4. Business Information
**Fields**:
- `id`: Unique identifier (string)
- `companyName`: Business name
- `description`: Company description (multilingual, markdown)
- `address`: Physical address
- `phone`: Contact phone number
- `email`: Contact email address
- `operatingHours`: Business hours (structured)
- `socialMedia`: Social media links (object)
- `teamMembers`: Array of team member objects
- `certifications`: Business certifications
- `serviceAreas`: Geographic service areas
- `logo`: Company logo image
- `images`: Additional business images

**Validation Rules**:
- Contact information required
- Phone number format validation
- Email format validation
- Operating hours in structured format
- Social media URLs validation

### 5. Multilingual Content
**Fields**:
- `entityId`: Reference to parent entity
- `entityType`: Type of parent entity (enum)
- `locale`: Language code (SK, HU, EN)
- `field`: Field name being translated
- `value`: Translated content
- `lastModified`: Translation update date

**Relationships**:
- Many-to-one with all content entities

**Validation Rules**:
- Locale must be supported language
- Value required for primary language (SK)
- Character encoding UTF-8

## Content Structure

### File-Based Content Organization
```
content/
├── services/
│   ├── sk/
│   │   ├── lawn-care.md
│   │   ├── garden-design.md
│   │   └── tree-services.md
│   ├── hu/
│   └── en/
├── portfolio/
│   ├── sk/
│   ├── hu/
│   └── en/
├── blog/
│   ├── sk/
│   ├── hu/
│   └── en/
└── business/
    ├── company-info.md
    └── team-members.md
```

### Image Organization
```
public/images/
├── services/
├── portfolio/
│   ├── before/
│   ├── after/
│   └── gallery/
├── blog/
├── team/
└── optimized/
    ├── webp/
    └── avif/
```

## State Transitions

### Content Publication Flow
1. **Draft** → Content created in CMS
2. **Review** → Content ready for review
3. **Published** → Content live on website
4. **Archived** → Content removed from public view

### Image Processing Flow
1. **Uploaded** → Raw image uploaded to CMS
2. **Processing** → Build-time optimization in progress
3. **Optimized** → Multiple formats and sizes generated
4. **Published** → Images served from static hosting

## Data Migration Notes

### From Strapi to Static Content
- Export existing content structure
- Transform to markdown format
- Preserve multilingual relationships
- Update image references
- Maintain URL slugs for SEO
- Validate content completeness

### Content Management Integration
- Netlify CMS config for each entity type
- Field validation in CMS interface
- Preview functionality for content editors
- Automated git commits for content changes