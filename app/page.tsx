'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Code,
  Monitor,
  Palette,
  Video,
  Zap,
} from 'lucide-react';
import { translations, Language } from '@/translations';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';

const Hero = ({ lang }: { lang: Language }) => {
  const t = translations[lang].hero;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const heroVideoSrc =
    process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_HERO_VIDEO_URL
      ? process.env.NEXT_PUBLIC_HERO_VIDEO_URL
      : '/herovideo.mp4';

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="home"
      className="pt-32 pb-24 px-6 relative overflow-hidden min-h-screen flex flex-col items-center bg-gradient-to-b from-slate-50 via-white to-slate-50"
    >
      <div className="absolute inset-0 z-0 scale-110 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center animate-pan-slow opacity-10 mix-blend-overlay transition-transform duration-700 ease-out pointer-events-none"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2400")',
            transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px) scale(1.1)`,
            filter: 'hue-rotate(15deg) brightness(0.8)',
          }}
        ></div>

        <div
          className="absolute inset-0 opacity-10 pointer-events-none transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #8b5cf6 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/50"></div>

        <div
          className="glow-sphere bg-violet-500/20 w-[900px] h-[900px] blur-[120px] transition-all duration-500 ease-out"
          style={{
            left: `calc(20% + ${mousePos.x * 100}px)`,
            top: `calc(10% + ${mousePos.y * 100}px)`,
            opacity: 0.3 + Math.abs(mousePos.x) * 0.15,
          }}
        ></div>
        <div
          className="glow-sphere bg-blue-500/20 w-[900px] h-[900px] blur-[120px] transition-all duration-500 ease-out"
          style={{
            right: `calc(20% + ${mousePos.x * -100}px)`,
            bottom: `calc(10% + ${mousePos.y * -100}px)`,
            opacity: 0.3 + Math.abs(mousePos.y) * 0.15,
          }}
        ></div>
      </div>

      <div
        className="max-w-[1440px] w-full mx-auto flex flex-col items-center text-center relative z-20 transition-transform duration-500 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.y * -2}deg) rotateY(${mousePos.x * 2}deg)`,
        }}
      >
        <div
          className={`inline-flex items-center space-x-3 bg-violet-50/80 backdrop-blur-md border border-violet-200/50 px-6 py-2.5 rounded-full mb-12 transition-all duration-1000 ${
            isMounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
          <span className="text-[11px] font-black text-violet-700 uppercase tracking-[0.4em]">
            {t.tagline}
          </span>
        </div>

        <h1
          className={`text-4xl md:text-6xl font-black mb-12 leading-[0.85] tracking-tighter transition-all duration-1000 delay-150 ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span className="block mb-4 text-slate-900">
            {lang === 'cn' ? (
              <>
                掌握 <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">AI</span>
              </>
            ) : (
              <>
                Master <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">AI Skills</span>
              </>
            )}
          </span>
          <span className="block text-slate-800">
            {lang === 'cn' ? (
              <>
                创造 <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent italic">未来</span>
              </>
            ) : (
              <>
                Create the{' '}
                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent italic">Future</span>
              </>
            )}
          </span>
        </h1>

        <p
          className={`text-base md:text-lg text-slate-700 max-w-4xl mb-16 leading-relaxed font-medium transition-all duration-1000 delay-300 ${
            isMounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {t.description}
        </p>

        <div
          className={`flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-10 mb-32 transition-all duration-1000 delay-500 ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            href="/training"
            className="group px-10 py-5 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center hover:from-violet-700 hover:to-blue-700 transition-all transform hover:scale-110 active:scale-95 shadow-lg shadow-violet-500/30"
          >
            {t.cta}
            <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-5 border-2 border-violet-200 hover:border-violet-400 text-violet-700 hover:text-violet-800 rounded-full font-bold text-sm uppercase tracking-widest transition-all hover:bg-violet-50 shadow-md"
          >
            {translations[lang].nav.projects}
          </button>
        </div>

        <div
          className={`w-full max-w-[1440px] px-4 transition-all duration-1000 delay-700 ${
            isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'
          }`}
        >
          <div className="relative group p-1.5 glass rounded-[3.5rem] overflow-hidden shadow-[0_60px_100px_rgba(0,0,0,0.7)]">
            <div className="aspect-[21/9] relative rounded-[3rem] overflow-hidden bg-slate-900">
              <video
                className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[4s] ease-out"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Hero video"
              >
                <source src={heroVideoSrc} type="video/mp4" />
                {t.cta}
              </video>
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors duration-700">
                <div className="w-24 h-24 glass rounded-full flex items-center justify-center cursor-pointer border border-white/30 group-hover:scale-110 group-hover:border-white/60 transition-all duration-500 shadow-2xl backdrop-blur-xl">
                  <div className="w-0 h-0 border-t-[14px] border-t-transparent border-l-[22px] border-l-white border-b-[14px] border-b-transparent ml-3 drop-shadow-[0_0_10px_white]"></div>
                </div>
              </div>

              <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 text-left max-w-4xl z-10">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="inline-block bg-white/5 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-violet-400 border border-white/10 backdrop-blur-xl shadow-lg">
                    Official Trailer
                  </div>
                  <div className="flex items-center space-x-2 bg-violet-600/90 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-xl shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    <span>Interactive</span>
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] leading-tight">
                  {lang === 'cn' ? 'AI 改变教育的瞬间' : 'Moments AI Changes Education'}
                </h3>
                <p className="text-white text-base mt-5 opacity-90 font-semibold drop-shadow-lg">
                  {lang === 'cn' ? '体验 5 天的创新、创作与影响力之旅。' : 'Experience the 5-day journey of innovation, creation, and impact.'}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = ({ lang }: { lang: Language }) => {
  const t = translations[lang].projects;
  const [zoomedIds, setZoomedIds] = useState<number[]>([]);

  const toggleZoom = (idx: number) => {
    setZoomedIds(prev => (prev.includes(idx) ? prev.filter(id => id !== idx) : [...prev, idx]));
  };

  const items = [
    {
      icon: <Palette className="w-8 h-8 text-pink-400" />,
      title: t.p1.title,
      desc: t.p1.desc,
      img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
      accent: 'rgba(236, 72, 153, 0.4)',
    },
    {
      icon: <Video className="w-8 h-8 text-cyan-400" />,
      title: t.p2.title,
      desc: t.p2.desc,
      img: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1200',
      accent: 'rgba(6, 182, 212, 0.4)',
    },
    {
      icon: <Code className="w-8 h-8 text-green-400" />,
      title: t.p3.title,
      desc: t.p3.desc,
      img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
      accent: 'rgba(34, 197, 94, 0.4)',
    },
  ];

  return (
    <section id="projects" className="py-20 px-6 bg-white">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-[0.9] mb-8 text-slate-900">
              {lang === 'cn' ? '激发潜能的' : 'POWERING'} <br />
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">{lang === 'cn' ? '真实项目' : 'REAL IMPACT'}</span>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed max-w-2xl">{t.subtitle}</p>
          </div>
          <button className="flex items-center space-x-4 text-xs font-black uppercase tracking-[0.3em] text-violet-600 hover:text-violet-700 transition-all transform hover:translate-x-2">
            <span>{lang === 'cn' ? '查看作品集' : 'View Portfolio'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => toggleZoom(idx)}
              className="group bg-white rounded-[2.5rem] p-8 cursor-pointer relative overflow-hidden min-h-[550px] flex flex-col transition-all duration-700 hover:shadow-2xl border border-slate-200 hover:border-violet-300"
            >
              <div className="mb-6 p-4 bg-gradient-to-br from-violet-50 to-blue-50 w-fit rounded-2xl border border-violet-200 group-hover:scale-110 group-hover:from-violet-100 group-hover:to-blue-100 transition-all duration-500">
                {item.icon}
              </div>

              <h3 className="text-2xl font-black mb-4 leading-tight text-slate-900 group-hover:text-violet-700 transition-colors tracking-tight">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-8 text-base">{item.desc}</p>

              <div className="mt-auto relative w-full h-[250px] rounded-[1.5rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                <img
                  src={item.img}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-transform duration-[2s] ${
                    zoomedIds.includes(idx)
                      ? 'scale-125 brightness-110'
                      : 'scale-100 group-hover:scale-110'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-60"></div>
              </div>

              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 100%, ${item.accent}, transparent 75%)` }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CampInfo = ({ lang }: { lang: Language }) => {
  const t = translations[lang].camp;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="camp" className="py-20 px-6 bg-gradient-to-b from-white to-slate-50" ref={sectionRef}>
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-600 w-2.5 h-2.5 rounded-full animate-ping"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600">
                {lang === 'cn' ? '冬季沉浸营' : 'WINTER CAMP'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-[0.9] mb-8 text-slate-900">
              {lang === 'cn' ? (
                <>
                  2026 冬季线下 <br /> <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">AI 创作营</span>
                </>
              ) : (
                <>
                  Winter AI <br /> <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">Creation Camp 2026</span>
                </>
              )}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-[4rem] p-10 md:p-20 overflow-hidden relative shadow-xl border border-slate-200">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          ></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Timeline</p>
                  <p className="text-xl font-black text-slate-900 flex items-center tracking-tight">
                    <Calendar className="mr-3 w-6 h-6 text-blue-600" />
                    {t.date}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Immersive Format
                  </p>
                  <p className="text-xl font-black text-slate-900 flex items-center tracking-tight">
                    <Zap className="mr-3 w-6 h-6 text-violet-600" />
                    {t.format}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-xs font-black text-slate-600 uppercase tracking-[0.3em]">
                  {t.benefits.title}
                </p>
                <div className="space-y-3">
                  {t.benefits.items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center space-x-5 p-4 rounded-[1.5rem] bg-violet-50 border border-violet-100 transition-all duration-1000 ease-out ${
                        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                      }`}
                      style={{ transitionDelay: `${idx * 150}ms` }}
                    >
                      <div className="p-2 bg-violet-600/20 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-violet-600" />
                      </div>
                      <span className="text-slate-900 text-lg font-bold tracking-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-slate-200 relative shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200"
                  alt="Camp Activity"
                  className={`w-full h-full object-cover transition-all duration-[2s] ${
                    isVisible ? 'scale-100 grayscale-0' : 'scale-115 grayscale'
                  }`}
                />
                <div className="absolute inset-0 bg-violet-600/5 group-hover:bg-transparent transition-colors duration-1000"></div>
              </div>

              <div
                className={`absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl transition-all duration-1000 delay-700 ${
                  isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-90'
                }`}
              >
                <div className="flex items-center space-x-5">
                  <div className="p-4 bg-gradient-to-br from-violet-600 to-blue-600 rounded-[1.2rem] shadow-lg">
                    <Monitor className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-4xl font-black bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent leading-none mb-1 tracking-tighter">20+</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                      {lang === 'cn' ? '核心 AI 工具' : 'CORE AI TOOLS'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ApplicationForm = ({ lang }: { lang: Language }) => {
  const t = translations[lang].form;
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    city: '',
    contactMobile: '',
    contactEmail: '',
    interests: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(item => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/feishu/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: formData.age ? Number(formData.age) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        age: '',
        city: '',
        contactMobile: '',
        contactEmail: '',
        interests: [],
      });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="apply" className="py-20 px-6 bg-white">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center">
        <div className="flex flex-col mb-16 gap-8 items-center">
          <div className="inline-block bg-violet-50 border border-violet-200 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-violet-600 w-fit">
            Limited Availability
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9] mb-4 text-slate-900">
            {t.title}
          </h2>
          <p className="text-slate-600 text-base max-w-xl leading-relaxed mx-auto">{t.subtitle}</p>
        </div>

        <div className="max-w-[900px] w-full mx-auto text-left">
          <form onSubmit={handleSubmit} className="bg-white p-10 md:p-16 rounded-[4rem] space-y-10 shadow-xl border border-slate-200 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-100/50 blur-[100px] pointer-events-none rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                  {t.name}
                </label>
                <input
                  required
                  type="text"
                  placeholder="Future AI Creator"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-8 py-4 focus:bg-white focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-base font-bold text-slate-900"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                  {t.age}
                </label>
                <input
                  required
                  type="number"
                  min={7}
                  max={18}
                  placeholder="7 - 18"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-8 py-4 focus:bg-white focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-base font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                {t.city}
              </label>
              <input
                required
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-4 focus:bg-white/10 focus:border-violet-500 outline-none transition-all text-base font-bold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                  {t.contactMobile}
                </label>
                <input
                  required
                  type="text"
                  placeholder={lang === 'cn' ? '138...' : '+86 / WeChat ID'}
                  name="contactMobile"
                  value={formData.contactMobile}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-8 py-4 focus:bg-white focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-base font-bold text-slate-900"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                  {t.contactEmail} <span className="text-slate-600 lowercase opacity-60 italic">{t.contactEmailNote}</span>
                </label>
                <input
                  required={lang === 'en'}
                  type="email"
                  placeholder="example@mail.com"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-8 py-4 focus:bg-white focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-base font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                {t.interests}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[t.int1, t.int2, t.int3].map((interest, idx) => (
                  <label
                    key={idx}
                    className="group flex items-center space-x-4 bg-slate-50 p-5 rounded-[1.5rem] border border-slate-200 cursor-pointer hover:bg-violet-50 hover:border-violet-400 transition-all shadow-md"
                  >
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      className="w-5 h-5 rounded-lg accent-violet-600 border-slate-300 transition-all"
                    />
                    <span className="font-black text-slate-700 group-hover:text-violet-700 transition-colors uppercase tracking-widest text-[10px]">
                      {interest}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {submitStatus === 'error' && (
              <div className="text-sm font-bold text-red-400">{t.error}</div>
            )}

            <button
              disabled={isSubmitting || submitStatus === 'success'}
              type="submit"
              className={`w-full py-5 rounded-[2rem] font-black text-lg uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 ${
                submitStatus === 'success'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700 transform hover:scale-[1.02] active:scale-95 btn-shimmer shadow-lg shadow-violet-500/30'
              }`}
            >
              {submitStatus === 'success' ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span>{t.success}</span>
                </>
              ) : (
                <span>{isSubmitting ? t.submitting : t.submit}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const About = ({ lang }: { lang: Language }) => {
  const t = translations[lang].about;
  return (
    <section id="about" className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col mb-16 gap-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9] text-slate-900">{t.title}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative group">
            <div className="grid grid-cols-2 gap-6 animate-float">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"
                className="rounded-[3rem] grayscale group-hover:grayscale-0 transition-all duration-[1.5s] shadow-2xl"
                alt="Learning"
              />
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000"
                className="rounded-[3rem] mt-12 grayscale group-hover:grayscale-0 transition-all duration-[1.5s] shadow-2xl"
                alt="Creating"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-10 rounded-[3rem] text-center border border-slate-200 shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-2">
                Impact since
              </p>
              <p className="text-6xl font-black tracking-tighter bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">2025</p>
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-10">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4 mb-1">
                  <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center font-black text-lg border border-violet-200">
                    01
                  </div>
                  <h3 className="text-2xl font-black italic tracking-tight text-slate-900">{t.vision.title}</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-base pl-16 border-l-2 border-violet-200">
                  {t.vision.desc}
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4 mb-1">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg border border-blue-200">
                    02
                  </div>
                  <h3 className="text-2xl font-black italic tracking-tight text-slate-900">{t.method.title}</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-base pl-16 border-l-2 border-blue-200">
                  {t.method.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default function Home() {
  const { i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Map react-i18next language to our Language type
  const lang: Language = isClient && i18n.isInitialized && i18n.language === 'en' ? 'en' : 'cn';
  const coreValue = translations[lang].coreValue;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 selection:bg-violet-600 selection:text-white selection:bg-opacity-80">
      <Navbar />

      <main className="bg-transparent">
        <Hero lang={lang} />

        <div className="max-w-[1440px] mx-auto px-6 py-12">
          <div className="bg-white p-10 md:p-20 rounded-[4rem] flex flex-col xl:flex-row items-center justify-between gap-16 relative overflow-hidden group shadow-xl border border-slate-200">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-[1s]"></div>

            <div className="text-left max-w-4xl relative z-10">
              <div className="inline-block bg-violet-50 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-violet-600 mb-8 border border-violet-200">
                Manifesto
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-8 leading-[0.95] tracking-tighter text-slate-900">
                {coreValue.title}
              </h2>
              <p className="text-slate-700 text-lg leading-relaxed font-medium">
                {coreValue.content}
              </p>
            </div>

            <div className="flex-shrink-0 relative z-10">
              <div className="relative">
                <div className="absolute -top-10 -left-8 w-32 h-32 bg-violet-600/20 blur-3xl rounded-full"></div>
                <div className="absolute -bottom-10 -right-6 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full"></div>
                <div className="relative bg-white border border-slate-200 p-6 rounded-[3rem] shadow-xl rotate-3 group-hover:rotate-0 transition-all duration-700 ease-out">
                  <div className="overflow-hidden rounded-[2.5rem] border border-slate-200">
                    <img
                      src="/core_vision.jpg"
                      alt={coreValue.title}
                      className="w-[320px] md:w-[360px] h-[240px] md:h-[260px] object-cover"
                    />
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-6">
                    <div>
                      <p className="text-[10px] font-black tracking-[0.4em] uppercase text-violet-600">
                        {coreValue.imageTagline}
                      </p>
                      <p className="text-slate-600 text-sm mt-2 max-w-[260px]">
                        {coreValue.imageCaption}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-white flex items-center justify-center shadow-lg">
                      <Zap className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-xl">
                  <p className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">
                    {coreValue.statLabel}
                  </p>
                  <p className="text-3xl font-black bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mt-2">{coreValue.statValue}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Projects lang={lang} />
        <CampInfo lang={lang} />
        <ApplicationForm lang={lang} />
        <About lang={lang} />
      </main>

      <Footer />
    </div>
  );
}




