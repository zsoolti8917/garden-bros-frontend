import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import '../globals.css'
import type { Locale } from '@/types/content'
import { isValidLocale, locales, getTranslation, t } from '@/lib/i18n'
import Header from '@/components/navigation/Header'
import Footer from '@/components/footer/Footer'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const dict = getTranslation(locale)

  return {
    title: 'Garden Bros - Professional Garden Care',
    description: t(dict, 'footer.description'),
    keywords: ['garden', 'lawn care', 'landscaping', 'Bratislava', 'gardening'],
    openGraph: {
      title: 'Garden Bros - Professional Garden Care',
      description: t(dict, 'footer.description'),
      type: 'website',
      locale: locale === 'sk' ? 'sk_SK' : locale === 'hu' ? 'hu_HU' : 'en_US',
      siteName: 'Garden Bros',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: { lang: string };
}) {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'

  return (
    <html lang={locale} className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <Header locale={locale} />
        <main className="flex-1 bg-white">
          {children}
        </main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}
