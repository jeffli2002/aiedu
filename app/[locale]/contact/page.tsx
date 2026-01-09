import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildLocaleCanonicalMetadata } from '@/lib/seo/metadata';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';
import { Clock, Globe, Mail, MapPin, MessageSquare } from 'lucide-react';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const title =
    locale === 'zh' ? '联系我们 - Future AI Creators' : 'Contact Us - Future AI Creators';
  const description =
    locale === 'zh'
      ? '联系 Future AI Creators 获取课程咨询、营地报名与合作支持。'
      : 'Contact Future AI Creators for course inquiries, camp applications, or partnerships.';
  const keywords =
    locale === 'zh'
      ? ['联系我们', 'AI教育', '课程咨询', '创作营报名', '合作']
      : ['contact', 'AI education', 'course inquiry', 'camp application', 'partnership'];

  return {
    ...buildLocaleCanonicalMetadata(locale, '/contact'),
    title,
    description,
    keywords,
  };
}

export default function ContactPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const isZh = locale === 'zh';

  const copy = isZh
    ? {
        title: '联系我们',
        subtitle: '有问题或想了解课程？我们随时为你提供帮助。',
        emailTitle: '邮箱支持',
        emailLabels: ['课程与营地咨询', '家长与学生支持', '合作与机构项目'],
        responseTitle: '响应时间',
        responseItems: [
          { label: '一般咨询', value: '48 小时内' },
          { label: '已报名学员/家长', value: '24 小时内' },
          { label: '营地报名相关', value: '24 小时内' },
        ],
        addressTitle: '办公地址',
        addressHeading: 'Future AI Creators 教育团队',
        addressEnLines: ['Datun Road, Chaoyang District', 'Beijing, China'],
        addressZhLines: ['中国北京市朝阳区大屯路'],
        faqTitle: '常见问题',
        faq: [
          {
            q: '课程适合哪个年龄段？',
            a: '我们主要面向 8-18 岁青少年，课程会按年龄段与基础进行分层。',
          },
          {
            q: '课程形式是线上还是线下？',
            a: '以线上为主，部分营地为线下或混合形式，具体以报名页说明为准。',
          },
          {
            q: '如何使用 AI 创作工具？',
            a: '我们会提供工具教学与项目任务，帮助学生通过实践完成作品。',
          },
          {
            q: '如果积分用完怎么办？',
            a: '可升级订阅或购买积分包获取更多积分。',
          },
          {
            q: '是否支持退款？',
            a: '请参考退款政策页面了解详细规则与例外情况。',
          },
        ],
        connectTitle: '关注我们',
        connectBody: '关注社交平台，获取最新课程与作品分享：',
        ctaTitle: '准备开始学习了吗？',
        ctaBody: '探索课程或立即开始 AI 创作。',
        ctaPrimary: '浏览课程',
        ctaSecondary: '开始创作',
      }
    : {
        title: 'Contact Us',
        subtitle: 'Questions about courses or camps? We are here to help.',
        emailTitle: 'Email Support',
        emailLabels: ['Courses & Camps', 'Parents & Students', 'Partnerships'],
        responseTitle: 'Response Time',
        responseItems: [
          { label: 'General inquiries', value: 'Within 48 hours' },
          { label: 'Enrolled families', value: 'Within 24 hours' },
          { label: 'Camp applications', value: 'Within 24 hours' },
        ],
        addressTitle: 'Office Address',
        addressHeading: 'Future AI Creators Education Team',
        addressEnLines: ['Datun Road, Chaoyang District', 'Beijing, China'],
        addressZhLines: ['中国北京市朝阳区大屯路'],
        faqTitle: 'Frequently Asked Questions',
        faq: [
          {
            q: 'What age group is the program for?',
            a: 'We primarily serve students ages 8-18, with levels tailored to experience.',
          },
          {
            q: 'Are classes online or onsite?',
            a: 'Most courses are online. Some camps run onsite or hybrid; details are listed on each program page.',
          },
          {
            q: 'How do students learn AI creation tools?',
            a: 'We provide guided lessons and project tasks so students build real work step by step.',
          },
          {
            q: 'What if I run out of credits?',
            a: 'You can upgrade your plan or purchase a credit pack to get more credits.',
          },
          {
            q: 'Do you offer refunds?',
            a: 'Please review our refund policy for rules and exceptions.',
          },
        ],
        connectTitle: 'Connect With Us',
        connectBody: 'Follow us for updates, tips, and student showcases:',
        ctaTitle: 'Ready to start learning?',
        ctaBody: 'Explore courses or jump into AI creation today.',
        ctaPrimary: 'Explore Courses',
        ctaSecondary: 'Start Creating',
      };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafaf9' }}>
      <Navbar />
      <main className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">{copy.title}</h1>
            <p className="text-lg text-gray-600">{copy.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-teal-500" />
                  {copy.emailTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {copy.emailLabels.map((label) => (
                  <div key={label}>
                    <p className="text-sm text-gray-600 mb-1">{label}</p>
                    <a
                      href="mailto:support@futurai.org"
                      className="text-teal-600 hover:underline font-medium"
                    >
                      support@futurai.org
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-500" />
                  {copy.responseTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {copy.responseItems.map((item) => (
                  <div key={item.label}>
                    <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-500" />
                {copy.addressTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-2">{copy.addressHeading}</p>
                <p className="text-gray-700">
                  {copy.addressEnLines[0]}
                  <br />
                  {copy.addressEnLines[1]}
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="font-semibold text-gray-900 mb-2">中文地址</p>
                <p className="text-gray-700">{copy.addressZhLines[0]}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-teal-500" />
                {copy.faqTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {copy.faq.map((item) => (
                <div key={item.q}>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-gray-700 text-sm">{item.a}</p>
                </div>
              ))}
              <div className="text-sm">
                <Link href="/refund" className="text-teal-600 hover:underline font-medium">
                  {isZh ? '查看退款政策' : 'View Refund Policy'}
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-teal-500" />
                {copy.connectTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{copy.connectBody}</p>
              <div className="flex gap-4 flex-wrap">
                <a
                  href="https://x.com/jeffli2002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-slate-700 font-medium"
                >
                  Twitter @jeffli2002
                </a>
                <a
                  href="mailto:support@futurai.org"
                  className="text-teal-600 hover:text-slate-700 font-medium"
                >
                  support@futurai.org
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 bg-gradient-to-r from-teal-50 via-teal-100 to-white rounded-lg p-8 text-center border border-teal-100 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{copy.ctaTitle}</h3>
            <p className="text-gray-700 mb-6">{copy.ctaBody}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/training"
                className="inline-flex items-center justify-center px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
              >
                {copy.ctaPrimary}
              </Link>
              <Link
                href="/image-generation"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-teal-500 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
              >
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
