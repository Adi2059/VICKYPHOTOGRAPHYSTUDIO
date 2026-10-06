import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { X, ArrowRight, ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from 'lucide-react';

export default function Portfolio({ setActiveTab }) {
  const containerRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedMedia, setSelectedMedia] = useState(null); 
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const carouselRef = useRef(null);

  const [hoveredVideoId, setHoveredVideoId] = useState(null);

  const filters = ['All', 'Weddings', 'Pre-Weddings', 'Haldi', 'Maternity', 'Birthday', 'Bride'];

  // 🎬 Cinematic Films Timeline Data
  const timelineFilms = [
    {
      id: "wedding-film",
      type: "The Royal Wedding",
      couple: "Saniya & Akash",
      year: "2026",
      context: "A grand celebration of heritage and sacred vows. Directed with pure restraint, we documented their union as the best wedding filmer in Ayodhya.",
      src: "https://res.cloudinary.com/tkhv6b6p/video/upload/v1791194859/SANIYA_AKASH_PEREFCT.mp4", 
      thumbnail: "https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141092/vicky-photography-studio-nandauli-ayodhya-photographers-1q963uv9fi.avif",
      mediaType: 'video'
    },
    {
      id: "prewedding-film",
      type: "Editorial Pre-Wedding",
      couple: "Meera & Kabir",
      year: "2026",
      context: "Shot against architectural marvels at golden hour. We approached this sequence like a high-fashion editorial, blending natural lighting with profound romance.",
      src: "https://www.w3schools.com/html/mov_bbb.mp4", 
      thumbnail: "https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141093/vicky-photography-studio-nandauli-ayodhya-photographers-92bh153zha.avif",
      mediaType: 'video'
    },
    {
      id: "haldi-film",
      type: "Vibrant Haldi",
      couple: "Priya & Siddharth",
      year: "2025",
      context: "Capturing the raw energy, colors, and pure joy. An unscripted narrative of pure celebration and cultural heritage.",
      src: "https://www.w3schools.com/html/mov_bbb.mp4", 
      thumbnail: "https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140828/vicky-photography-studio-nandauli-ayodhya-photographers-51rzbezibd.webp",
      mediaType: 'video'
    },
    {
      id: "birthday-film",
      type: "Grand Celebrations",
      couple: "Aarav's First",
      year: "2025",
      context: "A cinematic documentation of golden milestones. Preserving laughter and intimate moments in their truest form.",
      src: "https://www.w3schools.com/html/mov_bbb.mp4", 
      thumbnail: "https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141078/375f9eed27c4b9015da7a1252a8a72c4.jpg",
      mediaType: 'video'
    }
  ];

  // 🚀 SAARI PHOTOS YAHAAN HAIN! (Change 'category' if any photo is misplaced visually)
  const portfolioImages = [
    // --- WEDDINGS ---
    { id: 1, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141150/6436dd71a3547c86de82ad5e88150542.jpg', category: 'Weddings', title: 'The Royal Vows', mediaType: 'image' },
    { id: 2, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141095/c48b94bec54d8b351d042370caddc76c.jpg', category: 'Weddings', title: 'Sacred Rituals', mediaType: 'image' },
    { id: 3, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141094/bc30c845e63b5a82a5182a9da8b3c6c5.jpg', category: 'Weddings', title: 'Timeless Bond', mediaType: 'image' },
    { id: 4, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141093/7b0c2b5cb89d0d6a1c244569f453f66c.jpg', category: 'Weddings', title: 'Grandeur', mediaType: 'image' },
    { id: 5, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141093/vicky-photography-studio-nandauli-ayodhya-photographers-92bh153zha.avif', category: 'Weddings', title: 'The Celebration', mediaType: 'image' },
    { id: 6, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140828/vicky-photography-studio-nandauli-ayodhya-photographers-np7yrd4v3m.webp', category: 'Weddings', title: 'Union', mediaType: 'image' },
    { id: 7, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140828/vicky-photography-studio-nandauli-ayodhya-photographers-tlegmdgf9o.webp', category: 'Weddings', title: 'Promises', mediaType: 'image' },
    { id: 8, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140828/vicky-photography-studio-nandauli-ayodhya-photographers-x5carlaggi.webp', category: 'Weddings', title: 'Forever', mediaType: 'image' },
    { id: 9, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140828/vicky-photography-studio-nandauli-ayodhya-photographers-d2gfw3ovz1.avif', category: 'Weddings', title: 'Forever', mediaType: 'image' },

    // --- PRE-WEDDINGS ---
    { id: 9, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141091/799f7bd60c9f4a3ce36ed2a5c1bb8ae6.jpg', category: 'Pre-Weddings', title: 'Golden Hour', mediaType: 'image' },
    { id: 10, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141092/4c3a04b623f131eac5f8ea4f389468a2.jpg', category: 'Pre-Weddings', title: 'Editorial Frame', mediaType: 'image' },
    { id: 11, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141092/0d96d0ec47f9ae27d6c465d137f47b49.jpg', category: 'Pre-Weddings', title: 'Timeless Romance', mediaType: 'image' },
    { id: 12, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141091/799f7bd60c9f4a3ce36ed2a5c1bb8ae6.jpg', category: 'Pre-Weddings', title: 'Serenity', mediaType: 'image' },
    { id: 13, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141091/9e91eb85f896212dccaf39f0682c985c.jpg', category: 'Pre-Weddings', title: 'Love Story', mediaType: 'image' },
    { id: 14, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140826/vicky-photography-studio-nandauli-ayodhya-photographers-pi05l6yawf.avif', category: 'Pre-Weddings', title: 'The Proposal', mediaType: 'image' },
    { id: 15, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140827/vicky-photography-studio-nandauli-ayodhya-photographers-7g7nyq5tvx.webp', category: 'Pre-Weddings', title: 'Dreamy', mediaType: 'image' },
    { id: 16, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140825/vicky-photography-studio-nandauli-ayodhya-photographers-0sha98mzy5.webp', category: 'Pre-Weddings', title: 'Classic', mediaType: 'image' },

    // --- BRIDE ---
    { id: 17, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140827/vicky-photography-studio-nandauli-ayodhya-photographers-rx9tzh0jtw.avif', category: 'Bride', title: 'The Bridal Aura', mediaType: 'image' },
    { id: 18, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140827/vicky-photography-studio-nandauli-ayodhya-photographers-rx9tzh0jtw.avif', category: 'Bride', title: 'Elegance', mediaType: 'image' },
    { id: 19, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140827/vicky-photography-studio-nandauli-ayodhya-photographers-7g7nyq5tvx.webp', category: 'Bride', title: 'Regal Charm', mediaType: 'image' },
    { id: 20, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140827/vicky-photography-studio-nandauli-ayodhya-photographers-n1jnri4r1n.avif', category: 'Bride', title: 'Beauty', mediaType: 'image' },
    { id: 21, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140827/vicky-photography-studio-nandauli-ayodhya-photographers-tapx0rnr6v.webp', category: 'Bride', title: 'Grace', mediaType: 'image' },

    // --- HALDI ---
    { id: 22, src: '', category: 'Haldi', title: 'Vibrant Colors', mediaType: 'image' },
    { id: 23, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140827/vicky-photography-studio-nandauli-ayodhya-photographers-tapx0rnr6v.webp', category: 'Haldi', title: 'Joy & Turmeric', mediaType: 'image' },
    { id: 24, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140825/vicky-photography-studio-nandauli-ayodhya-photographers-0sha98mzy5.webp', category: 'Haldi', title: 'Traditions', mediaType: 'image' },
    { id: 25, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140826/vicky-photography-studio-nandauli-ayodhya-photographers-pi05l6yawf.avif', category: 'Haldi', title: 'Laughter', mediaType: 'image' },

    // --- MATERNITY ---
    { id: 26, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141092/0d96d0ec47f9ae27d6c465d137f47b49.jpg', category: 'Maternity', title: 'Motherhood Grace', mediaType: 'image' },
    { id: 27, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140825/e0ec47c1baa0912eedf990656c0c4b63.jpg', category: 'Maternity', title: 'New Beginnings', mediaType: 'image' },
    { id: 28, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140827/879e1abd50915071c6687c2add14d5d6.jpg', category: 'Maternity', title: 'Blessed', mediaType: 'image' },
    { id: 29, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140825/ec0b37777f678d6704b0c9a9c2788991.jpg', category: 'Maternity', title: 'Anticipation', mediaType: 'image' },
    { id: 30, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140827/d21067d59901e1c5f2a98922ed108387.jpg', category: 'Maternity', title: 'Anticipation', mediaType: 'image' },
    { id: 31, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140825/e0ec47c1baa0912eedf990656c0c4b63.jpg', category: 'Maternity', title: 'Anticipation', mediaType: 'image' },
    { id: 32, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140827/2a740265aae2f4859535803c5cb940ff.jpg', category: 'Maternity', title: 'Anticipation', mediaType: 'image' },

    // --- BIRTHDAY ---
    { id: 30, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141090/c7428bf97027ba81c5c4051fbc73ed2c.jpg', category: 'Birthday', title: 'Golden Celebrations', mediaType: 'image' },
    { id: 31, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141080/f7785749f68b4e46d41468056a23f973.jpg', category: 'Birthday', title: 'Smiles', mediaType: 'image' },
    { id: 32, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791141080/f7785749f68b4e46d41468056a23f973.jpg', category: 'Birthday', title: 'Festivities', mediaType: 'image' },
    { id: 33, src: 'https://res.cloudinary.com/tkhv6b6p/image/upload/v1791140825/e0ec47c1baa0912eedf990656c0c4b63.jpg', category: 'Birthday', title: 'Memories', mediaType: 'image' },
  ];

  const filteredImages = activeFilter === 'All' 
    ? portfolioImages 
    : portfolioImages.filter(img => img.category === activeFilter);

  useEffect(() => { setActiveIndex(0); }, [activeFilter]);

  const handlePrev = () => setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1));
  const handleNext = () => setActiveIndex((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0));

  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type.includes('mouse') ? e.pageX : e.touches[0].clientX);
  };
  const handleDragEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
  };

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

    let animId;
    const renderLoop = (time) => { lenis.raf(time); animId = requestAnimationFrame(renderLoop); };
    animId = requestAnimationFrame(renderLoop);

    return () => { lenis.destroy(); if (revealObserver) revealObserver.disconnect(); cancelAnimationFrame(animId); };
  }, [activeFilter]);

  useEffect(() => {
    if (selectedMedia) {
      document.body.style.overflow = 'hidden';
      const header = document.querySelector('header');
      if(header) header.style.zIndex = '0';
    } else {
      document.body.style.overflow = 'unset';
      const header = document.querySelector('header');
      if(header) header.style.zIndex = '50';
    }
  }, [selectedMedia]);

  return (
    <div ref={containerRef} className="font-sans tracking-tight relative overflow-hidden bg-[#050505] selection:bg-[#C5A059] selection:text-white pb-20">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');

        .font-luxury-serif { font-family: 'Cormorant Garamond', serif; }
        .font-luxury-sans { font-family: 'Montserrat', sans-serif; }

        .reveal-on-scroll { opacity: 0; transform: translateY(40px); transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-on-scroll.is-revealed { opacity: 1; transform: translateY(0); }

        @keyframes floatSlow { 0% { transform: translateY(0px) rotate(-4deg); } 50% { transform: translateY(-15px) rotate(-2deg); } 100% { transform: translateY(0px) rotate(-4deg); } }
        @keyframes floatSlowReverse { 0% { transform: translateY(0px) rotate(4deg); } 50% { transform: translateY(-15px) rotate(2deg); } 100% { transform: translateY(0px) rotate(4deg); } }
        
        .floating-card-left { animation: floatSlow 6s ease-in-out infinite; }
        .floating-card-right { animation: floatSlowReverse 7s ease-in-out infinite; }
        .floating-card-left:hover, .floating-card-right:hover { animation-play-state: paused; transform: translateY(-10px) rotate(0deg) scale(1.05) !important; z-index: 30; }
      `}</style>

      {/* =========================================================================
          SECTION 1: THE DARK INTRO 
      ========================================================================= */}
      <div className="relative w-full min-h-[85vh] bg-[#050505] text-white flex items-center justify-center overflow-hidden border-b border-white/5 py-20">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          {/* Default blur background image from your first array item */}
          <img src={portfolioImages[0].src} className="w-full h-full object-cover blur-sm" alt="Cinematic Vibe" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_85%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-transparent to-[#050505]" />
        </div>

        <div className="hidden lg:block absolute left-8 xl:left-24 top-1/2 -translate-y-1/2 w-[13rem] aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 z-10 floating-card-left cursor-pointer opacity-80 hover:opacity-100 group transition-all duration-500"
             onClick={() => setSelectedMedia(portfolioImages[2])}>
          <img src={portfolioImages[2].src} alt="Reel Left" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute bottom-6 left-6 font-luxury-sans text-[9px] uppercase tracking-[0.3em] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Couture</span>
        </div>

        <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center text-center px-6 mt-10 reveal-on-scroll">
          <span className="font-luxury-sans text-[9px] sm:text-[10px] tracking-[0.4em] uppercase text-[#C5A059] block mb-6 drop-shadow-md">The Master Archives</span>
          <h1 className="text-5xl sm:text-7xl lg:text-[6.5rem] font-luxury-serif font-light leading-none tracking-tight mb-6 drop-shadow-2xl">
            Visual <span className="italic text-gray-400">Poetry.</span>
          </h1>
          <p className="font-luxury-sans text-gray-400 text-[10px] sm:text-xs tracking-widest uppercase max-w-xl font-light leading-relaxed">
            Curated unscripted moments by the <span className="text-[#C5A059] font-medium">best wedding filmer in Ayodhya.</span> Preserving royal heritage and timeless fine-art legacy.
          </p>
        </div>

        <div className="hidden lg:block absolute right-8 xl:right-24 top-1/2 -translate-y-1/2 w-[13rem] aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 z-10 floating-card-right cursor-pointer opacity-80 hover:opacity-100 group transition-all duration-500"
             onClick={() => setSelectedMedia(portfolioImages[6])}>
          <img src={portfolioImages[6].src} alt="Reel Right" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" style={{ objectPosition: 'center 20%' }}/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute bottom-6 left-6 font-luxury-sans text-[9px] uppercase tracking-[0.3em] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Editorials</span>
        </div>
      </div>

      {/* =========================================================================
          🎬 SECTION 2: CINEMATIC FILMS TIMELINE 
      ========================================================================= */}
      <div className="relative w-full bg-[#0a0a0a] text-white py-24 lg:py-32 overflow-hidden border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-16 lg:mb-24 reveal-on-scroll">
            <span className="font-luxury-sans text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#C5A059] block mb-4">Featured Films</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-luxury-serif font-light">
              Cinematic <span className="italic text-gray-400">Journeys.</span>
            </h2>
          </div>

          <div className="relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
            {timelineFilms.map((film, index) => {
              const isEven = index % 2 === 0;
              const isHovered = hoveredVideoId === film.id;
              
              return (
                <div key={film.id} className={`relative flex flex-col md:flex-row items-start md:items-center justify-between w-full mb-20 lg:mb-32 group reveal-on-scroll ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-5 md:left-1/2 w-3 h-3 rounded-full bg-[#0a0a0a] border-2 border-[#C5A059] -translate-x-1.5 md:-translate-x-1.5 z-10 shadow-[0_0_15px_rgba(197,160,89,0.5)] transition-transform duration-500 group-hover:scale-150" />
                  
                  {/* Text Content */}
                  <div className={`w-full md:w-5/12 pl-14 md:pl-0 mb-8 md:mb-0 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                    <div className={`flex flex-col space-y-4 ${!isEven ? 'md:items-end' : 'md:items-start'}`}>
                      <div className="flex items-center gap-4">
                        <span className="font-luxury-serif text-2xl italic text-gray-500">{film.year}</span>
                        <div className="h-[1px] w-8 bg-[#C5A059]"></div>
                      </div>
                      <h3 className="font-luxury-serif text-3xl sm:text-4xl lg:text-5xl text-white font-light leading-tight">{film.couple}</h3>
                      <span className="font-luxury-sans text-[9px] uppercase tracking-[0.3em] text-[#C5A059] block">{film.type}</span>
                      <p className={`font-luxury-sans text-xs sm:text-sm text-gray-400 font-light leading-relaxed max-w-sm pt-2 ${!isEven ? 'md:text-right' : 'md:text-left'}`}>{film.context}</p>
                    </div>
                  </div>

                  {/* Video Content */}
                  <div className={`w-full md:w-6/12 pl-14 md:pl-0 ${isEven ? 'md:pr-8 lg:md:pr-16' : 'md:pl-8 lg:md:pl-16'}`}>
                    <div 
                      className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 cursor-pointer"
                      onMouseEnter={() => setHoveredVideoId(film.id)}
                      onMouseLeave={() => setHoveredVideoId(null)}
                      onClick={() => setSelectedMedia(film)}
                    >
                      <video 
                        src={film.src} 
                        poster={film.thumbnail}
                        loop 
                        muted={!isHovered}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2s]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />
                      
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                        {isHovered ? <Volume2 size={16} /> : <VolumeX size={16} />}
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110 bg-black/20">
                          <Play className="w-4 h-4 sm:w-6 sm:h-6 ml-1 text-white/90" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          🌟 SECTION 3: THE EXPANDING CAROUSEL 
      ========================================================================= */}
      <div id="gallery" className="relative w-full bg-[#E5E4DF] text-[#1a1a1a] py-16 lg:py-24 overflow-hidden">
        
        <div className="text-center mb-12 reveal-on-scroll">
          <span className="font-luxury-sans text-[10px] tracking-[0.4em] uppercase text-[#C5A059] block mb-4">The Fine-Art Collection</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-luxury-serif font-light">
            Editorial <span className="italic text-gray-500">Lookbook.</span>
          </h2>
        </div>

        <div className="flex justify-center mb-12 reveal-on-scroll px-4">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`font-luxury-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] transition-all duration-500 px-4 py-2 sm:px-5 sm:py-3 rounded-full border ${
                  activeFilter === filter 
                    ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-[0_10px_20px_rgba(197,160,89,0.3)] scale-105 font-medium' 
                    : 'bg-transparent text-gray-500 border-gray-300 hover:border-[#C5A059] hover:text-[#C5A059]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[75vh] flex items-center justify-center select-none reveal-on-scroll"
             onMouseDown={handleDragStart} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd} onTouchStart={handleDragStart} onTouchEnd={handleDragEnd}>
          {filteredImages.length === 0 ? (
            <div className="font-luxury-serif text-3xl text-gray-400 italic">Curating moments soon...</div>
          ) : (
            <div ref={carouselRef} className="absolute flex items-center justify-center w-full h-full">
              {filteredImages.map((img, idx) => {
                const offset = idx - activeIndex;
                const isActive = offset === 0;
                const isPrev = offset === -1 || (activeIndex === 0 && idx === filteredImages.length - 1);
                const isNext = offset === 1 || (activeIndex === filteredImages.length - 1 && idx === 0);
                const isHidden = !isActive && !isPrev && !isNext;

                let translateX = 0; let scale = 0.8; let opacity = 0.4; let zIndex = 0;
                if (isActive) { translateX = 0; scale = 1; opacity = 1; zIndex = 20; } 
                else if (isPrev) { translateX = -60; scale = 0.85; opacity = 0.5; zIndex = 10; } 
                else if (isNext) { translateX = 60; scale = 0.85; opacity = 0.5; zIndex = 10; } 
                else { opacity = 0; scale = 0.5; zIndex = -1; }

                return (
                  <div 
                    key={img.id}
                    onClick={() => { if (isActive) setSelectedMedia(img); else if (isPrev) handlePrev(); else if (isNext) handleNext(); }}
                    className={`absolute transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer
                      ${isActive ? 'w-[85vw] sm:w-[60vw] lg:w-[45vw] shadow-[0_30px_60px_rgba(0,0,0,0.4)]' : 'w-[70vw] sm:w-[40vw] lg:w-[30vw] shadow-lg'}
                      h-[45vh] sm:h-[55vh] lg:h-[65vh] rounded-2xl overflow-hidden bg-[#050505]
                    `}
                    style={{ transform: `translateX(${translateX}%) scale(${scale})`, opacity: opacity, zIndex: zIndex, pointerEvents: isHidden ? 'none' : 'auto' }}
                  >
                    <img src={img.src} className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-50 scale-125" alt="blur-bg"/>
                    <img src={img.src} alt={img.title} className="absolute inset-0 w-full h-full object-contain transition-transform duration-[2s] hover:scale-105" draggable="false" />
                    <div className={`absolute inset-0 bg-[#E5E4DF] mix-blend-color transition-opacity duration-[800ms] ${isActive ? 'opacity-0' : 'opacity-30'}`} />
                  </div>
                );
              })}
            </div>
          )}

          {filteredImages.length > 1 && (
            <div className="absolute top-1/2 -translate-y-1/2 w-full px-4 sm:px-12 flex justify-between z-30 pointer-events-none">
              <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="w-12 h-12 rounded-full border border-[#1a1a1a]/20 bg-[#F5F4F0]/80 backdrop-blur flex items-center justify-center hover:bg-[#C5A059] hover:text-white hover:border-[#C5A059] transition-all duration-300 pointer-events-auto shadow-lg">
                <ChevronLeft size={24} strokeWidth={1.5} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="w-12 h-12 rounded-full border border-[#1a1a1a]/20 bg-[#F5F4F0]/80 backdrop-blur flex items-center justify-center hover:bg-[#C5A059] hover:text-white hover:border-[#C5A059] transition-all duration-300 pointer-events-auto shadow-lg">
                <ChevronRight size={24} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-8 h-16 reveal-on-scroll">
          <span className="font-luxury-sans text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-2">
            {filteredImages[activeIndex]?.category}
          </span>
          <h3 className="font-luxury-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1a1a1a]">
            {filteredImages[activeIndex]?.title}
          </h3>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: CALL TO ACTION
      ========================================================================= */}
      <div className="w-full bg-[#050505] py-24 lg:py-32 relative z-20 border-t border-white/10">
        <div className="text-center reveal-on-scroll">
          <p className="font-luxury-serif text-3xl sm:text-4xl italic text-gray-500 mb-8">
            "Your legacy deserves to be framed in gold."
          </p>
          <button 
            onClick={() => setActiveTab ? setActiveTab('services') : document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-4 border-b border-white pb-2 font-luxury-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white hover:text-[#C5A059] hover:border-[#C5A059] transition-all duration-300"
          >
            <span>Explore Our Tariffs</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          🎯 SECTION 5: THE UNIVERSAL LIGHTBOX
      ========================================================================= */}
      {selectedMedia && (
        <div 
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 flex items-center justify-center bg-[#050505]/95 backdrop-blur-md opacity-100 transition-opacity duration-500"
          style={{ zIndex: 9999 }} 
        >
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedMedia(null); }}
            className="absolute top-6 right-6 sm:top-10 sm:right-10 w-12 h-12 sm:w-14 sm:h-14 bg-black/40 hover:bg-[#C5A059] rounded-full flex items-center justify-center text-white transition-all z-[10000] cursor-pointer shadow-2xl border border-white/20"
          >
            <X size={28} strokeWidth={1.5} />
          </button>

          <div className="absolute top-8 left-6 sm:top-10 sm:left-10 text-white z-50 pointer-events-none">
            <span className="font-luxury-sans text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-2 drop-shadow-lg">
              {selectedMedia.type || selectedMedia.category}
            </span>
            <h2 className="font-luxury-serif text-3xl sm:text-4xl font-light drop-shadow-lg">
              {selectedMedia.couple || selectedMedia.title}
            </h2>
          </div>

          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative w-[95vw] h-[80vh] max-w-7xl mt-16 sm:mt-0 flex items-center justify-center"
          >
            {selectedMedia.mediaType === 'video' ? (
              <div className="relative w-full aspect-video max-h-full rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 bg-black">
                <video 
                  src={selectedMedia.src} 
                  controls 
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <img 
                src={selectedMedia.src} 
                alt={selectedMedia.title} 
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
}