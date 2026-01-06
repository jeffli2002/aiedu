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
 * Training Page - Warm Editorial System
 * Palette: ink, warm/cool accents, soft sand canvas.
 * Typography: Instrument Serif (headlines), DM Sans (body).
 */

const THEME = {
  fonts: {
    display: '"Instrument Serif", Georgia, serif',
    body: '"DM Sans", system-ui, sans-serif'
  },
  colors: {
    ink: '#1a1a2e',
    body: '#4a4a4a',
    muted: '#6f6b66',
    faint: '#9a948e',
    border: '#ece6dd',
    canvas: '#faf7f2',
    surface: '#ffffff',
    chip: '#f6f2eb'
  },
  accents: {
    warm: { base: '#ff6b35', soft: 'rgba(255, 107, 53, 0.12)', border: 'rgba(255, 107, 53, 0.25)' },
    cool: { base: '#2ec4b6', soft: 'rgba(46, 196, 182, 0.12)', border: 'rgba(46, 196, 182, 0.25)' },
    ink: { base: '#1a1a2e', soft: 'rgba(26, 26, 46, 0.08)', border: 'rgba(26, 26, 46, 0.2)' }
  }
} as const;

type AccentKey = keyof typeof THEME.accents;

const labelClass = 'text-[11px] font-semibold uppercase tracking-[0.22em]';

const iconFrameStyle = (tone: AccentKey) => ({
  backgroundColor: THEME.accents[tone].soft,
  borderColor: THEME.accents[tone].border,
  color: THEME.accents[tone].base
});

const iconChipStyle = (tone: AccentKey) => ({
  backgroundColor: THEME.accents[tone].soft,
  borderColor: THEME.accents[tone].border,
  color: THEME.accents[tone].base
});

