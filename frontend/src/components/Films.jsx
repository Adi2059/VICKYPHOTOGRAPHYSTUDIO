import React, { useState, useRef } from 'react';
import { Play, Sparkles, Film, Maximize2, X, ArrowRight, Phone } from 'lucide-react';

export default function Films({ setActiveTab }) {
  const [selectedFilm, setSelectedFilm] = useState(null);
  const videoRefs = useRef([]);

  // 6 Curated Cinema Reels (With direct Cloudinary delivery)
  const premiumVideos = [
    {
      id: 1,
      title: "The Royal Vivah Legacy",
      category: "HERITAGE CINEMA",
      desc: "A grand-scale cinematic chronicle captured across heritage palace courtyards in UP. Mastered frame-by-frame on premium anamorphic optics to preserve the profound depth of traditional rituals.",
      videoUrl: "https://res.cloudinary.com/doa6d6cyf/video/upload/a_270/v1787917023/Captured_emotions_not_just_moments_Book_your_wedding_now_zchs8l.mp4"
    },
    {
      id: 2,
      title: "The Couture Pre-Wedding",
      category: "COUTURE NARRATIVE",
      desc: "A high-fashion dusk narrative documented during the golden hour glow across scenic landscapes. Directed around luxury slow-motion sequences and ambient river reflections.",
      videoUrl: "https://res.cloudinary.com/doa6d6cyf/video/upload/a_270/v1787917004/Abhishek_SwatiShot_by_-_foreverstudios.in_zo_wed_shaadisquad_shaadisaga.official_wedmegoo_vqahr8.mp4"
    },
    {
      id: 3,
      title: "Grand Jubilee Celebrations",
      category: "JUBILEE ARCHIVE",
      desc: "A high-octane celebration teaser combining celebratory sparklers, candid portraiture, and seamless acoustic transition rhythms crafted by Vicky Photography Studio.",
      videoUrl: "https://res.cloudinary.com/doa6d6cyf/video/upload/a_270/v1784909337/Turning_birthdays_into_fairytales._..Manasvis_1st_birthday_birthdayfun_1stbirthday_hqf4fd.mp4"
    },
    {
      id: 4,
      title: "Varmala Royal Symphony",
      category: "SACRED WEDDING ENCORE",
      desc: "A breathtaking widescreen showcase highlighting low-angle mandap perspectives, rose petal shower sequences, and raw traditional emotional expressions.",
      videoUrl: "https://res.cloudinary.com/doa6d6cyf/video/upload/a_270/v1787916986/AQOh5CnV93RYX0F0txPga1tKGKj_kykmsMffYLS8HbCW7rH5vVKgk_gpum_2R8Mr8DqsdaXwHFSR03jZIWSuFWDFLJFw0Zjj_oqjx5c.mp4"
    },
    {
      id: 5,
      title: "Golden Hour Romance",
      category: "COUPLE PORTRAITURE",
      desc: "Captured across sacred riverfronts during dusk. Focuses on effortless unscripted glances, wind-swept silhouettes, and warm golden lens flares under Mr. Vicky's direction.",
      videoUrl: "https://res.cloudinary.com/doa6d6cyf/video/upload/v1784910407/BOOK_UR_PRE-WEDDING_RIGHT_NOW_%EF%B8%8F.._Prewedding_couple_video_Prewedding_video_Varanasi_vide_nc7krt.mp4"
    },
    {
      id: 6,
      title: "The Palace Ritual Heritage",
      category: "TRADITIONAL VIVAH",
      desc: "An elaborate documentation of Vedic mantras, sacred hawan fire rituals, and heartfelt bidaai farewell tears, directed with complete observational discretion.",
      videoUrl: "https://res.cloudinary.com/doa6d6cyf/video/upload/a_270/v1784909330/Best_Cinematic_Teaser_--_Wedding_Teaser_--_2026_--_cinematic_shortsvideo_youtube_video_reel_1_vgxihz.mp4"
    }
  ];

  // Staggered 3-Photo Triptych
  const triptychPhotos = [
    {
      url: "https://res.cloudinary.com/doa6d6cyf/image/upload/v1784743445/ptaufiq-indian-wedding-rajkot-India-ceremony-couple-portraits_xxvlnv.jpg",
      title: "The Royal Vows",
      tag: "Heritage"
    },
    {
      url: "https://res.cloudinary.com/doa6d6cyf/image/upload/v1784742666/uniquephotography1.0-20260318-0087_yyozre.webp",
      title: "Bridal Splendor",
      tag: "Couture"
    },
    {
      url: "https://res.cloudinary.com/doa6d6cyf/image/upload/v1784746877/WhatsApp_Image_2026-07-23_at_12.30.06_AM_1_ipebqc.jpg",
      title: "Golden Dusk Intimacy",
      tag: "Ambient"
    }
  ];

  // Safe calling handler
  const handleCallClick = (e, phoneNumber = '09219497519') => {
    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) {
      e.preventDefault();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(phoneNumber);
      }
      alert(`📞 Studio Contact Number: ${phoneNumber}\n(Copied to clipboard!)`);
    }
  };

  // Handler to ensure ONLY ONE video plays at a time
  const handlePlay = (playingIndex) => {
    videoRefs.current.forEach((videoEl, index) => {
      if (videoEl && index !== playingIndex && !videoEl.paused) {
        videoEl.pause();
      }
    });
  };

  return (
    <div className="bg-[#FAFAFA] text-[#171717] font-sans selection:bg-[#C5A059] selection:text-white overflow-x-hidden relative w-full min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-24">

      {/* 🔮 MASTER LUXURY DESIGN SYSTEM */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');
        
        .font-brand-serif { font-family: 'Playfair Display', serif; }
        .font-brand-sans { font-family: 'Inter', sans-serif; }

        .glass-film-panel {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(24px) saturate(170%);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.02);
        }

        .tilt-film-card {
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease;
        }
        .tilt-film-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(197, 160, 89, 0.1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-5 sm:px-10 relative z-10 space-y-16 sm:space-y-28">

        {/* =========================================================================
            1. EDITORIAL CINEMA HERO HEADER
        ========================================================================= */}
        <section className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="font-brand-sans text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-[#171717] uppercase">
              The Director's Reel • Directed by Mr. Vicky
            </span>
          </div>

          <div className="space-y-2">
            <span className="font-brand-sans text-[9px] sm:text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase block">
              ✦ Vicky Photography Studio CINEMA MASTERWORKS ✦
            </span>
            <h1 className="font-brand-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#171717] tracking-tight leading-[1.1]">
              Unrepeatable Moments <br />
              <span className="italic font-normal text-[#C5A059]">
                Preserved In 4K Widescreen.
              </span>
            </h1>
          </div>

          <div className="w-16 h-[1.5px] bg-[#C5A059]/40 mx-auto my-3" />

          <p className="font-brand-sans text-gray-600 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            Immerse yourself in our native 24fps motion reels, acoustic sound designs, and royal celebration chronicles crafted across Uttar Pradesh and luxury destinations.
          </p>
        </section>

        {/* =========================================================================
            2. 6 CINEMA MOTION MASTERWORKS
        ========================================================================= */}
        <section className="space-y-12 sm:space-y-24">
          {premiumVideos.map((video, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={video.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-center group"
              >
                {/* 🎥 Master Viewfinder Video Container */}
                <div className={`w-full lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="glass-film-panel rounded-2xl sm:rounded-3xl p-3 sm:p-4 tilt-film-card border border-gray-100 shadow-lg relative overflow-hidden text-left">
                    <div className="w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black relative shadow-inner flex items-center justify-center">
                      <video
                        ref={(el) => (videoRefs.current[idx] = el)}
                        src={video.videoUrl}
                        controls
                        controlsList="nodownload"
                        preload="metadata"
                        onPlay={() => handlePlay(idx)}
                        className="w-full h-full object-contain bg-black"
                      />
                    </div>
                  </div>
                </div>

                {/* 📝 Video Narrative & Action */}
                <div className={`w-full lg:col-span-5 space-y-3 sm:space-y-4 ${isEven ? 'lg:order-2' : 'lg:order-1'} text-left`}>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[#C5A059] font-brand-serif text-xl sm:text-2xl font-bold italic">
                        0{idx + 1}
                      </span>
                      <span className="w-6 h-[1px] bg-gray-300" />
                      <span className="text-gray-500 font-brand-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold truncate">
                        {video.category}
                      </span>
                    </div>

                    <h3 className="font-brand-serif text-2xl sm:text-3xl lg:text-4xl text-[#171717] font-bold leading-tight">
                      {video.title}
                    </h3>
                  </div>

                  <p className="font-brand-sans text-gray-600 text-xs sm:text-sm leading-relaxed font-normal">
                    {video.desc}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedFilm(video)}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white border border-gray-200 text-[#171717] hover:bg-[#171717] hover:text-white hover:border-[#171717] font-brand-sans text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm cursor-pointer hover:-translate-y-0.5"
                    >
                      Theater Mode ⤢
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </section>

        {/* =========================================================================
            3. OPTICAL MASTER TRIPTYCH (3 STILLS IN 1 ROW)
        ========================================================================= */}
        <section className="glass-film-panel rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-gray-100 shadow-xl">
          <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3 mb-8 sm:mb-12">
            <span className="font-brand-sans text-[10px] font-bold tracking-[0.25em] text-gray-500 uppercase block">
              OPTICAL MASTER TRIPTYCH
            </span>
            <h2 className="font-brand-serif text-2xl sm:text-4xl font-bold text-[#171717] tracking-tight">
              Three Still Visions. <span className="italic font-light text-[#C5A059]">One Legacy.</span>
            </h2>
            <p className="font-brand-sans text-gray-600 text-xs sm:text-sm font-normal">
              Every frame represents an unrepeatable micro-expression captured with fine-art precision by Vicky Photography Studio.
            </p>
          </div>

          {/* Staggered Triptych Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {triptychPhotos.map((photo, index) => (
              <div
                key={index}
                className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg aspect-[4/5] bg-gray-100 border border-gray-200 group"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full font-brand-sans text-[9px] font-bold text-[#171717] uppercase tracking-widest shadow-sm">
                    {photo.tag}
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-white pointer-events-none text-left">
                  <h4 className="font-brand-serif text-lg sm:text-xl font-bold truncate">
                    {photo.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 sm:pt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => setActiveTab && setActiveTab('contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#171717] hover:bg-[#C5A059] text-white font-brand-sans text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-md cursor-pointer hover:-translate-y-0.5"
            >
              <span>Consult Mr. Vicky</span>
              <ArrowRight size={14} />
            </button>
            <a
              href="tel:09219497519"
              onClick={(e) => handleCallClick(e, '09219497519')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-brand-sans font-bold text-gray-700 bg-gray-50 border border-gray-200 px-6 py-3.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Phone size={13} className="text-[#C5A059]" /> 092194 97519
            </a>
          </div>
        </section>

      </div>

      {/* =========================================================================
          4. THEATER FULL-SCREEN VIEWING MODAL
      ========================================================================= */}
      {selectedFilm && (
        <div
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedFilm(null)}
        >
          <button
            className="absolute top-6 right-6 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-brand-sans text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer border border-white/20"
            onClick={() => setSelectedFilm(null)}
          >
            <span>Close Theater</span>
            <X size={14} />
          </button>

          <div
            className="max-w-5xl w-full max-h-[85vh] relative flex flex-col items-center justify-center space-y-3 sm:space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <video
                src={selectedFilm.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-center text-white space-y-1">
              <span className="font-brand-sans text-[10px] font-bold tracking-widest text-[#C5A059] uppercase block">
                {selectedFilm.category}
              </span>
              <h3 className="font-brand-serif text-xl sm:text-3xl font-medium">{selectedFilm.title}</h3>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}