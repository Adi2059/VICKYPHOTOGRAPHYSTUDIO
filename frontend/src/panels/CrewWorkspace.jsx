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
      <div className="w-full aspect-[4/3] bg-stone-100 flex flex-col items-center justify-center p-3 text-stone-400 text-center rounded-xl border border-dashed border-stone-300">
        <svg className="w-6 h-6 mb-1 text-amber-700/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="font-brand-mono text-[9px] uppercase tracking-wider text-stone-500">Asset Protected</span>
      </div>
    );
  }

  return (
    <img
      src={sources[currentSrcIndex]}
      alt={altText}
      referrerPolicy="no-referrer"
      className={`w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 ${!isHero && showOnlyHero ? 'grayscale' : ''
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
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'localhost 5100';
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
      return `https://drive.google.com/uc?export=download^&id=${photo}`;
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
      case 'Downloaded': return { bg: 'bg-blue-50 text-blue-900 border-blue-200', label: '⬇️ In Editing' };
      case 'Editing Done': return { bg: 'bg-emerald-50 text-emerald-900 border-emerald-200', label: '✅ Done' };
      default: return { bg: 'bg-rose-50 text-rose-900 border-rose-200', label: '🔴 Pending' };
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
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'localhost 5100';

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
    batContent += `echo 🚀 GURU VIDEOGRAPHY (AMAN KUMAR) - ASSET DOWNLOADER\n`;
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
  // 🚫 SECURITY VIEW (LOCK SCREEN - LIGHT LUXURY THEME)
  // =================================================================
  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-[9999] bg-stone-950/80 backdrop-blur-xl flex flex-col items-center justify-center p-4 selection:bg-amber-100 selection:text-amber-900 font-sans">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600&display=swap');
          .font-brand-cinzel { font-family: 'Cinzel', Georgia, serif; }
          .font-brand-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
          .font-brand-mono { font-family: 'Space Grotesk', monospace; }
        `}</style>

        <div className="bg-[#FAF8F5] p-8 sm:p-11 rounded-3xl border border-amber-200/90 shadow-2xl max-w-md w-full relative overflow-hidden text-stone-900">
          <div className="text-center mb-6 relative z-10 space-y-2">
            <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-2xs">
              <svg className="w-7 h-7 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <span className="font-brand-mono text-[9.5px] text-amber-800 tracking-[0.3em] uppercase block font-bold">
              [AUTHENTICATION REQUIRED]
            </span>
            <h2 className="font-brand-cinzel text-3xl font-bold text-stone-950 tracking-tight">Restricted Console</h2>
            <p className="font-brand-sans text-xs text-stone-500 font-normal">Guru Videography Crew Operations Only</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4 relative z-10 font-brand-sans text-xs">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Crew Security Passcode"
                className={`w-full bg-white border ${authError ? 'border-rose-400 focus:border-rose-600' : 'border-stone-300 focus:border-amber-700'} text-center text-stone-900 px-5 py-3.5 rounded-xl outline-none font-brand-mono font-bold tracking-widest transition-all shadow-2xs`}
                autoFocus
              />
              {authError && <p className="text-rose-700 font-brand-mono text-[11px] text-center mt-2 font-semibold">{authError}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onLogout}
                className="w-1/3 bg-stone-200 text-stone-700 py-3.5 rounded-xl font-brand-sans font-bold uppercase tracking-wider text-xs hover:bg-stone-300 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 bg-stone-950 hover:bg-amber-800 text-white py-3.5 rounded-xl font-brand-sans font-bold uppercase tracking-widest text-xs transition-all shadow-md cursor-pointer"
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
  // ✅ MAIN WORKSPACE VIEW (UNLOCKED - LIGHT LUXURY THEME)
  // =================================================================
  return (
    <div className="bg-[#FAF8F5] text-stone-900 font-sans tracking-tight min-h-[85vh] p-4 sm:p-8 selection:bg-amber-100 selection:text-amber-900 relative overflow-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .font-brand-cinzel { font-family: 'Cinzel', Georgia, serif; }
        .font-brand-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-brand-mono { font-family: 'Space Grotesk', monospace; }

        .glass-crew-shell {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(217, 119, 6, 0.2);
          box-shadow: 0 30px 70px -15px rgba(120, 53, 15, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.9);
        }

        .custom-crew-input {
          background: #ffffff;
          border: 1px solid rgba(214, 211, 209, 0.9);
          color: #1c1917;
          transition: all 0.25s ease;
        }
        .custom-crew-input:focus {
          border-color: #b45309;
          box-shadow: 0 0 0 3px rgba(180, 83, 9, 0.12);
        }
      `}</style>

      {/* Background Ambience */}
      <div className="absolute -top-32 -left-32 w-[700px] h-[700px] bg-gradient-to-br from-amber-200/30 via-rose-100/30 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 -right-36 w-[700px] h-[700px] bg-gradient-to-bl from-rose-100/30 via-amber-100/30 to-transparent rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto glass-crew-shell rounded-3xl min-h-[82vh] flex flex-col overflow-hidden relative z-10">

        {/* Top Header */}
        <div className="bg-white/80 p-5 sm:p-7 border-b border-stone-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-left space-y-0.5">
            <span className="text-amber-800 font-brand-mono text-[10px] tracking-[0.3em] uppercase block font-bold">
              DIRECTORIAL POST-PRODUCTION BAY • GURU VIDEOGRAPHY
            </span>
            <h2 className="font-brand-cinzel text-2xl sm:text-3xl text-stone-950 font-bold tracking-tight">
              Crew Workspace & Asset Management
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchProjects()}
              className="text-xs bg-white border border-stone-200 text-stone-700 px-4 py-2.5 rounded-full font-brand-sans font-semibold hover:bg-stone-50 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              title="Refresh Client Pipeline"
            >
              <span>↻ Sync</span>
            </button>
            <button
              onClick={onLogout}
              className="text-xs bg-rose-50 border border-rose-200 text-rose-800 px-6 py-2.5 rounded-full font-brand-sans font-bold tracking-widest uppercase hover:bg-rose-100 transition-all cursor-pointer shadow-2xs"
            >
              Lock & Exit
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[580px]">

          {/* LEFT PANEL: Tracker & Search */}
          <div className="w-full md:w-1/3 max-w-[340px] border-r border-stone-200 bg-stone-50/70 flex flex-col">

            {/* Search & Filters */}
            <div className="p-4 border-b border-stone-200 bg-white/60 space-y-2.5 text-left">
              <span className="text-[10px] font-brand-mono font-bold text-amber-800 uppercase tracking-widest block">
                PRODUCTION PIPELINE ({displayedProjects.length})
              </span>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search client or event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full custom-crew-input rounded-xl py-2 pl-9 pr-3 text-xs outline-none"
                />
                <svg className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full custom-crew-input rounded-xl p-2 text-xs font-brand-sans font-semibold uppercase tracking-wider outline-none cursor-pointer"
              >
                <option value="All">All Projects</option>
                <option value="Pending">🔴 Pending (To Download)</option>
                <option value="Downloaded">⬇️ In Editing</option>
                <option value="Editing Done">✅ Editing Done</option>
              </select>
            </div>

            {/* Project List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoading ? (
                <div className="animate-pulse text-stone-500 font-brand-mono text-xs pl-2">Syncing client databases...</div>
              ) : displayedProjects.length === 0 ? (
                <div className="text-stone-500 font-brand-sans text-xs italic border border-dashed border-stone-300 p-6 rounded-2xl text-center">
                  No ready client projects with selections found.
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
                      className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 text-left ${isSelected
                          ? 'bg-white border-amber-600 ring-2 ring-amber-500/20 shadow-md -translate-y-0.5'
                          : 'bg-white border-stone-200/90 hover:border-amber-600/40 hover:bg-white shadow-2xs'
                        }`}
                    >
                      <h4 className={`font-brand-cinzel font-bold text-base mb-0.5 truncate ${isSelected ? 'text-amber-900' : 'text-stone-950'
                        }`}>
                        {project.name}
                      </h4>
                      <p className="text-stone-500 font-brand-mono text-[9.5px] uppercase tracking-wider truncate">{project.eventType}</p>

                      <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-stone-100">
                        <span className="text-[11px] font-brand-mono text-stone-600">
                          Selected: <strong className="text-stone-900 font-bold">{selectionsCount}</strong>
                        </span>
                        <button
                          onClick={(e) => toggleProjectStatus(e, project._id)}
                          className={`text-[9px] font-brand-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusUI.bg} hover:brightness-95 transition-all cursor-pointer`}
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

          {/* RIGHT PANEL: Asset Grid & Smart Script */}
          <div id="editor-grid" className="flex-1 bg-white overflow-y-auto relative p-4 md:p-6 text-left">
            {!activeProject ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 space-y-3 p-6 text-center">
                <div className="w-16 h-16 rounded-3xl bg-stone-100 flex items-center justify-center text-stone-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <p className="font-brand-mono tracking-widest text-xs uppercase font-semibold">
                  Select a client project from the pipeline to begin downloading and curation
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-full space-y-5">

                {/* Active Project Toolbar */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-stone-50 border border-stone-200 p-4 sm:p-5 rounded-2xl gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-brand-cinzel text-2xl font-bold text-stone-950 tracking-wide">
                        {activeProject.name}
                      </h3>

                      <button
                        onClick={handleDeleteProject}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-brand-sans uppercase font-bold tracking-widest px-3 py-1 rounded-lg transition-colors cursor-pointer"
                        title="Clear this project from system once done"
                      >
                        Delete Project
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <p className="font-brand-mono text-xs text-stone-600">
                        Selected Assets: <span className="text-stone-950 font-bold">{photosArray.length}</span>
                      </p>

                      <button
                        onClick={() => setShowOnlyHero(!showOnlyHero)}
                        className={`text-[10px] font-brand-sans px-3.5 py-1 uppercase rounded-full border transition-all cursor-pointer font-semibold ${showOnlyHero
                            ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                            : 'bg-white text-stone-600 border-stone-300 hover:text-stone-950'
                          }`}
                      >
                        ⭐ {showOnlyHero ? 'Showing Hero Shots' : `Filter Hero Shots (${projectHeroes.length})`}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={generateRenamerScript}
                    disabled={filteredPhotos.length === 0}
                    className="bg-stone-950 hover:bg-amber-800 disabled:bg-stone-200 disabled:text-stone-400 text-white px-5 py-3 rounded-xl text-xs font-brand-sans font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    {filteredPhotos.length > 0 ? `Download Asset Script (.bat)` : 'No Assets'}
                  </button>
                </div>

                {/* Grid View */}
                {filteredPhotos.length === 0 ? (
                  <div className="text-center text-stone-400 mt-10 border border-dashed border-stone-300 p-12 rounded-2xl font-brand-sans text-xs">
                    {showOnlyHero ? 'No Hero Shots marked yet for this project. Toggle filter to view all assets.' : 'No photo selections found.'}
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[11px] font-brand-mono text-stone-500 uppercase tracking-wider font-bold">
                        Page {currentPage} of {totalPages}
                      </span>
                      <span className="text-[11px] font-brand-mono text-stone-500">
                        Displaying {indexOfFirstPhoto + 1} - {Math.min(indexOfLastPhoto, filteredPhotos.length)} Assets
                      </span>
                    </div>

                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mb-6">
                      {currentPhotos.map((photoItem, index) => {
                        const photoKey = getPhotoKey(photoItem, index);
                        const isHero = projectHeroes.includes(photoKey);

                        return (
                          <div
                            key={photoKey}
                            className={`relative group rounded-xl overflow-hidden border transition-all duration-300 break-inside-avoid bg-stone-100 shadow-xs ${isHero ? 'border-amber-600 ring-2 ring-amber-500/30' : 'border-stone-200'
                              }`}
                          >
                            <CrewThumbnail
                              photoItem={photoItem}
                              altText={`Client Selected Asset ${index + 1}`}
                              isHero={isHero}
                              showOnlyHero={showOnlyHero}
                            />

                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md text-stone-900 text-[10px] px-2 py-0.5 rounded-full font-brand-mono font-bold border border-stone-200 shadow-xs pointer-events-none">
                              #{indexOfFirstPhoto + index + 1}
                            </div>

                            <button
                              onClick={() => toggleHeroShot(photoKey)}
                              className="absolute top-2 right-2 bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-stone-200 hover:scale-110 transition-transform shadow-xs cursor-pointer z-10"
                              title="Toggle Hero Shot"
                            >
                              <svg className={`w-4 h-4 ${isHero ? 'text-amber-600 fill-amber-600' : 'text-stone-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-auto pt-6 border-t border-stone-200 flex flex-wrap justify-center items-center gap-2 pb-2">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-white border border-stone-300 text-stone-800 rounded-xl disabled:opacity-30 hover:bg-stone-50 text-xs font-brand-sans font-bold uppercase cursor-pointer"
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
                                className={`w-9 h-9 flex items-center justify-center rounded-xl font-brand-mono font-bold text-xs border transition-all cursor-pointer ${currentPage === p
                                    ? 'bg-stone-950 text-white border-stone-950 shadow-xs'
                                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                                  }`}
                              >
                                {p}
                              </button>
                            );
                          }
                          if (p === currentPage - 2 || p === currentPage + 2) return <span key={p} className="text-stone-400 px-1 font-brand-mono text-xs">...</span>;
                          return null;
                        })}

                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-white border border-stone-300 text-stone-800 rounded-xl disabled:opacity-30 hover:bg-stone-50 text-xs font-brand-sans font-bold uppercase cursor-pointer"
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