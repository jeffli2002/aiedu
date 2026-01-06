'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  Zap,
  Terminal,
  Share2,
  Code,
  Layout,
  Layers,
  Brain,
  ArrowRight,
  TrendingUp,
  Award,
  Flame,
  Mic,
  Sparkles
} from 'lucide-react';
import { TRAINING_SYSTEM, Module } from '@/lib/training-system';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/**
 * Training Page - Editorial Minimal Design
 * Colors: Coral Orange (#ff6b35), Teal (#2ec4b6)
 * Typography: Instrument Serif (headlines), DM Sans (body)
 */

export default function TrainingPageContent() {
  const t = useTranslations('training');
  const tc = useTranslations('common');
  const locale = useLocale();
  const [isClient, setIsClient] = useState(false);
  const lang = locale === 'zh' ? 'zh' : 'en';
  const system = TRAINING_SYSTEM[lang];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderModule = (m: Module) => {
    const hasPracticeSplit = m.theoryDuration || m.practiceDuration;

    const colors = {
      foundation: { border: 'border-slate-100 hover:border-[#2ec4b6]', accent: '#2ec4b6', bg: 'bg-[#2ec4b6]/5' },
      creation: { border: 'border-slate-100 hover:border-[#ff6b35]', accent: '#ff6b35', bg: 'bg-[#ff6b35]/5' },
      efficiency: { border: 'border-slate-100 hover:border-[#2ec4b6]', accent: '#2ec4b6', bg: 'bg-[#2ec4b6]/5' },
      vibe: { border: 'border-slate-100 hover:border-[#ff6b35]', accent: '#ff6b35', bg: 'bg-[#ff6b35]/5' },
      pbl: { border: 'border-slate-100 hover:border-[#1a1a2e]', accent: '#1a1a2e', bg: 'bg-slate-50' }
    };

    const colorSet = colors[m.type as keyof typeof colors] || colors.pbl;

    return (
      <Link
        href={`/${lang}/training/${m.id}`}
        key={m.id}
        className={`group relative bg-white p-8 rounded-[1.5rem] border transition-all duration-300 flex flex-col h-full text-left w-full hover:-translate-y-1 hover:shadow-lg ${colorSet.border}`}
        style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: m.format === 'Online' ? '#2ec4b6' : m.format === 'Offline' ? '#ff6b35' : '#1a1a2e' }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#999]">
              {m.format}
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${colorSet.accent}10`, color: colorSet.accent }}
          >
            <Clock className="w-3.5 h-3.5" />
            {m.duration}
          </div>
        </div>

        <div className="mb-6">
          <h4
            className="text-xl mb-3 leading-tight transition-colors duration-300"
            style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              color: '#1a1a2e'
            }}
          >
            {m.title}
          </h4>
          <p className="text-sm leading-relaxed line-clamp-2 min-h-[3rem]" style={{ color: '#666' }}>
            {m.description}
          </p>
        </div>

        {hasPracticeSplit ? (
          <div className="space-y-3 mb-6 w-full">
            <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider">
              <span style={{ color: '#2ec4b6' }}>{isClient ? t('theoryLabel') : '理论'}</span>
              <span style={{ color: '#ff6b35' }}>{isClient ? t('practiceLabel') : '实践'}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full flex overflow-hidden">
              <div className="h-full rounded-full" style={{ width: '35%', backgroundColor: '#2ec4b6' }} />
              <div className="h-full rounded-full ml-0.5" style={{ width: '65%', backgroundColor: '#ff6b35' }} />
            </div>
          </div>
        ) : (
          <div className="mb-6 h-8" />
        )}

        <div className="mt-auto pt-6 border-t border-slate-100 w-full flex flex-wrap gap-2">
          {m.skills.map((s: string) => (
            <span
              key={s}
              className="text-[10px] font-medium px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 transition-colors duration-300 group-hover:bg-[#ff6b35]/5 group-hover:border-[#ff6b35]/20"
              style={{ color: '#666' }}
            >
              {s}
            </span>
          ))}
        </div>

        <div className="absolute bottom-6 right-6 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <div className="p-2.5 rounded-xl text-white" style={{ backgroundColor: '#ff6b35' }}>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    );
  };

  if (!isClient) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fafaf9' }}>
        <Navbar />
        <div className="pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-10 w-10 border-2 mx-auto"
              style={{ borderColor: '#ff6b35', borderTopColor: 'transparent' }}
            />
            <p className="mt-4" style={{ color: '#666' }}>{tc('loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const pblSteps = [
    { label: t('pblSteps.0.label'), desc: t('pblSteps.0.desc') },
    { label: t('pblSteps.1.label'), desc: t('pblSteps.1.desc') },
    { label: t('pblSteps.2.label'), desc: t('pblSteps.2.desc') },
    { label: t('pblSteps.3.label'), desc: t('pblSteps.3.desc') }
  ];
  const milestones = [
    t('milestones.0'),
    t('milestones.1'),
    t('milestones.2'),
    t('milestones.3')
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#fafaf9', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-[10%] w-48 h-48 rounded-full opacity-10 animate-float" style={{ backgroundColor: '#ff6b35' }} />
        <div className="absolute bottom-20 left-[5%] w-32 h-32 rounded-full opacity-10 animate-float" style={{ backgroundColor: '#2ec4b6', animationDelay: '2s' }} />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#1a1a2e 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8"
          >
            <Sparkles className="w-4 h-4" style={{ color: '#ff6b35' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1a1a2e' }}>
              {t('academyTag')}
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl mb-6 max-w-4xl mx-auto leading-tight"
            style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              color: '#1a1a2e'
            }}
          >
            {t('heroTitle')}
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: '#666' }}>
            {t('heroSubtitle')}
          </p>

          <div className="flex justify-center">
            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/150?u=student${i + 50}`} alt="student" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-left border-l border-slate-200 pl-4">
                <p className="text-xs font-semibold" style={{ color: '#1a1a2e' }}>{t('studentJoin')}</p>
                <p className="text-xs font-medium" style={{ color: '#ff6b35' }}>{t('pioneersTag')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* PBL Methodology */}
        <section className="mb-24">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 flex flex-col lg:flex-row items-center gap-12 transition-all duration-300 hover:shadow-lg hover:border-slate-200 group">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
              style={{ backgroundColor: '#ff6b35' }}
            >
              <Brain className="w-8 h-8 text-white" />
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4"
                style={{ backgroundColor: '#ff6b35/10', color: '#ff6b35', backgroundColor: 'rgba(255, 107, 53, 0.1)' }}
              >
                <Flame className="w-3.5 h-3.5" />
                {t('pblBadge')}
              </div>

              <h2
                className="text-3xl md:text-4xl mb-4"
                style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
              >
                {t('modules.pbl')}
              </h2>
              <p className="text-base md:text-lg max-w-4xl leading-relaxed" style={{ color: '#666' }}>
                {t('pblContent')}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
                {pblSteps.map((s, i) => (
                  <div key={i} className="space-y-1.5 group/step">
                    <div className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{s.label}</div>
                    <div className="text-xs" style={{ color: '#999' }}>{s.desc}</div>
                    <div
                      className="h-0.5 w-8 transition-all duration-300 group-hover/step:w-full"
                      style={{ backgroundColor: '#ff6b35' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Foundations Section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center border"
              style={{ backgroundColor: 'rgba(46, 196, 182, 0.1)', borderColor: 'rgba(46, 196, 182, 0.2)', color: '#2ec4b6' }}
            >
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider block" style={{ color: '#2ec4b6' }}>
                {t('sectionLabels.foundations')}
              </span>
              <h2
                className="text-2xl md:text-3xl"
                style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
              >
                {t('modules.foundations')}
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {system.foundations.map(renderModule)}
          </div>
        </section>

        {/* Creation Section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center border"
              style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)', borderColor: 'rgba(255, 107, 53, 0.2)', color: '#ff6b35' }}
            >
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider block" style={{ color: '#ff6b35' }}>
                {t('sectionLabels.creation')}
              </span>
              <h2
                className="text-2xl md:text-3xl"
                style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
              >
                {t('modules.creation')}
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {system.creation.map(renderModule)}
          </div>
        </section>

        {/* Efficiency Section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center border"
              style={{ backgroundColor: 'rgba(46, 196, 182, 0.1)', borderColor: 'rgba(46, 196, 182, 0.2)', color: '#2ec4b6' }}
            >
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider block" style={{ color: '#2ec4b6' }}>
                {t('sectionLabels.efficiency')}
              </span>
              <h2
                className="text-2xl md:text-3xl"
                style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
              >
                {t('modules.efficiency')}
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {system.efficiency.map(renderModule)}
          </div>
        </section>

        {/* Vibe Hackathon Section */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-10">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center border"
              style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)', borderColor: 'rgba(255, 107, 53, 0.2)', color: '#ff6b35' }}
            >
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider block" style={{ color: '#ff6b35' }}>
                {t('sectionLabels.vibe')}
              </span>
              <h2
                className="text-2xl md:text-3xl"
                style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
              >
                {t('hackathonTitle')}
              </h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-[1.5rem] border border-slate-100">
                <h4
                  className="text-xl mb-6 flex items-center gap-2"
                  style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
                >
                  <Award className="w-5 h-5" style={{ color: '#ff6b35' }} /> {t('milestonesTitle')}
                </h4>
                <ul className="space-y-5">
                  {[
                    { icon: <Code className="w-4 h-4" />, color: '#2ec4b6' },
                    { icon: <Layers className="w-4 h-4" />, color: '#ff6b35' },
                    { icon: <Layout className="w-4 h-4" />, color: '#2ec4b6' },
                    { icon: <Share2 className="w-4 h-4" />, color: '#ff6b35' }
                  ].map((g, i) => (
                    <li key={i} className="flex items-center gap-4 group/item">
                      <div
                        className="p-2.5 rounded-xl transition-transform group-hover/item:scale-110"
                        style={{ backgroundColor: `${g.color}15`, color: g.color }}
                      >
                        {g.icon}
                      </div>
                      <span className="text-sm font-medium" style={{ color: '#4a4a4a' }}>{milestones[i]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="p-8 rounded-[1.5rem] text-white relative overflow-hidden"
                style={{ backgroundColor: '#1a1a2e' }}
              >
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: '#ff6b35' }} />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#2ec4b6' }}>{t('nextCohort')}</p>
                    <Zap className="w-5 h-5" style={{ color: '#ff6b35' }} />
                  </div>
                  <h4
                    className="text-2xl mb-2"
                    style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                  >
                    {t('cohortName')}
                  </h4>
                  <p className="text-sm opacity-60 mb-6">{t('cohortDetails')}</p>
                  <button
                    className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: '#ff6b35' }}
                  >
                    {t('waitingListBtn')}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
              {system.vibe.map(renderModule)}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
