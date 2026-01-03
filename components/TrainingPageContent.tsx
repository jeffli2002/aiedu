'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  Star,
  Flame,
  Mic
} from 'lucide-react';
import { TRAINING_SYSTEM, Module } from '@/lib/training-system';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TrainingPageContent() {
  const { t, i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const lang = i18n.language === 'zh' ? 'zh' : 'en';
  const system = TRAINING_SYSTEM[lang];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderModule = (m: Module) => {
    const hasPracticeSplit = m.theoryDuration || m.practiceDuration;
    const isVibe = m.type === 'vibe';
    
    const colors = {
      foundation: 'border-emerald-100/50 hover:border-emerald-400',
      creation: 'border-purple-100/50 hover:border-purple-400',
      efficiency: 'border-orange-100/50 hover:border-orange-400',
      vibe: 'border-blue-100/50 hover:border-blue-500',
      pbl: 'border-slate-100 hover:border-slate-400'
    };

    const categoryColor = colors[m.type as keyof typeof colors] || colors.pbl;

    return (
      <Link
        href={`/${lang}/training/${m.id}`}
        key={m.id} 
        className={`group relative bg-white p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col h-full text-left w-full hover:scale-[1.02] hover:-translate-y-2 shadow-sm hover:shadow-xl ${categoryColor}`}
      >
        <div className={`absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${isVibe ? 'from-blue-600 to-indigo-600' : 'from-slate-400 to-slate-600'}`} />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${m.format === 'Online' ? 'bg-emerald-500' : m.format === 'Offline' ? 'bg-orange-500' : 'bg-blue-600'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{m.format}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100/50">
            <Clock className="w-3.5 h-3.5" /> 
            {m.duration}
          </div>
        </div>

        <div className="mb-6 relative z-10">
          <h4 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-all duration-300 leading-tight group-hover:-translate-y-1">
            {m.title}
          </h4>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 min-h-[3rem] group-hover:text-slate-600 transition-colors">
            {m.description}
          </p>
        </div>
        
        {hasPracticeSplit ? (
          <div className="space-y-4 mb-8 relative z-10 w-full">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.15em]">
              <span className="text-blue-500 flex items-center gap-1">{isClient && i18n.isInitialized ? t('training.theoryLabel') : '理论'}</span>
              <span className="text-purple-500 flex items-center gap-1">{isClient && i18n.isInitialized ? t('training.practiceLabel') : '实践'}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full flex overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: '35%' }} />
              <div className="h-full bg-purple-500 transition-all duration-700 ml-0.5" style={{ width: '65%' }} />
            </div>
          </div>
        ) : (
          <div className="mb-8 h-[2.5rem] flex items-center relative z-10 w-full">
            <div className="w-full h-px bg-slate-100" />
          </div>
        )}

        <div className="mt-auto pt-6 border-t border-slate-50 relative z-10 w-full flex flex-wrap gap-2">
          {m.skills.map((s: string) => (
            <span key={s} className="text-[9px] font-black px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300 uppercase">
              {s}
            </span>
          ))}
        </div>

        <div className="absolute bottom-8 right-8 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 z-20">
          <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-xl">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </Link>
    );
  };

  if (!isClient || !i18n.isInitialized) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <div className="pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">{t('common.loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const pblSteps = t('training.pblSteps', { returnObjects: true }) as Array<{ label: string; desc: string }>;
  const milestones = t('training.milestones', { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 overflow-x-hidden">
      <Navbar />
      
      {/* Academy Hero */}
      <section className="relative pt-48 pb-20 px-6 overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000" 
            alt="Futuristic Engineering" 
            className="w-full h-full object-cover opacity-20 grayscale-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/40 to-[#f8fafc]" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-400/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-400/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-blue-100 text-blue-600 text-[10px] font-black tracking-[0.25em] uppercase mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-md">
            <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
            {t('training.academyTag')}
            <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-slate-900 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 mb-8 max-w-4xl mx-auto">
            {t('training.heroTitle')}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 font-medium">
            {t('training.heroSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
             <div className="flex items-center gap-4 glass px-5 py-2.5 rounded-2xl border-white shadow-lg">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/150?u=student${i + 50}`} alt="student" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-left border-l border-slate-200 pl-4 ml-1">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{t('training.studentJoin')}</p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase">{t('training.pioneersTag')}</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* PBL Methodology Spotlight */}
        <section className="mb-24">
          <div className="relative bg-white/40 backdrop-blur-md rounded-[3rem] p-8 md:p-12 border border-slate-100 flex flex-col lg:flex-row items-center gap-12 shadow-sm transition-all duration-700 hover:shadow-2xl hover:bg-white hover:border-blue-200 hover:scale-[1.01] hover:-translate-y-2 group cursor-default">
             <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
               <Brain className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-500" />
             </div>
             
             <div className="flex-1 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black tracking-widest uppercase mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                 <Flame className="w-3.5 h-3.5 text-orange-500" />
                 {t('training.pblBadge')}
               </div>
               
               <h2 className="text-2xl md:text-4xl font-bold font-display mb-4 text-slate-900 tracking-tight group-hover:text-blue-700 transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02] origin-left">
                 {t('training.modules.pbl')}
               </h2>
               <p className="text-slate-500 text-base md:text-xl max-w-4xl leading-relaxed group-hover:text-slate-700 transition-colors duration-500 group-hover:translate-x-1">
                 {t('training.pblContent')}
               </p>
               
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
                  {pblSteps.map((s, i) => (
                    <div key={i} className="space-y-1.5 group/step transition-all duration-300 hover:translate-y-[-4px]">
                      <div className="text-xs font-black text-slate-900 uppercase group-hover/step:text-blue-600 transition-colors tracking-widest">{s.label}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter group-hover/step:text-slate-500">{s.desc}</div>
                      <div className="h-0.5 w-8 bg-slate-100 group-hover/step:w-full group-hover/step:bg-blue-400 transition-all duration-500" />
                    </div>
                  ))}
               </div>
             </div>
          </div>
        </section>

        {/* Foundations Section */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block">{t('training.sectionLabels.foundations')}</span>
              <h2 className="text-2xl md:text-4xl font-bold font-display text-slate-900 tracking-tight">{t('training.modules.foundations')}</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {system.foundations.map(renderModule)}
          </div>
        </section>

        {/* Creation Section */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 border border-purple-100 shadow-sm">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[9px] font-black text-purple-500 uppercase tracking-widest block">{t('training.sectionLabels.creation')}</span>
              <h2 className="text-2xl md:text-4xl font-bold font-display text-slate-900 tracking-tight">{t('training.modules.creation')}</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {system.creation.map(renderModule)}
          </div>
        </section>

        {/* Efficiency Section */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 border border-orange-100 shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest block">{t('training.sectionLabels.efficiency')}</span>
              <h2 className="text-2xl md:text-4xl font-bold font-display text-slate-900 tracking-tight">{t('training.modules.efficiency')}</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {system.efficiency.map(renderModule)}
          </div>
        </section>

        {/* Vibe Hackathon Section */}
        <section className="mb-48 relative">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block">{t('training.sectionLabels.vibe')}</span>
              <h2 className="text-2xl md:text-4xl font-bold font-display text-slate-900 tracking-tight">{t('training.hackathonTitle')}</h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-8">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                 <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                   <Award className="text-yellow-500 w-6 h-6" /> {t('training.milestonesTitle')}
                 </h4>
                 <ul className="space-y-6">
                    {[
                      { icon: <Code className="w-4 h-4" />, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { icon: <Layers className="w-4 h-4" />, color: 'text-purple-600', bg: 'bg-purple-50' },
                      { icon: <Layout className="w-4 h-4" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { icon: <Share2 className="w-4 h-4" />, color: 'text-orange-600', bg: 'bg-orange-50' }
                    ].map((g, i) => (
                      <li key={i} className="flex items-center gap-4 text-slate-600 font-bold group/item">
                        <div className={`p-3 rounded-xl ${g.bg} ${g.color} group-hover/item:scale-110 transition-all`}>{g.icon}</div>
                        <span className="text-xs tracking-tight group-hover/item:text-slate-900 transition-colors">{milestones[i]}</span>
                      </li>
                    ))}
                 </ul>
               </div>
               
               <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-lg relative overflow-hidden border border-white/5 hover:scale-[1.01] transition-transform">
                 <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full" />
                 <div className="relative z-10">
                   <div className="flex justify-between items-start mb-8">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">{t('training.nextCohort')}</p>
                      <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                   </div>
                   <h4 className="text-3xl font-bold font-display mb-2 tracking-tight">{t('training.cohortName')}</h4>
                   <p className="text-xs opacity-60 mb-8 font-medium">{t('training.cohortDetails')}</p>
                   <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-md active:scale-95">
                      {t('training.waitingListBtn')}
                   </button>
                 </div>
               </div>
            </div>
            
            <div className="lg:col-span-8 grid md:grid-cols-2 gap-8">
               {system.vibe.map(renderModule)}
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
}
