import React, { useState, useEffect, useMemo } from 'react';

// Google Drive file ID extract karke direct renderable image URL banana
const getDirectDriveImageUrl = (urlOrId, size = 'w800') => {
  if (!urlOrId) return '';
  if (urlOrId.startsWith('http') && !urlOrId.includes('drive.google.com')) return urlOrId;
  let fileId = urlOrId;
  const match = urlOrId.match(/[-\w]{25,}/);
  if (match) fileId = match[0];
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=${size}`;
};

export default function ClientVault({ onLogout, clientId }) {
  const clientData = clientId;

  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // ---------------------------------------------------------------------------------
  // 👁️ VIEW MODE: 'grid' OR 'slider'
  // ---------------------------------------------------------------------------------
  const [viewMode, setViewMode] = useState('grid');
  const [sliderIndex, setSliderIndex] = useState(0);

  // ---------------------------------------------------------------------------------
  // 📄 PAGINATION STATE (Only for Grid View)
  // ---------------------------------------------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 30;

  // ---------------------------------------------------------------------------------
  // ⏱️ LIVE COUNTDOWN TIMER STATE
  // ---------------------------------------------------------------------------------
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  const activeDeadline = useMemo(() => {
    if (!clientData) return null;
    if (clientData.deadlineDate) {
      const adminDate = new Date(clientData.deadlineDate);
      adminDate.setHours(23, 59, 59, 999);
      return adminDate.toISOString();
    } else {
      const storageKey = `vault_deadline_${clientData.pin || 'default'}`;
      const storedDate = localStorage.getItem(storageKey);
      if (storedDate) return storedDate;
      const newDeadline = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem(storageKey, newDeadline);
      return newDeadline;
    }
  }, [clientData]);

  // ---------------------------------------------------------------------------------
  // 🎬 LIGHTBOX (BIG SCREEN) STATE
  // ---------------------------------------------------------------------------------
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ==========================================
  // ⏱️ TIMER LOGIC
  // ==========================================
  useEffect(() => {
    if (!activeDeadline) return;
    const calculateTimeLeft = () => {
      const deadline = new Date(activeDeadline).getTime();
      const now = new Date().getTime();
      const distance = deadline - now;
      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        expired: false
      });
    };
    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, [activeDeadline]);

  // ==========================================
  // 📂 AUTO-FETCH DRIVE PHOTOS
  // ==========================================
  useEffect(() => {
    if (clientData && clientData.driveLink) {
      handleFetchDrivePhotos(clientData.driveLink);
    }
  }, [clientData]);

  const handleFetchDrivePhotos = async (link) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5100'; // Make sure protocol is added if missing locally

      const response = await fetch(`${backendUrl}/api/client/fetch-drive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderLink: link })
      });
      const result = await response.json();
      if (result.success) {
        setPhotos(result.data);
      } else {
        alert("Studio team ne shayad galat link daala hai. Error: " + result.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // 📄 PAGINATION LOGIC
  // ==========================================
  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);
  const totalPages = Math.ceil(photos.length / photosPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selection Logic
  const toggleSelection = (id, e) => {
    if (e) e.stopPropagation();
    if (timeLeft.expired) {
      alert("⚠️ Selection window has closed. Please contact Studio Administration.");
      return;
    }
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedPhotos(newSelection);
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5100';

      const res = await fetch(`${backendUrl}/api/client/submit-selection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: clientData?.pin,
          selectedCount: selectedPhotos.size,
          selectedIds: Array.from(selectedPhotos)
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Amazing! You've finalized ${selectedPhotos.size} photos. The Studio Team has been notified.`);
      }
    } catch (error) {
      alert("Something went wrong. Please check your internet connection.");
    }
  };

  // ==========================================
  // 🎬 LIGHTBOX & SLIDER CONTROLS
  // ==========================================
  const openLightbox = (globalIndex) => {
    setCurrentIndex(globalIndex);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  const nextPhoto = (e) => {
    if (e) e.stopPropagation();
    if (viewMode === 'slider') {
      setSliderIndex((prev) => (prev + 1) % photos.length);
    } else {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const prevPhoto = (e) => {
    if (e) e.stopPropagation();
    if (viewMode === 'slider') {
      setSliderIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        if (e.key === 'ArrowRight') nextPhoto();
        if (e.key === 'ArrowLeft') prevPhoto();
        if (e.key === 'Escape') closeLightbox();
      } else if (viewMode === 'slider' && photos.length > 0) {
        // Allow arrow keys to navigate the slider view
        if (e.key === 'ArrowRight') nextPhoto();
        if (e.key === 'ArrowLeft') prevPhoto();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, viewMode, photos.length]);

  return (
    <div className="bg-[#050505] text-white font-sans tracking-tight relative overflow-hidden min-h-screen pt-4 sm:pt-8 pb-20 selection:bg-[#C5A059] selection:text-[#050505]">

      {/* 🔮 MASTER LUXURY DARK THEME STYLING */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');
        
        .font-brand-serif { font-family: 'Playfair Display', serif; }
        .font-brand-sans { font-family: 'Inter', sans-serif; }

        @keyframes floatVaultAurora1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 30px) scale(1.1); }
        }

        @keyframes floatVaultAurora2 {
          0%, 100% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(-40px, -20px) scale(0.95); }
        }

        .anim-vault-aurora1 { animation: floatVaultAurora1 18s ease-in-out infinite alternate; }
        .anim-vault-aurora2 { animation: floatVaultAurora2 22s ease-in-out infinite alternate; }

        .glass-vault-panel {
          background: rgba(15, 15, 15, 0.7);
          backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.8);
        }

        .tilt-photo-tile {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .tilt-photo-tile:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(197, 160, 89, 0.15);
        }

        /* Custom scrollbar for grid view */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* =========================================================================
          1. 3D AMBIENT DARK LIGHT CANVAS
      ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#050505]">
        <div className="absolute -top-32 -left-32 w-[700px] h-[700px] bg-gradient-to-br from-[#C5A059]/10 via-transparent to-transparent rounded-full blur-[140px] anim-vault-aurora1" />
        <div className="absolute top-1/3 -right-36 w-[800px] h-[800px] bg-gradient-to-bl from-white/[0.03] via-[#C5A059]/5 to-transparent rounded-full blur-[150px] anim-vault-aurora2" />
        <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#C5A059]/10 via-transparent to-transparent rounded-full blur-[130px]" />
        {/* Subtle grid pattern for texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="max-w-[100rem] mx-auto px-6 sm:px-12 relative z-10 space-y-10 sm:space-y-12">

        {/* =========================================================================
            2. 👑 EXECUTIVE VAULT HEADER & SUBMISSION CONTROLS
        ========================================================================= */}
        <div className="glass-vault-panel rounded-[2rem] p-6 sm:p-10 border border-white/5 shadow-2xl flex flex-col xl:flex-row justify-between items-center gap-8">
          <div className="text-center xl:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] font-brand-sans text-[9px] font-bold uppercase tracking-[0.2em] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
              SECURE CLIENT REPOSITORY • VICKY STUDIO
            </div>
            <h2 className="font-brand-serif text-3xl sm:text-5xl text-white font-light tracking-tight">
              Welcome, <span className="italic text-gray-300">{clientData?.name || "VVIP Client"}</span>
            </h2>
            <p className="font-brand-sans text-gray-500 text-xs tracking-[0.2em] uppercase font-bold">
              {clientData?.eventType || "Event"} Photo Selection Portal
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 w-full xl:w-auto">
            
            {/* View Mode Toggle */}
            <div className="flex bg-[#111] p-1.5 rounded-xl border border-white/5 w-full sm:w-auto overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-[10px] font-brand-sans font-bold uppercase tracking-[0.2em] transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white/10 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('slider')}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-[10px] font-brand-sans font-bold uppercase tracking-[0.2em] transition-all cursor-pointer ${
                  viewMode === 'slider' ? 'bg-[#C5A059] text-[#050505] shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Studio Slider
              </button>
            </div>

            <div className="text-center xl:text-right px-6 py-3 bg-black/40 border border-white/5 rounded-xl backdrop-blur-sm min-w-[140px]">
              <p className="text-[9px] font-brand-sans uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">Selected</p>
              <p className="text-2xl font-brand-serif font-light text-[#C5A059] leading-none">{selectedPhotos.size} <span className="text-sm text-gray-600 font-brand-sans">/ {photos.length}</span></p>
            </div>

            <button
              onClick={handleFinalSubmit}
              disabled={selectedPhotos.size === 0 || timeLeft.expired}
              className="w-full sm:w-auto bg-white hover:bg-[#C5A059] disabled:bg-white/10 disabled:text-gray-500 text-[#050505] px-8 py-4 rounded-xl text-[10px] font-brand-sans font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] disabled:shadow-none cursor-pointer whitespace-nowrap"
            >
              {timeLeft.expired ? 'PORTAL LOCKED' : 'Submit Final Album ✦'}
            </button>

            <button
              onClick={onLogout}
              className="w-full sm:w-auto text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl font-brand-sans font-bold uppercase tracking-[0.2em] hover:bg-red-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>

        {/* =========================================================================
            3. ⏳ LIVE ARCHIVAL COUNTDOWN TIMER
        ========================================================================= */}
        {activeDeadline && (
          <div className={`glass-vault-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 border transition-all duration-500 ${
            timeLeft.expired
              ? 'bg-red-950/20 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)]'
              : timeLeft.days < 2
                ? 'bg-[#C5A059]/10 border-[#C5A059]/30 shadow-[0_0_30px_rgba(197,160,89,0.1)]'
                : 'border-white/5'
            }`}>
            <div className="text-center md:text-left space-y-1.5">
              <span className={`font-brand-sans text-[9px] tracking-[0.3em] uppercase font-bold block ${timeLeft.expired ? 'text-red-400' : 'text-[#C5A059]'}`}>
                {timeLeft.expired ? '⚠️ SELECTION DEADLINE PASSED' : '[ACTION REQUIRED]'}
              </span>
              <h3 className="font-brand-serif text-2xl sm:text-3xl text-white font-light tracking-tight">
                {timeLeft.expired ? 'Selection Window Closed.' : 'Photo Selection Countdown'}
              </h3>
              <p className="font-brand-sans text-gray-400 text-xs sm:text-sm max-w-md leading-relaxed font-light">
                {timeLeft.expired
                  ? 'Your project timeline is currently paused. Please contact studio administration to reopen.'
                  : 'Please finalize your selections before the countdown concludes so our grading team can begin album manufacturing.'}
              </p>
            </div>

            <div className="flex gap-4 sm:gap-6">
              {[{ label: 'Days', value: timeLeft.days }, { label: 'Hours', value: timeLeft.hours }, { label: 'Mins', value: timeLeft.minutes }, { label: 'Secs', value: timeLeft.seconds }].map((unit, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl border backdrop-blur-md shadow-inner ${
                    timeLeft.expired
                      ? 'bg-red-500/10 border-red-500/20'
                      : 'bg-black/40 border-white/10'
                    }`}>
                    <span className={`font-brand-sans text-xl sm:text-2xl font-light ${
                      timeLeft.expired ? 'text-red-400' : timeLeft.days < 2 ? 'text-[#C5A059]' : 'text-white'
                      }`}>
                      {String(unit.value).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[9px] font-brand-sans text-gray-500 uppercase tracking-[0.2em] font-bold mt-3">{unit.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            4. 🔲 VIEW RENDERER (GRID OR SLIDER)
        ========================================================================= */}
        {isLoading ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((skel) => (
              <div key={skel} className="w-full h-72 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="glass-vault-panel rounded-3xl text-center py-32 border border-white/5 border-dashed">
            <p className="font-brand-sans text-sm text-gray-500 uppercase tracking-[0.2em] font-bold">No photos found in your cloud vault.</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* --- GRID VIEW --- */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-2 border-b border-white/5 pb-4">
              <h3 className="font-brand-sans text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.2em]">
                Page {currentPage} of {totalPages}
              </h3>
              <span className="font-brand-sans text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                Displaying {indexOfFirstPhoto + 1} - {Math.min(indexOfLastPhoto, photos.length)} of {photos.length} Stills
              </span>
            </div>

            <div className={`columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 ${timeLeft.expired ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
              {currentPhotos.map((photo, index) => {
                const isSelected = selectedPhotos.has(photo.id);
                return (
                  <div
                    key={photo.id}
                    className={`relative group break-inside-avoid overflow-hidden rounded-2xl bg-[#111] border tilt-photo-tile cursor-pointer ${
                      isSelected ? 'border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.2)]' : 'border-white/5'
                    }`}
                  >
                    <img
                      src={getDirectDriveImageUrl(photo.id || photo.thumbUrl, 'w400')}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://lh3.googleusercontent.com/d/${photo.id}=s400`;
                      }}
                      alt="Vault Memory"
                      onClick={() => openLightbox(indexOfFirstPhoto + index)}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 hover:opacity-100"
                      loading="lazy"
                    />

                    {/* Dark Overlay for Selection */}
                    <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
                      isSelected ? 'bg-black/40' : 'bg-transparent group-hover:bg-black/20'
                    }`} />
                    
                    {/* Checkbox */}
                    <button
                      onClick={(e) => toggleSelection(photo.id, e)}
                      className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border ${
                        isSelected
                          ? 'bg-[#C5A059] text-[#050505] border-[#C5A059] scale-110 shadow-lg'
                          : 'bg-black/40 text-gray-400 border-white/20 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isSelected && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />}
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-3 pt-12">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all font-brand-sans text-[10px] uppercase font-bold cursor-pointer"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`w-11 h-11 flex items-center justify-center rounded-xl font-brand-sans font-bold text-[10px] transition-all border cursor-pointer ${
                          currentPage === pageNumber
                            ? 'bg-[#C5A059] text-[#050505] border-[#C5A059]'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                          }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                    return <span key={pageNumber} className="text-gray-600 font-brand-sans text-xs px-2">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all font-brand-sans text-[10px] uppercase font-bold cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          /* --- STUDIO SLIDER VIEW (Tinder/Netflix Style) --- */
          <div className="relative w-full max-w-5xl mx-auto h-[70vh] min-h-[500px] rounded-[2rem] border border-white/5 bg-[#0a0a0a] shadow-2xl flex items-center justify-center overflow-hidden">
            
            {/* Background blurred image for immersive feel */}
            <div 
              className="absolute inset-0 opacity-20 blur-3xl scale-110 bg-center bg-cover transition-all duration-1000"
              style={{ backgroundImage: `url(${getDirectDriveImageUrl(photos[sliderIndex].id || photos[sliderIndex].thumbUrl, 'w400')})` }}
            />

            <div className={`relative z-10 w-full h-full p-4 md:p-10 flex items-center justify-center ${timeLeft.expired ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
              
              <button onClick={prevPhoto} className="absolute left-4 md:left-8 z-20 text-gray-400 hover:text-white bg-black/50 hover:bg-[#C5A059] p-4 rounded-full border border-white/10 hover:border-[#C5A059] transition-all cursor-pointer backdrop-blur-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>

              <div className="relative h-full w-full max-w-3xl flex flex-col items-center justify-center">
                <img
                  key={photos[sliderIndex].id}
                  src={
                    photos[sliderIndex].thumbUrl
                      ? photos[sliderIndex].thumbUrl.replace(/=s\d+/, '=s0')
                      : getDirectDriveImageUrl(photos[sliderIndex].id, 'w1600')
                  }
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://lh3.googleusercontent.com/d/${photos[sliderIndex].id}`;
                  }}
                  alt="Vault Slide"
                  className="max-w-full max-h-[calc(100%-80px)] object-contain rounded-xl shadow-2xl border border-white/10"
                />

                {/* Slider Selection Action Bar */}
                <div className="absolute bottom-0 w-full flex justify-center pb-2">
                  <button
                    onClick={() => toggleSelection(photos[sliderIndex].id)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-full font-brand-sans font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300 shadow-2xl cursor-pointer backdrop-blur-md border ${
                      selectedPhotos.has(photos[sliderIndex].id)
                        ? 'bg-[#C5A059] text-[#050505] border-[#C5A059] scale-105'
                        : 'bg-black/60 text-white border-white/20 hover:border-[#C5A059] hover:bg-black/80'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPhotos.has(photos[sliderIndex].id) ? 'border-[#050505]' : 'border-white/50'}`}>
                      {selectedPhotos.has(photos[sliderIndex].id) && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    {selectedPhotos.has(photos[sliderIndex].id) ? 'STILL SELECTED FOR ALBUM' : 'SELECT THIS STILL'}
                  </button>
                </div>
              </div>

              <button onClick={nextPhoto} className="absolute right-4 md:right-8 z-20 text-gray-400 hover:text-white bg-black/50 hover:bg-[#C5A059] p-4 rounded-full border border-white/10 hover:border-[#C5A059] transition-all cursor-pointer backdrop-blur-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
              
            </div>

            <div className="absolute top-6 right-8 z-20">
              <span className="font-brand-sans text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] bg-black/60 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                {sliderIndex + 1} / {photos.length}
              </span>
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          6. 🎞️ CINEMATIC HIGH-RES LIGHTBOX MODAL (For Grid View Expansion)
      ========================================================================= */}
      {lightboxOpen && viewMode === 'grid' && photos.length > 0 && (
        <div className="fixed inset-0 z-[99999] bg-[#050505]/95 backdrop-blur-2xl flex flex-col items-center justify-center">
          <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
            <p className="text-gray-400 font-brand-sans tracking-[0.2em] text-[10px] uppercase font-bold">
              Frame {currentIndex + 1} of {photos.length}
            </p>
            <button
              onClick={closeLightbox}
              className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full border border-white/10 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="relative w-full max-w-7xl h-[75vh] flex items-center justify-center px-4 md:px-16 mt-10">
            <button onClick={prevPhoto} className="absolute left-4 md:left-8 text-gray-400 hover:text-white bg-black/50 hover:bg-[#C5A059] p-4 rounded-full border border-white/10 hover:border-[#C5A059] transition-all z-50 cursor-pointer backdrop-blur-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <img
              key={photos[currentIndex].id}
              src={
                photos[currentIndex].thumbUrl
                  ? photos[currentIndex].thumbUrl.replace(/=s\d+/, '=s0')
                  : getDirectDriveImageUrl(photos[currentIndex].id, 'w1600')
              }
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://lh3.googleusercontent.com/d/${photos[currentIndex].id}`;
              }}
              alt="Vault High-Res View"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/10"
            />

            <button onClick={nextPhoto} className="absolute right-4 md:right-8 text-gray-400 hover:text-white bg-black/50 hover:bg-[#C5A059] p-4 rounded-full border border-white/10 hover:border-[#C5A059] transition-all z-50 cursor-pointer backdrop-blur-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="absolute bottom-10 z-50 flex items-center gap-6">
            <button
              onClick={() => toggleSelection(photos[currentIndex].id)}
              disabled={timeLeft.expired}
              className={`flex items-center gap-3 px-8 py-4 rounded-full font-brand-sans font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl cursor-pointer backdrop-blur-md border ${
                timeLeft.expired
                  ? 'opacity-50 cursor-not-allowed bg-black/60 text-gray-500 border-white/10'
                  : selectedPhotos.has(photos[currentIndex].id)
                    ? 'bg-[#C5A059] text-[#050505] border-[#C5A059] scale-105'
                    : 'bg-black/60 text-white border-white/20 hover:border-[#C5A059] hover:bg-black/80'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPhotos.has(photos[currentIndex].id) ? 'border-[#050505]' : 'border-white/50'}`}>
                {selectedPhotos.has(photos[currentIndex].id) && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
              </div>
              {timeLeft.expired ? 'PORTAL LOCKED' : selectedPhotos.has(photos[currentIndex].id) ? 'STILL SELECTED ✓' : 'SELECT THIS STILL'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}