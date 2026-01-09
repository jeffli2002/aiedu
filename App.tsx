
import React, { useState, useEffect, useRef } from 'react';
import { translations, Language } from './translations';
import { 
  Globe, 
  Cpu, 
  Palette, 
  Video, 
  Code, 
  Calendar, 
  MapPin, 
  Award, 
  CheckCircle,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Monitor,
  Zap
} from 'lucide-react';

// --- UI Components ---

const Navbar: React.FC<{ lang: Language; setLang: (l: Language) => void }> = ({ lang, setLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[lang].nav;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-8 py-5">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => scrollTo('home')}>
          <div className="bg-gradient-to-tr from-violet-600 to-blue-500 p-2.5 rounded-2xl group-hover:rotate-12 transition-transform duration-500">
            <Cpu className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tighter uppercase">Future Creator</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-10">
          <button onClick={() => scrollTo('projects')} className="text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em]">{t.projects}</button>
          <button onClick={() => scrollTo('camp')} className="text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em]">{t.camp}</button>
          <button onClick={() => scrollTo('about')} className="text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em]">{t.about}</button>
          
          <div className="flex items-center space-x-8 pl-8 border-l border-white/10">
            <button 
              onClick={() => setLang(lang === 'en' ? 'cn' : 'en')}
              className="text-slate-400 hover:text-blue-400 transition-colors text-xs font-bold tracking-widest"
            >
              {lang === 'en' ? 'CN' : 'EN'}
            </button>
            <button 
              onClick={() => scrollTo('apply')}
              className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-[0.15em] hover:bg-violet-600 hover:text-white transition-all transform hover:scale-105 btn-shimmer"
            >
              {t.apply}
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center space-x-4">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 glass border-b border-white/10 p-8 flex flex-col space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <button onClick={() => scrollTo('projects')} className="text-left font-black text-xl uppercase">{t.projects}</button>
          <button onClick={() => scrollTo('camp')} className="text-left font-black text-xl uppercase">{t.camp}</button>
          <button onClick={() => scrollTo('about')} className="text-left font-black text-xl uppercase">{t.about}</button>
          <button 
            onClick={() => scrollTo('apply')}
            className="bg-white text-black text-center py-5 rounded-2xl font-black uppercase tracking-widest"
          >
            {t.apply}
          </button>
        </div>
      )}
    </nav>
  );
};

