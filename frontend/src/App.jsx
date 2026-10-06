import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Story from './components/Story';
import Services from './components/Services';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Films from './components/Films';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Testimonials from './components/Testimonials';

// Secure Executive Control Panels
import ClientVault from './panels/ClientVault';
import AdminDashboard from './panels/AdminDashboard';
import CrewWorkspace from './panels/CrewWorkspace';

export default function App() {
  const [currentView, setCurrentView] = useState('public');
  const [activeTab, setActiveTab] = useState('home');
  const [authenticatedClient, setAuthenticatedClient] = useState(null);

  // 🔐 CUSTOM LUXURY LOGIN MODAL STATES
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPin, setLoginPin] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // 🌐 DYNAMIC BACKEND API BASE URL
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'localhost 5100';

  useEffect(() => {
    // Pure black background matching the luxury Hero section
    document.body.style.backgroundColor = "#0a0a0a";
    document.documentElement.style.backgroundColor = "#0a0a0a";
  }, []);

  // ---------------------------------------------------------------------------------
  // 🚀 PORTAL LOGIN LOGIC
  // ---------------------------------------------------------------------------------
  const processLogin = async (e) => {
    e.preventDefault();
    const secretKey = loginPin.trim();
    if (!secretKey) return;

    setIsAuthenticating(true);

    // 1️⃣ LOCAL STORAGE CHECK
    const localVaults = JSON.parse(localStorage.getItem('saved_vault_clients') || '[]');
    const matchedLocalClient = localVaults.find(c => String(c.pin).trim() === secretKey);

    if (matchedLocalClient) {
      setAuthenticatedClient(matchedLocalClient);
      setCurrentView('client-vault');
      setShowLoginModal(false);
      setLoginPin('');
      setIsAuthenticating(false);
      return;
    }

    // 2️⃣ BACKEND CLOUD API VERIFICATION
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/verify-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey })
      });

      const data = await response.json();

      if (data.success) {
        if (data.role === 'admin') {
          setCurrentView('admin');
        } else if (data.role === 'crew') {
          setCurrentView('crew');
        } else if (data.role === 'client') {
          setAuthenticatedClient(data.clientData);
          setCurrentView('client-vault');
        }
        setShowLoginModal(false);
        setLoginPin('');
      } else {
        alert("❌ Access Denied: Invalid Security PIN. Please verify your 4-digit key.");
      }
    } catch (error) {
      console.error("Backend Verification Error:", error);
      alert("⚠️ Network notice: Backend server unreachable. Check Node.js server status.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'DELETE' })
      .catch(err => console.error(err));

    setAuthenticatedClient(null);
    setCurrentView('public');
    setActiveTab('home');
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white select-none overflow-x-hidden selection:bg-white selection:text-black relative w-full flex flex-col">

      {/* 🔮 MASTER LUXURY STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');
        
        .font-intro-serif { font-family: 'Playfair Display', serif; }
        .font-intro-sans { font-family: 'Inter', sans-serif; }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-modal { animation: modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        /* Ensure instant appearance */
        .animate-fade-in { animation: fadeIn 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* 💎 PIN AUTHENTICATION MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 sm:p-10 max-w-sm w-full relative shadow-2xl animate-modal text-white">

            <button
              onClick={() => { setShowLoginModal(false); setLoginPin(''); }}
              className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors cursor-pointer bg-white/5 hover:bg-white/10 p-1.5 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="text-center space-y-1.5 mb-7 relative z-10">
              <span className="text-gray-400 font-intro-sans text-[9.5px] tracking-[0.3em] uppercase block font-bold">CLIENT VAULT ACCESS</span>
              <h2 className="font-intro-serif text-3xl text-white font-bold tracking-tight">
                Vicky <span className="italic font-light text-gray-400">Portal</span>
              </h2>
            </div>

            <form onSubmit={processLogin} className="space-y-5 relative z-10">
              <div>
                <input
                  type="password"
                  maxLength="4"
                  placeholder="----"
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-black border border-white/20 rounded-2xl px-4 py-3.5 text-center text-3xl text-white tracking-[0.7em] focus:border-white focus:bg-[#0a0a0a] outline-none transition-colors font-intro-sans font-bold shadow-sm placeholder:text-gray-700"
                  autoFocus
                />
                <p className="text-center text-[10px] font-intro-sans font-medium tracking-wider text-gray-500 uppercase mt-3">
                  Enter 4-Digit Security PIN
                </p>
              </div>

              <button
                type="submit"
                disabled={loginPin.length < 4 || isAuthenticating}
                className="w-full bg-white hover:bg-gray-200 text-black font-intro-sans text-xs font-bold uppercase tracking-[0.2em] py-4 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isAuthenticating ? "Verifying..." : "Authenticate Vault ✦"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🧭 NAVIGATION */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openLoginModal={() => setShowLoginModal(true)}
      />

      {/* 🖼️ FULL-WIDTH VIEWPORT */}
      <div className="w-full min-h-screen flex flex-col flex-1 transition-all duration-300 bg-[#0a0a0a]">

        <main className="flex-1 w-full">
          {currentView === 'public' && (
            <div className="w-full">
              {activeTab === 'home' && <div className="animate-fade-in"><Hero setActiveTab={setActiveTab} /></div>}
              {activeTab === 'story' && <div className="animate-fade-in"><Story setActiveTab={setActiveTab} /></div>}
              {activeTab === 'films' && <div className="animate-fade-in"><Films setActiveTab={setActiveTab} /></div>}
              {activeTab === 'portfolio' && <div className="animate-fade-in"><Portfolio setActiveTab={setActiveTab} /></div>}
              {activeTab === 'services' && <div className="animate-fade-in"><Services setActiveTab={setActiveTab} /></div>}
              {activeTab === 'testimonials' && <div className="animate-fade-in"><Testimonials setActiveTab={setActiveTab} /></div>}
              {activeTab === 'contact' && <div className="animate-fade-in"><Contact setActiveTab={setActiveTab} /></div>}
            </div>
          )}

          {/* SECURE DASHBOARDS & CONTROL REPOSITORIES */}
          {currentView === 'client-vault' && (
            <div className="p-4 sm:p-8 max-w-7xl mx-auto">
              <ClientVault onLogout={handleLogout} clientId={authenticatedClient} />
            </div>
          )}
          {currentView === 'admin' && (
            <div className="p-4 sm:p-8 max-w-7xl mx-auto">
              <AdminDashboard onLogout={handleLogout} />
            </div>
          )}
          {currentView === 'crew' && (
            <div className="p-4 sm:p-8 max-w-7xl mx-auto">
              <CrewWorkspace onLogout={handleLogout} />
            </div>
          )}
        </main>

        {/* 🌟 MASTER FOOTER */}
        <Footer
          currentView={currentView}
          setCurrentView={setCurrentView}
          setActiveTab={setActiveTab}
        />
      </div>

    </div>
  );
}