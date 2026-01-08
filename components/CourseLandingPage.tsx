'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
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
import { CourseMaterial, Module } from '@/lib/training-system';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UpgradePrompt from '@/components/auth/UpgradePrompt';
import { useIsAuthenticated } from '@/store/auth-store';
import { withLocalePath } from '@/i18n/locale-utils';
import { useSubscription } from '@/hooks/use-subscription';
import { useUpgradePrompt } from '@/hooks/use-upgrade-prompt';
import { trainingConfig } from '@/config/training.config';

interface CourseLandingPageProps {
  course: Module;
}

type Tone = 'primary' | 'secondary';

const labelClass = 'text-[11px] font-semibold uppercase tracking-[0.22em]';
const toneFrameClass: Record<Tone, string> = {
  primary: 'bg-primary-light text-primary border border-[rgba(255,107,53,0.25)]',
  secondary: 'bg-secondary-light text-secondary border border-[rgba(46,196,182,0.25)]'
};
// Unused but kept for potential future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toneTextClass: Record<Tone, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary'
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toneHoverClass: Record<Tone, string> = {
  primary: 'group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)]',
  secondary: 'group-hover:bg-[var(--color-secondary)] group-hover:text-white group-hover:border-[var(--color-secondary)]'
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toneHoverTextClass: Record<Tone, string> = {
  primary: 'group-hover:text-[var(--color-primary)]',
  secondary: 'group-hover:text-[var(--color-secondary)]'
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toneChipHoverClass: Record<Tone, string> = {
  primary: 'group-hover:bg-primary-light group-hover:text-[var(--color-primary)]',
  secondary: 'group-hover:bg-secondary-light group-hover:text-[var(--color-secondary)]'
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tonePanelClass: Record<Tone, string> = {
  primary: 'bg-primary-light border border-[rgba(255,107,53,0.2)] group-hover:bg-[var(--color-primary)] group-hover:border-[var(--color-primary)]',
  secondary: 'bg-secondary-light border border-[rgba(46,196,182,0.2)] group-hover:bg-[var(--color-secondary)] group-hover:border-[var(--color-secondary)]'
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tonePanelTextClass: Record<Tone, string> = {
  primary: 'text-primary group-hover:text-white',
  secondary: 'text-secondary group-hover:text-white'
};

export default function CourseLandingPage({ course }: CourseLandingPageProps) {
  const t = useTranslations('training');
  const tc = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [fullscreenPdf, setFullscreenPdf] = useState<{ mediaId: string; title: string } | null>(null);
  const [loadingMedia, setLoadingMedia] = useState<Record<string, boolean>>({});
  const [fullscreenLoading, setFullscreenLoading] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const { planId, loading: subscriptionLoading } = useSubscription();
  const { showUpgradePrompt, openUpgradePrompt, closeUpgradePrompt } = useUpgradePrompt();
  const lang = locale === 'zh' ? 'zh' : 'en';
  const visibleMaterials = (course.materials || []).filter(
    (m) => !m.language || m.language === lang
  );
  const isSubscriber = !subscriptionLoading && planId !== 'free';
  const previewPercent = trainingConfig.freeVideoPreviewPercent;
  const previewRatio = Math.min(1, Math.max(0, previewPercent / 100));
  const previewEnabled = !subscriptionLoading && !isSubscriber && previewRatio > 0 && previewRatio < 1;
  const hasPreviewVideos = visibleMaterials.some((m) => m.type === 'video' && m.access === 'preview');
  const previewPromptedRef = useRef<Set<string>>(new Set());

  // Initialize loading states for all materials
  useEffect(() => {
    const initialLoadingState: Record<string, boolean> = {};
    visibleMaterials.forEach((m) => {
      initialLoadingState[m.id] = true;
    });
    setLoadingMedia(initialLoadingState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id, lang]);

  const handleMediaLoaded = useCallback((mediaId: string) => {
    setLoadingMedia((prev) => ({ ...prev, [mediaId]: false }));
  }, []);

  const enforcePreviewLimit = useCallback(
    (material: CourseMaterial, video: HTMLVideoElement) => {
      if (!previewEnabled) return;
      if (material.type !== 'video' || material.access !== 'preview') return;
      if (video.currentSrc.includes('/preview.')) return;
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const limit = video.duration * previewRatio;
      if (video.currentTime >= limit) {
        video.pause();
        if (video.currentTime > limit) {
          video.currentTime = Math.max(0, limit - 0.05);
        }
        if (!previewPromptedRef.current.has(material.mediaId)) {
          previewPromptedRef.current.add(material.mediaId);
          openUpgradePrompt();
        }
      }
    },
    [openUpgradePrompt, previewEnabled, previewRatio]
  );

  const handlePreviewEnded = useCallback(
    (material: CourseMaterial, video: HTMLVideoElement) => {
      if (!previewEnabled) return;
      if (material.type !== 'video' || material.access !== 'preview') return;
      if (!video.currentSrc.includes('/preview.')) return;
      if (!previewPromptedRef.current.has(material.mediaId)) {
        previewPromptedRef.current.add(material.mediaId);
        openUpgradePrompt();
      }
    },
    [openUpgradePrompt, previewEnabled]
  );

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

  if (!isClient) {
    return (
      <div className="min-h-screen section-light font-body">
        <Navbar />
        <div className="pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
            <p className="mt-4 text-muted">{tc('loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const courseTypeLabel = t(`courseLanding.courseType.${course.type}`);
  const masteryLabel = t('courseLanding.mastery');
  const isVideoCourse = course.id === 'c202';
  const ctaHref = isAuthenticated
    ? withLocalePath(isVideoCourse ? '/video-generation' : '/image-generation', lang)
    : withLocalePath('/signup', lang);
  const ctaLabel = isAuthenticated
    ? t('courseLanding.startCreationBtn')
    : t('courseLanding.enrollBtn');
  const infoItems: { icon: JSX.Element; label: string; value: string; tone: Tone }[] = [
    { icon: <Clock className="w-6 h-6" />, label: t('courseLanding.totalTime'), value: course.duration, tone: 'primary' },
    { icon: <Cpu className="w-6 h-6" />, label: t('courseLanding.format'), value: t(`courseLanding.format${course.format}`), tone: 'secondary' },
    {
      icon: <Target className="w-6 h-6" />,
      label: t('courseLanding.skillLevel'),
      value: course.type === 'vibe'
        ? t('courseLanding.vibeAgeRange')
        : course.type === 'creation'
          ? t('courseLanding.creationAgeRange')
          : course.type === 'efficiency'
            ? t('courseLanding.efficiencyAgeRange')
            : t('courseLanding.ageRange'),
      tone: 'primary'
    }
  ];

  return (
    <div className="min-h-screen section-light pb-32 font-body">
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
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-primary-light blur-[100px] rounded-full animate-pulse opacity-80" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          {/* Refined Back Button */}
          <button
            onClick={handleBack}
            className="btn-secondary group mb-12"
          >
            <ArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
            <span className={`${labelClass} text-dark`}>
              {t('courseLanding.backBtn')}
            </span>
          </button>

          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md mb-6 shadow-sm ${labelClass} ${toneFrameClass.primary}`}>
              <Star className="w-3.5 h-3.5 fill-current" />
              {courseTypeLabel} {masteryLabel}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold font-display text-dark leading-[0.98] tracking-tight mb-6 drop-shadow-sm">
              {course.title}
            </h1>
            <p className="text-base md:text-lg text-muted leading-relaxed font-medium max-w-2xl">
              {course.description}
            </p>
          </div>
        </div>
      </section>

      {/* Info Bar - Floating Card Style */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] border border-[var(--color-border-light)] shadow-2xl flex flex-wrap gap-12 md:gap-24 items-center justify-between">
          <div className="flex flex-wrap gap-12 md:gap-24">
            {infoItems.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${toneFrameClass[item.tone]}`}>{item.icon}</div>
                  <span className={`${labelClass} text-light`}>{item.label}</span>
                </div>
                <div className="text-xl md:text-2xl font-semibold text-dark ml-1">{item.value}</div>
              </div>
            ))}
          </div>
          
          <Link
            href={ctaHref}
            className="btn-primary uppercase tracking-[0.22em]"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>

      {/* Gated Materials Section */}
      {visibleMaterials.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-16">
          <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] border border-[var(--color-border-light)] shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-4 rounded-2xl ${toneFrameClass.secondary}`}>
                <Presentation className="w-6 h-6" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold font-display text-dark">
                {t('courseLanding.materials') || '课程资料'}
              </h3>
            </div>

            {!isAuthenticated ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {visibleMaterials.map((m) => (
                  <div key={m.id} className="rounded-2xl border border-[var(--color-border-light)] bg-white shadow-sm overflow-hidden">
                    {m.type === 'pdf' ? (
                      <a
                        href={`/api/media/pdf/${encodeURIComponent(m.mediaId)}?authOnly=1`}
                        className="block group cursor-pointer"
                        title={m.title}
                      >
                        <div className="px-3 py-2 border-b border-[var(--color-border-light)] flex items-center justify-between">
                          <div className="font-semibold text-[13px] truncate text-dark">{m.title}</div>
                          <div className={`${labelClass} text-light`}>{m.type.toUpperCase()}</div>
                        </div>
                        <div className="p-2">
                          <div className="relative w-full aspect-video rounded-xl border border-[var(--color-border)] bg-[var(--color-light)] overflow-hidden">
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
                        <div className="px-3 py-2 border-b border-[var(--color-border-light)] flex items-center justify-between">
                          <div className="font-semibold text-[13px] truncate text-dark">{m.title}</div>
                          <div className={`${labelClass} text-light`}>{m.type.toUpperCase()}</div>
                        </div>
                        <div className="p-2">
                          <div className="relative w-full aspect-video rounded-xl border border-[var(--color-border)] bg-[var(--color-light)] overflow-hidden">
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
                {previewEnabled && hasPreviewVideos && (
                  <div className="lg:col-span-2 rounded-3xl border border-[var(--color-border-light)] bg-[var(--color-light)] p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-dark">
                        {lang === 'zh'
                          ? `免费用户：PDF 全部可读，视频仅试听前 ${previewPercent}%。`
                          : `Free plan: full PDFs, videos are limited to the first ${previewPercent}%.`}
                      </p>
                      <p className="text-xs text-light mt-1">
                        {lang === 'zh'
                          ? '升级订阅即可无限制观看完整视频内容。'
                          : 'Upgrade to watch full training videos without limits.'}
                      </p>
                    </div>
                    <Link
                      href={withLocalePath('/pricing', lang)}
                      className="btn-outline-coral px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.22em] whitespace-nowrap"
                    >
                      {lang === 'zh' ? '升级订阅' : 'Upgrade'}
                    </Link>
                  </div>
                )}
                {visibleMaterials.map((m) => (
                  <div key={m.id} className="rounded-3xl border border-[var(--color-border-light)] bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[var(--color-border-light)] flex items-center justify-between">
                      <div className="font-semibold text-dark">{m.title}</div>
                      <div className={`${labelClass} text-light`}>{m.type.toUpperCase()}</div>
                    </div>
                    <div className="p-4">
                      {m.type === 'video' ? (
                        <div className="relative">
                          {/* Loading overlay for video */}
                          {loadingMedia[m.id] && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[var(--color-border-light)] rounded-2xl border border-[var(--color-border)]">
                              <div className="flex flex-col items-center gap-3">
                                <div className="relative">
                                  <div className="w-16 h-16 rounded-full bg-secondary-light flex items-center justify-center">
                                    <Play className="w-6 h-6 text-primary" />
                                  </div>
                                  <Loader2 className="absolute -top-1 -left-1 w-[72px] h-[72px] text-primary animate-spin" />
                                </div>
                                <p className="text-sm font-medium text-muted">
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
                            className="w-full rounded-2xl border border-[var(--color-border)]"
                            onContextMenu={(e) => e.preventDefault()}
                            preload="metadata"
                            src={`/api/media/video/${encodeURIComponent(m.mediaId)}/manifest`}
                            poster={`/api/media/video/${encodeURIComponent(m.mediaId)}/manifest?thumb=1`}
                            onLoadedData={() => handleMediaLoaded(m.id)}
                            onCanPlay={() => handleMediaLoaded(m.id)}
                            onLoadedMetadata={(event) => enforcePreviewLimit(m, event.currentTarget)}
                            onTimeUpdate={(event) => enforcePreviewLimit(m, event.currentTarget)}
                            onSeeking={(event) => enforcePreviewLimit(m, event.currentTarget)}
                            onEnded={(event) => handlePreviewEnded(m, event.currentTarget)}
                          />
                          {previewEnabled && m.type === 'video' && m.access === 'preview' && (
                            <div className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                              {lang === 'zh' ? `试听 ${previewPercent}%` : `Preview ${previewPercent}%`}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="relative">
                            {/* Loading overlay for PDF */}
                            {loadingMedia[m.id] && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[var(--color-light)] rounded-2xl border border-[var(--color-border)]">
                              <div className="flex flex-col items-center gap-3">
                                <div className="relative">
                                  <div className="w-16 h-16 rounded-full bg-secondary-light flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-primary" />
                                  </div>
                                  <Loader2 className="absolute -top-1 -left-1 w-[72px] h-[72px] text-primary animate-spin" />
                                </div>
                                <p className="text-sm font-medium text-muted">
                                  {lang === 'zh' ? '正在加载文档...' : 'Loading document...'}
                                </p>
                                <p className="text-xs text-light">
                                  {lang === 'zh' ? '首次加载可能需要几秒钟' : 'First load may take a few seconds'}
                                </p>
                              </div>
                            </div>
                            )}
                            <object
                              key={m.mediaId}
                              data={`/api/media/pdf/${encodeURIComponent(m.mediaId)}?authOnly=1#toolbar=0&navpanes=0&scrollbar=0`}
                              type="application/pdf"
                              className="w-full h-[70vh] rounded-2xl border border-[var(--color-border)] bg-white"
                              onLoad={() => handleMediaLoaded(m.id)}
                            >
                              <a
                                href={`/api/media/pdf/${encodeURIComponent(m.mediaId)}?authOnly=1`}
                                className="link-primary underline"
                              >
                                {t('courseLanding.openDocument') || '打开文档'}
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
                              className="btn-outline-coral inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                            >
                              {t('courseLanding.viewFullscreen') || '全屏阅读'}
                            </button>
                            <a
                              href={`/api/media/pdf/${encodeURIComponent(m.mediaId)}?authOnly=1`}
                              className="text-[12px] link-primary underline"
                            >
                              {t('courseLanding.openInNewTab') || '在新标签打开'}
                            </a>
                          </div>
                        </div>
                      )}
                      <div className="mt-3 text-xs text-light">{t('courseLanding.noDownload') || '为保护版权，本资料仅支持在线阅读/观看，已禁用右键、下载、Picture-in-Picture 与播放速度调节。'}</div>
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
            <div className="w-1.5 h-12 bg-[var(--color-primary)] rounded-full" />
            <h2 className="text-3xl md:text-4xl font-semibold font-display text-dark">{t('courseLanding.syllabusTitle')}</h2>
          </div>

          <div className="space-y-12">
            {course.syllabus.map((item, idx) => (
              <div key={idx} className="relative pl-16 group">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--color-border-light)] group-last:bg-transparent" />
                <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)] ring-8 ring-[rgba(255,107,53,0.15)] group-hover:scale-125 transition-transform" />
                
                <div className="p-10 rounded-[2.5rem] bg-[var(--color-light)] border border-transparent hover:border-[rgba(255,107,53,0.2)] hover:bg-white hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">
                  <div className={`${labelClass} text-secondary mb-3`}>
                    {t('courseLanding.stage')} 0{idx + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-dark group-hover:text-[var(--color-primary)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted leading-relaxed text-lg font-medium">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multiple PBL Projects showcase */}
        <div className="lg:col-span-5 space-y-10">
          <div className="sticky top-32">
            <div className="flex items-center gap-4 mb-10">
              <div className={`p-4 rounded-2xl ${toneFrameClass.secondary}`}>
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold font-display text-dark">{t('courseLanding.projectsTitle')}</h3>
            </div>

            <div className="space-y-8">
              {course.projects.map((project, idx) => {
                const projectTone: Tone = idx % 2 === 0 ? 'primary' : 'secondary';
                return (
                  <div key={idx} className="bg-white border border-[var(--color-border-light)] rounded-[3rem] p-10 hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:-translate-y-1 group">
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors ${toneFrameClass[projectTone]} ${toneHoverClass[projectTone]}`}>
                        {idx % 2 === 0 ? <Code2 className="w-6 h-6" /> : <Presentation className="w-6 h-6" />}
                      </div>
                      <h4 className={`text-xl font-semibold text-dark transition-colors leading-tight ${toneHoverTextClass[projectTone]}`}>
                        {project.title}
                      </h4>
                    </div>
                  
                    <div className="space-y-10">
                      <div className="space-y-3">
                        <div className={`${labelClass} text-light`}>{t('courseLanding.mission')}</div>
                        <p className="text-lg font-semibold leading-snug text-muted group-hover:text-dark transition-colors">{project.goal}</p>
                      </div>

                      <div className="space-y-4">
                        <div className={`${labelClass} text-light`}>{t('courseLanding.tools')}</div>
                        <div className="flex flex-wrap gap-2">
                          {project.tools.map(tool => (
                            <span
                              key={tool}
                              className={`px-4 py-1.5 bg-[var(--color-light)] rounded-xl border border-[var(--color-border)] text-[11px] font-semibold uppercase tracking-[0.18em] text-muted transition-colors ${toneChipHoverClass[projectTone]}`}
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className={`p-8 rounded-[2rem] shadow-sm transition-all ${tonePanelClass[projectTone]}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className={`w-5 h-5 ${tonePanelTextClass[projectTone]}`} />
                          <span className={`${labelClass} ${tonePanelTextClass[projectTone]}`}>{t('courseLanding.outcome')}</span>
                        </div>
                        <p className="text-base font-semibold leading-relaxed text-dark group-hover:text-white">{project.outcome}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12">
              <Link
                href={ctaHref}
                className="btn-primary w-full uppercase tracking-[0.22em]"
              >
                {ctaLabel}
                <ChevronRight className="w-6 h-6" />
              </Link>
            </div>
            
            <div className="mt-10 flex items-center justify-center gap-6 text-light">
               <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-[var(--color-border)] overflow-hidden shadow-sm">
                     <img src={`https://i.pravatar.cc/150?u=student${i + 60}`} alt="student" className="w-full h-full object-cover" />
                   </div>
                 ))}
               </div>
               <span className={`${labelClass} text-light`}>{t('courseLanding.enrolledStudents')}</span>
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
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[var(--color-dark)]">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-[rgba(255,255,255,0.08)] flex items-center justify-center">
                      <FileText className="w-8 h-8 text-secondary" />
                    </div>
                    <Loader2 className="absolute -top-1 -left-1 w-[88px] h-[88px] text-secondary animate-spin" />
                  </div>
                  <p className="text-base font-medium text-white">
                    {lang === 'zh' ? '正在加载文档...' : 'Loading document...'}
                  </p>
                  <p className="text-sm text-light">
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
                  <p className="mb-4">{t('courseLanding.pdfLoadError') || '无法加载 PDF 文档'}</p>
                  <a
                    href={`/api/media/pdf/${encodeURIComponent(fullscreenPdf.mediaId)}?authOnly=1`}
                    className="link-primary underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('courseLanding.openInNewTab') || '在新标签页中打开'}
                  </a>
                </div>
              </div>
            </object>
          </div>
        </div>
      )}

      {showUpgradePrompt && (
        <UpgradePrompt
          isOpen={showUpgradePrompt}
          onClose={closeUpgradePrompt}
          isAuthenticated={isAuthenticated}
          type="videoGeneration"
        />
      )}

      <Footer />
    </div>
  );
}
