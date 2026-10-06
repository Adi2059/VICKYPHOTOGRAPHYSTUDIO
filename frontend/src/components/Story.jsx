import React, { useState } from 'react';
import { Camera, Sparkles, Film, Award, Clock, ArrowRight, ShieldCheck, Heart, Volume2, Aperture, Layers, CheckCircle2, Play, Eye, Flame, Compass } from 'lucide-react';

export default function Story({ setActiveTab }) {
  const [activeTabLocal, setActiveTabLocal] = useState('all');

  // 🎬 Directorial Guiding Standards
  const directorialPillars = [
    {
      num: "01",
      title: "Organic Skin-Tone Science",
      subtitle: "DCI-P3 Color Fidelity",
      desc: "Every frame is calibrated against natural sunlight and ritual tones for true skin warmth that never feels artificial."
    },
    {
      num: "02",
      title: "The Art of Discretion",
      subtitle: "Unobtrusive Directorial Flow",
      desc: "Capturing the father's quiet tear and spontaneous laughter without demanding repeat takes or staged poses."
    },
    {
      num: "03",
      title: "Spatial Acoustic Soundscapes",
      subtitle: "Multi-Track Audio Mastering",
      desc: "We record clean lavalier vows, ambient chants, and ancestral blessings, mixing them into cinematic sound design."
    },
    {
      num: "04",
      title: "Museum Archival Longevity",
      subtitle: "Perpetual Cloud & Premium Albums",
      desc: "Calibrated specifically for acid-free physical cotton albums with triple-redundant 16-bit RAW security."
    }
  ];

  return (
    <div className="bg-[#FAFAFA] text-[#171717] font-sans tracking-tight selection:bg-[#C5A059] selection:text-white overflow-x-hidden relative w-full pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-24">

      {/* 🔮 CINEMA-GRADE MASTER DESIGN SYSTEM */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        .font-brand-serif { font-family: 'Playfair Display', serif; }
        .font-brand-sans { font-family: 'Inter', sans-serif; }

        .cinema-cell-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(24px) saturate(170%);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.08);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cinema-cell-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(197, 160, 89, 0.1);
        }

        .viewfinder-crosshair {
          position: relative;
        }
        .viewfinder-crosshair::before, .viewfinder-crosshair::after {
          content: '';
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: rgba(197, 160, 89, 0.8);
          pointer-events: none;
        }
        .viewfinder-crosshair::before {
          top: 10px; left: 10px;
          border-top: 2px solid; border-left: 2px solid;
        }
        .viewfinder-crosshair::after {
          bottom: 10px; right: 10px;
          border-bottom: 2px solid; border-right: 2px solid;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-5 sm:px-10 relative z-10 space-y-16 sm:space-y-36">

        {/* =========================================================================
            🎬 1. EDITORIAL DIRECTORIAL OVERVIEW
        ========================================================================= */}
        <section className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="font-brand-sans text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-[#171717] uppercase">
              The Directorial Heritage • Vicky Photography Studio
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-brand-serif text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[#171717] leading-[1.05]">
              We Tell Stories That <br />
              <span className="italic font-normal text-[#C5A059]">
                Outlive Time Itself.
              </span>
            </h1>
          </div>

          <div className="w-16 h-[1.5px] bg-[#C5A059]/40 mx-auto my-3" />

          <p className="font-brand-sans text-gray-600 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            A wedding is not a set of items to check off a schedule. It is a collision of legacy, sacred vows, and raw vulnerability. Our journey is guided by a single passion: delivering films that outlast generations.
          </p>
        </section>

        {/* =========================================================================
            🎬 2. LEAD DIRECTOR PORTRAIT & STATEMENT 
        ========================================================================= */}
        <section className="cinema-cell-card rounded-2xl sm:rounded-3xl p-6 sm:p-12 lg:p-14 border border-gray-100 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center">

            {/* Director Portrait */}
            <div className="md:col-span-5 w-full">
              <div className="viewfinder-crosshair relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg aspect-[4/5] bg-gray-100 group border border-gray-200">
                <img
                  src="https://res.cloudinary.com/doa6d6cyf/image/upload/v1787200596/B27718D4-6C3E-4625-A538-B422E1FAB16A_bi6gx6.png"
                  alt="Mr. Vicky - Lead Filmmaker"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1605372483863-71887e594d2c?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white text-left">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-brand-sans tracking-widest uppercase mb-2 inline-block font-bold">
                    Principal Filmmaker
                  </span>
                  <h3 className="font-brand-serif text-xl sm:text-2xl font-bold leading-tight truncate">Mr. Vicky</h3>
                  <p className="font-brand-sans text-xs text-gray-300 font-medium truncate mt-0.5">Master of Light</p>
                </div>
              </div>
            </div>

            {/* Director Manifesto */}
            <div className="md:col-span-7 space-y-4 sm:space-y-6 text-left">
              <div className="space-y-2">
                <h2 className="font-brand-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#171717] tracking-tight leading-tight">
                  "Light is emotion. <br />
                  <span className="italic font-normal text-[#C5A059]">We never force what isn't there."</span>
                </h2>
              </div>

              <p className="font-brand-sans text-gray-600 text-xs sm:text-sm leading-relaxed font-normal">
                At Vicky Photography Studio, we focus on what really matters: the trembling hands during the kanyadaan, the quiet smile, and the unrepeatable natural cadence of family laughter.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-1.5">
                  <h4 className="font-brand-serif text-sm font-bold text-[#171717] truncate">01. Observational Eye</h4>
                  <p className="font-brand-sans text-xs text-gray-500">Sacred rituals documented as they authentically occur.</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-1.5">
                  <h4 className="font-brand-serif text-sm font-bold text-[#171717] truncate">02. Hand-Finished</h4>
                  <p className="font-brand-sans text-xs text-gray-500">Personally reviewed and color-mastered by Mr. Vicky.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-brand-serif text-base font-bold text-[#171717] block">Vicky Photography Studio</span>
                  <span className="font-brand-sans text-[9px] text-[#C5A059] uppercase tracking-widest block font-bold mt-0.5">Amanigunj, UP</span>
                </div>
                <button
                  onClick={() => setActiveTab && setActiveTab('contact')}
                  className="px-6 py-3 rounded-full bg-[#171717] hover:bg-[#C5A059] text-white font-brand-sans text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm cursor-pointer"
                >
                  Consultation →
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            🎞️ 3. ACT I • GENESIS
        ========================================================================= */}
        <section className="space-y-6 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4 gap-3 text-left">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                <span className="font-brand-sans text-[10px] font-bold tracking-[0.25em] text-gray-500 uppercase">
                  ACT I • EARLY YEARS
                </span>
              </div>
              <h2 className="font-brand-serif text-2xl sm:text-4xl font-bold text-[#171717] tracking-tight">
                The Passion Ignites
              </h2>
            </div>
            <span className="font-brand-sans text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              School-Day Vision
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 items-center">

            {/* Left Film Showcase */}
            <div className="md:col-span-5 w-full">
              <div className="viewfinder-crosshair cinema-cell-card rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] relative bg-gray-100 group border border-gray-200">
                <img
                  src="https://res.cloudinary.com/doa6d6cyf/image/upload/v1787200595/663AE026-2F46-4DFA-B107-732911156199_xnvgpz.png"
                  alt="Act I Genesis Archive"
                  className="w-full h-full object-cover object-[center_20%] transition-transform duration-1000 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent p-5 text-white flex justify-between items-end pointer-events-none">
                  <div className="text-left space-y-1">
                    <span className="font-brand-sans text-[9px] uppercase tracking-widest text-[#C5A059] font-bold block">
                      ORIGINAL GENESIS
                    </span>
                    <h4 className="font-brand-serif text-lg font-bold leading-tight truncate">
                      Early Camera Shoots
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Narrative Spec Sheet */}
            <div className="md:col-span-7 space-y-4 sm:space-y-6 text-left">
              <h3 className="font-brand-serif text-xl sm:text-3xl font-bold text-[#171717] leading-tight">
                From Local Shoots to Optical Mastery
              </h3>

              <blockquote className="font-brand-serif text-base text-gray-600 italic border-l-2 border-[#C5A059] pl-4 py-1">
                "Back in the early days, taking small local photography assignments was about learning how genuine smiles could be immortalized."
              </blockquote>

              <p className="font-brand-sans text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                Mr. Vicky began his journey early, taking up events and local ceremonies. Every opportunity was treated as a masterclass to invest in cinema glass and color grading knowledge.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2 font-brand-sans text-[10px] sm:text-xs">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-gray-400 block text-[9px] uppercase font-bold mb-0.5">Focus</span>
                  <span className="text-[#171717] font-bold truncate block">Light & Emotion</span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-gray-400 block text-[9px] uppercase font-bold mb-0.5">Early Work</span>
                  <span className="text-[#C5A059] font-bold truncate block">Ceremonies</span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-gray-400 block text-[9px] uppercase font-bold mb-0.5">Base</span>
                  <span className="text-[#171717] font-bold truncate block">Uttar Pradesh</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            👑 4. ACT II • THE CRAFT REFINED 
        ========================================================================= */}
        <section className="space-y-6 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4 gap-3 text-left">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                <span className="font-brand-sans text-[10px] font-bold tracking-[0.25em] text-gray-500 uppercase">
                  ACT II • 2021 — 2024
                </span>
              </div>
              <h2 className="font-brand-serif text-2xl sm:text-4xl font-bold text-[#171717] tracking-tight">
                Skill Evolution & Recognition
              </h2>
            </div>
            <span className="font-brand-sans text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              High-End Filmmaking
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 items-center">

            {/* Left Narrative Spec Sheet */}
            <div className="md:col-span-7 space-y-4 sm:space-y-6 text-left order-2 md:order-1">
              <h3 className="font-brand-serif text-xl sm:text-3xl font-bold text-[#171717] leading-tight">
                Mastering Color Science & Discretion
              </h3>

              <blockquote className="font-brand-serif text-base text-gray-600 italic border-l-2 border-[#C5A059] pl-4 py-1">
                "Treating every wedding not like a commercial contract, but like an artistic canvas where every family member feels respected."
              </blockquote>

              <p className="font-brand-sans text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                Vicky Photography Studio expanded rapidly. Families loved the difference: no harsh lights, cinematic 24fps films, crystal sound, and natural warm tones.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2 font-brand-sans text-[10px] sm:text-xs">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-gray-400 block text-[9px] uppercase font-bold mb-0.5">Pipeline</span>
                  <span className="text-[#171717] font-bold truncate block">4K Wide</span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-gray-400 block text-[9px] uppercase font-bold mb-0.5">Audio</span>
                  <span className="text-[#C5A059] font-bold truncate block">Spatial</span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-gray-400 block text-[9px] uppercase font-bold mb-0.5">Trust</span>
                  <span className="text-[#171717] font-bold truncate block">100% Word</span>
                </div>
              </div>
            </div>

            {/* Right Film Showcase */}
            <div className="md:col-span-5 w-full order-1 md:order-2">
              <div className="viewfinder-crosshair cinema-cell-card rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] relative bg-gray-100 group border border-gray-200">
                <img
                  src="https://res.cloudinary.com/doa6d6cyf/image/upload/v1787200594/IMG_5697_ulijfv.jpg"
                  alt="Act II Heritage Archive"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800";
                  }}
                />

                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#171717] font-brand-sans text-[9px] font-bold tracking-widest uppercase shadow-sm">
                    2021-2024
                  </span>
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 text-white flex justify-between items-end pointer-events-none">
                  <span className="font-brand-sans text-[9px] uppercase tracking-widest text-[#C5A059] font-bold block truncate">
                    SACRED CELEBRATIONS
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            🏛️ 5. ACT III • 2025 & BEYOND
        ========================================================================= */}
        <section className="space-y-6 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4 gap-3 text-left">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                <span className="font-brand-sans text-[10px] font-bold tracking-[0.25em] text-gray-500 uppercase">
                  ACT III • 2025 — 2026
                </span>
              </div>
              <h2 className="font-brand-serif text-2xl sm:text-4xl font-bold text-[#171717] tracking-tight">
                200+ Families Milestone
              </h2>
            </div>
            <span className="font-brand-sans text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              Gold Standard Era
            </span>
          </div>

          <div className="cinema-cell-card rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-gray-100 shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Column Film Frame */}
              <div className="md:col-span-5 w-full">
                <div className="viewfinder-crosshair rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] relative bg-gray-100 group border border-gray-200">
                  <img
                    src="https://res.cloudinary.com/doa6d6cyf/image/upload/v1787200595/3338FB63-6388-47C1-B255-FCD225036F00_qlaiw0.png"
                    alt="2026 Apex Standard"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#171717] font-brand-sans text-[9px] font-bold tracking-widest uppercase shadow-sm">
                      2025-2026
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white flex justify-between items-end pointer-events-none">
                    <span className="font-brand-sans text-[9px] text-[#C5A059] uppercase tracking-widest block font-bold truncate">
                      Family Heirlooms
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column Narrative */}
              <div className="md:col-span-7 space-y-4 sm:space-y-6 text-left">
                <h3 className="font-brand-serif text-xl sm:text-4xl font-bold text-[#171717] leading-tight">
                  200+ Families. Timeless Stories.
                </h3>

                <blockquote className="font-brand-serif text-base text-gray-600 italic border-l-2 border-[#C5A059] pl-4 py-1">
                  "The breakthrough proved that authentic storytelling and pure passion always triumph."
                </blockquote>

                <p className="font-brand-sans text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                  Starting from humble beginnings, Vicky Photography Studio achieved massive industry recognition in recent years. With 200+ happy couples, Mr. Vicky stands as one of the premier luxury filmmakers.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 font-brand-sans text-[10px] sm:text-xs">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <span className="text-gray-400 block text-[9px] uppercase font-bold mb-0.5">Happy Clients</span>
                    <span className="text-[#171717] font-bold text-sm sm:text-lg truncate block">200+ Events</span>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <span className="text-gray-400 block text-[9px] uppercase font-bold mb-0.5">Vault Delivery</span>
                    <span className="text-[#C5A059] font-bold text-sm sm:text-lg truncate block">4K RAW</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab && setActiveTab('portfolio')}
                    className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-brand-sans font-bold uppercase tracking-widest text-[#C5A059] hover:text-[#171717] transition-colors cursor-pointer"
                  >
                    <span>Explore Master Portfolio</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            🏛️ 6. THE FOUR DIRECTORIAL PILLARS 
        ========================================================================= */}
        <section className="space-y-6 sm:space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="font-brand-sans text-[10px] font-bold tracking-[0.25em] text-gray-500 uppercase block">
              PRODUCTION FOUNDATIONS
            </span>
            <h2 className="font-brand-serif text-2xl sm:text-5xl font-bold text-[#171717] tracking-tight">
              The Guiding Pillars
            </h2>
            <p className="font-brand-sans text-gray-600 text-xs sm:text-sm">
              Why our wedding films and stills remain organically distinctive across decades.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {directorialPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="cinema-cell-card p-5 sm:p-7 rounded-2xl sm:rounded-3xl space-y-3 sm:space-y-4 border border-gray-100 text-left"
              >
                <span className="font-brand-serif text-2xl sm:text-3xl font-bold text-[#C5A059] block">
                  {pillar.num}
                </span>
                <div>
                  <h3 className="font-brand-serif text-sm sm:text-lg font-bold text-[#171717] leading-tight">
                    {pillar.title}
                  </h3>
                  <span className="font-brand-sans text-[9px] font-bold text-gray-500 uppercase tracking-widest block mt-1 truncate">
                    {pillar.subtitle}
                  </span>
                </div>
                <p className="font-brand-sans text-xs text-gray-600 leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            ✨ 7. DIRECTORIAL CALL TO ACTION
        ========================================================================= */}
        <section className="cinema-cell-card p-8 sm:p-14 rounded-2xl sm:rounded-3xl text-center space-y-4 sm:space-y-5 max-w-3xl mx-auto border border-gray-200 shadow-xl">
          <span className="font-brand-sans text-[10px] font-bold tracking-[0.25em] text-gray-500 uppercase block">
            LIMITED COMMISSION SEASONS
          </span>
          <h2 className="font-brand-serif text-2xl sm:text-5xl font-bold text-[#171717] tracking-tight">
            Commission Your <span className="italic font-light text-[#C5A059]">Chronicle</span>
          </h2>
          <p className="font-brand-sans text-gray-600 text-xs sm:text-sm max-w-lg mx-auto font-normal leading-relaxed">
            To preserve uncompromising quality and bespoke mastery, Mr. Vicky and our team accept a strictly limited number of wedding commissions each season.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveTab && setActiveTab('contact')}
              className="px-6 sm:px-8 py-3.5 rounded-full bg-[#171717] hover:bg-[#C5A059] text-white font-brand-sans text-[10px] sm:text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm cursor-pointer hover:-translate-y-0.5"
            >
              Check Availability (09219497519) →
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}