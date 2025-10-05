import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CriticalCSSProvider from '@/components/CriticalCSSProvider'
import ResourcePreloader from '@/components/ResourcePreloader'
import PerformanceMonitor, { PerformanceDebugger, CriticalResourcePreloader } from '@/components/PerformanceMonitor'
import AccessibilityProvider from '@/components/AccessibilityProvider'
import MobileValidatorComponent, { MobileValidationDebugger } from '@/components/MobileValidator'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Garden Bros - Professional Garden Care',
  description: 'Professional garden care services in Bratislava and surroundings. Lawn maintenance, garden design, tree services, and more.',
  keywords: ['garden', 'lawn care', 'landscaping', 'Bratislava', 'gardening'],
  openGraph: {
    title: 'Garden Bros - Professional Garden Care',
    description: 'Professional garden care services in Bratislava and surroundings.',
    type: 'website',
    locale: 'sk_SK',
    siteName: 'Garden Bros',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/_next/static/css/app/layout.css"
          as="style"
        />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//admin.gardenbros.sk" />
        <link rel="dns-prefetch" href="//images.pexels.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
      </head>
      <body className={inter.className}>
        <AccessibilityProvider>
          <CriticalResourcePreloader />
          <PerformanceMonitor enableAnalytics={process.env.NODE_ENV === 'production'} />
          <MobileValidatorComponent />
          <ResourcePreloader pageType="homepage" />
          <CriticalCSSProvider pageType="homepage">
            {children}
          </CriticalCSSProvider>
          <PerformanceDebugger />
          <MobileValidationDebugger />
        </AccessibilityProvider>
      </body>
    </html>
  )
}