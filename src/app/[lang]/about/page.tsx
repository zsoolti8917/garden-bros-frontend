import type { Metadata } from 'next'
import Image from 'next/image'
import type { Locale } from '@/types/content'
import { isValidLocale, getTranslation, t } from '@/lib/i18n'
import { getBusinessInfo, getTeamMembers } from '@/lib/content'

interface AboutPageProps {
  params: { lang: string }
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const dict = getTranslation(locale)

  return {
    title: t(dict, 'about.meta.title'),
    description: t(dict, 'about.meta.description'),
    keywords: ['about garden bros', 'gardening company', 'team', 'experience', 'Bratislava'],
    openGraph: {
      title: t(dict, 'about.meta.title'),
      description: t(dict, 'about.meta.description'),
      type: 'website',
      locale: locale === 'sk' ? 'sk_SK' : locale === 'hu' ? 'hu_HU' : 'en_US',
    },
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
  const locale = isValidLocale(params.lang) ? params.lang : 'sk'
  const dict = getTranslation(locale)

  const businessInfo = await getBusinessInfo()
  const teamMembers = await getTeamMembers()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 lg:py-24">
        <div className="container-custom text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            {t(dict, 'about.hero.title')}
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            {t(dict, 'about.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {t(dict, 'about.story.title')}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-6">
                  {t(dict, 'about.story.paragraph1')}
                </p>
                <p className="mb-6">
                  {t(dict, 'about.story.paragraph2')}
                </p>
                <p className="mb-6">
                  {t(dict, 'about.story.paragraph3')}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-96 rounded-lg overflow-hidden">
                {businessInfo?.images?.[0] ? (
                  <Image
                    src={businessInfo.images[0]}
                    alt="Garden Bros Team"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-medium">Garden Bros</span>
                  </div>
                )}
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-200 rounded-full opacity-50" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-100 rounded-full opacity-30" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {t(dict, 'about.values.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t(dict, 'about.values.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t(dict, 'about.values.quality.title')}
              </h3>
              <p className="text-gray-600">
                {t(dict, 'about.values.quality.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t(dict, 'about.values.passion.title')}
              </h3>
              <p className="text-gray-600">
                {t(dict, 'about.values.passion.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t(dict, 'about.values.service.title')}
              </h3>
              <p className="text-gray-600">
                {t(dict, 'about.values.service.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t(dict, 'about.values.sustainability.title')}
              </h3>
              <p className="text-gray-600">
                {t(dict, 'about.values.sustainability.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t(dict, 'about.values.innovation.title')}
              </h3>
              <p className="text-gray-600">
                {t(dict, 'about.values.innovation.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t(dict, 'about.values.community.title')}
              </h3>
              <p className="text-gray-600">
                {t(dict, 'about.values.community.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {teamMembers && teamMembers.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {t(dict, 'about.team.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t(dict, 'about.team.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative h-64 w-64 mx-auto mb-6 rounded-full overflow-hidden">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        sizes="256px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-3">
                    {member.position}
                  </p>
                  {member.bio && (
                    <p className="text-gray-600 text-sm">
                      {member.bio}
                    </p>
                  )}
                  {member.experience && (
                    <p className="text-gray-500 text-xs mt-2">
                      {member.experience} {t(dict, 'about.team.experience')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Statistics Section */}
      <section className="py-16 lg:py-24 bg-primary-600">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              {t(dict, 'about.stats.title')}
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              {t(dict, 'about.stats.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                500+
              </div>
              <p className="text-primary-100">
                {t(dict, 'about.stats.projects')}
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                10+
              </div>
              <p className="text-primary-100">
                {t(dict, 'about.stats.experience')}
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                98%
              </div>
              <p className="text-primary-100">
                {t(dict, 'about.stats.satisfaction')}
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                24/7
              </div>
              <p className="text-primary-100">
                {t(dict, 'about.stats.support')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      {businessInfo?.certifications && businessInfo.certifications.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {t(dict, 'about.certifications.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t(dict, 'about.certifications.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businessInfo.certifications.map((cert, index) => (
                <div key={index} className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {cert.name || cert}
                  </h3>
                  {cert.description && (
                    <p className="text-gray-600 text-sm">
                      {cert.description}
                    </p>
                  )}
                  {cert.year && (
                    <p className="text-gray-500 text-xs mt-2">
                      {cert.year}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {t(dict, 'about.cta.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t(dict, 'about.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${locale}/contact`}
              className="btn-primary"
            >
              {t(dict, 'about.cta.contact')}
            </a>
            <a
              href={`/${locale}/services`}
              className="btn-outline"
            >
              {t(dict, 'about.cta.services')}
            </a>
          </div>
        </div>
      </section>

      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: t(dict, 'about.meta.title'),
            description: t(dict, 'about.meta.description'),
            url: `https://gardenbros.sk/${locale}/about`,
            mainEntity: {
              "@type": "Organization",
              name: "Garden Bros",
              description: businessInfo?.description || t(dict, 'about.meta.description'),
              ...(businessInfo && {
                address: {
                  "@type": "PostalAddress",
                  streetAddress: businessInfo.address,
                  addressCountry: "SK"
                },
                telephone: businessInfo.phone,
                email: businessInfo.email
              }),
              ...(teamMembers && teamMembers.length > 0 && {
                employee: teamMembers.map(member => ({
                  "@type": "Person",
                  name: member.name,
                  jobTitle: member.position,
                  ...(member.bio && { description: member.bio })
                }))
              })
            }
          })
        }}
      />
    </div>
  )
}