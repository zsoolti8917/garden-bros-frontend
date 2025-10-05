# Tasks: Static Website Migration

**Input**: Design documents from `/specs/001-i-want-to/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Static Next.js project**: `src/`, `public/`, `tests/` at repository root
- Paths shown below are for single project structure per plan.md

## Phase 3.1: Setup
- [x] T001 Create Next.js project structure with TypeScript and app directory in repository root
- [x] T002 Initialize package.json with Next.js 14.2.3, TailwindCSS, TypeScript dependencies
- [x] T003 [P] Configure ESLint and Prettier for TypeScript/Next.js in .eslintrc.json and .prettierrc
- [x] T004 [P] Create next.config.js with static export configuration and image optimization
- [x] T005 [P] Setup TailwindCSS configuration in tailwind.config.js with Garden Bros color scheme

## Phase 3.2: Content Structure & CMS Setup ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: Content structure and CMS must be functional before building components**
- [x] T006 [P] Create content directory structure in content/ with services/, portfolio/, blog/, business/ folders
- [x] T007 [P] Create public/images directory structure with services/, portfolio/, blog/, team/ subfolders
- [x] T008 [P] Setup Netlify CMS configuration in public/admin/config.yml using contracts/cms-schema.yml
- [x] T009 [P] Create CMS admin interface HTML file in public/admin/index.html
- [x] T010 [P] Setup git-gateway backend configuration for Netlify CMS
- [x] T011 [P] Create sample content files for services in content/services/sk/, content/services/hu/, content/services/en/
- [x] T012 [P] Create sample portfolio content in content/portfolio/sk/, content/portfolio/hu/, content/portfolio/en/
- [x] T013 [P] Create business information files in content/business/company-info.md and content/business/team-members.md

## Phase 3.3: Core Implementation (ONLY after content structure is ready)
- [x] T014 [P] Create TypeScript types for content entities in src/types/content.ts based on data-model.md
- [x] T015 [P] Create content parsing utilities in src/lib/content.ts for markdown and frontmatter processing
- [x] T016 [P] Setup Next.js internationalization configuration in src/lib/i18n.ts for SK, HU, EN languages
- [x] T017 Create main layout component in src/app/layout.tsx with responsive navigation and footer
- [x] T018 Create homepage component in src/app/page.tsx with hero section and featured content
- [x] T019 [P] Create services listing component in src/components/services/ServicesList.tsx
- [x] T020 [P] Create service detail component in src/components/services/ServiceDetail.tsx
- [x] T021 [P] Create portfolio gallery component in src/components/portfolio/PortfolioGallery.tsx
- [x] T022 [P] Create portfolio item component in src/components/portfolio/PortfolioItem.tsx
- [x] T023 [P] Create blog listing component in src/components/blog/BlogList.tsx
- [x] T024 [P] Create blog post component in src/components/blog/BlogPost.tsx

## Phase 3.4: Forms & Integration
- [x] T025 Create contact form component in src/components/forms/ContactForm.tsx using contracts/form-schema.json validation
- [x] T026 Create quote request form in src/components/forms/QuoteForm.tsx with file upload support
- [x] T027 Create newsletter signup form in src/components/forms/NewsletterForm.tsx
- [x] T028 Setup form validation utilities in src/lib/validation.ts based on form schemas
- [x] T029 Configure Netlify Forms integration with honeypot spam protection
- [x] T030 Implement form submission error handling and maintenance mode fallback
- [x] T031 Create form success/error message components in src/components/ui/FormMessages.tsx

## Phase 3.5: Pages & Routing
- [x] T032 Create services index page in src/app/[locale]/services/page.tsx
- [x] T033 Create dynamic service detail pages in src/app/[locale]/services/[slug]/page.tsx
- [x] T034 Create portfolio index page in src/app/[locale]/portfolio/page.tsx
- [x] T035 Create dynamic portfolio item pages in src/app/[locale]/portfolio/[slug]/page.tsx
- [x] T036 Create blog index page in src/app/[locale]/blog/page.tsx
- [x] T037 Create dynamic blog post pages in src/app/[locale]/blog/[slug]/page.tsx
- [x] T038 Create contact page in src/app/[locale]/contact/page.tsx
- [x] T039 Create about page in src/app/[locale]/about/page.tsx

## Phase 3.6: Image Optimization & Performance
- [x] T040 [P] Configure Next.js Image component with responsive variants and modern formats
- [x] T041 [P] Create image optimization utilities in src/lib/images.ts for build-time processing
- [x] T042 [P] Implement lazy loading for portfolio galleries with intersection observer
- [x] T043 [P] Setup critical CSS inlining for above-the-fold content
- [x] T044 [P] Configure resource preloading for fonts and critical assets

## Phase 3.7: Constitutional Compliance & Polish
- [ ] T045 [P] Performance optimization to meet <3s load time requirement (Core Web Vitals)
- [ ] T046 [P] Accessibility audit and fixes to maintain WCAG 2.1 AA compliance
- [ ] T047 [P] Mobile responsiveness validation with touch target sizing (min 44px)
- [ ] T048 [P] SEO optimization with meta tags, structured data, and sitemap generation
- [ ] T049 [P] Content clarity review ensuring jargon-free language and clear CTAs
- [ ] T050 [P] Setup Lighthouse CI for automated performance monitoring
- [ ] T051 [P] Create unit tests for content parsing in tests/unit/content.test.ts
- [ ] T052 [P] Create integration tests for form submissions in tests/integration/forms.test.ts
- [ ] T053 [P] Create E2E tests for user journeys in tests/e2e/user-flows.spec.ts
- [ ] T054 Manual testing checklist execution per quickstart.md validation scenarios

## Dependencies
- Setup (T001-T005) before everything
- Content structure (T006-T013) before implementation (T014-T024)
- Content parsing (T014-T016) before components (T017-T024)
- Components (T017-T024) before pages (T032-T039)
- Forms (T025-T031) can run parallel with pages
- Performance optimization (T040-T044) before compliance testing (T045-T054)

## Parallel Example
```
# Launch T006-T013 together for content setup:
Task: "Create content directory structure in content/ with services/, portfolio/, blog/, business/ folders"
Task: "Create public/images directory structure with services/, portfolio/, blog/, team/ subfolders"
Task: "Setup Netlify CMS configuration in public/admin/config.yml using contracts/cms-schema.yml"
Task: "Create sample content files for services in content/services/sk/, content/services/hu/, content/services/en/"
```

## Notes
- [P] tasks = different files, no dependencies
- CMS must be functional before building components
- Test forms with actual Netlify deployment
- Commit after each completed task
- Validate constitutional compliance throughout

## Task Generation Rules
*Applied during main() execution*

1. **From CMS Schema (cms-schema.yml)**:
   - Each collection → CMS configuration task [P]
   - Each content type → sample content creation task [P]

2. **From Form Schema (form-schema.json)**:
   - Each form type → form component task [P]
   - Validation rules → validation utility tasks

3. **From Data Model**:
   - Each entity → TypeScript type definition [P]
   - Content structure → directory creation tasks [P]

4. **From Quickstart Scenarios**:
   - Each validation scenario → integration test [P]
   - Performance benchmarks → optimization tasks

5. **Ordering**:
   - Setup → Content Structure → CMS → Components → Pages → Forms → Performance → Testing
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All CMS schema collections have corresponding setup tasks
- [x] All form schemas have component and validation tasks
- [x] All content entities have type definition tasks
- [x] Constitutional compliance tasks included (performance, accessibility, mobile, SEO, content)
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task