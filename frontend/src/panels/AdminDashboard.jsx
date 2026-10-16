import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ onLogout }) {
  // 🎛️ Navigation State
  const [activeTab, setActiveTab] = useState('vault');

  // 🗄️ Database States
  const [clients, setClients] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [crewStatuses, setCrewStatuses] = useState({});

  // 📝 Vault Form State
  const [newClient, setNewClient] = useState({
    name: '', eventType: 'Wedding', driveLink: '', pin: '', deadlineDate: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editClientId, setEditClientId] = useState(null);

  // 🔎 CRM Search & Filter State
  const [crmSearch, setCrmSearch] = useState('');
  const [crmFilter, setCrmFilter] = useState('All');

  // 🤵 Offline CRM Form State
  const [showCrmModal, setShowCrmModal] = useState(false);
  const [offlineClient, setOfflineClient] = useState({
    name: '', eventType: 'Wedding', totalAmount: '', paidAmount: ''
  });

  // ---------------------------------------------------------------------------------
  // 🚀 DATA FETCHING & PERSISTENCE LOGIC
  // ---------------------------------------------------------------------------------
  const loadData = async () => {
    setIsLoading(true);
    let backendClients = [];

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'localhost 5100';

      const res = await fetch(`${backendUrl}/api/admin/clients`);
      const data = await res.json();
      if (data.success) backendClients = data.data;
    } catch (error) {
      backendClients = [
        { _id: '101', name: 'Rahul & Sneha (Lucknow)', eventType: 'Wedding', driveLink: 'https://drive.google.com', pin: '4921', selectedPhotosCount: 45, deadlineDate: '2026-07-30' },
        { _id: '102', name: 'Vikas Kumar (Amanigunj)', eventType: 'Pre-Wedding', driveLink: 'https://drive.google.com', pin: '8392', selectedPhotosCount: 150, deadlineDate: '2026-07-25' }
      ];
    }

    // Load Local Vaults, Offline Clients and Financials
    const localVaults = JSON.parse(localStorage.getItem('saved_vault_clients') || '[]');
    const offlineClients = JSON.parse(localStorage.getItem('crm_offline_clients') || '[]');
    const savedFinancials = JSON.parse(localStorage.getItem('crm_financials') || '{}');

    // Combine all without duplicates
    const allClientsMap = new Map();
    [...backendClients, ...localVaults, ...offlineClients].forEach(c => {
      allClientsMap.set(c._id, c);
    });

    const combinedClients = Array.from(allClientsMap.values()).map(client => {
      const finance = savedFinancials[client._id] || { totalAmount: 0, paidAmount: 0, financialStatus: 'Lead' };
      return { ...client, ...finance };
    });

    setClients(combinedClients);
    setIsLoading(false);
  };

  const fetchBookings = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'localhost 5100';

      const res = await fetch(`${backendUrl}/api/admin/bookings`);
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch (error) {
      setBookings([{ _id: '1', name: 'Vikram Singh (Amanigunj)', phone: '09219497519', eventDate: '2026-11-14', serviceType: 'Premium Wedding Package', status: 'New Lead' }]);
    }
  };

  const syncCrewStatus = () => {
    const saved = localStorage.getItem('crew_project_statuses');
    if (saved) setCrewStatuses(JSON.parse(saved));
  };

  useEffect(() => {
    loadData();
    fetchBookings();
    syncCrewStatus();
    const interval = setInterval(syncCrewStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------------------------------------------
  // 💰 SMART PAYMENT UPDATER 
  // ---------------------------------------------------------------------------------
  const updatePayment = (id, field, value) => {
    const val = Number(value);
    setClients(prevClients => {
      const updatedClients = prevClients.map(c => {
        if (c._id === id) {
          const updated = { ...c, [field]: val };

          if (updated.paidAmount >= updated.totalAmount && updated.totalAmount > 0) {
            updated.financialStatus = 'Full Payment';
          } else if (updated.paidAmount > 0) {
            updated.financialStatus = 'Advance Received';
          } else {
            updated.financialStatus = 'Lead';
          }

          const storedFinancials = JSON.parse(localStorage.getItem('crm_financials') || '{}');
          storedFinancials[id] = { totalAmount: updated.totalAmount, paidAmount: updated.paidAmount, financialStatus: updated.financialStatus };
          localStorage.setItem('crm_financials', JSON.stringify(storedFinancials));

          if (id.toString().startsWith('offline_')) {
            const offlineClients = JSON.parse(localStorage.getItem('crm_offline_clients') || '[]');
            const newOffline = offlineClients.map(off => off._id === id ? updated : off);
            localStorage.setItem('crm_offline_clients', JSON.stringify(newOffline));
          }

          return updated;
        }
        return c;
      });
      return updatedClients;
    });
  };

  // ---------------------------------------------------------------------------------
  // 🤵 UNIVERSAL DELETE & OFFLINE CRM LOGIC
  // ---------------------------------------------------------------------------------
  const handleSaveOfflineClient = (e) => {
    e.preventDefault();
    const newId = `offline_${Date.now()}`;
    const newClientData = { _id: newId, name: offlineClient.name, eventType: offlineClient.eventType, isOffline: true };
    const offlineClients = JSON.parse(localStorage.getItem('crm_offline_clients') || '[]');
    localStorage.setItem('crm_offline_clients', JSON.stringify([...offlineClients, newClientData]));

    const storedFinancials = JSON.parse(localStorage.getItem('crm_financials') || '{}');
    storedFinancials[newId] = { totalAmount: Number(offlineClient.totalAmount) || 0, paidAmount: Number(offlineClient.paidAmount) || 0, financialStatus: Number(offlineClient.paidAmount) > 0 ? 'Advance Received' : 'Lead' };
    localStorage.setItem('crm_financials', JSON.stringify(storedFinancials));

    loadData();
    setShowCrmModal(false);
    setOfflineClient({ name: '', eventType: 'Wedding', totalAmount: '', paidAmount: '' });
  };

  const handleDeleteClient = async (id, name, isOffline) => {
    if (window.confirm(`⚠️ Permanently delete ${name}'s records? This action cannot be undone.`)) {
      if (isOffline) {
        const offlineClients = JSON.parse(localStorage.getItem('crm_offline_clients') || '[]');
        localStorage.setItem('crm_offline_clients', JSON.stringify(offlineClients.filter(c => c._id !== id)));
        setClients(clients.filter(c => c._id !== id));
      } else {
        try {
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'localhost 5100';

          const response = await fetch(`${backendUrl}/api/admin/clients/${id}`, {
            method: 'DELETE'
          });
          const data = await response.json();

          if (data.success) {
            const localVaults = JSON.parse(localStorage.getItem('saved_vault_clients') || '[]');
            localStorage.setItem('saved_vault_clients', JSON.stringify(localVaults.filter(c => c._id !== id)));
            setClients(clients.filter(c => c._id !== id));
          } else {
            alert("Delete failed: " + data.message);
          }
        } catch (error) {
          console.error("Delete Error:", error);
          alert("⚠️ Backend server offline hai, delete nahi ho paaya.");
        }
      }

      const storedFinancials = JSON.parse(localStorage.getItem('crm_financials') || '{}');
      delete storedFinancials[id];
      localStorage.setItem('crm_financials', JSON.stringify(storedFinancials));
    }
  };

  // ---------------------------------------------------------------------------------
  // 📂 VAULT / PORTAL CREATION & PERSISTENCE
  // ---------------------------------------------------------------------------------
  const handleSaveVault = async (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.driveLink || !newClient.pin || !newClient.deadlineDate) {
      return alert("Bhai, saari details aur deadline date fill karna zaroori hai!");
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'localhost 5100';

      const url = isEditing
        ? `${backendUrl}/api/admin/clients/${editClientId}`
        : `${backendUrl}/api/admin/clients`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });

      const data = await response.json();

      if (data.success) {
        alert(isEditing ? "Vault Updated Successfully in Database!" : "New Portal Created & Secured in Database!");
        setNewClient({ name: '', eventType: 'Wedding', driveLink: '', pin: '', deadlineDate: '' });
        setIsEditing(false);
        setEditClientId(null);
        loadData();
      } else {
        alert("Database Error: " + data.message);
      }
    } catch (error) {
      console.error("Backend Save Error:", error);
      alert("⚠️ Backend Server se connect nahi ho paaya! Node.js server chal raha hai?");
    }
  };

  const handleEditClick = (client) => {
    setNewClient({
      name: client.name, eventType: client.eventType, driveLink: client.driveLink, pin: client.pin, deadlineDate: client.deadlineDate || ''
    });
    setIsEditing(true);
    setEditClientId(client._id);
  };

  const handleUpdateLeadStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
  };

  const filteredCrmClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(crmSearch.toLowerCase());
    const matchesFilter = crmFilter === 'All' ? true : crmFilter === 'CrewDone' ? crewStatuses[c._id] === 'Editing Done' : c.financialStatus === crmFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-[#050505] text-white font-sans w-full min-h-screen p-4 sm:p-8 md:p-12 selection:bg-[#C5A059] selection:text-[#050505] relative overflow-hidden">

      {/* 🔮 STYLES & LUXURY DARK THEME DEFINITIONS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        .font-brand-serif { font-family: 'Playfair Display', serif; }
        .font-brand-sans { font-family: 'Inter', sans-serif; }

        .glass-admin-shell {
          background: rgba(15, 15, 15, 0.6);
          backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.8);
        }

        .glass-admin-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
        }

        .custom-admin-input {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          transition: all 0.3s ease;
        }
        .custom-admin-input:focus {
          border-color: #C5A059;
          background: rgba(10, 10, 10, 0.8);
          box-shadow: 0 0 0 1px rgba(197, 160, 89, 0.2);
        }
        
        /* Date picker icon inversion for dark mode */
        .color-scheme-dark {
          color-scheme: dark;
        }
      `}</style>

      {/* Background Cinematic Texture & Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/10 via-transparent to-transparent rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-0 w-[80vw] h-[50vw] bg-[#C5A059]/5 blur-[150px] rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Main Spanning Container instead of narrow boxed-in look */}
      <div className="max-w-[100rem] mx-auto w-full glass-admin-shell rounded-[2rem] min-h-[88vh] overflow-hidden relative z-10 flex flex-col">

        {/* 👑 EXECUTIVE CONSOLE HEADER */}
        <div className="bg-[#0a0a0a]/80 p-8 md:p-10 border-b border-white/5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="text-left space-y-1.5">
            <span className="text-[#C5A059] font-brand-sans text-[10px] tracking-[0.3em] uppercase block font-bold">
              Directorial Executive Suite • Vicky Studio
            </span>
            <h2 className="font-brand-serif text-3xl md:text-5xl text-white tracking-tight font-light">
              Command <span className="italic text-gray-400">Center.</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="flex bg-[#111] p-1.5 rounded-xl border border-white/10 w-full sm:w-auto overflow-x-auto shadow-inner">
              <button
                onClick={() => setActiveTab('crm')}
                className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-xs font-brand-sans font-bold uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'crm'
                  ? 'bg-[#C5A059] text-[#050505] shadow-lg'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                📊 CRM & Accounts
              </button>
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-xs font-brand-sans font-bold uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'inquiries'
                  ? 'bg-[#C5A059] text-[#050505] shadow-lg'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                ⚡ Live Inquiries
              </button>
              <button
                onClick={() => setActiveTab('vault')}
                className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-xs font-brand-sans font-bold uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'vault'
                  ? 'bg-[#C5A059] text-[#050505] shadow-lg'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                📂 Client Vaults
              </button>
            </div>

            <button
              onClick={onLogout}
              className="w-full sm:w-auto text-xs uppercase font-brand-sans font-bold tracking-widest bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-all cursor-pointer whitespace-nowrap"
            >
              Exit Console
            </button>
          </div>
        </div>

        {/* =========================================================
            TAB 1: CRM & ACCOUNTS
        ========================================================= */}
        {activeTab === 'crm' && (
          <div className="p-8 md:p-10 flex-1 flex flex-col space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="text-left">
                <span className="font-brand-sans text-[10px] font-bold text-gray-500 tracking-widest uppercase block mb-1">Ledger Records</span>
                <h3 className="font-brand-serif text-3xl font-light text-white">Client Financial Master</h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search client records..."
                    value={crmSearch}
                    onChange={(e) => setCrmSearch(e.target.value)}
                    className="w-full sm:w-72 custom-admin-input rounded-xl py-3 pl-10 pr-4 text-xs outline-none placeholder-gray-500"
                  />
                  <svg className="w-4 h-4 text-gray-500 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>

                <select
                  value={crmFilter}
                  onChange={(e) => setCrmFilter(e.target.value)}
                  className="w-full sm:w-auto custom-admin-input bg-[#111] rounded-xl p-3 text-[10px] font-brand-sans font-bold uppercase tracking-widest outline-none cursor-pointer"
                >
                  <option value="All">All Clients</option>
                  <option value="Hot Lead">🔥 Hot Leads</option>
                  <option value="Advance Received">💸 Advance Received</option>
                  <option value="Full Payment">✅ Full Payment</option>
                  <option value="CrewDone">🎬 Crew Editing Done</option>
                </select>

                <button
                  onClick={() => setShowCrmModal(true)}
                  className="w-full sm:w-auto bg-[#C5A059] hover:bg-white text-[#050505] px-6 py-3 rounded-xl text-[10px] font-brand-sans font-bold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                >
                  + Offline Client
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto pr-2 no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCrmClients.map(client => {
                  const total = client.totalAmount || 0;
                  const paid = client.paidAmount || 0;
                  const percent = total > 0 ? Math.min(Math.round((paid / total) * 100), 100) : 0;
                  const cStatus = crewStatuses[client._id] || 'Pending';
                  
                  // Dark mode optimized status colors
                  const cColor = cStatus === 'Editing Done'
                    ? 'text-green-400 border-green-500/30 bg-green-500/10'
                    : cStatus === 'Downloaded'
                      ? 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                      : 'text-gray-400 border-white/10 bg-white/5';

                  return (
                    <div key={client._id} className="glass-admin-card rounded-2xl p-7 transition-all duration-300 flex flex-col justify-between hover:border-[#C5A059]/40 relative group text-left">

                      <button
                        onClick={() => handleDeleteClient(client._id, client.name, client.isOffline)}
                        className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 p-2 rounded-lg cursor-pointer"
                        title="Delete Client"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>

                      <div className="mb-6">
                        <h4 className="font-brand-serif text-2xl font-light text-white pr-10 truncate">{client.name}</h4>
                        <div className="flex gap-2 mt-2">
                          <span className="text-[9px] font-brand-sans font-bold text-gray-300 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-full border border-white/10">{client.eventType}</span>
                          {client.isOffline && <span className="text-[9px] font-brand-sans font-bold text-purple-300 uppercase tracking-widest bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">Offline Walkin</span>}
                        </div>
                      </div>

                      <div className="space-y-4 bg-black/40 p-5 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">Total Deal (₹)</span>
                          <input
                            type="number"
                            value={total || ''}
                            onChange={(e) => updatePayment(client._id, 'totalAmount', e.target.value)}
                            placeholder="0"
                            className="bg-transparent border-b border-white/10 focus:border-[#C5A059] text-right text-white font-brand-sans text-sm font-bold w-28 outline-none transition-colors"
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">Received (₹)</span>
                          <input
                            type="number"
                            value={paid || ''}
                            onChange={(e) => updatePayment(client._id, 'paidAmount', e.target.value)}
                            placeholder="0"
                            className="bg-transparent border-b border-white/10 focus:border-green-400 text-right text-green-400 font-brand-sans text-sm font-bold w-28 outline-none transition-colors"
                          />
                        </div>

                        <div className="pt-2">
                          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-1.5 rounded-full transition-all duration-700 ${percent === 100 ? 'bg-green-400' : 'bg-[#C5A059]'}`} style={{ width: `${percent}%` }}></div>
                          </div>
                          <div className="flex justify-between text-[9px] font-brand-sans font-bold mt-2 uppercase tracking-widest">
                            <span className="text-gray-400">Pending: ₹{Math.max(total - paid, 0).toLocaleString()}</span>
                            <span className={percent === 100 ? 'text-green-400' : 'text-[#C5A059]'}>{percent}% Settled</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex justify-between items-center border-t border-white/10 pt-4">
                        <span className={`text-[9px] font-brand-sans font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${
                          client.financialStatus === 'Full Payment' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                          client.financialStatus === 'Advance Received' ? 'bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30' : 
                          'bg-white/5 text-gray-400 border border-white/10'
                          }`}>
                          {client.financialStatus || 'Lead'}
                        </span>

                        {!client.isOffline ? (
                          <div className={`text-[9px] font-brand-sans font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${cColor}`}>
                            Crew: {cStatus}
                          </div>
                        ) : (
                          <span className="text-[9px] font-brand-sans font-bold text-gray-500 uppercase tracking-widest">Offline Client</span>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 🤵 MODAL: ADD OFFLINE CLIENT */}
        {showCrmModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl relative text-left">
              <span className="text-[9px] font-brand-sans uppercase tracking-widest text-[#C5A059] font-bold block mb-2">Direct Studio Walkin</span>
              <h3 className="font-brand-serif text-3xl text-white font-light mb-8">Create Offline Client</h3>

              <form onSubmit={handleSaveOfflineClient} className="space-y-5 font-brand-sans text-xs">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Client / Couple Name</label>
                  <input
                    type="text"
                    required
                    value={offlineClient.name}
                    onChange={e => setOfflineClient({ ...offlineClient, name: e.target.value })}
                    className="w-full custom-admin-input rounded-xl px-4 py-3 outline-none"
                    placeholder="e.g. Vikas & Family"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Event Scope</label>
                  <select
                    value={offlineClient.eventType}
                    onChange={e => setOfflineClient({ ...offlineClient, eventType: e.target.value })}
                    className="w-full custom-admin-input rounded-xl px-4 py-3 outline-none cursor-pointer"
                  >
                    <option value="Wedding" className="bg-[#111]">Wedding</option>
                    <option value="Pre-Wedding" className="bg-[#111]">Pre-Wedding</option>
                    <option value="Engagement" className="bg-[#111]">Engagement</option>
                    <option value="Birthday" className="bg-[#111]">Birthday / Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Total Deal (₹)</label>
                    <input
                      type="number"
                      required
                      value={offlineClient.totalAmount}
                      onChange={e => setOfflineClient({ ...offlineClient, totalAmount: e.target.value })}
                      className="w-full custom-admin-input rounded-xl px-4 py-3 font-bold outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Advance (₹)</label>
                    <input
                      type="number"
                      required
                      value={offlineClient.paidAmount}
                      onChange={e => setOfflineClient({ ...offlineClient, paidAmount: e.target.value })}
                      className="w-full custom-admin-input rounded-xl px-4 py-3 text-green-400 font-bold outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-5">
                  <button
                    type="button"
                    onClick={() => setShowCrmModal(false)}
                    className="flex-1 bg-white/5 text-gray-400 font-bold uppercase tracking-widest text-[10px] py-4 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#C5A059] hover:bg-white text-[#050505] font-bold uppercase tracking-widest text-[10px] py-4 rounded-xl transition-colors cursor-pointer shadow-lg"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: LIVE INQUIRIES
        ========================================================= */}
        {activeTab === 'inquiries' && (
          <div className="p-8 md:p-10 flex-1 flex flex-col space-y-8">
            <div className="text-left">
              <span className="font-brand-sans text-[10px] font-bold text-gray-500 tracking-widest uppercase block mb-1">Pipeline Monitor</span>
              <h3 className="font-brand-serif text-3xl font-light text-white">Live Booking Requests</h3>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-white/[0.03] border-b border-white/10 text-[9px] uppercase tracking-widest text-gray-400 font-brand-sans font-bold">
                      <th className="p-5">Client Lead</th>
                      <th className="p-5">Event Date</th>
                      <th className="p-5">Service Requested</th>
                      <th className="p-5">Contact Details</th>
                      <th className="p-5 text-center">Operation Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-brand-sans">
                    {bookings.map((lead) => (
                      <tr key={lead._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors text-gray-300">
                        <td className="p-5 font-brand-serif text-white font-light text-lg">{lead.name}</td>
                        <td className="p-5 font-bold text-[#C5A059] text-xs uppercase tracking-wider">{new Date(lead.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td className="p-5 text-gray-400">{lead.serviceType}</td>
                        <td className="p-5 font-mono text-xs">{lead.phone}</td>
                        <td className="p-5 text-center">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead._id, e.target.value)}
                            className={`px-4 py-2 rounded-full text-[9px] font-brand-sans font-bold uppercase tracking-widest outline-none border cursor-pointer ${
                              lead.status === 'New Lead' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              lead.status === 'Deal Closed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                              'bg-white/5 text-gray-300 border-white/10'
                            }`}
                          >
                            <option value="New Lead" className="bg-[#111]">🔴 NEW LEAD</option>
                            <option value="Contacted" className="bg-[#111]">🔵 CONTACTED</option>
                            <option value="Deal Closed" className="bg-[#111]">🟢 DEAL CLOSED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: CLIENT VAULTS
        ========================================================= */}
        {activeTab === 'vault' && (
          <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">

            {/* Left: Deployment Form */}
            <div className="lg:col-span-4 glass-admin-card p-8 md:p-10 rounded-[2rem] h-fit text-left space-y-6">
              <div>
                <span className="text-[10px] font-brand-sans text-[#C5A059] uppercase tracking-widest font-bold block mb-1">Secure Vault Manager</span>
                <h3 className="text-white text-3xl font-brand-serif font-light">
                  {isEditing ? 'Update Vault' : 'Deploy Portal'}
                </h3>
              </div>

              <form onSubmit={handleSaveVault} className="space-y-5 font-brand-sans text-xs pt-2">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Client / Couple Name</label>
                  <input
                    type="text"
                    required
                    className="w-full custom-admin-input rounded-xl px-4 py-3 outline-none"
                    placeholder="e.g. Rahul & Sneha"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Event Scope</label>
                  <select
                    className="w-full custom-admin-input rounded-xl px-4 py-3 outline-none cursor-pointer"
                    value={newClient.eventType}
                    onChange={(e) => setNewClient({ ...newClient, eventType: e.target.value })}
                  >
                    <option value="Wedding" className="bg-[#111]">Wedding</option>
                    <option value="Pre-Wedding" className="bg-[#111]">Pre-Wedding</option>
                    <option value="Engagement" className="bg-[#111]">Engagement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Master Drive Folder Link</label>
                  <input
                    type="url"
                    required
                    className="w-full custom-admin-input rounded-xl px-4 py-3 outline-none"
                    placeholder="Paste Google Drive URL..."
                    value={newClient.driveLink}
                    onChange={(e) => setNewClient({ ...newClient, driveLink: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[#C5A059] font-bold uppercase tracking-widest mb-1.5">Selection Deadline</label>
                  <input
                    type="date"
                    required
                    className="w-full custom-admin-input rounded-xl px-4 py-3 outline-none cursor-pointer font-bold color-scheme-dark text-gray-300"
                    value={newClient.deadlineDate}
                    onChange={(e) => setNewClient({ ...newClient, deadlineDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Security PIN (4 Digits)</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      readOnly
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[#C5A059] font-brand-sans text-xl font-bold text-center tracking-[0.5em] outline-none shadow-inner"
                      placeholder="----"
                      value={newClient.pin}
                    />
                    <button
                      type="button"
                      onClick={() => setNewClient({ ...newClient, pin: Math.floor(1000 + Math.random() * 9000).toString() })}
                      className="bg-white/10 hover:bg-[#C5A059] text-white hover:text-black px-5 rounded-xl text-[9px] font-brand-sans font-bold uppercase tracking-widest cursor-pointer transition-all shadow-sm"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className={`flex-1 font-bold uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(197,160,89,0.15)] text-[10px] cursor-pointer ${
                      isEditing ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-[#C5A059] text-[#050505] hover:bg-white'
                    }`}
                  >
                    {isEditing ? 'Update Details' : 'Deploy Portal ✦'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setNewClient({ name: '', eventType: 'Wedding', driveLink: '', pin: '', deadlineDate: '' }); setEditClientId(null); }}
                      className="px-6 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-[10px] uppercase font-bold hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right: Active Portals Grid */}
            <div className="lg:col-span-8 glass-admin-card rounded-[2rem] p-8 md:p-10 flex flex-col text-left space-y-8">
              <div className="border-b border-white/10 pb-5 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-brand-sans text-gray-500 uppercase tracking-widest font-bold block mb-1">Live Assets</span>
                  <h3 className="text-white text-3xl font-brand-serif font-light">Active Cloud Portals</h3>
                </div>
                <span className="text-[10px] font-brand-sans uppercase tracking-widest font-bold text-[#C5A059] px-3 py-1 bg-[#C5A059]/10 rounded-full border border-[#C5A059]/20">
                  {clients.filter(c => !c.isOffline).length} Deployed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-auto pr-2 no-scrollbar">
                {clients.filter(c => !c.isOffline).map(client => (
                  <div key={client._id} className="bg-black/40 border border-white/10 hover:border-[#C5A059]/50 rounded-2xl p-6 transition-all group relative flex flex-col justify-between shadow-lg backdrop-blur-sm">

                    <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(client)}
                        className="bg-white/5 border border-white/10 text-blue-400 hover:bg-blue-500/20 p-2 rounded-xl shadow-sm cursor-pointer transition-colors"
                        title="Edit Vault Settings"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client._id, client.name, false)}
                        className="bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/20 p-2 rounded-xl shadow-sm cursor-pointer transition-colors"
                        title="Delete Vault"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>

                    <div className="mb-5">
                      <h4 className="text-white font-brand-serif text-2xl font-light pr-20 truncate">{client.name}</h4>
                      <div className="flex gap-2 items-center flex-wrap mt-2">
                        <span className="text-[9px] font-brand-sans font-bold text-gray-300 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-full border border-white/10">{client.eventType}</span>
                        {crewStatuses[client._id] && <span className="text-[9px] font-brand-sans font-bold text-blue-300 border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">{crewStatuses[client._id]}</span>}
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-5 flex items-center justify-between shadow-inner">
                      <div>
                        <span className="block text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Selection Target</span>
                        <span className="text-gray-200 font-brand-sans text-xs font-bold tracking-wider">{client.deadlineDate ? new Date(client.deadlineDate).toLocaleDateString('en-GB') : 'Not Set'}</span>
                      </div>
                      <div className="text-[#C5A059] opacity-80">⏳</div>
                    </div>

                    <div className="flex justify-between items-end border-t border-white/5 pt-4 mt-auto">
                      <div>
                        <p className="text-[8.5px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Access PIN</p>
                        <p className="text-white font-brand-sans font-bold tracking-[0.3em] text-xl leading-none">{client.pin}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8.5px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Photos Selected</p>
                        <p className="text-[#C5A059] font-brand-serif font-bold text-2xl leading-none">{client.selectedPhotosCount || 0}</p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}