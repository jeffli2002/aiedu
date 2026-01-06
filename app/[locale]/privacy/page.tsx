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
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function PrivacyPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'privacy' });

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

              {/* Information We Collect */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.collection.title')}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#4a4a4a' }}>
                  {t('sections.collection.content')}
                </p>
                <ul className="list-disc pl-6 space-y-2" style={{ color: '#4a4a4a' }}>
                  <li>{t('sections.collection.items.account')}</li>
                  <li>{t('sections.collection.items.usage')}</li>
                  <li>{t('sections.collection.items.device')}</li>
                  <li>{t('sections.collection.items.cookies')}</li>
                </ul>
              </section>

              {/* How We Use Information */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.use.title')}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#4a4a4a' }}>
                  {t('sections.use.content')}
                </p>
                <ul className="list-disc pl-6 space-y-2" style={{ color: '#4a4a4a' }}>
                  <li>{t('sections.use.items.1')}</li>
                  <li>{t('sections.use.items.2')}</li>
                  <li>{t('sections.use.items.3')}</li>
                  <li>{t('sections.use.items.4')}</li>
                </ul>
              </section>

              {/* Data Sharing */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.sharing.title')}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#4a4a4a' }}>
                  {t('sections.sharing.content')}
                </p>
              </section>

              {/* Data Security */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.security.title')}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#4a4a4a' }}>
                  {t('sections.security.content')}
                </p>
              </section>

              {/* Children's Privacy */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.children.title')}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#4a4a4a' }}>
                  {t('sections.children.content')}
                </p>
              </section>

              {/* Your Rights */}
              <section className="mb-10">
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    color: '#1a1a2e',
                  }}
                >
                  {t('sections.rights.title')}
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#4a4a4a' }}>
                  {t('sections.rights.content')}
                </p>
              </section>

              {/* Changes to Privacy Policy */}
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
                    href="mailto:privacy@futurai.org"
                    className="underline"
                    style={{ color: '#ff6b35' }}
                  >
                    privacy@futurai.org
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