const Hero: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang].hero;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      // Create a normalized value between -1 and 1
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" className="pt-32 pb-24 px-6 relative overflow-hidden min-h-screen flex flex-col items-center scanlines">
      {/* Enhanced Animated Tech Background */}
      <div className="absolute inset-0 z-0 scale-110 overflow-hidden">
        {/* Primary Tech Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center animate-pan-slow opacity-40 mix-blend-screen transition-transform duration-700 ease-out pointer-events-none"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2400")',
            transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px) scale(1.1)`,
            filter: 'hue-rotate(15deg) brightness(1.2)'
          }}
        ></div>
        
        {/* Secondary Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none transition-transform duration-1000 ease-out"
          style={{ 
            backgroundImage: 'radial-gradient(circle at center, #8b5cf6 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`
          }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
        
        {/* Interactive Dynamic Glow Spheres */}
        <div 
          className="glow-sphere bg-violet-600/30 w-[900px] h-[900px] blur-[120px] transition-all duration-500 ease-out"
          style={{ 
            left: 'calc(20% + ' + (mousePos.x * 100) + 'px)',
            top: 'calc(10% + ' + (mousePos.y * 100) + 'px)',
            opacity: 0.4 + Math.abs(mousePos.x) * 0.2
          }}
        ></div>
        <div 
          className="glow-sphere bg-blue-600/30 w-[900px] h-[900px] blur-[120px] transition-all duration-500 ease-out"
          style={{ 
            right: 'calc(20% + ' + (mousePos.x * -100) + 'px)',
            bottom: 'calc(10% + ' + (mousePos.y * -100) + 'px)',
            opacity: 0.4 + Math.abs(mousePos.y) * 0.2
          }}
        ></div>
      </div>

      <div className="max-w-[1440px] w-full mx-auto flex flex-col items-center text-center relative z-20 transition-transform duration-500 ease-out"
           style={{ transform: `perspective(1000px) rotateX(${mousePos.y * -2}deg) rotateY(${mousePos.x * 2}deg)` }}>
        <div className={`inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full mb-12 transition-all duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]"></div>
          <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] drop-shadow-md">{t.tagline}</span>
        </div>
        
        <h1 className={`text-6xl md:text-[8rem] font-black mb-12 leading-[0.85] tracking-tighter text-slate-500 transition-all duration-1000 delay-150 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <span className="block mb-4">
            {lang === 'cn' ? (
              <>掌握 <span className="text-gradient">AI</span></>
            ) : (
              <>Master <span className="text-gradient">AI Skills</span></>
            )}
          </span>
          <span className="block">
            {lang === 'cn' ? (
              <>创造 <span className="text-white italic drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">未来</span></>
            ) : (
              <>Create the <span className="text-white italic drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">Future</span></>
            )}
          </span>
        </h1>
        
        <p className={`text-lg md:text-xl text-white max-w-2xl mb-16 leading-relaxed font-medium transition-all duration-1000 delay-300 drop-shadow-lg ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
          {t.description}
        </p>
        
        <div className={`flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-10 mb-32 transition-all duration-1000 delay-500 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button 
            onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
            className="group px-10 py-5 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-violet-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
          >
            {t.cta}
            <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
          <button 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-5 border border-white/20 hover:border-white/50 rounded-full font-bold text-sm uppercase tracking-widest transition-all glass hover:bg-white/5 shadow-xl"
          >
            {translations[lang].nav.projects}
          </button>
        </div>

        {/* Video Feature Container */}
        <div className={`w-full max-w-[1440px] px-4 transition-all duration-1000 delay-700 ${isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}>
          <div className="relative group p-1.5 glass rounded-[3.5rem] overflow-hidden shadow-[0_60px_100px_rgba(0,0,0,0.7)]">
            <div className="aspect-[21/9] relative rounded-[3rem] overflow-hidden bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1620712943543-bcc4628c9759?auto=format&fit=crop&q=80&w=2400" 
                alt="AI Future" 
                className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[4s] ease-out"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors duration-700">
                <div className="w-24 h-24 glass rounded-full flex items-center justify-center cursor-pointer border border-white/30 group-hover:scale-110 group-hover:border-white/60 transition-all duration-500 shadow-2xl backdrop-blur-xl">
                  <div className="w-0 h-0 border-t-[14px] border-t-transparent border-l-[22px] border-l-white border-b-[14px] border-b-transparent ml-3 drop-shadow-[0_0_10px_white]"></div>
                </div>
              </div>
              
              {/* VIDEO TEXT & BADGE: Aligned to match Core Value Section padding */}
              <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 text-left max-w-4xl z-10">
                  <div className="flex items-center space-x-4 mb-8">
                      <div className="inline-block bg-white/5 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-violet-400 border border-white/10 backdrop-blur-xl shadow-lg">Official Trailer</div>
                      <div className="flex items-center space-x-2 bg-violet-600/90 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-xl shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                        <span>Interactive</span>
                      </div>
                  </div>
                  <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] leading-tight">{lang === 'cn' ? 'AI 改变教育的瞬间' : 'Moments AI Changes Education'}</h3>
                  <p className="text-white text-lg mt-5 opacity-90 font-semibold drop-shadow-lg">Experience the 5-day journey of innovation, creation, and impact.</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang].projects;
  const [zoomedIds, setZoomedIds] = useState<number[]>([]);

  const toggleZoom = (idx: number) => {
    setZoomedIds(prev => 
      prev.includes(idx) ? prev.filter(id => id !== idx) : [...prev, idx]
    );
  };

  const items = [
    {
      icon: <Palette className="w-8 h-8 text-pink-400" />,
      title: t.p1.title,
      desc: t.p1.desc,
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
      accent: "rgba(236, 72, 153, 0.4)"
    },
    {
      icon: <Video className="w-8 h-8 text-cyan-400" />,
      title: t.p2.title,
      desc: t.p2.desc,
      img: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1200",
      accent: "rgba(6, 182, 212, 0.4)"
    },
    {
      icon: <Code className="w-8 h-8 text-green-400" />,
      title: t.p3.title,
      desc: t.p3.desc,
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
      accent: "rgba(34, 197, 94, 0.4)"
    }
  ];

  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-[5.5rem] font-black tracking-tighter leading-[0.9] mb-8">
              {lang === 'cn' ? '激发潜能的' : 'POWERING'} <br/>
              <span className="text-slate-600">{lang === 'cn' ? '真实项目' : 'REAL IMPACT'}</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">{t.subtitle}</p>
          </div>
          <button className="flex items-center space-x-4 text-xs font-black uppercase tracking-[0.3em] text-violet-400 hover:text-white transition-all transform hover:translate-x-2">
            <span>{lang === 'cn' ? '查看作品集' : 'View Portfolio'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => toggleZoom(idx)}
              className="group glass-card rounded-[2.5rem] p-8 cursor-pointer relative overflow-hidden min-h-[550px] flex flex-col transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
            >
              <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl border border-white/5 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                {item.icon}
              </div>
              
              <h3 className="text-3xl font-black mb-4 leading-tight group-hover:text-white transition-colors tracking-tight">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed mb-8 text-base opacity-80">{item.desc}</p>
              
              <div className="mt-auto relative w-full h-[250px] rounded-[1.5rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className={`w-full h-full object-cover transition-transform duration-[2s] ${zoomedIds.includes(idx) ? 'scale-125 brightness-110' : 'scale-100 group-hover:scale-110'}`} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
              </div>

              {/* Hover highlight effect */}
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

const CampInfo: React.FC<{ lang: Language }> = ({ lang }) => {
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
    <section id="camp" className="py-20 px-6" ref={sectionRef}>
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-600 w-2.5 h-2.5 rounded-full animate-ping"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400">{lang === 'cn' ? '冬季沉浸营' : 'WINTER CAMP'}</span>
            </div>
            <h2 className="text-5xl md:text-[5.5rem] font-black tracking-tighter leading-[0.9] mb-8">
              {lang === 'cn' ? (
                <>2026 冬季线下 <br/> <span className="text-slate-600">AI 创作营</span></>
              ) : (
                <>Winter AI <br/> <span className="text-slate-600">Creation Camp 2026</span></>
              )}
            </h2>
          </div>
        </div>

        <div className="glass rounded-[4rem] p-10 md:p-20 overflow-hidden relative shadow-inner">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Timeline</p>
                  <p className="text-xl font-black text-white flex items-center tracking-tight">
                    <Calendar className="mr-3 w-6 h-6 text-blue-500" />
                    {t.date}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Immersive Format</p>
                  <p className="text-xl font-black text-white flex items-center tracking-tight">
                    <Zap className="mr-3 w-6 h-6 text-yellow-500" />
                    {t.format}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{t.benefits.title}</p>
                <div className="space-y-3">
                  {t.benefits.items.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center space-x-5 p-4 rounded-[1.5rem] bg-white/5 border border-white/5 transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                      style={{ transitionDelay: `${idx * 150}ms` }}
                    >
                      <div className="p-2 bg-green-500/20 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="text-slate-100 text-lg font-bold tracking-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 relative shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" 
                  alt="Camp Activity" 
                  className={`w-full h-full object-cover transition-all duration-[2s] ${isVisible ? 'scale-100 grayscale-0' : 'scale-115 grayscale'}`}
                />
                <div className="absolute inset-0 bg-violet-600/5 group-hover:bg-transparent transition-colors duration-1000"></div>
              </div>
              
              <div className={`absolute -bottom-10 -left-10 glass p-8 rounded-[2rem] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.6)] transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-90'}`}>
                <div className="flex items-center space-x-5">
                    <div className="p-4 bg-violet-600 rounded-[1.2rem] shadow-xl">
                        <Monitor className="text-white w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-4xl font-black text-white leading-none mb-1 tracking-tighter">20+</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{lang === 'cn' ? '核心 AI 工具' : 'CORE AI TOOLS'}</p>
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

const ApplicationForm: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang].form;
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      (e.target as HTMLFormElement).reset();
    }, 5000);
  };

  return (
    <section id="apply" className="py-20 px-6">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center">
        <div className="flex flex-col mb-16 gap-8 items-center">
          <div className="inline-block bg-white/5 border border-white/10 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 w-fit">Limited Availability</div>
          <h2 className="text-5xl md:text-[5.5rem] font-black tracking-tighter leading-[0.9] mb-4">{t.title}</h2>
          <p className="text-slate-500 text-lg max-w-xl leading-relaxed mx-auto">{t.subtitle}</p>
        </div>

        <div className="max-w-[900px] w-full mx-auto text-left">
          <form onSubmit={handleSubmit} className="glass p-10 md:p-16 rounded-[4rem] space-y-10 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] pointer-events-none rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{t.name}</label>
                <input 
                  required
                  type="text" 
                  placeholder="Future AI Creator"
                  className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-4 focus:bg-white/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-800 text-base font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{t.age}</label>
                <input 
                  required
                  type="number" 
                  placeholder="10 - 15"
                  className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-4 focus:bg-white/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-800 text-base font-bold"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{t.school}</label>
              <input 
                required
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-4 focus:bg-white/10 focus:border-violet-500 outline-none transition-all text-base font-bold"
              />
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{t.contactMobile}</label>
                <input 
                  required
                  type="text" 
                  placeholder={lang === 'cn' ? "138..." : "+86 / WeChat ID"}
                  className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-4 focus:bg-white/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-800 text-base font-bold"
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
                  className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-4 focus:bg-white/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-800 text-base font-bold"
                />
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{t.interests}</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[t.int1, t.int2, t.int3].map((interest, idx) => (
                  <label key={idx} className="group flex items-center space-x-4 bg-white/5 p-5 rounded-[1.5rem] border border-white/5 cursor-pointer hover:bg-white/10 hover:border-violet-500/50 transition-all shadow-lg">
                    <input type="checkbox" className="w-5 h-5 rounded-lg accent-violet-600 bg-slate-800 border-none transition-all" />
                    <span className="font-black text-slate-300 group-hover:text-white transition-colors uppercase tracking-widest text-[10px]">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              disabled={submitted}
              type="submit" 
              className={`w-full py-5 rounded-[2rem] font-black text-lg uppercase tracking-[0.2em] transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center space-x-3 ${submitted ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-violet-600 hover:text-white transform hover:scale-[1.02] active:scale-95 btn-shimmer'}`}
            >
              {submitted ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span>{t.success}</span>
                </>
              ) : (
                <span>{t.submit}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const About: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang].about;
  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col mb-16 gap-8">
          <h2 className="text-5xl md:text-[5.5rem] font-black tracking-tighter leading-[0.9]">{t.title}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative group">
                <div className="grid grid-cols-2 gap-6 animate-float">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" className="rounded-[3rem] grayscale group-hover:grayscale-0 transition-all duration-[1.5s] shadow-2xl" alt="Learning" />
                    <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000" className="rounded-[3rem] mt-12 grayscale group-hover:grayscale-0 transition-all duration-[1.5s] shadow-2xl" alt="Creating" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass p-10 rounded-[3rem] text-center border-white/20 shadow-2xl backdrop-blur-3xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-2">Impact since</p>
                    <p className="text-6xl font-black tracking-tighter text-white">2024</p>
                </div>
            </div>
            
            <div className="space-y-12">
                <div className="space-y-10">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4 mb-1">
                            <div className="w-12 h-12 bg-violet-600/20 text-violet-400 rounded-2xl flex items-center justify-center font-black text-lg border border-violet-600/20">01</div>
                            <h3 className="text-3xl font-black italic tracking-tight">{t.vision.title}</h3>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-lg pl-16 border-l-2 border-white/5 opacity-90">{t.vision.desc}</p>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4 mb-1">
                            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center font-black text-lg border border-blue-500/20">02</div>
                            <h3 className="text-3xl font-black italic tracking-tight">{t.method.title}</h3>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-lg pl-16 border-l-2 border-white/5 opacity-90">{t.method.desc}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <footer className="py-12 border-t border-white/5 px-8 bg-black/40">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-10">
        <div className="flex items-center space-x-5 group">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 group-hover:bg-violet-600 transition-all duration-500 group-hover:rotate-12">
            <Cpu className="w-7 h-7 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic text-white">FuturAI</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {['Privacy', 'Terms', 'Instagram', 'WeChat', 'YouTube'].map((link) => (
            <a key={link} href="#" className="text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em]">{link}</a>
          ))}
        </div>
        
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] text-center lg:text-right opacity-60">
          © 2026. {lang === 'en' ? 'Built for the Creators of Tomorrow.' : '为明日创造者而生。'}
        </p>
      </div>
    </footer>
  );
};

