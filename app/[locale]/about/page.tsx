import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getSEOMetadata } from '@/lib/seo/metadata-translations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from '@/i18n/navigation';
import { Sparkles, Target, Users, Zap } from 'lucide-react';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  return getSEOMetadata(locale, 'landing', '/about');
}

export default function AboutPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const isZh = locale === 'zh';
  const copy = isZh
    ? {
        title: '关于 FuturAI',
        subtitle: '让孩子把 AI 变成真实技能与作品。',
        missionTitle: '我们的使命',
        missionBody: [
          '我们相信 AI 是未来的基础能力。FuturAI 致力于帮助青少年从“使用者”成长为“创造者”。',
          '通过项目式学习与真实问题探索，我们训练学生的创造力、批判思维与负责任的 AI 素养。',
        ],
        whatTitle: '我们做什么',
        whatIntro: '我们为青少年提供结构化的 AI 学习体验：',
        whatList: [
          '项目式 AI 课程（图像、视频、应用原型）',
          '假期创作营与主题营',
          '导师反馈与作品集沉淀',
          '家长进度更新与学习报告',
          'AI 伦理与安全使用训练',
        ],
        whyTitle: '为什么选择我们',
        whyItems: [
          {
            title: '动手创作',
            body: '从真实项目出发，边做边学，建立可展示的成果。',
          },
          {
            title: '面向未来',
            body: '训练提示词、叙事表达与产品思维等综合能力。',
          },
          {
            title: '创作自信',
            body: '鼓励表达观点与解决问题，培养长期学习动力。',
          },
          {
            title: '社区共创',
            body: '与同龄伙伴协作与分享，让创作更有成就感。',
          },
        ],
        whoTitle: '服务对象',
        whoList: [
          '希望系统学习 AI 的学生与青少年',
          '为孩子寻找高质量课程的家长',
          '学校与教育机构',
          '青少年科技与创作项目',
        ],
        techTitle: '我们的技术与方法',
        techBody: [
          '我们将 AI 图像与视频工具融入学习任务，强调“过程”与“思考”，而不仅是结果。',
          '课程采用可复用的项目框架，帮助学生持续迭代、建立个人作品集。',
        ],
        ctaTitle: '开启你的 AI 创作之旅',
        ctaBody: '加入课程或报名创作营，让孩子用 AI 解决问题并表达观点。',
        ctaPrimary: '浏览课程',
        ctaSecondary: '开始创作',
      }
    : {
        title: 'About FuturAI',
        subtitle: 'Practical AI literacy for the next generation of creators.',
        missionTitle: 'Our Mission',
        missionBody: [
          'We believe AI is a foundational skill for the future. FuturAI helps young learners grow from users into creators.',
          'Through project-based learning and real-world challenges, we cultivate creativity, critical thinking, and responsible AI literacy.',
        ],
        whatTitle: 'What We Do',
        whatIntro: 'We provide structured AI learning experiences for youth:',
        whatList: [
          'Project-based AI courses (image, video, and app prototyping)',
          'Seasonal creation camps and themed cohorts',
          'Mentor feedback and portfolio building',
          'Parent updates and learning reports',
          'Ethics and safe AI usage training',
        ],
        whyTitle: 'Why Choose Us',
        whyItems: [
          {
            title: 'Hands-on Creation',
            body: 'Learn by building real projects with outcomes you can showcase.',
          },
          {
            title: 'Future-ready Skills',
            body: 'Develop prompting, storytelling, and product thinking together.',
          },
          {
            title: 'Creative Confidence',
            body: 'Encourage expression and problem solving with guided support.',
          },
          {
            title: 'Community Learning',
            body: 'Collaborate and share with peers to grow faster.',
          },
        ],
        whoTitle: 'Who We Serve',
        whoList: [
          'Students and teens exploring AI',
          'Parents seeking structured AI education',
          'Schools and educators',
          'Youth tech and creativity programs',
        ],
        techTitle: 'Our Technology and Method',
        techBody: [
          'We integrate AI image and video tools into learning tasks, focusing on process and thinking, not just outcomes.',
          'Our curriculum uses reusable project frameworks that help learners iterate and build portfolios.',
        ],
        ctaTitle: 'Start the AI Creator Journey',
        ctaBody: 'Join a course or camp and let students solve real problems with AI.',
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

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-teal-500" />
                  {copy.missionTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4">
                {copy.missionBody.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-teal-500" />
                  {copy.whatTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4">
                <p>{copy.whatIntro}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {copy.whatList.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-teal-500" />
                  {copy.whyTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <div className="grid md:grid-cols-2 gap-4">
                  {copy.whyItems.map((item) => (
                    <div key={item.title} className="space-y-2">
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm">{item.body}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-500" />
                  {copy.whoTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4">
                <p>{isZh ? '适合以下人群：' : 'FuturAI is designed for:'}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {copy.whoList.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{copy.techTitle}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4">
                {copy.techBody.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-teal-50 via-teal-100 to-white rounded-lg p-8 text-center border border-teal-100 shadow-lg">
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
        </div>
      </main>
      <Footer />
    </div>
  );
}










