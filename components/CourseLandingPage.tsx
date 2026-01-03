'use client';

import { useEffect, useState, useCallback } from 'react';
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
  ChevronRight,
  X,
  Loader2,
  FileText,
  Play
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
  const [fullscreenPdf, setFullscreenPdf] = useState<{ mediaId: string; title: string } | null>(null);
  const [loadingMedia, setLoadingMedia] = useState<Record<string, boolean>>({});
  const [fullscreenLoading, setFullscreenLoading] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const lang = i18n.language === 'zh' ? 'zh' : 'en';
  const visibleMaterials = (course.materials || []).filter(
    (m) => !m.language || m.language === lang
  );

  // Initialize loading states for all materials
  useEffect(() => {
    const initialLoadingState: Record<string, boolean> = {};
    visibleMaterials.forEach((m) => {
      initialLoadingState[m.id] = true;
    });
    setLoadingMedia(initialLoadingState);
  }, [course.id, lang]);

  const handleMediaLoaded = useCallback((mediaId: string) => {
    setLoadingMedia((prev) => ({ ...prev, [mediaId]: false }));
  }, []);

  // Thumbnails are served via normalized endpoints backed by R2 keys.

  useEffect(() => {
    setIsClient(true);
    window.scrollTo(0, 0);
  }, [course.id]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenPdf) {
        setFullscreenPdf(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [fullscreenPdf]);

  // Fallback timeout to hide loading overlay if onLoad doesn't fire (common with <object> PDFs)
  useEffect(() => {
    if (!fullscreenPdf) return;
    const timeout = setTimeout(() => {
      setFullscreenLoading(false);
    }, 8000); // Hide after 8 seconds max
    return () => clearTimeout(timeout);
  }, [fullscreenPdf]);

  // Fallback timeout for inline media loading states
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    Object.entries(loadingMedia).forEach(([id, isLoading]) => {
      if (isLoading) {
        const timeout = setTimeout(() => {
          setLoadingMedia((prev) => ({ ...prev, [id]: false }));
        }, 10000); // Hide after 10 seconds max
        timeouts.push(timeout);
      }
    });
    return () => timeouts.forEach(clearTimeout);
  }, [loadingMedia]);

  const handleBack = () => {
    router.push(`/${lang}/training`);
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
              { 
                icon: <Target className="w-6 h-6 text-emerald-600" />, 
                label: t('training.courseLanding.skillLevel'), 
                value: course.type === 'vibe' 
                  ? t('training.courseLanding.vibeAgeRange')
                  : course.type === 'creation'
                  ? t('training.courseLanding.creationAgeRange')
                  : course.type === 'efficiency'
                  ? t('training.courseLanding.efficiencyAgeRange')
                  : t('training.courseLanding.ageRange')
              },
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
      {visibleMaterials.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-16">
          <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <Presentation className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{t('training.courseLanding.materials') || '课程资料'}</h3>
            </div>

            {!isAuthenticated ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {visibleMaterials.map((m) => (
                  <div key={m.id} className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                    {m.type === 'pdf' ? (
                      <a
                        href={`/api/media/pdf/${encodeURIComponent(m.mediaId)}?authOnly=1`}
                        className="block group cursor-pointer"
                        title={m.title}
                      >
                        <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                          <div className="font-semibold text-[13px] truncate text-slate-800">{m.title}</div>
                          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{m.type.toUpperCase()}</div>
                        </div>
                        <div className="p-2">
                          <div className="relative w-full aspect-video rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                            <img
                              alt={m.title}
                              className="w-full h-full object-cover"
                              src={`/api/media/pdf/${encodeURIComponent(m.mediaId)}?thumb=1`}
                              onContextMenu={(e) => e.preventDefault()}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                // as last resort try CDN direct jpg then png
                                const base = `${(process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/$/, '')}/docs/${encodeURIComponent(m.mediaId)}`;
                                target.src = `${base}/thumb.jpg`;
                                setTimeout(() => {
                                  if (!target.complete || target.naturalWidth === 0) {
                                    target.src = `${base}/thumb.png`;
                                  }
                                }, 200);
                              }}
                            />
                            <div className="pointer-events-none absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/50 text-[10px] text-white">PDF</div>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <a
                        href={`/api/media/video/${encodeURIComponent(m.mediaId)}/manifest?authOnly=1`}
                        className="block group"
                        title={m.title}
                      >
                        <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                          <div className="font-semibold text-[13px] truncate text-slate-800">{m.title}</div>
                          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{m.type.toUpperCase()}</div>
                        </div>
                        <div className="p-2">
                          <div className="relative w-full aspect-video rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                            <img
                              alt={m.title}
                              className="w-full h-full object-cover"
                              src={`/api/media/video/${encodeURIComponent(m.mediaId)}/manifest?thumb=1`}
                              onContextMenu={(e) => e.preventDefault()}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const base = `${(process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/$/, '')}/videos/${encodeURIComponent(m.mediaId)}`;
                                target.src = `${base}/thumb.jpg`;
                                setTimeout(() => {
                                  if (!target.complete || target.naturalWidth === 0) {
                                    target.src = `${base}/thumb.png`;
                                  }
                                }, 200);
                              }}
                            />
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-black/50 grid place-items-center text-white">
                                ▶
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {visibleMaterials.map((m) => (
                  <div key={m.id} className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="font-bold text-slate-800">{m.title}</div>
                      <div className="text-xs font-black uppercase tracking-widest text-slate-400">{m.type.toUpperCase()}</div>
                    </div>
                    <div className="p-4">
                      {m.type === 'video' ? (
                        <div className="relative">
                          {/* Loading overlay for video */}
                          {loadingMedia[m.id] && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-100 rounded-2xl border border-slate-200">
                              <div className="flex flex-col items-center gap-3">
                                <div className="relative">
                                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                                    <Play className="w-6 h-6 text-blue-600" />
                                  </div>
                                  <Loader2 className="absolute -top-1 -left-1 w-[72px] h-[72px] text-blue-600 animate-spin" />
                                </div>
                                <p className="text-sm font-medium text-slate-600">
                                  {lang === 'zh' ? '正在加载视频...' : 'Loading video...'}
                                </p>
                              </div>
                            </div>
                          )}
                          <video
                            key={m.mediaId}
                            controls
                            controlsList="nodownload noplaybackrate"
                            disablePictureInPicture
                            className="w-full rounded-2xl border border-slate-200"
                            onContextMenu={(e) => e.preventDefault()}
                            preload="metadata"
                            src={`/api/media/video/${encodeURIComponent(m.mediaId)}/manifest?authOnly=1`}
                            poster={`/api/media/video/${encodeURIComponent(m.mediaId)}/manifest?thumb=1`}
                            onLoadedData={() => handleMediaLoaded(m.id)}
                            onCanPlay={() => handleMediaLoaded(m.id)}
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="relative">
                            {/* Loading overlay for PDF */}
                            {loadingMedia[m.id] && (
                              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200">
                                <div className="flex flex-col items-center gap-3">
                                  <div className="relative">
                                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                                      <FileText className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <Loader2 className="absolute -top-1 -left-1 w-[72px] h-[72px] text-blue-600 animate-spin" />
                                  </div>
                                  <p className="text-sm font-medium text-slate-600">
                                    {lang === 'zh' ? '正在加载文档...' : 'Loading document...'}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {lang === 'zh' ? '首次加载可能需要几秒钟' : 'First load may take a few seconds'}
                                  </p>
                                </div>
                              </div>
                            )}
                            <object
                              key={m.mediaId}
                              data={`/api/media/pdf/${encodeURIComponent(m.mediaId)}?authOnly=1#toolbar=0&navpanes=0&scrollbar=0`}
                              type="application/pdf"
                              className="w-full h-[70vh] rounded-2xl border border-slate-200 bg-white"
                              onLoad={() => handleMediaLoaded(m.id)}
                            >
                              <a
                                href={`/api/media/pdf/${encodeURIComponent(m.mediaId)}?authOnly=1`}
                                className="text-blue-600 underline"
                              >
                                {t('training.courseLanding.openDocument') || '打开文档'}
                              </a>
                            </object>
                          </div>
                          <div className="mt-3 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setFullscreenLoading(true);
                                setFullscreenPdf({ mediaId: m.mediaId, title: m.title });
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 transition-colors"
                            >
                              {t('training.courseLanding.viewFullscreen') || '全屏阅读'}
                            </button>
                            <a
                              href={`/api/media/pdf/${encodeURIComponent(m.mediaId)}?authOnly=1`}
                              className="text-[12px] text-blue-600 underline"
                            >
                              {t('training.courseLanding.openInNewTab') || '在新标签打开'}
                            </a>
                          </div>
                        </div>
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

      {/* Fullscreen PDF Viewer */}
      {fullscreenPdf && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black"
          onClick={() => setFullscreenPdf(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setFullscreenPdf(null);
            }
          }}
          aria-modal="true"
          tabIndex={-1}
        >
          {/* Header with title and close button */}
          <div className="flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-sm border-b border-white/10">
            <h3 className="text-white font-semibold text-lg truncate flex-1 mr-4">
              {fullscreenPdf.title}
            </h3>
            <button
              type="button"
              className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors flex-shrink-0"
              aria-label="Close PDF viewer"
              onClick={() => setFullscreenPdf(null)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* PDF Container */}
          <div
            className="flex-1 overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.stopPropagation();
                setFullscreenPdf(null);
              }
            }}
          >
            {/* Loading overlay for fullscreen PDF */}
            {fullscreenLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-blue-400" />
                    </div>
                    <Loader2 className="absolute -top-1 -left-1 w-[88px] h-[88px] text-blue-400 animate-spin" />
                  </div>
                  <p className="text-base font-medium text-white">
                    {lang === 'zh' ? '正在加载文档...' : 'Loading document...'}
                  </p>
                  <p className="text-sm text-slate-400">
                    {lang === 'zh' ? '首次加载可能需要几秒钟' : 'First load may take a few seconds'}
                  </p>
                </div>
              </div>
            )}
            <object
              data={`/api/media/pdf/${encodeURIComponent(fullscreenPdf.mediaId)}?authOnly=1#toolbar=1&navpanes=1&scrollbar=1`}
              type="application/pdf"
              className="w-full h-full"
              onLoad={() => setFullscreenLoading(false)}
            >
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                  <p className="mb-4">{t('training.courseLanding.pdfLoadError') || '无法加载 PDF 文档'}</p>
                  <a
                    href={`/api/media/pdf/${encodeURIComponent(fullscreenPdf.mediaId)}?authOnly=1`}
                    className="text-blue-400 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('training.courseLanding.openInNewTab') || '在新标签页中打开'}
                  </a>
                </div>
              </div>
            </object>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
