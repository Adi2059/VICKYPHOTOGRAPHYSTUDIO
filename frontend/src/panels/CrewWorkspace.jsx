import React, { useState, useEffect, useRef } from 'react';

// =====================================================================
// 🛡️ MULTI-TIER ROBUST THUMBNAIL ENGINE (NEVER BREAKS GOOGLE DRIVE / CLOUDINARY)
// =====================================================================
function CrewThumbnail({ photoItem, altText, isHero, showOnlyHero }) {
  const extractSources = (item) => {
    let raw = item;
    if (item && typeof item === 'object') {
      raw = item.url || item.secure_url || item.id || item._id || '';
    }

    if (typeof raw === 'string') {
      // Agar direct URL hai (Cloudinary / S3 / External)
      if (raw.startsWith('http://') || raw.startsWith('https://')) {
        return [raw];
      }
      // Agar Google Drive File ID hai - 4 fallback endpoints
      const cleanId = raw.trim();
      return [
        `https://lh3.googleusercontent.com/d/${cleanId}=s600`,
        `https://drive.google.com/thumbnail?id=${cleanId}&sz=w800`,
        `https://drive.google.com/uc?export=view&id=${cleanId}`,
        `https://drive.google.com/uc?export=download&id=${cleanId}`
      ];
    }
    return [''];
  };

  const sources = extractSources(photoItem);
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  const handleError = () => {
    if (currentSrcIndex < sources.length - 1) {
      setCurrentSrcIndex(prev => prev + 1);
    } else {
      setHasFailedAll(true);
    }
  };

  if (hasFailedAll) {
    return (
      <div className="w-full aspect-[4/3] bg-black/40 flex flex-col items-center justify-center p-3 text-gray-500 text-center rounded-xl border border-dashed border-white/20">
        <svg className="w-6 h-6 mb-1 text-red-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="font-brand-mono text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold">Asset Protected</span>
      </div>
    );
  }

  return (
    <img
      src={sources[currentSrcIndex]}
      alt={altText}
      referrerPolicy="no-referrer"
      className={`w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 hover:opacity-100 ${
        !isHero && showOnlyHero ? 'grayscale opacity-40' : ''
      }`}
      loading="lazy"
      onError={handleError}
    />
  );
}

