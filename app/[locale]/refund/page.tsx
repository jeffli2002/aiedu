import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildLocaleCanonicalMetadata } from '@/lib/seo/metadata';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { paymentConfig } from '@/config/payment.config';
import { AlertCircle } from 'lucide-react';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const title = locale === 'zh' ? '退款政策 - Future AI Creators' : 'Refund Policy - Future AI Creators';
  const description =
    locale === 'zh'
      ? 'Future AI Creators 的退款政策，适用于课程、订阅与数字服务。了解退款规则与例外情况。'
      : 'Refund policy for Future AI Creators education programs, subscriptions, and digital services.';
  const keywords =
    locale === 'zh'
      ? ['退款政策', 'AI教育退款', '课程退款', '订阅取消', '数字服务退款']
      : [
          'AI education refund policy',
          'course refunds',
          'subscription cancellation',
          'digital service refunds',
        ];

  return {
    ...buildLocaleCanonicalMetadata(locale, '/refund'),
    title,
    description,
    keywords,
  };
}

export default function RefundPolicyPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const isZh = locale === 'zh';
  const copy = isZh
    ? {
        title: '退款政策',
        updated: '更新日期：2026年1月9日',
        noticeTitle: '数字化服务说明',
        noticeBody:
          '我们提供的是数字化课程与 AI 学习服务。一旦开通访问或使用积分，即视为服务已交付。',
        intro:
          '本退款政策适用于 Future AI Creators 的课程、订阅与数字化服务。购买即表示您已阅读并同意本政策。',
        section1Title: '1. 通用政策',
        section1Body:
          '由于数字服务具有即时交付特性，以下项目在开通访问后不支持退款：',
        section1List: [
          '课程与营地报名',
          '订阅计划',
          'AI 工具积分与信用包',
          '数字化教学资料',
        ],
        section2Title: '2. 为什么不退款？',
        section2Body:
          '数字课程与 AI 生成服务会立即消耗教学与计算资源。一旦您：',
        section2List: ['访问课程内容', '使用积分生成内容', '下载或分享学习成果'],
        section2Footer:
          '即视为服务已被使用，无法恢复，因此一般不提供退款。',
        section3Title: '3. 订阅取消',
        section3Body: '您可以随时取消订阅：',
        section3List: [
          '取消后可继续使用至当前计费周期结束',
          '未使用的月度积分在周期结束后到期',
          '中途取消不提供部分退款',
          '一次性购买的积分不会过期',
        ],
        section4Title: '4. 例外情况',
        section4Body: '以下情况可申请审核：',
        section4List: [
          '重复扣款或计费错误',
          '未经授权的交易（需核实）',
          '服务中断导致无法使用已购服务',
        ],
        section4Footer:
          '如需申请退款审核，请在 7 天内联系 support@futurai.org 并提供交易信息与说明。',
        section5Title: '5. 试用与体验',
        section5Body: '我们鼓励先使用注册赠送额度体验服务：',
        creditsUnit: '积分',
        section5ListLabels: {
          signup: '注册可获得',
        },
        section5Footer: '这些免费额度可用于体验 AI 工具与课程内容。',
        section6Title: '6. 拒付与争议',
        section6Body: '如对有效交易发起拒付或争议：',
        section6List: [
          '账户可能被暂停或关闭',
          '已生成内容可能无法访问',
          '可能产生额外费用与法律成本',
        ],
        section6Footer: '请先联系支持团队解决问题。',
        section7Title: '7. 价格变更',
        section7Body: '我们可能调整价格，但会提前通知：',
        section7List: ['现有订阅在有效期内保持原价', '变更仅影响新订阅或续订'],
        section8Title: '8. 联系我们',
        section8Body:
          '如对本政策有疑问，请联系 support@futurai.org。我们将尽力协助处理。',
        section9Title: '9. 政策更新',
        section9Body:
          '政策更新将公布在本页并更新日期。继续使用服务即表示接受新政策。',
        summaryTitle: '摘要',
        summaryList: [
          '数字服务通常不可退款',
          '建议先使用免费额度体验',
          '订阅可随时取消，权益到期后结束',
          '异常情况可在 7 天内申请审核',
        ],
      }
    : {
        title: 'Refund Policy',
        updated: 'Last updated: January 9, 2026',
        noticeTitle: 'Digital Services Notice',
        noticeBody:
          'We provide digital courses and AI learning services. Once access is granted or credits are used, the service is considered delivered.',
        intro:
          'This Refund Policy applies to Future AI Creators courses, subscriptions, and digital services. By purchasing, you agree to this policy.',
        section1Title: '1. General Policy',
        section1Body:
          'Because digital services are delivered immediately, the following are non-refundable after access is granted:',
        section1List: [
          'Course and camp enrollments',
          'Subscription plans',
          'AI tool credits and credit packs',
          'Digital learning materials',
        ],
        section2Title: '2. Why No Refunds?',
        section2Body:
          'Digital courses and AI generation services consume teaching and compute resources. Once you:',
        section2List: ['Access course content', 'Use credits to generate content', 'Download or share work'],
        section2Footer:
          'the service has been used and cannot be reversed, so refunds are generally not available.',
        section3Title: '3. Subscription Cancellation',
        section3Body: 'You can cancel subscriptions at any time:',
        section3List: [
          'Access remains until the end of the current billing period',
          'Unused monthly credits expire at the end of the period',
          'No partial refunds for mid-cycle cancellation',
          'One-time purchased credits do not expire',
        ],
        section4Title: '4. Exceptions',
        section4Body: 'We may review refund requests for:',
        section4List: [
          'Duplicate charges or billing errors',
          'Unauthorized transactions (subject to verification)',
          'Service outages that prevented access to paid services',
        ],
        section4Footer:
          'To request a review, contact support@futurai.org within 7 days with your transaction details.',
        section5Title: '5. Trial and Testing',
        section5Body: 'We encourage using the sign-up bonus credits to test the service:',
        creditsUnit: 'credits',
        section5ListLabels: {
          signup: 'Sign-up bonus',
        },
        section5Footer: 'These credits help you evaluate AI tools and learning content before purchase.',
        section6Title: '6. Chargebacks',
        section6Body: 'If you file a chargeback or dispute a valid charge:',
        section6List: [
          'Your account may be suspended or terminated',
          'Generated content may become inaccessible',
          'Additional fees or legal costs may apply',
        ],
        section6Footer: 'Please contact support first to resolve billing issues.',
        section7Title: '7. Pricing Changes',
        section7Body: 'We may update prices with advance notice:',
        section7List: [
          'Existing subscriptions remain at the current rate during the active term',
          'Changes apply only to new subscriptions or renewals',
        ],
        section8Title: '8. Contact Us',
        section8Body:
          'If you have questions about this policy, reach us at support@futurai.org. We will do our best to help.',
        section9Title: '9. Policy Updates',
        section9Body:
          'Updates will be posted on this page with a new date. Continued use means you accept the revised policy.',
        summaryTitle: 'Summary',
        summaryList: [
          'Digital services are generally non-refundable',
          'Use free credits to test before purchase',
          'Subscriptions can be canceled anytime (access lasts to period end)',
          'Exceptions can be reviewed within 7 days',
        ],
      };

  const freePlan = paymentConfig.plans.find((plan) => plan.id === 'free');
  const signupCredits = freePlan?.credits.onSignup ?? 15;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafaf9' }}>
      <Navbar />
      <main className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-8 text-4xl font-bold text-gray-900">{copy.title}</h1>

          <div className="space-y-6 text-gray-700">
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2 text-lg">
                      {copy.noticeTitle}
                    </h3>
                    <p className="text-amber-800">{copy.noticeBody}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-gray-500">{copy.updated}</p>
                <p>{copy.intro}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">{copy.section1Title}</h2>
                <p>{copy.section1Body}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {copy.section1List.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">{copy.section2Title}</h2>
                <p>{copy.section2Body}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {copy.section2List.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-4">{copy.section2Footer}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">{copy.section3Title}</h2>
                <p>{copy.section3Body}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {copy.section3List.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">{copy.section4Title}</h2>
                <p>{copy.section4Body}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {copy.section4List.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-4">{copy.section4Footer}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">{copy.section5Title}</h2>
                <p>{copy.section5Body}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    {copy.section5ListLabels.signup} {signupCredits} {copy.creditsUnit}
                  </li>
                </ul>
                <p className="mt-4">{copy.section5Footer}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">{copy.section6Title}</h2>
                <p>{copy.section6Body}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {copy.section6List.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-4">{copy.section6Footer}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">{copy.section7Title}</h2>
                <p>{copy.section7Body}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {copy.section7List.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">{copy.section8Title}</h2>
                <p>{copy.section8Body}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">{copy.section9Title}</h2>
                <p>{copy.section9Body}</p>
              </CardContent>
            </Card>

            <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">{copy.summaryTitle}</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                {copy.summaryList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
