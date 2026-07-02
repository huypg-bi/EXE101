import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Code, Shield, Mail, ArrowUpRight } from 'lucide-react';

function LandingPage() {
  const [showNavCta, setShowNavCta] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const navigate = useNavigate();

  const handleNavigate = (path) => (e) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      navigate(path);
    }, 400); // 400ms is slightly less than 500ms transition to ensure it fires smoothly
  };

  useEffect(() => {
    const handleScroll = () => {
      const heroCta = document.getElementById('hero-cta');
      if (heroCta) {
        const rect = heroCta.getBoundingClientRect();
        // Show nav CTA when the bottom of hero CTA scrolls above the taskbar (around 80px from top)
        setShowNavCta(rect.bottom < 80);
      } else {
        // Fallback
        setShowNavCta(window.scrollY > 450);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Fixed Pill Taskbar (Always in center, Get started slides out on scroll) */}
      <header className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ease-out ${!isMounted || isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="flex items-center rounded-full bg-white/35 dark:bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-[180%] border border-white/60 dark:border-white/15 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.8),inset_0_0_16px_rgba(255,255,255,0.4)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_0_rgba(255,255,255,0.25),inset_0_0_16px_rgba(255,255,255,0.05)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden">
          
          <nav className="flex items-center px-6 gap-8 shrink-0">
            <a href="#creations" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors">Home</a>
            <a href="#about" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors">About</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
            <a href="#contact" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
          </nav>

          <div 
            className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-end overflow-hidden ${showNavCta ? 'max-w-[160px] opacity-100 pl-2 pr-0.5' : 'max-w-0 opacity-0 pl-0 pr-0 pointer-events-none'}`}
          >
            <a 
              href="/register" 
              onClick={handleNavigate('/register')} 
              className={`bg-[#74C365] hover:bg-[#5FA352] dark:bg-[#1E488F] dark:hover:bg-[#183972] text-white font-semibold rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-center text-xs sm:text-sm px-4 py-1.5 w-max whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_15px_rgba(116,195,101,0.3)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_15px_rgba(30,72,143,0.3)] ${showNavCta ? 'translate-x-0' : 'translate-x-full'}`}
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      <div className={`w-full h-full relative page-fade-in ${isExiting ? 'page-fade-out' : ''}`}>
        {/* Outer Static Header (Scrolls away naturally) */}
        <div className="absolute top-0 left-0 w-full flex items-center justify-between px-6 md:px-12 py-6 z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#74C365] to-emerald-500 dark:from-[#1E488F] dark:to-indigo-500 flex items-center justify-center shrink-0 transition-colors duration-500">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Agentix</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="/login" onClick={handleNavigate('/login')} className="text-sm font-bold text-slate-900 dark:text-white hover:text-[#74C365] dark:hover:text-[#1E488F] transition-all duration-300">
              Sign in
            </a>
            <a href="/register" onClick={handleNavigate('/register')} className="bg-[#74C365] hover:bg-[#5FA352] dark:bg-[#1E488F] dark:hover:bg-[#183972] text-white font-bold rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(116,195,101,0.35)] hover:shadow-[0_6px_20px_rgba(116,195,101,0.5)] dark:shadow-[0_4px_15px_rgba(30,72,143,0.35)] dark:hover:shadow-[0_6px_20px_rgba(30,72,143,0.5)] text-sm px-5 py-2.5">
              Sign up
            </a>
          </div>
        </div>

      {/* Hero Section */}
      <main className="relative pt-48 pb-32 px-4 flex flex-col items-center justify-center text-center z-10">

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-medium text-slate-600 dark:text-gray-300">New: Try 30 days free trial option</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 max-w-4xl leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          Let's build AI agents <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-indigo-400 theme-transition">together</span>
        </h1>
        
        <p className="text-lg text-slate-500 dark:text-gray-400 max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          Our platform helps you build, test, and deliver faster — so you can focus on what matters.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300" id="hero-cta">
          <a href="/register" onClick={handleNavigate('/register')} className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-bold px-8 py-3.5 rounded-full transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
            Get started <ArrowRight className="w-5 h-5" />
          </a>
          <button className="px-8 py-3.5 rounded-full font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors w-full sm:w-auto">
            Book a demo
          </button>
        </div>
      </main>

      {/* Creations Section */}
      <section id="creations" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Our latest creation</h2>
          <p className="text-slate-500 dark:text-gray-400 max-w-2xl mx-auto">A visual collection of our most recent works - each piece crafted with intention, emotion, and style.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-8 rounded-3xl hover:border-brand-primary/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center mb-6 text-brand-primary group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Prompt engineers</h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Bridging the gap between human intent and machine understanding through expert prompt design.</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl hover:border-brand-primary/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
              <Code className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Data scientists</h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Turning data into actionable insights that drive intelligent innovation and growth.</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl hover:border-brand-primary/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Software engineers</h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Building scalable and efficient systems that bring ideas to life through code.</p>
          </div>
        </div>
      </section>

      {/* About Apps Section */}
      <section id="about" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">About our apps</h2>
          <p className="text-slate-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">A visual collection of our most recent works - each piece crafted with intention, emotion, and style.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-8 rounded-3xl hover:border-brand-primary/30 transition-all text-center">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/20 mx-auto flex items-center justify-center mb-6">
              <span className="text-brand-primary font-bold text-xl">1</span>
            </div>
            <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Lightning-Fast</h4>
            <p className="text-sm text-slate-500 dark:text-gray-400">Built with speed — minimal load times and optimized.</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl hover:border-brand-primary/30 transition-all text-center">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/20 mx-auto flex items-center justify-center mb-6">
              <span className="text-brand-primary font-bold text-xl">2</span>
            </div>
            <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Beautiful Design</h4>
            <p className="text-sm text-slate-500 dark:text-gray-400">Modern, pixel-perfect UI components ready for any project.</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl hover:border-brand-primary/30 transition-all text-center">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/20 mx-auto flex items-center justify-center mb-6">
              <span className="text-brand-primary font-bold text-xl">3</span>
            </div>
            <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Plug-and-Play</h4>
            <p className="text-sm text-slate-500 dark:text-gray-400">Simple setup with support for React, Next.js and Tailwind.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 max-w-7xl mx-auto relative z-10 border-t border-slate-200 dark:border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Our testimonials</h2>
          <p className="text-slate-500 dark:text-gray-400 max-w-2xl mx-auto">See what our community of developers and designers have to say.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Richard Nelson', role: 'AI Content Marketer', quote: 'Super clean and easy to use. These Tailwind + React components saved me hours of dev time!' },
            { name: 'Sophia Martinez', role: 'UI/UX Designer', quote: 'The design quality is top-notch. Perfect balance between simplicity and style. Highly recommend!' },
            { name: 'Ethan Roberts', role: 'Frontend Developer', quote: 'Absolutely love the reusability of these components. My workflow feels 10x faster now.' },
          ].map((t, i) => (
            <div key={i} className="glass-panel p-6 rounded-3xl">
              <div className="flex text-yellow-500 mb-4 text-sm">★★★★★</div>
              <p className="text-sm text-slate-700 dark:text-gray-300 mb-6 line-clamp-3">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center font-bold text-xs text-slate-900 dark:text-white">{t.name[0]}</div>
                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h5>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / CTA */}
      <footer id="contact" className="py-24 px-4 relative z-10 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">Trusted by leading companies.</h2>
          <p className="text-slate-500 dark:text-gray-400 max-w-2xl mb-10">Built to integrate effortlessly with your existing tools, frameworks and workflows — so you can move faster.</p>
          
          <div className="glass-panel p-8 rounded-3xl w-full max-w-md">
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Subscribe newsletter</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">The latest news, articles, and resources, sent to your inbox weekly.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email address" className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-primary" />
              <button className="bg-brand-primary text-white px-5 py-2 rounded-xl font-bold hover:opacity-80 transition-colors flex items-center gap-2">
                Subscribe <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-slate-200 dark:border-white/5 w-full flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-primary to-indigo-500 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">Agentix</span>
            </div>
            <p>Copyright 2025 © Agentix. All Right Reserved.</p>
          </div>
        </div>
      </footer>

    </div>
    </>
  );
}

export default LandingPage;
