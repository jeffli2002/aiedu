'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  Target, 
  Cpu, 
  CheckCircle,
  Code2,
  Presentation,
  Rocket,
  Star,
  ChevronRight
} from 'lucide-react';
import { Module } from '@/lib/training-system';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useIsAuthenticated } from '@/store/auth-store';

interface CourseLandingPageProps {
  course: Module;
}

export default function CourseLandingPage({ course }: CourseLandingPageProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const lang = i18n.language === 'zh' ? 'zh' : 'en';

  useEffect(() => {
    setIsClient(true);
    window.scrollTo(0, 0);
  }, [course.id]);

  const handleBack = () => {
    router.push('/training');
  };

  if (!isClient || !i18n.isInitialized) {
    return (
      <div className="min-h-screen bg-white">
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

  const courseTypeLabel = t(`training.courseLanding.courseType.${course.type}`);
  const masteryLabel = t('training.courseLanding.mastery');

  return (
    <div className="min-h-screen bg-white pb-32">
      <Navbar />
      
      {/* Immersive Hero with Enhanced Background and Layering */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={course.heroImage} 
            alt={course.title} 
            className="w-full h-full object-cover scale-100 transition-transform duration-[10s] hover:scale-110"
          />
          {/* Multi-layered mask for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent md:block hidden" />
          <div className="absolute inset-0 bg-white/60 md:hidden" />
          
          {/* Subtle animated overlay */}
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          {/* Refined Back Button */}
          <button 
            onClick={handleBack}
            className="group mb-12 inline-flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200 px-6 py-3 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:bg-white active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600 group-hover:-translate-x-1 transition-transform" />
            <span className="font-black uppercase tracking-widest text-[10px] text-slate-900">
              {t('training.courseLanding.backBtn')}
            </span>
          </button>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 backdrop-blur-md border border-blue-600/20 text-blue-700 text-[10px] font-black tracking-widest uppercase mb-6 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-blue-600" />
              {courseTypeLabel} {masteryLabel}
            </div>
            <h1 className="text-5xl md:text-8xl font-bold font-display text-slate-900 leading-[1] tracking-tight mb-8 drop-shadow-sm">
              {course.title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-semibold max-w-2xl">
              {course.description}
            </p>
          </div>
        </div>
      </section>

      {/* Info Bar - Floating Card Style */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl flex flex-wrap gap-12 md:gap-24 items-center justify-between">
          <div className="flex flex-wrap gap-12 md:gap-24">
            {[
              { icon: <Clock className="w-6 h-6 text-blue-600" />, label: t('training.courseLanding.totalTime'), value: course.duration },
              { icon: <Cpu className="w-6 h-6 text-purple-600" />, label: t('training.courseLanding.format'), value: t(`training.courseLanding.format${course.format}`) },
              { icon: <Target className="w-6 h-6 text-emerald-600" />, label: t('training.courseLanding.skillLevel'), value: course.type === 'vibe' ? t('training.courseLanding.vibeAgeRange') : t('training.courseLanding.ageRange') },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">{item.icon}</div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 ml-1">{item.value}</div>
              </div>
            ))}
          </div>
          
          <Link
            href="/#apply"
            className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20 active:scale-95 inline-block text-center"
          >
            {t('training.courseLanding.enrollBtn')}
          </Link>
        </div>
      </div>

      {/* Gated Materials Section */}
      {course.materials && course.materials.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-16">
          <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <Presentation className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{t('training.courseLanding.materials') || '课程资料'}</h3>
            </div>

            {!isAuthenticated ? (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 md:p-8 text-amber-800">
                <p className="font-semibold">{t('training.courseLanding.signInToView') || '登录后可在线阅读/观看课程资料（禁止下载）。'}</p>
                <div className="mt-3 text-sm text-amber-700">{t('training.courseLanding.signInHint') || '请点击页面右上角登录按钮后刷新本页。'}</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {course.materials.map((m) => (
                  <div key={m.id} className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="font-bold text-slate-800">{m.title}</div>
                      <div className="text-xs font-black uppercase tracking-widest text-slate-400">{m.type.toUpperCase()}</div>
                    </div>
                    <div className="p-4">
                      {m.type === 'video' ? (
                        <video
                          key={m.mediaId}
                          controls
                          controlsList="nodownload noplaybackrate"
                          disablePictureInPicture
                          className="w-full rounded-2xl border border-slate-200"
                          onContextMenu={(e) => e.preventDefault()}
                          preload="metadata"
                          src={`/api/media/video/${encodeURIComponent(m.mediaId)}/manifest`}
                        />
                      ) : (
                        <iframe
                          key={m.mediaId}
                          className="w-full h-[70vh] rounded-2xl border border-slate-200 bg-white"
                          src={`/api/media/pdf/${encodeURIComponent(m.mediaId)}#toolbar=0&navpanes=0&scrollbar=0`}
                          sandbox="allow-scripts allow-same-origin"
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      )}
                      <div className="mt-3 text-xs text-slate-400">{t('training.courseLanding.noDownload') || '为保护版权，本资料仅支持在线阅读/观看，已禁用右键、下载、Picture-in-Picture 与播放速度调节。'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-6 mt-32 grid lg:grid-cols-12 gap-24">
        {/* Syllabus Timeline */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-1.5 h-12 bg-blue-600 rounded-full" />
            <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900">{t('training.courseLanding.syllabusTitle')}</h2>
          </div>

          <div className="space-y-12">
            {course.syllabus.map((item, idx) => (
              <div key={idx} className="relative pl-16 group">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-100 group-last:bg-transparent" />
                <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-blue-600 ring-8 ring-blue-50 group-hover:scale-125 transition-transform" />
                
                <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">
                    {t('training.courseLanding.stage')} 0{idx + 1}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-lg font-medium">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multiple PBL Projects showcase */}
        <div className="lg:col-span-5 space-y-10">
          <div className="sticky top-32">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-slate-900 rounded-2xl">
                <Rocket className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold font-display text-slate-900">{t('training.courseLanding.projectsTitle')}</h3>
            </div>

            <div className="space-y-8">
              {course.projects.map((project, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-[3rem] p-10 hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:-translate-y-1 group">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      {idx % 2 === 0 ? <Code2 className="w-6 h-6 text-blue-600 group-hover:text-white" /> : <Presentation className="w-6 h-6 text-purple-600 group-hover:text-white" />}
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">{project.title}</h4>
                  </div>
                  
                  <div className="space-y-10">
                    <div className="space-y-3">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('training.courseLanding.mission')}</div>
                      <p className="text-lg font-bold leading-snug text-slate-700 group-hover:text-slate-900 transition-colors">{project.goal}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('training.courseLanding.tools')}</div>
                      <div className="flex flex-wrap gap-2">
                        {project.tools.map(tool => (
                          <span key={tool} className="px-4 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-black text-slate-500 uppercase group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">{tool}</span>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-blue-50 border border-blue-100 shadow-sm transition-all group-hover:bg-blue-600 group-hover:border-blue-500">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 group-hover:text-white" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-800 group-hover:text-blue-100">{t('training.courseLanding.outcome')}</span>
                      </div>
                      <p className="text-base font-bold leading-relaxed text-slate-900 group-hover:text-white">{project.outcome}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Link
                href="/#apply"
                className="w-full bg-slate-900 text-white py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.25em] hover:bg-blue-600 transition-all flex items-center justify-center gap-4 active:scale-[0.98] shadow-2xl"
              >
                {t('training.courseLanding.enrollBtn')}
                <ChevronRight className="w-6 h-6" />
              </Link>
            </div>
            
            <div className="mt-10 flex items-center justify-center gap-6 text-slate-400">
               <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                     <img src={`https://i.pravatar.cc/150?u=student${i + 60}`} alt="student" className="w-full h-full object-cover" />
                   </div>
                 ))}
               </div>
               <span className="text-xs font-black uppercase tracking-wider text-slate-500">{t('training.courseLanding.enrolledStudents')}</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
