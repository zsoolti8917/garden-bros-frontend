'use client'

import React, { useEffect } from 'react'
import {
  extractCriticalCSS,
  inlineCriticalCSS,
  deferNonCriticalCSS,
  getCSSStrategy,
  CSS_STRATEGIES
} from '@/lib/critical-css'

interface CriticalCSSProviderProps {
  children: React.ReactNode
  pageType?: keyof typeof CSS_STRATEGIES
  customCSS?: string
}

export default function CriticalCSSProvider({
  children,
  pageType = 'homepage',
  customCSS
}: CriticalCSSProviderProps) {
  useEffect(() => {
    const initializeCriticalCSS = async () => {
      try {
        // Get the appropriate CSS strategy for this page type
        const strategy = getCSSStrategy(pageType)

        // In a real implementation, you would extract from your CSS files
        // For now, we'll inline essential critical styles
        const criticalCSS = `
          /* Critical CSS for ${pageType} */
          html {
            line-height: 1.15;
            -webkit-text-size-adjust: 100%;
          }

          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }

          .header {
            position: sticky;
            top: 0;
            z-index: 50;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
          }

          .hero {
            min-height: 60vh;
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, #22c55e, #16a34a);
          }

          .btn-primary {
            background: #22c55e;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .btn-primary:hover {
            background: #16a34a;
          }

          .grid {
            display: grid;
          }

          .grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }

          @media (min-width: 768px) {
            .md\\:grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (min-width: 1024px) {
            .lg\\:grid-cols-3 {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
          }

          .gap-6 {
            gap: 1.5rem;
          }

          .rounded-lg {
            border-radius: 0.5rem;
          }

          .shadow-md {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }

          .transition-all {
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;
          }

          .focus-ring:focus {
            outline: 2px solid #22c55e;
            outline-offset: 2px;
          }

          .fade-in {
            animation: fadeIn 0.3s ease-in-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .loading {
            opacity: 0.6;
            pointer-events: none;
          }

          .skeleton {
            background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }

          @keyframes loading {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }

          ${customCSS || ''}
        `

        // Inline critical CSS immediately
        inlineCriticalCSS(criticalCSS)

        // Defer non-critical CSS loading
        if (strategy.deferNonCritical) {
          // In a real implementation, you would defer your main CSS file
          // deferNonCriticalCSS('/styles/main.css')
        }

        // Performance monitoring in development
        if (process.env.NODE_ENV === 'development') {
          setTimeout(() => {
            const criticalSize = new Blob([criticalCSS]).size
            console.log(`Critical CSS inlined: ${criticalSize} bytes for ${pageType}`)

            if (criticalSize > strategy.inlineThreshold) {
              console.warn(`Critical CSS size exceeds recommended threshold of ${strategy.inlineThreshold} bytes`)
            }
          }, 100)
        }
      } catch (error) {
        console.error('Failed to initialize critical CSS:', error)
      }
    }

    initializeCriticalCSS()
  }, [pageType, customCSS])

  return <>{children}</>
}