// --- Main App ---

function App() {
  const [lang, setLang] = useState<Language>('cn');

  return (
    <div className="min-h-screen selection:bg-violet-600 selection:text-white selection:bg-opacity-80">
      <Navbar lang={lang} setLang={setLang} />
      
      <main>
        <Hero lang={lang} />
        
        {/* Core Value / Global Call to Action (Manifesto) */}
        <div className="max-w-[1440px] mx-auto px-6 py-12">
            <div className="glass p-10 md:p-20 rounded-[4rem] flex flex-col xl:flex-row items-center justify-between gap-16 relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-[1s]"></div>
                
                <div className="text-left max-w-4xl relative z-10">
                    <div className="inline-block bg-white/5 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-violet-400 mb-8 border border-white/10 backdrop-blur-xl">Manifesto</div>
                    <h2 className="text-4xl md:text-[4.5rem] font-black mb-8 leading-[0.95] tracking-tighter text-white drop-shadow-xl">{translations[lang].coreValue.title}</h2>
                    <p className="text-slate-300 text-xl leading-relaxed opacity-80 font-medium">{translations[lang].coreValue.content}</p>
                </div>
                
                <div className="flex-shrink-0 relative z-10">
                    <div className="bg-white p-8 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.6)] rotate-6 group-hover:rotate-0 transition-all duration-700 ease-out">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://futureaicreators.com&color=020617&bgcolor=ffffff`} 
                          alt="Join QR" 
                          className="w-40 h-40"
                        />
                        <div className="mt-6 flex flex-col items-center">
                            <p className="text-black text-[10px] font-black tracking-[0.5em] uppercase opacity-80">Scan to Explore</p>
                            <div className="w-10 h-1 bg-violet-600 mt-3 rounded-full"></div>
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

      <Footer lang={lang} />
    </div>
  );
}

export default App;
