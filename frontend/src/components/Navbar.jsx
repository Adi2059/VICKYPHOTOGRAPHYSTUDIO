import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react'; // Ensure lucide-react is installed

// 🚀 ADDED 'openLoginModal' as a prop here
export default function Navbar({ activeTab, setActiveTab, openLoginModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll logic for navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'home', label: 'HOME' },
    { id: 'portfolio', label: 'PORTFOLIO' },
    { id: 'services', label: 'SERVICES' },
    { id: 'testimonials', label: 'REVIEWS' },
    { id: 'contact', label: 'CONTACT' }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-md py-4 shadow-2xl' : 'bg-transparent py-6 lg:py-8'
        }`}
      >
        <div className="px-6 lg:px-12 w-full flex items-center justify-between">
          
          {/* LOGO */}
          <div 
            className="cursor-pointer flex flex-col items-start select-none"
            onClick={() => handleNavClick('home')}
          >
            <span className="text-white font-black text-2xl sm:text-3xl leading-none tracking-tighter uppercase font-brutalist">
              Vicky Photography
            </span>
            <span className="text-gray-300 font-light italic text-xl sm:text-2xl leading-none -mt-1 font-intro-serif">
              Studio<span className="text-[10px] align-top font-normal ml-0.5 text-gray-500">®</span>
            </span>
          </div>

          {/* DESKTOP MENU & CLIENT VAULT */}
          <div className="hidden md:flex items-center">
            
            {/* Main Navigation Links */}
            <div className="flex items-center gap-10">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`font-brutalist text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 relative group
                    ${activeTab === item.id ? 'text-white' : 'text-gray-400 hover:text-white'}
                  `}
                >
                  {item.label}
                  <span 
                    className={`absolute -bottom-2 left-0 w-full h-[1px] bg-white transition-transform duration-300 origin-left 
                      ${activeTab === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                    `} 
                  />
                </button>
              ))}
            </div>

            {/* 🚀 FIXED: The Secret Client Vault Login (Desktop) */}
            <div className="flex items-center ml-8 pl-8 border-l border-white/20">
              <button 
                onClick={openLoginModal} 
                className="flex items-center gap-2 font-luxury-sans text-[10px] tracking-[0.2em] uppercase text-white hover:text-[#C5A059] transition-all duration-300 group cursor-pointer"
              >
                <Lock size={12} className="text-gray-400 group-hover:text-[#C5A059] transition-colors" />
                <span>Client Vault</span>
              </button>
            </div>

          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white font-brutalist text-sm sm:text-base font-medium tracking-wide"
            >
              {isMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>

        </div>
      </nav>

      {/* MOBILE FULL-SCREEN MENU */}
      <div 
        className={`fixed inset-0 bg-[#0a0a0a] z-40 transition-transform duration-500 ease-in-out md:hidden flex flex-col justify-center items-center
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Decorative Map Background */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-screen" style={{ backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg")`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'invert(1)' }} />
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          <span className="text-gray-500 font-brutalist font-bold tracking-widest uppercase mb-4">Menu</span>
          
          {/* 🚀 FIXED: Restored original menu items loop */}
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`font-brutalist text-3xl sm:text-4xl tracking-widest font-black uppercase transition-colors
                ${activeTab === item.id ? 'text-white' : 'text-gray-500'}
              `}
            >
              {item.label}
            </button>
          ))}

          {/* Divider */}
          <div className="w-12 h-[1px] bg-white/20 my-6" />

          {/* 🚀 FIXED: The Secret Client Vault Login (Mobile Menu) */}
          <button 
            onClick={() => {
              setIsMenuOpen(false);
              if (openLoginModal) openLoginModal();
            }}
            className="flex items-center gap-3 border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full text-white transition-all cursor-pointer"
          >
            <Lock size={14} className="text-[#C5A059]" />
            <span className="font-brutalist text-xs tracking-widest uppercase font-bold">Access Client Vault</span>
          </button>

        </div>
      </div>
    </>
  );
}