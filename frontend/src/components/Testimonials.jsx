import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ArrowRight } from 'lucide-react';

export default function Reviews({ setActiveTab }) {
  const containerRef = useRef(null);

  // 🚀 Load Elfsight Platform Script dynamically in React
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);

    // Smooth Scrolling with Lenis
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (containerRef.current) {
      const revealElements = containerRef.current.querySelectorAll('.reveal-on-scroll');
      revealElements.forEach(el => revealObserver.observe(el));
    }

    let animId;
    const renderLoop = (time) => { lenis.raf(time); animId = requestAnimationFrame(renderLoop); };
    animId = requestAnimationFrame(renderLoop);

    return () => {
      lenis.destroy();
      if (revealObserver) revealObserver.disconnect();
      cancelAnimationFrame(animId);
      // Clean up script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#050505] text-white font-sans tracking-tight overflow-hidden min-h-screen pt-36 sm:pt-44 pb-24 selection:bg-[#C5A059] selection:text-white">

      {/* 🔮 MASTER LUXURY TYPOGRAPHY & ANIMATIONS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');

        .font-luxury-serif { font-family: 'Cormorant Garamond', serif; }
        .font-luxury-sans { font-family: 'Montserrat', sans-serif; }

        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .reveal-on-scroll.is-revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* =========================================================================
          🌟 NEW: CINEMATIC BACKGROUND LAYER
      ========================================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://res.cloudinary.com/doa6d6cyf/image/upload/v1784742666/uniquephotography1.0-20260318-0087_yyozre.webp" 
          alt="Cinematic Background" 
          className="w-full h-full object-cover opacity-[0.15] blur-sm scale-105"
        />
        {/* Dark Overlays for Text Readability & Mood */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_85%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10 space-y-24">

        {/* =========================================================================
            SECTION 1: HEADER
        ========================================================================= */}
        <div className="text-center space-y-6 reveal-on-scroll">
          <span className="font-luxury-sans text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#C5A059] block drop-shadow-lg">
            Google Verified • Vicky Studio
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-[6.5rem] font-luxury-serif font-light leading-none tracking-tight drop-shadow-2xl">
            Words of <span className="italic text-gray-300">Grace.</span>
          </h1>
          <p className="font-luxury-sans text-gray-300 text-xs sm:text-sm tracking-widest uppercase max-w-xl mx-auto font-light leading-relaxed drop-shadow-md">
            Authentic reflections synced directly from our Google Business profile.
          </p>
        </div>

        {/* =========================================================================
            SECTION 2: LIVE ELFSIGHT GOOGLE REVIEWS WIDGET
        ========================================================================= */}
        <div className="w-full reveal-on-scroll relative">
          {/* Subtle glow behind the widget to make it pop against the background */}
          <div className="absolute inset-0 bg-[#C5A059]/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="elfsight-app-2f6296fc-1c12-41ce-b554-76d1c7f706b5 relative z-10" data-elfsight-app-lazy></div>
        </div>

        {/* =========================================================================
            SECTION 3: CALL TO ACTION
        ========================================================================= */}
        <div className="text-center pt-12 reveal-on-scroll">
          <p className="font-luxury-serif text-3xl sm:text-4xl italic text-gray-300 mb-8 drop-shadow-md">
            Ready to become part of our visual legacy?
          </p>
          <button 
            onClick={() => setActiveTab ? setActiveTab('services') : document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-4 bg-white/95 backdrop-blur-sm text-black hover:bg-[#C5A059] hover:text-white px-10 py-4 font-luxury-sans font-medium uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <span>Inquire Your Date</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}