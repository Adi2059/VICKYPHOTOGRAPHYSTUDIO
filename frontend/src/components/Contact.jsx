import React, { useEffect } from 'react';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

// 🎨 Custom Instagram SVG Icon (100% Error-Free)
const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function ContactPage() {
  
  // Auto-scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white font-sans selection:bg-[#C5A059] selection:text-white">
      
      {/* 🔮 MASTER LUXURY TYPOGRAPHY */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');
        .font-luxury-serif { font-family: 'Cormorant Garamond', serif; }
        .font-luxury-sans { font-family: 'Montserrat', sans-serif; }
        
        /* Custom scrollbar for form area if needed */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 🎬 Cinematic Background Texture (Very subtle) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src="https://res.cloudinary.com/doa6d6cyf/image/upload/v1784742666/uniquephotography1.0-20260318-0087_yyozre.webp" 
          alt="Texture" 
          className="w-full h-full object-cover opacity-[0.07] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/95 to-[#050505]/80" />
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#C5A059]/5 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3" />
      </div>

      {/* 🌟 MAIN CONTENT GRID */}
      <div className="relative z-10 max-w-[90rem] mx-auto w-full px-6 lg:px-16 pt-32 lg:pt-40 pb-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* =====================================================================
              LEFT COLUMN: Sticky Typography & Info (Takes 5 cols)
          ===================================================================== */}
          <div className="lg:col-span-5 lg:sticky lg:top-40 flex flex-col justify-start">
            
            <div className="mb-12">
              <span className="font-luxury-sans text-[10px] tracking-[0.4em] uppercase text-[#C5A059] block mb-6">
                Reserve Your Date
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-luxury-serif font-light leading-[1.1] tracking-tight mb-8">
                Let's frame <br /> your <span className="italic text-gray-400">forever.</span>
              </h1>
              <p className="font-luxury-sans text-xs sm:text-sm text-gray-400 font-light leading-relaxed max-w-sm">
                Every great cinematic legacy begins with a simple conversation. Reach out to secure our availability for your grand celebrations, editorials, or intimate ceremonies.
              </p>
            </div>

            <div className="w-12 h-[1px] bg-white/20 mb-12"></div> {/* Elegant Divider */}

            {/* Direct Contact Links */}
            <div className="space-y-8">
              
              {/* WhatsApp */}
              <a href="https://wa.me/919219497519" target="_blank" rel="noreferrer" className="flex items-center gap-5 group w-fit">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C5A059] group-hover:bg-[#C5A059]/10 transition-all duration-300">
                  <Phone size={18} className="text-gray-400 group-hover:text-[#C5A059] transition-colors" />
                </div>
                <div>
                  <span className="block font-luxury-sans text-[9px] uppercase tracking-widest text-gray-500 mb-1">WhatsApp / Call</span>
                  <span className="font-luxury-sans text-sm font-light tracking-widest text-gray-300 group-hover:text-white transition-colors">
                    +91 92194 97519
                  </span>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:vickyphotographystudio4005@gmail.com" className="flex items-center gap-5 group w-fit">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C5A059] group-hover:bg-[#C5A059]/10 transition-all duration-300">
                  <Mail size={18} className="text-gray-400 group-hover:text-[#C5A059] transition-colors" />
                </div>
                <div>
                  <span className="block font-luxury-sans text-[9px] uppercase tracking-widest text-gray-500 mb-1">Email Us</span>
                  <span className="font-luxury-sans text-sm font-light tracking-wider text-gray-300 group-hover:text-white transition-colors">
                    vickyphotographystudio4005@gmail.com
                  </span>
                </div>
              </a>

              {/* Instagram */}
              <a href="https://www.instagram.com/vickyphotographystudio/" target="_blank" rel="noreferrer" className="flex items-center gap-5 group w-fit">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C5A059] group-hover:bg-[#C5A059]/10 transition-all duration-300">
                  <InstagramIcon size={18} className="text-gray-400 group-hover:text-[#C5A059] transition-colors" />
                </div>
                <div>
                  <span className="block font-luxury-sans text-[9px] uppercase tracking-widest text-gray-500 mb-1">Follow Our Work</span>
                  <span className="font-luxury-sans text-sm font-light tracking-widest uppercase text-gray-300 group-hover:text-white transition-colors">
                    @vickyphotographystudio
                  </span>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-start gap-5 pt-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-[#C5A059]" />
                </div>
                <div className="pt-1">
                  <span className="block font-luxury-sans text-[9px] uppercase tracking-widest text-gray-500 mb-2">Studio Location</span>
                  <span className="font-luxury-sans text-xs font-light tracking-wider text-gray-400 leading-relaxed max-w-[220px] block">
                    Jhun Jhun Wala PG College, Hanshapur, Ayodhya - 224001
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* =====================================================================
              RIGHT COLUMN: The Luxury Form (Takes 7 cols)
          ===================================================================== */}
          <div className="lg:col-span-7">
            <div className="bg-[#080808]/80 backdrop-blur-2xl border border-white/5 p-8 sm:p-12 lg:p-16 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
              
              <h3 className="font-luxury-serif text-3xl lg:text-4xl font-light mb-12 text-white">Send an Inquiry</h3>
              
              <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
                
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                  <div className="relative group">
                    <input type="text" required placeholder="Your Name *" className="w-full bg-transparent border-b border-white/20 pb-4 text-sm font-luxury-sans text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A059] transition-colors" />
                  </div>
                  <div className="relative group">
                    <input type="text" placeholder="Partner's Name" className="w-full bg-transparent border-b border-white/20 pb-4 text-sm font-luxury-sans text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A059] transition-colors" />
                  </div>
                </div>
                
                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                  <div className="relative group">
                    <input type="email" required placeholder="Email Address *" className="w-full bg-transparent border-b border-white/20 pb-4 text-sm font-luxury-sans text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A059] transition-colors" />
                  </div>
                  <div className="relative group">
                    <input type="tel" required placeholder="Phone Number *" className="w-full bg-transparent border-b border-white/20 pb-4 text-sm font-luxury-sans text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A059] transition-colors" />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                  <div className="relative group">
                    <label className="absolute -top-5 text-[9px] uppercase tracking-widest text-gray-500">Event Date</label>
                    <input type="date" className="w-full bg-transparent border-b border-white/20 pb-4 pt-2 text-sm font-luxury-sans text-gray-300 focus:outline-none focus:border-[#C5A059] transition-colors color-scheme-dark" />
                  </div>
                  <div className="relative group">
                    <input type="text" placeholder="Event Venue / City" className="w-full bg-transparent border-b border-white/20 pb-4 pt-2 text-sm font-luxury-sans text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A059] transition-colors" />
                  </div>
                </div>

                {/* Row 4 */}
                <div className="relative group">
                  <textarea rows="4" placeholder="Tell us about your grand vision... What are you planning?" className="w-full bg-transparent border-b border-white/20 pb-4 text-sm font-luxury-sans text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A059] transition-colors resize-none"></textarea>
                </div>

                {/* Submit Button */}
                <button className="w-full flex items-center justify-center gap-4 bg-[#C5A059] text-white hover:bg-white hover:text-black py-5 mt-4 transition-all duration-500 group font-luxury-sans text-[10px] uppercase tracking-[0.2em] font-medium shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                  Submit Inquiry
                  <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform" />
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}