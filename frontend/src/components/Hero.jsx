import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis'; 

export default function Hero({ setActiveTab }) {
  // =========================================
  // 1. DATA & STATE
  // =========================================
  const backgroundVideoUrl = "https://res.cloudinary.com/tkhv6b6p/video/upload/v1791279602/1006.mp4";
  
  const partners = [
    "VOGUE WEDDINGS", "WEDMEGOOD", "SHAADISAGA", "HARPER'S BAZAAR", 
    "THE WEDDING BRIGADE", "FEARLESS PHOTOGRAPHERS", "GQ", "WEDDINGWIRE"
  ];

  // 🚀 UPDATED FOLD 3 IMAGES (Reserved Best 4 Photos)
  const fold3Collections = [
    { id: "I", title: "The Royal Vows", img: "https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140826/bride_4.jpg" },
    { id: "II", title: "Editorial Portraits", img: "https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140828/vicky-photography-studio-nandauli-ayodhya-photographers-tlegmdgf9o.webp" },
    { id: "III", title: "BRIDAL", img: "https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141073/337cceec1aad6c598dd144505da5c584.jpg" },
    { id: "IV", title: "Grand Reception", img: "https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140828/vicky-photography-studio-nandauli-ayodhya-photographers-51rzbezibd.webp" }
  ];

  // 🚀 CUSTOM QUOTE BUILDER STATE (FOLD 5)
  const [quoteData, setQuoteData] = useState({
    corePackage: 125000, 
    drone: false,
    days: '2 Days',
    guests: '200-400'
  });
  
  const totalEstimate = quoteData.corePackage + (quoteData.drone ? 15000 : 0);

  // =========================================
  // 2. REFS
  // =========================================
  const containerRef = useRef(null);
  
  // Fold 2 Refs
  const fold2Ref = useRef(null), line1Ref = useRef(null), line2Ref = useRef(null), btnRef = useRef(null);
  const targetProgress2 = useRef(0), currentProgress2 = useRef(0);

  // Fold 3 Refs
  const fold3Ref = useRef(null), fold3ImagesRef = useRef([]);

  // Fold 4 Refs
  const fold4Ref = useRef(null), f4HeadingRef = useRef(null), card1Ref = useRef(null), card2Ref = useRef(null), card3Ref = useRef(null);

  // =========================================
  // 3. ANIMATIONS & EFFECTS
  // =========================================
  useEffect(() => {
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

    lenis.on('scroll', () => {
      const windowHeight = window.innerHeight;
      
      // Calculate Fold 2 text reveal progress
      if (fold2Ref.current) {
        const rect2 = fold2Ref.current.getBoundingClientRect();
        const start2 = windowHeight * 0.95; 
        const end2 = windowHeight * 0.35;
        targetProgress2.current = rect2.top > start2 ? 0 : rect2.top < end2 ? 1 : (start2 - rect2.top) / (start2 - end2);
      }
    });

    let animId;
    const renderLoop = (time) => {
      lenis.raf(time); 

      // Smooth interpolation for Fold 2
      currentProgress2.current += (targetProgress2.current - currentProgress2.current) * 0.08;
      const p1 = Math.min(1, Math.max(0, currentProgress2.current * 1.4));
      const p2 = Math.min(1, Math.max(0, (currentProgress2.current - 0.2) * 1.4));
      
      if (line1Ref.current) { 
        line1Ref.current.style.transform = `translate3d(${(1 - p1) * 100}vw, 0, 0)`; 
        line1Ref.current.style.opacity = p1.toFixed(3); 
      }
      if (line2Ref.current) { 
        line2Ref.current.style.transform = `translate3d(${(1 - p2) * 100}vw, 0, 0)`; 
        line2Ref.current.style.opacity = p2.toFixed(3); 
      }
      if (btnRef.current) { 
        btnRef.current.style.transform = `translate3d(0, ${(1 - p2) * 40}px, 0)`; 
        btnRef.current.style.opacity = p2.toFixed(3); 
      }

      animId = requestAnimationFrame(renderLoop);
    };
    
    animId = requestAnimationFrame(renderLoop);

    return () => {
      lenis.destroy();
      if (revealObserver) revealObserver.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  // Fold 3 Hover Logic
  const handleHoverCollection = (index) => {
    fold3ImagesRef.current.forEach((img, i) => {
      if (img) {
        img.style.opacity = i === index ? '1' : '0';
        img.style.transform = i === index ? 'scale(1)' : 'scale(1.05)';
      }
    });
  };

  return (
    <div ref={containerRef} id="home" className="relative w-full bg-[#0a0a0a] text-white overflow-hidden font-sans selection:bg-[#C5A059] selection:text-white">

      {/* 🚀 TYPOGRAPHY UPDATES FOR LUXURY WEDDING THEME */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');
        
        .font-luxury-serif { font-family: 'Cormorant Garamond', serif; }
        .font-luxury-sans { font-family: 'Montserrat', sans-serif; }
        
        .fade-in-up { animation: fadeInUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }

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

        .marquee-container { display: flex; white-space: nowrap; overflow: hidden; width: 100%; }
        .marquee-content { display: flex; align-items: center; animation: marquee 45s linear infinite; will-change: transform; }
        @keyframes marquee { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-50%, 0, 0); } }
      `}</style>

{/* =========================================================
    FOLD 1: FULL SCREEN HERO (VOGUE WEDDING STYLE - SIZED DOWN)
========================================================= */}
<div className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-end pb-12 sm:pb-16 lg:pb-20 border-b border-white/5">
  <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" src={backgroundVideoUrl} />
  <div className="absolute inset-0 bg-black/20" />
  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
  
  <div className="relative z-20 px-6 sm:px-10 lg:px-16 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 sm:gap-8 lg:gap-10">
    
    {/* 🚀 FIXED: Heading size scaled down for mobile & desktop */}
    <div className="w-full lg:w-8/12 fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
      <h1 className="text-white text-[3rem] sm:text-5xl lg:text-[4.5rem] xl:text-[5.5rem] font-luxury-serif font-light leading-[1.05] tracking-tight text-left drop-shadow-xl">
        Timeless Cinema <br className="hidden sm:block" /> 
        <span className="sm:hidden">& </span>
        <span className="hidden sm:inline">& </span>
        <span className="italic text-[#C5A059]">Fine-Art</span> For <br /> 
        The World Of Weddings.
      </h1>
    </div>
    
    {/* 🚀 FIXED: Paragraph & Button adjusted */}
    <div className="w-full lg:w-4/12 max-w-[320px] text-left fade-in-up opacity-0" style={{ animationDelay: '0.4s' }}>
      <p className="text-gray-300 text-[10px] sm:text-[11px] lg:text-xs font-luxury-sans font-light leading-[1.8] mb-6 tracking-widest uppercase">
        We craft bold visual narratives, authentic unscripted stories, and premium fine-art photography that preserve your legacy with museum-grade precision.
      </p>
      <button 
        onClick={() => setActiveTab ? setActiveTab('contact') : document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} 
        className="w-fit bg-black/20 backdrop-blur-sm border border-white/30 hover:border-[#C5A059] hover:bg-[#C5A059] text-white px-8 py-3.5 font-luxury-sans font-medium uppercase tracking-[0.2em] text-[9px] transition-all duration-500 cursor-pointer shadow-lg"
      >
        Inquire Availability
      </button>
    </div>

  </div>
</div>
        {/* =========================================================
    FOLD 2: HORIZONTAL SCROLL SCRUBBING REVEAL (IMAGE FIXED & SEO TEXT)
========================================================= */}
<div ref={fold2Ref} className="relative w-full min-h-[100vh] bg-[#0a0a0a] flex flex-col justify-between overflow-hidden border-b border-white/5">
  
  {/* Background Image & Soft Base Gradients */}
  <div className="absolute inset-0 z-0">
    <img 
      src="https://res.cloudinary.com/doa6d6cyf/image/upload/v1784742666/uniquephotography1.0-20260318-0087_yyozre.webp" 
      alt="Best in Ayodhya Wedding Photography" 
      className="w-full h-full object-cover object-[center_30%] opacity-50 scale-x-[-1]" 
    />
    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]/30" />
  </div>

  {/* TOP SECTION: Marquee Header */}
  <div className="relative z-20 w-full pt-16 lg:pt-24 reveal-on-scroll">
    <div className="marquee-container w-full">
      <div className="marquee-content gap-16 lg:gap-24 pl-16 lg:pl-24">
        {[...partners, ...partners, ...partners].map((partner, idx) => (
          <div key={idx} className="flex items-center gap-2 shrink-0">
            <span className="text-gray-400 font-luxury-sans font-medium text-[10px] lg:text-xs tracking-[0.3em] uppercase opacity-70">{partner}</span>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* BOTTOM SECTION: The Luxury Typography Card */}
  <div className="relative z-10 w-full px-6 lg:px-16 pb-20 lg:pb-32 reveal-on-scroll flex justify-start items-center h-full" style={{ transitionDelay: '0.2s' }}>
    
    {/* 🚀 FIXED: Card is back, but size is controlled (max-w-xl) */}
    <div className="max-w-xl lg:max-w-2xl p-6 lg:p-10 rounded-xl backdrop-blur-md bg-[#050505]/60 border border-white/10 shadow-2xl">
      <div className="space-y-6">
        {/* Adjusted Text Sizes for tighter fit */}
        <h2 ref={line1Ref} className="text-white text-2xl sm:text-3xl lg:text-4xl font-luxury-serif font-normal leading-[1.3] text-left block opacity-0">
          Crafting fine-art cinema, <br className="hidden sm:block"/> recognized as the <span className="italic text-[#C5A059] font-light">best in Ayodhya.</span>
        </h2>
        <h2 ref={line2Ref} className="text-gray-300 text-lg sm:text-xl lg:text-2xl font-luxury-serif font-light leading-[1.3] text-left block opacity-0">
          Vicky Studio positions couples at the <br className="hidden sm:block"/> heart of timeless luxury.
        </h2>
      </div>
      
      <div ref={btnRef} className="mt-8 lg:mt-10 opacity-0">
        <button 
          onClick={() => setActiveTab ? setActiveTab('contact') : document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} 
          className="border-b border-[#C5A059]/50 pb-1.5 text-[#C5A059] hover:text-white hover:border-white font-luxury-sans font-medium tracking-[0.2em] text-[10px] sm:text-[11px] uppercase transition-all duration-300 cursor-pointer"
        >
          Get In Touch &rarr;
        </button>
      </div>
    </div>
    
  </div>
</div>

      {/* =========================================================
          🔮 FOLD 3: MINIMAL EDITORIAL REVEAL (UNIQUE & CLEAN)
      ========================================================= */}
      <div ref={fold3Ref} className="relative w-full min-h-screen bg-[#050505] overflow-hidden border-b border-white/5 py-24 lg:py-32 flex items-center">
        <div className="max-w-[95rem] mx-auto px-6 lg:px-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          <div className="lg:col-span-5 w-full order-2 lg:order-1 relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border border-white/10 group reveal-on-scroll bg-[#0a0a0a]">
            {fold3Collections.map((col, idx) => (
              <img
                key={idx}
                ref={el => fold3ImagesRef.current[idx] = el}
                src={col.img}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ 
                  opacity: idx === 0 ? 1 : 0, 
                  transform: idx === 0 ? 'scale(1)' : 'scale(1.05)' 
                }}
              />
            ))}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </div>

          <div className="lg:col-span-7 w-full order-1 lg:order-2 flex flex-col justify-center space-y-8 sm:space-y-12 reveal-on-scroll">
            <div className="space-y-3">
              <span className="font-luxury-sans text-[10px] tracking-[0.3em] uppercase text-[#C5A059] block">The Archives</span>
              <h2 className="text-white text-3xl sm:text-5xl font-luxury-serif font-light leading-tight">
                Curated Chapters of <br/> <span className="italic">Visual Elegance.</span>
              </h2>
            </div>

            <div className="flex flex-col border-t border-white/10">
              {fold3Collections.map((col, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => handleHoverCollection(idx)}
                  onClick={() => handleHoverCollection(idx)}
                  className="group flex flex-col py-6 sm:py-8 border-b border-white/10 cursor-pointer"
                >
                  <div className="flex items-center gap-6 sm:gap-10">
                    <span className="font-luxury-serif text-sm sm:text-lg text-gray-500 transition-colors duration-500 group-hover:text-[#C5A059] italic w-8 text-right">
                      {col.id}.
                    </span>
                    <h3 className="font-luxury-serif text-4xl sm:text-6xl text-gray-400 transition-all duration-700 ease-out group-hover:text-white group-hover:translate-x-6">
                      {col.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================
          ✨ FOLD 4: THE SIGNATURE COLLECTIONS (Optimized Spacing)
      ======================================================== */}
      <div ref={fold4Ref} className="relative w-full bg-[#E8E8E8] text-[#1a1a1a] pt-16 pb-16 lg:pt-20 lg:pb-24 px-6 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")' }}></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
          
          <div ref={f4HeadingRef} className="mb-10 lg:mb-14 text-center reveal-on-scroll">
            <span className="font-luxury-sans text-[10px] tracking-[0.3em] uppercase text-[#8A6E35] block mb-3">The Portfolio</span>
            <h2 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-luxury-serif font-light leading-[1.1] text-[#1a1a1a]">
              Signature <span className="italic text-[#8A6E35]">Collections.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 w-full mb-12 lg:mb-16">
            
            {/* 🚀 FOLD 4 IMAGES UPDATED HERE */}
            <div ref={card1Ref} className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden group reveal-on-scroll cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500" style={{ transitionDelay: '0.1s' }}>
              <img src="https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140828/vicky-photography-studio-nandauli-ayodhya-photographers-np7yrd4v3m.webp" alt="Weddings" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                <span className="font-luxury-sans text-[9px] tracking-[0.2em] uppercase text-white/70 mb-2">01 / Cinematic</span>
                <h3 className="text-3xl font-luxury-serif font-medium text-white mb-3">For Weddings</h3>
                <div className="h-[2px] w-12 bg-[#C5A059] transition-all duration-500 group-hover:w-24"></div>
              </div>
            </div>

            <div ref={card2Ref} className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden group reveal-on-scroll cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500" style={{ transitionDelay: '0.2s' }}>
              <img src="https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141073/337cceec1aad6c598dd144505da5c584.jpg" alt="Portraits" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                <span className="font-luxury-sans text-[9px] tracking-[0.2em] uppercase text-white/70 mb-2">02 / Fine-Art</span>
                <h3 className="text-3xl font-luxury-serif font-medium text-white mb-3">For Portraits</h3>
                <div className="h-[2px] w-12 bg-[#C5A059] transition-all duration-500 group-hover:w-24"></div>
              </div>
            </div>

            <div ref={card3Ref} className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden group reveal-on-scroll cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500" style={{ transitionDelay: '0.3s' }}>
              <img src="https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141091/799f7bd60c9f4a3ce36ed2a5c1bb8ae6.jpg" alt="Traditions" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                <span className="font-luxury-sans text-[9px] tracking-[0.2em] uppercase text-white/70 mb-2">03 / Cultural</span>
                <h3 className="text-3xl font-luxury-serif font-medium text-white mb-3">For Traditions</h3>
                <div className="h-[2px] w-12 bg-[#C5A059] transition-all duration-500 group-hover:w-24"></div>
              </div>
            </div>

          </div>

          <div className="inline-block reveal-on-scroll" style={{ transitionDelay: '0.4s' }}>
            <button onClick={() => setActiveTab ? setActiveTab('portfolio') : document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })} className="bg-transparent border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a] px-10 py-4 font-luxury-sans font-medium uppercase tracking-[0.2em] text-[10px] cursor-pointer transition-all duration-500">
              View Complete Archive
            </button>
          </div>
          
        </div>
      </div>

      {/* =========================================================
          🎨 FOLD 5: CUSTOM QUOTATION BUILDER
      ========================================================= */}
      <div className="relative w-full min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 lg:px-16 py-24 overflow-hidden border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] lg:w-[40vw] lg:h-[40vw] bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start reveal-on-scroll">
          
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <div>
              <span className="font-luxury-sans text-[10px] tracking-[0.3em] uppercase text-[#C5A059] block mb-4">Investment Estimator</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-luxury-serif font-light leading-tight text-white mb-6">
                Tailor Your <br /> <span className="italic">Visual Legacy.</span>
              </h2>
              <p className="font-luxury-sans text-sm text-gray-400 leading-relaxed font-light max-w-sm">
                Select your desired services and event details to instantly generate a custom estimated quotation for your big day.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-[#C5A059]/30 shadow-[0_0_40px_rgba(197,160,89,0.05)] mt-8">
              <span className="font-luxury-sans text-[10px] tracking-[0.2em] uppercase text-gray-400 block mb-2">Estimated Investment</span>
              <div className="flex items-baseline gap-2">
                <span className="font-luxury-serif text-4xl sm:text-5xl font-medium text-white">
                  ₹ {totalEstimate.toLocaleString('en-IN')}
                </span>
                <span className="text-gray-500 text-sm">*</span>
              </div>
              <p className="text-[10px] font-luxury-sans text-gray-500 uppercase tracking-widest mt-6 border-t border-white/10 pt-4">
                *Taxes & Travel logistics excluded.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-10">
            
            <div className="space-y-4">
              <h3 className="font-luxury-serif text-xl sm:text-2xl text-white italic">01. Select Core Service</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 125000, name: 'Cinematic Wedding', price: '₹1.25L' },
                  { id: 80000, name: 'Traditional Wedding', price: '₹80K' },
                  { id: 30000, name: 'Standard One-Day Event', price: '₹30K' },
                  { id: 15000, name: 'Product / Commercial', price: '₹15K' }
                ].map((pkg) => (
                  <div 
                    key={pkg.id}
                    onClick={() => setQuoteData({ ...quoteData, corePackage: pkg.id })}
                    className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between h-full ${
                      quoteData.corePackage === pkg.id 
                        ? 'bg-[#1a1a1a] border-[#C5A059] shadow-lg' 
                        : 'bg-[#0a0a0a] border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="font-luxury-sans text-xs uppercase tracking-widest text-gray-300 font-medium mb-4">{pkg.name}</span>
                    <div className="flex items-center justify-between">
                      <span className="font-luxury-serif text-2xl text-white">{pkg.price}</span>
                      {quoteData.corePackage === pkg.id && <div className="w-2 h-2 rounded-full bg-[#C5A059]" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <h3 className="font-luxury-serif text-xl sm:text-2xl text-white italic">02. Cinematic Add-ons</h3>
              <div 
                onClick={() => setQuoteData({ ...quoteData, drone: !quoteData.drone })}
                className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                  quoteData.drone 
                    ? 'bg-[#1a1a1a] border-[#C5A059]' 
                    : 'bg-[#0a0a0a] border-white/10 hover:border-white/30'
                }`}
              >
                <div>
                  <span className="font-luxury-sans text-xs uppercase tracking-widest text-gray-300 font-medium block">4K Drone Coverage</span>
                  <span className="font-luxury-sans text-[10px] text-gray-500 mt-1">Aerial establishing shots & Baraat</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-luxury-serif text-xl text-white">+ ₹15K</span>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${quoteData.drone ? 'bg-[#C5A059] border-[#C5A059]' : 'border-gray-600'}`}>
                    {quoteData.drone && <span className="text-black text-xs font-bold">✓</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <h3 className="font-luxury-serif text-xl sm:text-2xl text-white italic">03. Event Logistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-luxury-sans text-[9px] uppercase tracking-widest text-gray-500">Duration</label>
                  <select 
                    value={quoteData.days}
                    onChange={(e) => setQuoteData({ ...quoteData, days: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white font-luxury-sans text-xs outline-none focus:border-[#C5A059] appearance-none"
                  >
                    <option value="1 Day">1 Day Event</option>
                    <option value="2 Days">2 Days (Pre-wedding + Main)</option>
                    <option value="3+ Days">3+ Days (Grand Celebration)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-luxury-sans text-[9px] uppercase tracking-widest text-gray-500">Guest Count</label>
                  <select 
                    value={quoteData.guests}
                    onChange={(e) => setQuoteData({ ...quoteData, guests: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white font-luxury-sans text-xs outline-none focus:border-[#C5A059] appearance-none"
                  >
                    <option value="Under 100">Under 100 (Intimate)</option>
                    <option value="100-300">100 - 300 (Standard)</option>
                    <option value="300+">300+ (Grand)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button onClick={() => setActiveTab ? setActiveTab('contact') : document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="w-full bg-white text-black hover:bg-[#C5A059] hover:text-white py-5 rounded-xl font-luxury-sans font-medium uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-xl cursor-pointer">
                Request Official Proposal &rarr;
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}