const MODULE_ACCENTS: Record<string, AccentKey> = {
  foundation: 'cool',
  creation: 'warm',
  efficiency: 'cool',
  vibe: 'warm',
  pbl: 'ink'
};

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
    const accentKey = MODULE_ACCENTS[m.type] || 'ink';
    const moduleStyles: Record<AccentKey, { borderClass: string; accent: string; soft: string; tagHoverClass: string }> = {
      warm: {
        borderClass: 'border-[#ece6dd] hover:border-[#ff6b35]',
        accent: THEME.accents.warm.base,
        soft: THEME.accents.warm.soft,
        tagHoverClass: 'group-hover:bg-[#ff6b35]/10 group-hover:border-[#ff6b35]/25'
      },
      cool: {
        borderClass: 'border-[#ece6dd] hover:border-[#2ec4b6]',
        accent: THEME.accents.cool.base,
        soft: THEME.accents.cool.soft,
        tagHoverClass: 'group-hover:bg-[#2ec4b6]/10 group-hover:border-[#2ec4b6]/25'
      },
      ink: {
        borderClass: 'border-[#ece6dd] hover:border-[#1a1a2e]',
        accent: THEME.accents.ink.base,
        soft: THEME.accents.ink.soft,
        tagHoverClass: 'group-hover:bg-[#1a1a2e]/10 group-hover:border-[#1a1a2e]/25'
      }
    };
    const colorSet = moduleStyles[accentKey];
    const formatDotColor = m.format === 'Online'
      ? THEME.accents.cool.base
      : m.format === 'Offline'
        ? THEME.accents.warm.base
        : THEME.accents.ink.base;

    return (
      <Link
        href={`/${lang}/training/${m.id}`}
        key={m.id}
        className={`group relative bg-white p-8 rounded-[1.5rem] border transition-all duration-300 flex flex-col h-full text-left w-full hover:-translate-y-1 hover:shadow-lg ${colorSet.borderClass}`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: formatDotColor }}
            />
            <span className={labelClass} style={{ color: THEME.colors.faint }}>
              {m.format}
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide px-3 py-1.5 rounded-full"
            style={{ backgroundColor: colorSet.soft, color: colorSet.accent }}
          >
            <Clock className="w-3.5 h-3.5" />
            {m.duration}
          </div>
        </div>

        <div className="mb-6">
          <h4
            className="text-xl mb-3 leading-tight transition-colors duration-300"
            style={{
              fontFamily: THEME.fonts.display,
              color: THEME.colors.ink
            }}
          >
            {m.title}
          </h4>
          <p className="text-sm leading-relaxed line-clamp-2 min-h-[3rem]" style={{ color: THEME.colors.muted }}>
            {m.description}
          </p>
        </div>

        {hasPracticeSplit ? (
          <div className="space-y-3 mb-6 w-full">
            <div className={`${labelClass} flex justify-between`}>
              <span style={{ color: THEME.accents.cool.base }}>{isClient ? t('theoryLabel') : '理论'}</span>
              <span style={{ color: THEME.accents.warm.base }}>{isClient ? t('practiceLabel') : '实践'}</span>
            </div>
            <div className="h-1.5 w-full rounded-full flex overflow-hidden" style={{ backgroundColor: THEME.colors.chip }}>
              <div className="h-full rounded-full" style={{ width: '35%', backgroundColor: THEME.accents.cool.base }} />
              <div className="h-full rounded-full ml-0.5" style={{ width: '65%', backgroundColor: THEME.accents.warm.base }} />
            </div>
          </div>
        ) : (
          <div className="mb-6 h-8" />
        )}

        <div className="mt-auto pt-6 border-t w-full flex flex-wrap gap-2" style={{ borderColor: THEME.colors.border }}>
          {m.skills.map((s: string) => (
            <span
              key={s}
              className={`text-[11px] font-medium tracking-wide px-3 py-1.5 rounded-lg border transition-colors duration-300 ${colorSet.tagHoverClass}`}
              style={{ color: THEME.colors.muted, backgroundColor: THEME.colors.chip, borderColor: THEME.colors.border }}
            >
              {s}
            </span>
          ))}
        </div>

        <div className="absolute bottom-6 right-6 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <div className="p-2.5 rounded-xl text-white" style={{ backgroundColor: colorSet.accent }}>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    );
  };

  if (!isClient) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: THEME.colors.canvas, fontFamily: THEME.fonts.body }}>
        <Navbar />
        <div className="pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-10 w-10 border-2 mx-auto"
              style={{ borderColor: THEME.accents.warm.base, borderTopColor: 'transparent' }}
            />
            <p className="mt-4" style={{ color: THEME.colors.muted }}>{tc('loading')}</p>
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
  const milestoneItems: { icon: JSX.Element; tone: AccentKey }[] = [
    { icon: <Code className="w-4 h-4" />, tone: 'cool' },
    { icon: <Layers className="w-4 h-4" />, tone: 'warm' },
    { icon: <Layout className="w-4 h-4" />, tone: 'cool' },
    { icon: <Share2 className="w-4 h-4" />, tone: 'warm' }
  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: THEME.colors.canvas, fontFamily: THEME.fonts.body, color: THEME.colors.body }}
    >
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden">
        {/* Decorative elements */}
        <div
          className="absolute top-20 right-[10%] w-48 h-48 rounded-full opacity-10 animate-float"
          style={{ backgroundColor: THEME.accents.warm.base }}
        />
        <div
          className="absolute bottom-20 left-[5%] w-32 h-32 rounded-full opacity-10 animate-float"
          style={{ backgroundColor: THEME.accents.cool.base, animationDelay: '2s' }}
        />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(${THEME.colors.ink} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm mb-8"
            style={{ backgroundColor: THEME.colors.surface, borderColor: THEME.colors.border }}
          >
            <Sparkles className="w-4 h-4" style={{ color: THEME.accents.warm.base }} />
            <span className={labelClass} style={{ color: THEME.colors.ink }}>
              {t('academyTag')}
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl mb-6 max-w-4xl mx-auto leading-tight"
            style={{
              fontFamily: THEME.fonts.display,
              color: THEME.colors.ink
            }}
          >
            {t('heroTitle')}
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: THEME.colors.muted }}>
            {t('heroSubtitle')}
          </p>

          <div className="flex justify-center">
            <div
              className="flex items-center gap-4 px-5 py-3 rounded-2xl border shadow-sm"
              style={{ backgroundColor: THEME.colors.surface, borderColor: THEME.colors.border }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#e9e4dd] overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/150?u=student${i + 50}`} alt="student" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-left border-l pl-4" style={{ borderColor: THEME.colors.border }}>
                <p className="text-xs font-semibold" style={{ color: THEME.colors.ink }}>{t('studentJoin')}</p>
                <p className="text-xs font-medium" style={{ color: THEME.accents.warm.base }}>{t('pioneersTag')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* PBL Methodology */}
        <section className="mb-24">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-[#ece6dd] flex flex-col lg:flex-row items-center gap-12 transition-all duration-300 hover:shadow-lg hover:border-[#d9d2c9] group">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 border"
              style={iconFrameStyle('warm')}
            >
              <Brain className="w-8 h-8" />
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 ${labelClass}`}
                style={{ backgroundColor: THEME.accents.warm.soft, color: THEME.accents.warm.base }}
              >
                <Flame className="w-3.5 h-3.5" />
                {t('pblBadge')}
              </div>

              <h2
                className="text-3xl md:text-4xl mb-4"
                style={{ fontFamily: THEME.fonts.display, color: THEME.colors.ink }}
              >
                {t('modules.pbl')}
              </h2>
              <p className="text-base md:text-lg max-w-4xl leading-relaxed" style={{ color: THEME.colors.muted }}>
                {t('pblContent')}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
                {pblSteps.map((s, i) => (
                  <div key={i} className="space-y-1.5 group/step">
                    <div className="text-sm font-semibold" style={{ color: THEME.colors.ink }}>{s.label}</div>
                    <div className="text-xs" style={{ color: THEME.colors.faint }}>{s.desc}</div>
                    <div
                      className="h-0.5 w-8 transition-all duration-300 group-hover/step:w-full"
                      style={{ backgroundColor: THEME.accents.warm.base }}
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
              style={iconFrameStyle('cool')}
            >
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className={`${labelClass} block`} style={{ color: THEME.accents.cool.base }}>
                {t('sectionLabels.foundations')}
              </span>
              <h2
                className="text-2xl md:text-3xl"
                style={{ fontFamily: THEME.fonts.display, color: THEME.colors.ink }}
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
              style={iconFrameStyle('warm')}
            >
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <span className={`${labelClass} block`} style={{ color: THEME.accents.warm.base }}>
                {t('sectionLabels.creation')}
              </span>
              <h2
                className="text-2xl md:text-3xl"
                style={{ fontFamily: THEME.fonts.display, color: THEME.colors.ink }}
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
              style={iconFrameStyle('cool')}
            >
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className={`${labelClass} block`} style={{ color: THEME.accents.cool.base }}>
                {t('sectionLabels.efficiency')}
              </span>
              <h2
                className="text-2xl md:text-3xl"
                style={{ fontFamily: THEME.fonts.display, color: THEME.colors.ink }}
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
              style={iconFrameStyle('warm')}
            >
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <span className={`${labelClass} block`} style={{ color: THEME.accents.warm.base }}>
                {t('sectionLabels.vibe')}
              </span>
              <h2
                className="text-2xl md:text-3xl"
                style={{ fontFamily: THEME.fonts.display, color: THEME.colors.ink }}
              >
                {t('hackathonTitle')}
              </h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-[1.5rem] border" style={{ borderColor: THEME.colors.border }}>
                <h4
                  className="text-xl mb-6 flex items-center gap-2"
                  style={{ fontFamily: THEME.fonts.display, color: THEME.colors.ink }}
                >
                  <Award className="w-5 h-5" style={{ color: THEME.accents.warm.base }} /> {t('milestonesTitle')}
                </h4>
                <ul className="space-y-5">
                  {milestoneItems.map((g, i) => (
                    <li key={i} className="flex items-center gap-4 group/item">
                      <div
                        className="p-2.5 rounded-xl transition-transform group-hover/item:scale-110 border"
                        style={iconChipStyle(g.tone)}
                      >
                        {g.icon}
                      </div>
                      <span className="text-sm font-medium" style={{ color: THEME.colors.body }}>{milestones[i]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="p-8 rounded-[1.5rem] text-white relative overflow-hidden"
                style={{ backgroundColor: THEME.colors.ink }}
              >
                <div
                  className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full opacity-20"
                  style={{ backgroundColor: THEME.accents.warm.base }}
                />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <p className={labelClass} style={{ color: THEME.accents.cool.base }}>{t('nextCohort')}</p>
                    <Zap className="w-5 h-5" style={{ color: THEME.accents.warm.base }} />
                  </div>
                  <h4
                    className="text-2xl mb-2"
                    style={{ fontFamily: THEME.fonts.display }}
                  >
                    {t('cohortName')}
                  </h4>
                  <p className="text-sm mb-6" style={{ color: 'rgba(255, 255, 255, 0.68)' }}>
                    {t('cohortDetails')}
                  </p>
                  <button
                    className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: THEME.accents.warm.base }}
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
