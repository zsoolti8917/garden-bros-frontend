# Quickstart Guide: Static Website Migration

**Phase 1 Output** | **Date**: 2025-10-04 | **Feature**: Static Website Migration

## Overview
This guide provides step-by-step instructions to validate that the static website migration meets all functional requirements and constitutional compliance.

## Prerequisites
- Static website deployed to hosting platform
- Content migrated and accessible through CMS
- All build processes completed successfully
- Performance optimization artifacts generated

## Validation Scenarios

### 1. Performance Validation (FR-002)
**Objective**: Verify <3s page load times with optimized images

**Steps**:
1. Open browser developer tools
2. Navigate to homepage: `https://[domain]/`
3. Check Network tab load time < 3 seconds
4. Test on 3G throttling in dev tools
5. Run Lighthouse performance audit
6. Verify Core Web Vitals scores:
   - LCP (Largest Contentful Paint) < 2.5s
   - FID (First Input Delay) < 100ms
   - CLS (Cumulative Layout Shift) < 0.1

**Expected Results**:
- All pages load under 3 seconds
- Lighthouse performance score > 90
- Core Web Vitals in "Good" range
- Images served in WebP/AVIF formats

### 2. Static Hosting Validation (FR-003, FR-004)
**Objective**: Confirm no backend dependencies and multi-platform deployment

**Steps**:
1. Deploy to Vercel: `vercel deploy`
2. Deploy to Netlify: Connect git repository
3. Deploy to GitHub Pages: Enable in repository settings
4. Test all deployments function identically
5. Verify no API calls to external services (except forms/CMS)
6. Check browser network tab for backend requests

**Expected Results**:
- All hosting platforms serve identical content
- No failed requests to backend services
- All functionality works without server dependencies

### 3. Multilingual Support Validation (FR-006)
**Objective**: Verify Slovak, Hungarian, English language support

**Steps**:
1. Navigate to homepage
2. Switch language to Slovak: `/sk/`
3. Verify content displays in Slovak
4. Switch to Hungarian: `/hu/`
5. Verify content displays in Hungarian
6. Switch to English: `/en/`
7. Verify content displays in English
8. Check URL structure maintains language prefix
9. Verify language switcher functionality

**Expected Results**:
- All languages display correct content
- URLs include proper language codes
- Language switcher works on all pages
- Content is translated appropriately

### 4. Contact Form Validation (FR-007)
**Objective**: Test third-party form processing with maintenance fallback

**Steps**:
1. Navigate to contact page: `/contact`
2. Fill out contact form with valid data
3. Submit form and verify success message
4. Check form submission received (email/dashboard)
5. Test form with invalid data
6. Verify proper validation messages
7. Simulate form service failure (block network requests)
8. Verify maintenance message appears

**Expected Results**:
- Valid submissions process successfully
- Invalid data shows appropriate errors
- Service failure triggers maintenance mode
- No form submissions lost during failures

### 5. Content Management Validation (FR-010)
**Objective**: Verify git-based CMS functionality

**Steps**:
1. Access CMS admin: `/admin/`
2. Login with credentials
3. Create new service entry
4. Add images and content
5. Save and publish
6. Verify content appears on website
7. Edit existing portfolio item
8. Check git commit created automatically
9. Verify preview functionality

**Expected Results**:
- CMS interface loads and functions
- Content changes appear on website
- Git commits created for changes
- Preview shows accurate representation

### 6. Image Optimization Validation (FR-011)
**Objective**: Confirm responsive image variants generated

**Steps**:
1. Navigate to portfolio page
2. Open browser dev tools
3. Check image elements for `srcset` attributes
4. Verify multiple image sizes available
5. Test on different screen sizes
6. Check image formats (WebP/AVIF served when supported)
7. Verify lazy loading functionality
8. Test gallery performance with 20+ images

**Expected Results**:
- Images have responsive variants
- Modern formats served to compatible browsers
- Lazy loading prevents unnecessary downloads
- Gallery performance remains optimal

### 7. Accessibility Validation (FR-009)
**Objective**: Maintain WCAG 2.1 AA compliance

**Steps**:
1. Run automated accessibility audit (axe-core)
2. Navigate website using only keyboard
3. Test with screen reader (NVDA/JAWS)
4. Check color contrast ratios
5. Verify alt text on all images
6. Test form labels and validation
7. Check heading structure hierarchy
8. Verify focus indicators

**Expected Results**:
- No accessibility violations detected
- All functionality accessible via keyboard
- Screen reader announces content properly
- Color contrasts meet 4.5:1 minimum ratio

### 8. SEO Validation (FR-005)
**Objective**: Maintain search engine optimization

**Steps**:
1. Check all pages have unique titles
2. Verify meta descriptions present
3. Test structured data markup
4. Check sitemap.xml generation
5. Verify robots.txt configuration
6. Test internal linking structure
7. Check canonical URLs
8. Verify social media meta tags

**Expected Results**:
- All pages have proper SEO metadata
- Structured data validates without errors
- Sitemap includes all pages
- Social sharing works correctly

## Performance Benchmarks

### Load Time Targets
- Homepage: < 2 seconds
- Service pages: < 2.5 seconds
- Portfolio gallery: < 3 seconds
- Blog posts: < 2 seconds

### Core Web Vitals Targets
- LCP: < 2.5 seconds
- FID: < 100 milliseconds
- CLS: < 0.1

### Lighthouse Scores
- Performance: > 90
- Accessibility: 100
- Best Practices: > 95
- SEO: 100

## Troubleshooting

### Common Issues
1. **Slow image loading**: Check image optimization pipeline
2. **Form submissions failing**: Verify third-party service configuration
3. **CMS not updating**: Check git repository permissions
4. **Language switching broken**: Verify i18n routing configuration
5. **Build failures**: Check content validation and dependencies

### Emergency Procedures
1. **Site down**: Deploy previous working version
2. **Form service outage**: Enable maintenance mode
3. **Content corruption**: Restore from git history
4. **Performance degradation**: Enable performance monitoring alerts

## Success Criteria
✅ All validation scenarios pass
✅ Performance benchmarks met
✅ Constitutional compliance verified
✅ No critical accessibility violations
✅ All functional requirements satisfied

## Next Steps
After successful validation:
1. Monitor performance metrics
2. Set up content publishing workflow
3. Train content administrators
4. Implement monitoring and alerting
5. Plan regular performance audits