export default function CrewWorkspace({ onLogout }) {
  // ---------------------------------------------------------------------------------
  // 🔐 SECURITY STATE (PASSWORD GATE)
  // ---------------------------------------------------------------------------------
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ---------------------------------------------------------------------------------
  // 🔍 SEARCH & FILTER STATE
  // ---------------------------------------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // ---------------------------------------------------------------------------------
  // 🚀 FEATURE STATE (Status Tracker & Hero Shots) 
  // ---------------------------------------------------------------------------------
  const [projectStatuses, setProjectStatuses] = useState(() => {
    const saved = localStorage.getItem('crew_project_statuses');
    return saved ? JSON.parse(saved) : {};
  });

  const [heroShots, setHeroShots] = useState(() => {
    const saved = localStorage.getItem('crew_hero_shots');
    return saved ? JSON.parse(saved) : {};
  });

  const [showOnlyHero, setShowOnlyHero] = useState(false);

  // ---------------------------------------------------------------------------------
  // 📄 PAGINATION STATE
  // ---------------------------------------------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 50;

  // =================================================================
  // 🔄 REAL-TIME AUTO REFRESH (SYNC CLIENTS AS SOON AS THEY SELECT)
  // =================================================================
  const fetchProjects = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5100';
      const res = await fetch(`${backendUrl}/api/admin/clients`);
      const result = await res.json();

      if (result.success) {
        const readyProjects = result.data.filter(client => {
          const count = client.selectedPhotosCount || 0;
          const arrayLen = Array.isArray(client.selectedPhotos) ? client.selectedPhotos.length : 0;
          return count > 0 || arrayLen > 0;
        });
        setProjects(readyProjects);

        // Agar active project update hua ho toh real-time data sync karein
        if (activeProject) {
          const updatedActive = readyProjects.find(p => p._id === activeProject._id);
          if (updatedActive) {
            setActiveProject(updatedActive);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    // 10-Second Auto-Polling for Real-Time Sync
    const interval = setInterval(() => {
      fetchProjects(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setShowOnlyHero(false);
  }, [activeProject]);

  // =================================================================
  // 🔑 HELPER FUNCTIONS
  // =================================================================
  const getPhotoKey = (photo, index) => {
    if (typeof photo === 'string') return photo;
    if (photo && typeof photo === 'object') return photo._id || photo.id || photo.url || `photo-${index}`;
    return `photo-${index}`;
  };

  const getDownloadUrl = (photo) => {
    if (!photo) return '';
    if (typeof photo === 'object') {
      if (photo.url) return photo.url;
      if (photo.secure_url) return photo.secure_url;
      if (photo.id) photo = photo.id;
    }
    if (typeof photo === 'string') {
      if (photo.startsWith('http://') || photo.startsWith('https://')) {
        return photo;
      }
      return `https://drive.google.com/uc?export=download&id=${photo}`; // removed rogue ^
    }
    return '';
  };

  // =================================================================
  // 🚦 LOGIC: POST-PRODUCTION STATUS TRACKER
  // =================================================================
  const toggleProjectStatus = (e, projectId) => {
    e.stopPropagation();
    const currentStatus = projectStatuses[projectId] || 'Pending';
    let nextStatus = 'Pending';

    if (currentStatus === 'Pending') nextStatus = 'Downloaded';
    else if (currentStatus === 'Downloaded') nextStatus = 'Editing Done';

    const updatedStatuses = { ...projectStatuses, [projectId]: nextStatus };
    setProjectStatuses(updatedStatuses);
    localStorage.setItem('crew_project_statuses', JSON.stringify(updatedStatuses));
  };

  const getStatusUI = (status) => {
    switch (status) {
      case 'Downloaded': return { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', label: '⬇️ In Editing' };
      case 'Editing Done': return { bg: 'bg-green-500/10 text-green-400 border-green-500/30', label: '✅ Done' };
      default: return { bg: 'bg-red-500/10 text-red-400 border-red-500/30', label: '🔴 Pending' };
    }
  };

  // =================================================================
  // ⭐ LOGIC: HERO SHOT HIGHLIGHTER
  // =================================================================
  const toggleHeroShot = (photoIdentifier) => {
    if (!activeProject) return;
    const projectId = activeProject._id;
    const currentProjectHeroes = heroShots[projectId] || [];

    let updatedHeroes;
    if (currentProjectHeroes.includes(photoIdentifier)) {
      updatedHeroes = currentProjectHeroes.filter(id => id !== photoIdentifier);
    } else {
      updatedHeroes = [...currentProjectHeroes, photoIdentifier];
    }

    const newHeroState = { ...heroShots, [projectId]: updatedHeroes };
    setHeroShots(newHeroState);
    localStorage.setItem('crew_hero_shots', JSON.stringify(newHeroState));
  };

  // =================================================================
  // 🗑️ LOGIC: DELETE / NUKE PROJECT
  // =================================================================
  const handleDeleteProject = async () => {
    if (!activeProject) return;
    const confirmDelete = window.confirm(`⚠️ WARNING: Are you sure you want to permanently delete ${activeProject.name}'s project?\n\nThis will remove them from the Workspace entirely.`);

    if (confirmDelete) {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5100';

        const res = await fetch(`${backendUrl}/api/admin/clients/${activeProject._id}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          setProjects(projects.filter(p => p._id !== activeProject._id));
          setActiveProject(null);
          alert(`✅ ${activeProject.name}'s project has been cleared from the system!`);
        } else {
          alert("Failed to delete from database. Check backend connection.");
        }
      } catch (error) {
        console.error("Delete Error:", error);
      }
    }
  };

  // =================================================================
  // 🪄 LOGIC: SMART ASSET RENAMER & DOWNLOAD SCRIPT (.bat)
  // =================================================================
  const generateRenamerScript = () => {
    const targetPhotos = showOnlyHero ? filteredPhotos : photosArray;
    if (!activeProject || targetPhotos.length === 0) return alert("No photos to download!");

    const cleanName = (activeProject.name || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
    const folderName = `${cleanName}_Assets`;

    let batContent = `@echo off\n`;
    batContent += `echo ========================================================\n`;
    batContent += `echo 🚀 GURU VIDEOGRAPHY STUDIO - ASSET DOWNLOADER\n`;
    batContent += `echo ========================================================\n`;
    batContent += `echo Creating Client Folder: ${folderName}...\n`;
    batContent += `mkdir "${folderName}"\n`;
    batContent += `cd "${folderName}"\n\n`;

    targetPhotos.forEach((item, index) => {
      const padIndex = String(index + 1).padStart(3, '0');
      const fileName = `${cleanName}_${padIndex}.jpg`;
      const url = getDownloadUrl(item);
      batContent += `echo [${padIndex}/${targetPhotos.length}] Downloading ${fileName}...\n`;
      batContent += `curl -L -k -s -o "${fileName}" "${url}"\n`;
    });

    batContent += `\necho.\necho ✅ All ${targetPhotos.length} Assets Downloaded and Renamed Successfully!\npause\n`;

    const blob = new Blob([batContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Download_${cleanName}.bat`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 🚀 GRID FILTER & PAGINATION LOGIC
  const photosArray = activeProject?.selectedPhotos || [];
  const projectHeroes = heroShots[activeProject?._id] || [];

  const filteredPhotos = showOnlyHero
    ? photosArray.filter((photo, idx) => projectHeroes.includes(getPhotoKey(photo, idx)))
    : photosArray;

  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);
  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = filteredPhotos.slice(indexOfFirstPhoto, indexOfLastPhoto);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    document.getElementById('editor-grid')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    if (password === 'Aman@1234') {
      setIsUnlocked(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect Crew Password');
      setPassword('');
    }
  };

  // 🚀 CLIENT SEARCH & FILTER LOGIC
  const displayedProjects = projects.filter(project => {
    const matchesSearch = (project.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.eventType || '').toLowerCase().includes(searchTerm.toLowerCase());
    const pStatus = projectStatuses[project._id] || 'Pending';
    const matchesStatus = statusFilter === 'All' ? true : pStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // =================================================================
  // 🚫 SECURITY VIEW (LOCK SCREEN - LUXURY DARK THEME)
  // =================================================================
  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#050505]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-4 selection:bg-[#C5A059] selection:text-white font-sans overflow-hidden">
        
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#C5A059]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#050505] rounded-full blur-[100px]" />
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');
          .font-brand-serif { font-family: 'Playfair Display', serif; }
          .font-brand-sans { font-family: 'Inter', sans-serif; }
        `}</style>

        <div className="bg-[#0a0a0a]/80 p-8 sm:p-12 rounded-[2rem] border border-white/5 shadow-2xl max-w-md w-full relative z-10 text-white backdrop-blur-xl">
          <div className="text-center mb-8 space-y-3">
            <div className="w-16 h-16 bg-[#111] border border-white/10 rounded-full mx-auto flex items-center justify-center mb-4 shadow-inner">
              <svg className="w-8 h-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <span className="font-brand-sans text-[10px] text-[#C5A059] tracking-[0.3em] uppercase block font-bold">
              [AUTHENTICATION REQUIRED]
            </span>
            <h2 className="font-brand-serif text-3xl font-light text-white tracking-tight">Restricted Bay</h2>
            <p className="font-brand-sans text-xs text-gray-500 font-normal">Guru Videography Crew Operations Only</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-5 font-brand-sans text-xs">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Passcode..."
                className={`w-full bg-[#111] border ${authError ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-[#C5A059]'} text-center text-white px-6 py-4 rounded-xl outline-none font-mono font-bold tracking-[0.3em] transition-all shadow-inner placeholder-gray-600`}
                autoFocus
              />
              {authError && <p className="text-red-400 font-mono text-[10px] text-center mt-3 font-semibold uppercase tracking-widest">{authError}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onLogout}
                className="w-1/3 bg-white/5 border border-white/10 text-gray-400 py-4 rounded-xl font-brand-sans font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 bg-[#C5A059] hover:bg-white text-[#050505] py-4 rounded-xl font-brand-sans font-bold uppercase tracking-[0.2em] text-[10px] transition-all shadow-md cursor-pointer"
              >
                Unlock Console ✦
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =================================================================
  // ✅ MAIN WORKSPACE VIEW (UNLOCKED - DARK LUXURY THEME)
  // =================================================================
  return (
    <div className="bg-[#050505] text-white font-sans tracking-tight min-h-[85vh] p-4 sm:p-8 selection:bg-[#C5A059] selection:text-[#050505] relative overflow-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        .font-brand-serif { font-family: 'Playfair Display', serif; }
        .font-brand-sans { font-family: 'Inter', sans-serif; }

        .glass-crew-shell {
          background: rgba(15, 15, 15, 0.7);
          backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.8);
        }

        .custom-crew-input {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          transition: all 0.3s ease;
        }
        .custom-crew-input:focus {
          border-color: #C5A059;
          background: rgba(10, 10, 10, 0.8);
        }

        /* Hide scrollbar for cleaner look */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/10 via-transparent to-transparent rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#C5A059]/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-[100rem] mx-auto glass-crew-shell rounded-[2rem] min-h-[82vh] flex flex-col overflow-hidden relative z-10">

        {/* Top Header */}
        <div className="bg-[#0a0a0a]/80 p-6 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="text-left space-y-1.5">
            <span className="text-[#C5A059] font-brand-sans text-[10px] tracking-[0.3em] uppercase block font-bold">
              DIRECTORIAL POST-PRODUCTION BAY • GURU VIDEOGRAPHY
            </span>
            <h2 className="font-brand-serif text-3xl sm:text-4xl text-white font-light tracking-tight">
              Crew Workspace & <span className="italic text-gray-400">Assets</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => fetchProjects()}
              className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-5 py-3 rounded-xl font-brand-sans font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all cursor-pointer flex items-center gap-2 w-full sm:w-auto justify-center"
              title="Refresh Client Pipeline"
            >
              <span>↻ Sync DB</span>
            </button>
            <button
              onClick={onLogout}
              className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-xl font-brand-sans font-bold tracking-[0.2em] uppercase hover:bg-red-500/20 transition-all cursor-pointer w-full sm:w-auto justify-center"
            >
              Lock Console
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[650px]">

          {/* =========================================================================
              LEFT PANEL: Tracker & Search 
          ========================================================================= */}
          <div className="w-full md:w-1/3 xl:w-1/4 max-w-[400px] border-r border-white/5 bg-black/40 flex flex-col backdrop-blur-md">

            {/* Search & Filters */}
            <div className="p-6 border-b border-white/5 bg-[#0a0a0a]/50 space-y-4 text-left">
              <span className="text-[10px] font-brand-sans font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">
                PRODUCTION PIPELINE ({displayedProjects.length})
              </span>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search client or event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full custom-crew-input rounded-xl py-3 pl-10 pr-4 text-xs font-brand-sans outline-none placeholder-gray-600"
                />
                <svg className="w-4 h-4 text-gray-500 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full custom-crew-input rounded-xl p-3 text-[10px] font-brand-sans font-bold uppercase tracking-[0.2em] outline-none cursor-pointer bg-[#111]"
              >
                <option value="All" className="bg-[#111]">All Projects</option>
                <option value="Pending" className="bg-[#111]">🔴 Pending (To Download)</option>
                <option value="Downloaded" className="bg-[#111]">⬇️ In Editing</option>
                <option value="Editing Done" className="bg-[#111]">✅ Editing Done</option>
              </select>
            </div>

            {/* Project List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {isLoading ? (
                <div className="animate-pulse text-gray-500 font-brand-sans text-xs uppercase tracking-widest pl-2">Syncing pipelines...</div>
              ) : displayedProjects.length === 0 ? (
                <div className="text-gray-500 font-brand-sans text-xs uppercase tracking-widest border border-dashed border-white/10 p-8 rounded-2xl text-center">
                  No ready projects.
                </div>
              ) : (
                displayedProjects.map(project => {
                  const statusUI = getStatusUI(projectStatuses[project._id]);
                  const isSelected = activeProject?._id === project._id;
                  const selectionsCount = project.selectedPhotosCount || project.selectedPhotos?.length || 0;
                  
                  return (
                    <div
                      key={project._id}
                      onClick={() => setActiveProject(project)}
                      className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 text-left ${
                        isSelected
                          ? 'bg-[#111] border-[#C5A059] ring-1 ring-[#C5A059]/30 shadow-lg'
                          : 'bg-white/5 border-white/5 hover:border-[#C5A059]/40 hover:bg-white/10 shadow-sm'
                      }`}
                    >
                      <h4 className={`font-brand-serif font-light text-xl mb-1 truncate ${isSelected ? 'text-[#C5A059]' : 'text-white'}`}>
                        {project.name}
                      </h4>
                      <p className="text-gray-500 font-brand-sans font-bold text-[9px] uppercase tracking-[0.2em] truncate">{project.eventType}</p>

                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                        <span className="text-[10px] font-brand-sans uppercase tracking-widest text-gray-400">
                          Assets: <strong className="text-white font-bold">{selectionsCount}</strong>
                        </span>
                        <button
                          onClick={(e) => toggleProjectStatus(e, project._id)}
                          className={`text-[9px] font-brand-sans font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${statusUI.bg} hover:brightness-110 transition-all cursor-pointer`}
                        >
                          {statusUI.label}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* =========================================================================
              RIGHT PANEL: Asset Grid & Smart Script 
          ========================================================================= */}
          <div id="editor-grid" className="flex-1 bg-transparent overflow-y-auto relative p-6 md:p-10 text-left no-scrollbar">
            {!activeProject ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 space-y-4 p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-[#111] border border-white/5 flex items-center justify-center text-gray-400 shadow-inner">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <p className="font-brand-sans tracking-[0.2em] text-[10px] uppercase font-bold text-gray-600 max-w-xs">
                  Select a client project from the pipeline to begin downloading and curation
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-full space-y-6">

                {/* Active Project Toolbar */}
                <div className="flex flex-col 2xl:flex-row justify-between items-start 2xl:items-center bg-black/40 border border-white/10 p-6 md:p-8 rounded-[2rem] gap-6 backdrop-blur-md">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-4">
                      <h3 className="font-brand-serif text-3xl font-light text-white tracking-tight">
                        {activeProject.name}
                      </h3>

                      <button
                        onClick={handleDeleteProject}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[9px] font-brand-sans uppercase font-bold tracking-[0.2em] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Clear this project from system once done"
                      >
                        Purge Project
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 pt-2">
                      <p className="font-brand-sans text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                        Selected Assets: <span className="text-white text-sm">{photosArray.length}</span>
                      </p>

                      <button
                        onClick={() => setShowOnlyHero(!showOnlyHero)}
                        className={`text-[9px] font-brand-sans px-4 py-1.5 uppercase tracking-[0.2em] rounded-full border transition-all cursor-pointer font-bold ${
                          showOnlyHero
                            ? 'bg-[#C5A059] text-[#050505] border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.3)]'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                        }`}
                      >
                        ⭐ {showOnlyHero ? 'Showing Hero Shots' : `Filter Hero Shots (${projectHeroes.length})`}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={generateRenamerScript}
                    disabled={filteredPhotos.length === 0}
                    className="w-full 2xl:w-auto bg-[#C5A059] hover:bg-white disabled:bg-white/5 disabled:text-gray-600 disabled:border-white/5 text-[#050505] px-6 py-4 rounded-xl text-[10px] font-brand-sans font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg disabled:shadow-none"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    {filteredPhotos.length > 0 ? `Download Script (.bat)` : 'No Assets'}
                  </button>
                </div>

                {/* Grid View */}
                {filteredPhotos.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10 border border-dashed border-white/10 p-16 rounded-[2rem] font-brand-sans text-[10px] uppercase tracking-[0.2em] font-bold">
                    {showOnlyHero ? 'No Hero Shots marked yet for this project. Toggle filter to view all assets.' : 'No photo selections found.'}
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center px-2">
                      <span className="text-[10px] font-brand-sans text-[#C5A059] uppercase tracking-[0.2em] font-bold">
                        Page {currentPage} of {totalPages}
                      </span>
                      <span className="text-[10px] font-brand-sans text-gray-500 uppercase tracking-[0.2em] font-bold">
                        Displaying {indexOfFirstPhoto + 1} - {Math.min(indexOfLastPhoto, filteredPhotos.length)} Assets
                      </span>
                    </div>

                    <div className="columns-2 md:columns-3 xl:columns-4 gap-5 space-y-5 mb-8">
                      {currentPhotos.map((photoItem, index) => {
                        const photoKey = getPhotoKey(photoItem, index);
                        const isHero = projectHeroes.includes(photoKey);

                        return (
                          <div
                            key={photoKey}
                            className={`relative group rounded-2xl overflow-hidden border transition-all duration-500 break-inside-avoid bg-[#111] shadow-lg ${
                              isHero ? 'border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.2)]' : 'border-white/5'
                            }`}
                          >
                            <CrewThumbnail
                              photoItem={photoItem}
                              altText={`Client Selected Asset ${index + 1}`}
                              isHero={isHero}
                              showOnlyHero={showOnlyHero}
                            />

                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[9px] px-2.5 py-1 rounded-full font-brand-sans font-bold tracking-widest border border-white/10 shadow-sm pointer-events-none">
                              #{indexOfFirstPhoto + index + 1}
                            </div>

                            <button
                              onClick={() => toggleHeroShot(photoKey)}
                              className={`absolute top-3 right-3 backdrop-blur-md p-2 rounded-full border transition-all shadow-md cursor-pointer z-10 ${
                                isHero ? 'bg-[#C5A059] border-[#C5A059] scale-110' : 'bg-black/60 border-white/20 hover:bg-white/10 hover:border-white'
                              }`}
                              title="Toggle Hero Shot"
                            >
                              <svg className={`w-4 h-4 ${isHero ? 'text-[#050505] fill-[#050505]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-auto pt-8 border-t border-white/10 flex flex-wrap justify-center items-center gap-3 pb-4">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-5 py-3 bg-white/5 border border-white/10 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-[9px] font-brand-sans font-bold tracking-[0.2em] uppercase cursor-pointer transition-colors"
                        >
                          Prev
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                          const p = i + 1;
                          if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                            return (
                              <button
                                key={p}
                                onClick={() => paginate(p)}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl font-brand-sans font-bold text-[10px] border transition-all cursor-pointer ${
                                  currentPage === p
                                    ? 'bg-[#C5A059] text-[#050505] border-[#C5A059] shadow-md'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                  }`}
                              >
                                {p}
                              </button>
                            );
                          }
                          if (p === currentPage - 2 || p === currentPage + 2) return <span key={p} className="text-gray-600 px-1 font-brand-sans font-bold text-[10px]">...</span>;
                          return null;
                        })}

                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-5 py-3 bg-white/5 border border-white/10 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-[9px] font-brand-sans font-bold tracking-[0.2em] uppercase cursor-pointer transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}