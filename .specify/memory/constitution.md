<!--
Version change: 0.0.0 → 1.0.0
Modified principles: (none)
Added sections:
  - Core Principles (Performance-First, Accessibility-First, Mobile-First Design, Content Clarity, SEO & Discoverability)
  - Web Standards (technology constraints and coding standards)
  - Development Workflow (testing and deployment requirements)
  - Governance (amendment process and compliance requirements)
Removed sections: (none)
Templates requiring updates:
✅ Updated:
  - plan-template.md (Constitution Check section updated with specific compliance gates)
  - spec-template.md (added constitutional requirements to common underspecified areas)
  - tasks-template.md (added Constitutional Compliance phase, updated validation checklist)
⚠ Pending: (none)
Follow-up TODOs: (none)
-->

# Garden Bros Website Constitution

## Core Principles

### I. Performance-First
Every page MUST load in under 3 seconds on 3G connections; Core Web Vitals must meet Google's "Good" thresholds; Images must be optimized and use modern formats (WebP/AVIF); Critical CSS must be inlined and non-critical resources deferred.

Rationale: Website performance directly impacts user engagement, SEO rankings, and conversion rates for gardening services.

### II. Accessibility-First
All content MUST be accessible to users with disabilities following WCAG 2.1 AA standards; Semantic HTML must be used throughout; Color contrast ratios must exceed 4.5:1; All interactive elements must be keyboard navigable and screen reader compatible.

Rationale: Gardening services should be accessible to all community members regardless of abilities, ensuring inclusive design practices.

### III. Mobile-First Design
All features MUST be designed and developed for mobile devices first; Touch targets must be minimum 44px; Text must be readable without zooming; Navigation must work with one hand.

Rationale: Most users browse gardening services on mobile devices while planning outdoor projects.

### IV. Content Clarity
All service descriptions MUST be clear and jargon-free; Call-to-action buttons must use action-oriented language; Contact information must be prominently displayed on every page; Service pricing and availability must be transparent.

Rationale: Clear communication builds trust with potential customers and reduces inquiry friction.

### V. SEO & Discoverability
All pages MUST have unique, descriptive titles and meta descriptions; Content must target local gardening keywords; Schema markup must be implemented for business information; Site structure must support search engine crawling.

Rationale: Local gardening businesses depend on search engine visibility for customer acquisition.

## Web Standards

All code MUST follow modern web standards and best practices; HTML must be valid and semantic; CSS must use modern layout techniques (Grid, Flexbox); JavaScript must be ES6+ with proper error handling; API responses must follow RESTful conventions; All external dependencies must be regularly updated for security.

Technology constraints: Next.js for React framework; TailwindCSS for styling; TypeScript for type safety; Strapi CMS for content management; Vercel for frontend deployment.

## Development Workflow

All changes MUST be made through feature branches; Code must pass linting and type checking before commit; Visual regression testing must be performed for UI changes; Performance testing must verify Core Web Vitals compliance; All changes must be tested on mobile devices; Content changes must be reviewed for clarity and SEO impact.

Deployment requires: automated builds to pass; lighthouse performance score > 90; accessibility audit with no violations; manual testing on target devices completed.

## Governance

This Constitution supersedes all other development practices; All pull requests must verify constitutional compliance before merge; Performance regressions require explicit justification and mitigation plan; Accessibility violations are blocking issues that prevent deployment; Content updates must maintain SEO optimization and brand consistency.

Amendments require: documentation of proposed changes; performance impact assessment; accessibility review; approval from project maintainer; migration plan for existing code.

**Version**: 1.0.0 | **Ratified**: 2025-10-04 | **Last Amended**: 2025-10-04