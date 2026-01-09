import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const t = await getTranslations({ locale, namespace: 'terms' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function TermsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'terms' });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafaf9' }}>
      <Navbar />
      <main className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1
              className="text-4xl md:text-5xl mb-4"
              style={{
                fontFamily: '"Instrument Serif", Georgia, serif',
                color: '#1a1a2e',
              }}
            >
              {t('title')}
            </h1>
            <p
              className="text-lg"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#666',
              }}
            >
              {t('lastUpdated')}: {new Date().toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Content */}
          <div
            className="bg-white rounded-[1.5rem] p-8 md:p-12 shadow-sm"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <div className="prose prose-lg max-w-none" style={{ color: '#1a1a2e' }}>
              {/* Introduction */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.introduction.title')}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#4a4a4a' }}>
                  {t('sections.introduction.content')}
                </p>
              </section>

              {/* Acceptance */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.acceptance.title')}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#4a4a4a' }}>
                  {t('sections.acceptance.content')}
                </p>
              </section>

              {/* Age Requirement */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.ageRequirement.title')}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#4a4a4a' }}>
                  {t('sections.ageRequirement.content')}
                </p>
              </section>

              {/* Account Registration */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.account.title')}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#4a4a4a' }}>
                  {t('sections.account.content')}
                </p>
              </section>

              {/* Use of Service */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.useOfService.title')}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#4a4a4a' }}>
                  {t('sections.useOfService.content')}
                </p>
                <ul className="list-disc pl-6 space-y-2" style={{ color: '#4a4a4a' }}>
                  <li>{t('sections.useOfService.prohibited.1')}</li>
                  <li>{t('sections.useOfService.prohibited.2')}</li>
                  <li>{t('sections.useOfService.prohibited.3')}</li>
                  <li>{t('sections.useOfService.prohibited.4')}</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.intellectualProperty.title')}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#4a4a4a' }}>
                  {t('sections.intellectualProperty.content')}
                </p>
              </section>

              {/* Credits and Payments */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.credits.title')}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#4a4a4a' }}>
                  {t('sections.credits.content')}
                </p>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.liability.title')}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#4a4a4a' }}>
                  {t('sections.liability.content')}
                </p>
              </section>

              {/* Changes to Terms */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.changes.title')}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#4a4a4a' }}>
                  {t('sections.changes.content')}
                </p>
              </section>

              {/* Contact */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.contact.title')}
                </h2>
                <p className="leading-relaxed" style={{ color: '#4a4a4a' }}>
                  {t('sections.contact.content')}{' '}
                  <a
                    href="mailto:support@futurai.org"
                    className="underline"
                    style={{ color: '#ff6b35' }}
                  >
                    support@futurai.org
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

