
# Implementation Plan: Static Website Migration

**Branch**: `001-i-want-to` | **Date**: 2025-10-04 | **Spec**: /home/zsolt/garden-rework/specs/001-i-want-to/spec.md
**Input**: Feature specification from `/home/zsolt/garden-rework/specs/001-i-want-to/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code, or `AGENTS.md` for all other agents).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Migrate existing Garden Bros website from Strapi-based dynamic architecture to fully static website to eliminate backend dependencies, reduce maintenance overhead, and improve performance. Static site will maintain all current functionality including multilingual support, portfolio galleries, and contact forms while achieving <3s load times through build-time optimization and third-party service integrations.

## Technical Context
**Language/Version**: TypeScript with Next.js 14.2.3
**Primary Dependencies**: Next.js, TailwindCSS, Netlify CMS, third-party form services
**Storage**: Static files, git-based content management, no database
**Testing**: Jest for unit tests, Playwright for E2E, Lighthouse for performance
**Target Platform**: Static hosting platforms (Vercel, Netlify, GitHub Pages)
**Project Type**: web - frontend-only static site
**Performance Goals**: <3s page load on 3G, Core Web Vitals "Good" scores, Lighthouse >90
**Constraints**: No backend server, multilingual support, build-time optimization required
**Scale/Scope**: Small business website, portfolio galleries, blog posts, contact forms

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Performance-First Compliance**:
- [x] Feature design supports <3s page load times (FR-002: build-time optimization)
- [x] Images/assets include optimization strategy (FR-011: responsive variants)
- [x] Core Web Vitals impact assessed (Lighthouse >90 requirement)

**Accessibility-First Compliance**:
- [x] WCAG 2.1 AA requirements considered (FR-009: preserve current compliance)
- [x] Semantic HTML structure planned (static site generation with semantic markup)
- [x] Keyboard navigation requirements identified (maintain current accessibility)

**Mobile-First Compliance**:
- [x] Feature designed for mobile experience first (FR-008: responsive design)
- [x] Touch target sizing (min 44px) planned (constitutional requirement)
- [x] Responsive design considerations documented (build-time responsive images)

**Content Clarity Compliance**:
- [x] User-facing text follows jargon-free guidelines (content recreation from scratch)
- [x] Call-to-action language is action-oriented (maintain current UX patterns)
- [x] Contact information placement considered (preserve current contact page)

**SEO & Discoverability Compliance**:
- [x] Page titles and meta descriptions planned (FR-005: maintain SEO optimization)
- [x] Local gardening keywords identified (preserve current SEO strategy)
- [x] Schema markup requirements documented (maintain business information schema)

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Static Next.js Website Structure
src/
├── app/                 # Next.js 13+ app directory
│   ├── [locale]/       # Internationalization routing
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components
│   ├── forms/         # Form components
│   ├── gallery/       # Portfolio gallery
│   └── navigation/    # Navigation components
├── content/           # Static content files
│   ├── services/      # Service descriptions
│   ├── portfolio/     # Portfolio content
│   ├── blog/         # Blog posts
│   └── business/     # Business information
├── lib/              # Utility functions
│   ├── cms.ts        # CMS integration
│   ├── i18n.ts       # Internationalization
│   └── utils.ts      # General utilities
└── types/            # TypeScript type definitions

public/
├── images/           # Static images
├── admin/           # Netlify CMS admin
└── locales/         # Translation files

tests/
├── components/      # Component tests
├── integration/     # Integration tests
└── e2e/            # End-to-end tests

config/
├── next.config.js   # Next.js configuration
├── tailwind.config.js # TailwindCSS config
└── netlify-cms.config.yml # CMS configuration
```

**Structure Decision**: Static Next.js website with app directory structure. All content managed through git-based CMS with build-time generation. No backend dependencies - fully static deployment to any hosting platform. Internationalization handled through Next.js i18n with locale-based routing.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 artifacts:
  - CMS schema (cms-schema.yml) → CMS setup and configuration tasks
  - Form schema (form-schema.json) → Form implementation and validation tasks
  - Data model → Content structure and migration tasks
  - Quickstart scenarios → Integration test tasks
- Static site generation → Build optimization tasks
- Constitutional compliance → Performance, accessibility, and SEO tasks

**Content Migration Tasks**:
- Export existing Strapi content → Content audit task
- Transform content structure → Data transformation tasks [P]
- Create content templates → Template creation tasks [P]
- Migrate images and media → Asset optimization tasks
- Set up multilingual structure → i18n implementation tasks

**Infrastructure Tasks**:
- Next.js project setup → Project initialization
- CMS integration → Netlify CMS configuration
- Form service setup → Third-party service integration
- Build pipeline → Optimization and deployment setup
- Hosting configuration → Multi-platform deployment tests

**Testing Strategy**:
- CMS functionality tests → Content management validation
- Form submission tests → Third-party integration testing
- Performance tests → Lighthouse and Core Web Vitals validation
- Accessibility tests → WCAG compliance verification
- Multilingual tests → i18n functionality validation

**Ordering Strategy**:
- Setup → Content Migration → CMS Integration → Forms → Performance Optimization → Testing
- Constitutional compliance tasks integrated throughout
- Parallel execution for independent content types and components
- Build-time optimization tasks depend on content structure completion

**Estimated Output**: 35-40 numbered, ordered tasks covering:
- Project setup and configuration (5 tasks)
- Content migration and structure (12 tasks)
- CMS integration and forms (8 tasks)
- Performance and optimization (6 tasks)
- Constitutional compliance validation (8 tasks)
- Testing and deployment (6 tasks)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
