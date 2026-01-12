'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Sparkles, Video, Code, Palette, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { translations, Language } from '@/translations';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

/**
 * DESIGN SYSTEM - Editorial Minimal for Youth AI Education
 *
 * Aesthetic: Magazine editorial meets playful youth energy
 * Typography: Instrument Serif (display) + DM Sans (body)
 * Colors: Coral Orange (#ff6b35) dominant, Teal (#2ec4b6) accent
 * Texture: Subtle grain overlay for depth
 * Layout: Asymmetric, generous whitespace, overlapping elements
 */

// Grain texture overlay component
const GrainOverlay = () => (
  <div
    className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    }}
  />
);

// Decorative floating shapes
const FloatingShape = ({
  className,
  color = '#ff6b35',
  size = 120,
  delay = 0
}: {
  className?: string;
  color?: string;
  size?: number;
  delay?: number;
}) => (
  <div
    className={`absolute rounded-full opacity-10 animate-float ${className}`}
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      animationDelay: `${delay}s`,
    }}
  />
);

const Hero = ({ lang }: { lang: Language }) => {
  const t = translations[lang].hero;
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const cnTitle = t.title;
  const renderCnTitle = () => {
    const [beforeAiLearning, afterAiLearning] = cnTitle.split('AI学习');
    if (!afterAiLearning) return cnTitle;
    const [between, afterPractice] = afterAiLearning.split('实操');
    if (!afterPractice) return cnTitle;
    return (
      <>
        {beforeAiLearning}
        <span className="italic" style={{ color: '#ff6b35' }}>AI学习</span>
        {between}
        <span className="italic" style={{ color: '#2ec4b6' }}>实操</span>
        {afterPractice}
      </>
    );
  };
  const renderEnTitle = () => {
    const hasPractical = t.title.includes('Practical ');
    const practicalParts = t.title.split('Practical ');
    if (!hasPractical || practicalParts.length < 2) return t.title;
    const afterPractical = practicalParts.slice(1).join('Practical ');
    const learningParts = afterPractical.split('AI Learning');
    if (learningParts.length < 2) {
      return (
        <>
          {practicalParts[0]}
          <span className="italic" style={{ color: '#ff6b35' }}>Practical</span>{' '}
          {afterPractical}
        </>
      );
    }
    return (
      <>
        {practicalParts[0]}
        <span className="italic" style={{ color: '#ff6b35' }}>Practical</span>{' '}
        {learningParts[0]}
        <span className="italic" style={{ color: '#2ec4b6' }}>AI Learning</span>
        {learningParts.slice(1).join('AI Learning')}
      </>
    );
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen pt-32 pb-20 px-6 lg:px-12 overflow-hidden"
      style={{ backgroundColor: '#fafaf9' }}
    >
      {/* Decorative shapes */}
      <FloatingShape className="top-20 right-[15%]" color="#ff6b35" size={200} delay={0} />
      <FloatingShape className="bottom-32 left-[5%]" color="#2ec4b6" size={160} delay={0.5} />
      <FloatingShape className="top-1/2 right-[5%]" color="#ff6b35" size={80} delay={1} />

      {/* Dotted pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#1a1a2e 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Asymmetric grid layout */}
        <div className="grid grid-cols-12 gap-6 items-center min-h-[70vh]">
          {/* Left content - spans 5 cols on large screens */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-1">
            {/* Tagline badge */}
            <div
              className={`inline-flex items-center gap-2 bg-white border border-slate-200/80
                px-4 py-2 rounded-full mb-10 shadow-sm transition-all duration-1000
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <Sparkles className="w-4 h-4 text-[#ff6b35]" />
              <span
                className="text-[11px] font-semibold tracking-[0.2em] uppercase"
                style={{ color: '#1a1a2e', fontFamily: 'DM Sans, sans-serif' }}
              >
                {t.tagline}
              </span>
            </div>

            {/* Main headline - Editorial typography */}
            <h1
              className={`text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-8 transition-all duration-1000 delay-150
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{
                fontFamily: '"Instrument Serif", Georgia, serif',
                color: '#1a1a2e',
                fontWeight: 400,
              }}
            >
              {lang === 'cn' ? renderCnTitle() : renderEnTitle()}
            </h1>

            {/* Description */}
            <p
              className={`text-lg leading-relaxed mb-12 max-w-md transition-all duration-1000 delay-300
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#4a4a4a',
              }}
            >
              {t.description}
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-1000 delay-500
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <Link
                href="/training"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold
                  transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
                style={{
                  backgroundColor: '#ff6b35',
                  fontFamily: 'DM Sans, sans-serif',
                  boxShadow: '0 12px 40px -8px rgba(255, 107, 53, 0.4)',
                }}
              >
                {t.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/image-generation"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold
                  border-2 transition-all duration-300 hover:border-[#2ec4b6] hover:text-[#2ec4b6]"
                style={{
                  borderColor: '#e5e5e5',
                  color: '#1a1a2e',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {t.secondaryCta}
              </Link>
            </div>
          </div>

          {/* Right: Hero illustration - asymmetric placement */}
          <div
            className={`col-span-12 lg:col-span-6 lg:col-start-7 relative transition-all duration-1000 delay-700
              ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
          >
            {/* Main image with creative framing */}
            <div className="relative group">
              {/* Background accent */}
              <div
                className="absolute -inset-4 rounded-[2rem] -rotate-2 transition-all duration-500 group-hover:rotate-[-4deg] group-hover:opacity-0.15"
                style={{ backgroundColor: '#ff6b35', opacity: 0.08 }}
              />

              {/* Image container */}
              <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden border-2 border-white shadow-2xl transition-all duration-500 group-hover:shadow-[0_25px_60px_-12px_rgba(255,107,53,0.3)] group-hover:-translate-y-2">
                <img
                  src="/homepage/hero.jpg"
                  alt="Students creating with AI"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200';
                  }}
                />
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#ff6b35]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Floating stat card */}
              <div
                className="absolute -bottom-6 -left-6 bg-white px-6 py-4 rounded-2xl shadow-xl border border-slate-100 transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:-translate-y-1"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                <p
                  className="text-3xl font-bold transition-colors duration-300 group-hover:text-[#ff6b35]"
                  style={{ color: '#ff6b35', fontFamily: '"Instrument Serif", serif' }}
                >
                  10+
                </p>
                <p className="text-sm text-slate-500 mt-1 transition-colors duration-300 group-hover:text-slate-700">
                  {lang === 'cn' ? '适龄年龄' : 'Age Range'}
                </p>
              </div>

              {/* Play button overlay hint */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all duration-300 group-hover:bg-[#ff6b35] group-hover:text-white group-hover:scale-110 group-hover:shadow-xl">
                <Play className="w-4 h-4 text-[#ff6b35] group-hover:text-white transition-colors duration-300" style={{ fill: 'currentColor' }} />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-white transition-colors duration-300">
                  {lang === 'cn' ? '开始学习' : 'Start Learning'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CoreValue = ({ lang }: { lang: Language }) => {
  const coreValue = translations[lang].coreValue;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-6 lg:px-12 bg-white relative overflow-hidden">
      {/* Decorative element */}
      <div
        className="absolute top-0 right-0 w-1/3 h-full opacity-[0.02]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #1a1a2e 0, #1a1a2e 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Image side - larger, offset */}
          <div
            className={`col-span-12 lg:col-span-5 relative transition-all duration-1000
              ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
          >
            <div className="relative group">
              <div
                className="absolute -inset-3 rounded-[2rem] rotate-3 transition-all duration-500 group-hover:rotate-6 group-hover:opacity-0.2"
                style={{ backgroundColor: '#2ec4b6', opacity: 0.1 }}
              />
              <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-[0_25px_60px_-12px_rgba(46,196,182,0.3)] group-hover:-translate-y-2">
                <img
                  src="/homepage/core-value.jpg"
                  alt={coreValue.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = '/core_vision.jpg';
                  }}
                />
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2ec4b6]/10 via-transparent to-[#ff6b35]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              {/* Floating badge */}
              <div
                className="absolute -bottom-4 -right-4 bg-[#ff6b35] text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl group-hover:bg-[#2ec4b6]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                <p className="text-2xl font-bold transition-transform duration-300 group-hover:scale-105">{coreValue.statValue}</p>
                <p className="text-xs opacity-80 group-hover:opacity-100 transition-opacity duration-300">{coreValue.statLabel}</p>
              </div>
            </div>
          </div>

          {/* Content side */}
          <div
            className={`col-span-12 lg:col-span-6 lg:col-start-7 transition-all duration-1000 delay-300
              ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
          >
            <span
              className="inline-block text-xs font-semibold tracking-[0.3em] uppercase mb-6"
              style={{ color: '#ff6b35', fontFamily: 'DM Sans, sans-serif' }}
            >
              {lang === 'cn' ? '我们的理念' : 'Our Philosophy'}
            </span>

            <h2
              className="text-4xl md:text-5xl leading-tight mb-8"
              style={{
                fontFamily: '"Instrument Serif", Georgia, serif',
                color: '#1a1a2e',
              }}
            >
              {coreValue.title}
            </h2>

            <p
              className="text-lg leading-relaxed mb-10"
              style={{ fontFamily: 'DM Sans, sans-serif', color: '#4a4a4a' }}
            >
              {coreValue.content}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-8">
              <div>
                <p
                  className="text-4xl font-bold"
                  style={{ color: '#2ec4b6', fontFamily: '"Instrument Serif", serif' }}
                >
                  10
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {lang === 'cn' ? '核心课程' : 'Core Courses'}
                </p>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div>
                <p
                  className="text-4xl font-bold"
                  style={{ color: '#ff6b35', fontFamily: '"Instrument Serif", serif' }}
                >
                  2
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {lang === 'cn' ? '语言支持' : 'Languages'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = ({ lang }: { lang: Language }) => {
  const t = translations[lang].projects;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const items = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: t.p1.title,
      desc: t.p1.desc,
      img: '/homepage/project-poster.jpg',
      fallbackImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
      color: '#ff6b35',
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: t.p2.title,
      desc: t.p2.desc,
      img: '/homepage/project-video.jpg',
      fallbackImg: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800',
      color: '#2ec4b6',
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: t.p3.title,
      desc: t.p3.desc,
      img: '/homepage/project-app.jpg',
      fallbackImg: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
      color: '#1a1a2e',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-28 px-6 lg:px-12 relative overflow-hidden"
      style={{ backgroundColor: '#fafaf9' }}
    >
      <FloatingShape className="top-20 left-[10%]" color="#2ec4b6" size={100} delay={0.3} />
      <FloatingShape className="bottom-20 right-[15%]" color="#ff6b35" size={140} delay={0.7} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header - asymmetric */}
        <div className="max-w-2xl mb-20">
          <span
            className="inline-block text-xs font-semibold tracking-[0.3em] uppercase mb-6"
            style={{ color: '#ff6b35', fontFamily: 'DM Sans, sans-serif' }}
          >
            {lang === 'cn' ? '项目展示' : 'Projects'}
          </span>
          <h2
            className="text-4xl md:text-5xl leading-tight mb-6"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
          >
            {lang === 'cn' ? '真实 AI 项目' : 'Real-World AI Projects'}
          </h2>
          <p
            className="text-lg"
            style={{ fontFamily: 'DM Sans, sans-serif', color: '#4a4a4a' }}
          >
            {t.subtitle}
          </p>
        </div>

        {/* Project cards - staggered grid */}
        <div className="grid grid-cols-12 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`col-span-12 md:col-span-4 group transition-all duration-700
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div
                className="bg-white rounded-[1.5rem] overflow-hidden border border-slate-100
                  hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.currentTarget.src = item.fallbackImg; }}
                  />
                </div>

                {/* Content */}
                <div className="p-8">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${item.color}12`, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    className="text-xl mb-4"
                    style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#666' }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = ({ lang }: { lang: Language }) => {
  const t = translations[lang].about;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-semibold tracking-[0.3em] uppercase mb-6"
            style={{ color: '#ff6b35', fontFamily: 'DM Sans, sans-serif' }}
          >
            {lang === 'cn' ? '关于我们' : 'About Us'}
          </span>
          <h2
            className="text-4xl md:text-5xl"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
          >
            {t.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            { num: '01', color: '#ff6b35', data: t.vision },
            { num: '02', color: '#2ec4b6', data: t.method },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`group p-10 rounded-[1.5rem] border border-slate-100 transition-all duration-500 cursor-pointer
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                hover:-translate-y-2 hover:shadow-2xl hover:border-transparent`}
              style={{
                transitionDelay: `${idx * 150}ms`,
                backgroundColor: '#fafaf9',
              }}
            >
              <span
                className="text-5xl font-light opacity-20 transition-all duration-500 group-hover:opacity-30 group-hover:scale-110 inline-block"
                style={{ color: item.color, fontFamily: '"Instrument Serif", serif' }}
              >
                {item.num}
              </span>
              <h3
                className="text-2xl mt-4 mb-4 transition-colors duration-300 group-hover:text-[#1a1a2e]"
                style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
              >
                {item.data.title}
              </h3>
              <p
                className="leading-relaxed transition-colors duration-300 group-hover:text-slate-700"
                style={{ fontFamily: 'DM Sans, sans-serif', color: '#666' }}
              >
                {item.data.desc}
              </p>
              {/* Hover accent line */}
              <div
                className="h-1 w-0 mt-6 transition-all duration-500 group-hover:w-full rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Data
const faqData = {
  en: [
    {
      category: 'Platform & Courses',
      items: [
        { q: 'What courses are available on the platform?', a: 'We offer AI Foundations, AI Image Creation, AI Video Production, and AI-assisted coding courses. All courses are designed for students aged 10+ with hands-on projects.' },
        { q: 'How do I access the training materials?', a: 'After signing in, navigate to the Training section. Materials include video lessons, PDFs, and interactive exercises. Premium content requires a subscription.' },
        { q: 'Are courses available in both Chinese and English?', a: 'Yes! All our courses are fully bilingual (Chinese/English). You can switch languages anytime using the language toggle.' },
      ],
    },
    {
      category: 'AI Tools',
      items: [
        { q: 'How does the AI image generator work?', a: 'Our AI image generator uses state-of-the-art models. Describe what you want, select a style, and the AI generates unique images. Each generation costs credits.' },
        { q: 'What is the credit system?', a: 'Credits are used for AI generations. New users receive free credits. Get more by upgrading or purchasing credit packs.' },
        { q: 'Can I use generated images commercially?', a: 'Images are yours for personal and educational projects. For commercial use, please review our terms of service.' },
      ],
    },
    {
      category: 'Age & Requirements',
      items: [
        { q: 'What age group is this platform for?', a: 'Our platform is designed for students aged 10+. Content is age-appropriate and focuses on creative, educational AI applications.' },
        { q: 'Do I need coding experience?', a: 'No coding experience required for most courses. AI Foundations and Creation courses are beginner-friendly.' },
        { q: 'What devices can I use?', a: 'Our platform works on any modern browser - desktop, tablet, or mobile. We recommend laptop or desktop for best experience.' },
      ],
    },
  ],
  cn: [
    {
      category: '平台与课程',
      items: [
        { q: '平台提供哪些课程？', a: '我们提供AI基础、AI图像创作、AI视频制作和AI辅助编程课程。所有课程专为10岁以上学生设计，包含实践项目。' },
        { q: '如何访问培训材料？', a: '登录后，进入"训练课程"板块。材料包括视频课程、PDF和互动练习。高级内容需要订阅会员。' },
        { q: '课程是否提供中英双语？', a: '是的！所有课程都是中英双语。您可以随时使用语言切换功能。' },
      ],
    },
    {
      category: 'AI 工具',
      items: [
        { q: 'AI图像生成器如何工作？', a: '我们的AI图像生成器使用最先进的模型。描述您想创建的内容，选择风格，AI就会生成独特的图像。每次生成消耗积分。' },
        { q: '积分系统是什么？', a: '积分用于 AI 生成。新用户可获得免费积分。需要更多积分可升级订阅或购买积分包。' },
        { q: '生成的图片可以商用吗？', a: '图像可用于个人和教育项目。如需商业用途，请查阅服务条款。' },
      ],
    },
    {
      category: '年龄与要求',
      items: [
        { q: '这个平台适合什么年龄段？', a: '我们的平台专为10岁以上学生设计。内容适合该年龄段，专注于AI的创意和教育应用。' },
        { q: '需要编程基础吗？', a: '大多数课程不需要编程经验。AI基础和创作课程对初学者友好。' },
        { q: '可以使用哪些设备？', a: '支持任何现代浏览器——电脑、平板或手机。建议使用电脑获得最佳体验。' },
      ],
    },
  ],
};

const FAQ = ({ lang }: { lang: Language }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const data = faqData[lang === 'cn' ? 'cn' : 'en'];
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) newOpen.delete(id);
    else newOpen.add(id);
    setOpenItems(newOpen);
  };

  return (
    <section
      ref={sectionRef}
      className="py-28 px-6 lg:px-12 relative overflow-hidden"
      style={{ backgroundColor: '#fafaf9' }}
    >
      <FloatingShape className="top-20 right-[10%]" color="#ff6b35" size={120} delay={0.2} />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-semibold tracking-[0.3em] uppercase mb-6"
            style={{ color: '#ff6b35', fontFamily: 'DM Sans, sans-serif' }}
          >
            FAQ
          </span>
          <h2
            className="text-4xl md:text-5xl mb-4"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
          >
            {lang === 'cn' ? '常见问题' : 'Common Questions'}
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#666' }}>
            {lang === 'cn' ? '有问题？我们来帮您解答。' : 'Have questions? We have answers.'}
          </p>
        </div>

        <div className="space-y-10">
          {data.map((category, catIdx) => (
            <div
              key={catIdx}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${catIdx * 100}ms` }}
            >
              <h3
                className="text-sm font-semibold tracking-[0.2em] uppercase mb-4"
                style={{ color: '#2ec4b6', fontFamily: 'DM Sans, sans-serif' }}
              >
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.items.map((item, itemIdx) => {
                  const id = `${catIdx}-${itemIdx}`;
                  const isOpen = openItems.has(id);

                  return (
                    <div
                      key={id}
                      className="group bg-white rounded-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#ff6b35]/20"
                    >
                      <button
                        onClick={() => toggleItem(id)}
                        className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 transition-colors group-hover:bg-[#fff7f2]"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        <span
                          className="font-semibold text-[#1a1a2e] transition-colors group-hover:text-[#ff6b35]"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {item.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0 transition-colors group-hover:text-[#ff6b35]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 transition-colors group-hover:text-[#ff6b35]" />
                        )}
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40' : 'max-h-0'}`}
                      >
                        <div
                          className="px-6 pb-5 leading-relaxed"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: '#666' }}
                        >
                          {item.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export interface HomePageProps {
  lang?: Language;
}

export default function Home({ lang: propLang }: HomePageProps = {}) {
  const lang: Language = propLang ?? 'cn';

  return (
    <div
      className="min-h-screen selection:bg-[#ff6b35] selection:text-white"
      style={{ backgroundColor: '#fafaf9' }}
    >
      <GrainOverlay />
      <Navbar />

      <main>
        <Hero lang={lang} />
        <CoreValue lang={lang} />
        <Projects lang={lang} />
        <About lang={lang} />
        <FAQ lang={lang} />
      </main>

      <Footer />

      {/* Global styles for custom animations and fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
