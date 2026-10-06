import React, { useState, useRef, useEffect } from 'react';
import { Camera, Award, Clock, HeartHandshake, ArrowRight } from 'lucide-react';

export default function Services({ setActiveTab }) {
  const formRef = useRef(null);
  const containerRef = useRef(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [inquiryData, setInquiryData] = useState({
    name: '',
    phone: '',
    address: '',
    eventDate: '',
    serviceType: 'signature-wedding',
  });

  // 💎 REFINED ELITE PACKAGES 
  const elitePackages = [
    {
      id: "standard-wedding",
      tier: "THE CLASSIC ARCHIVE",
      title: "Standard Wedding",
      price: "₹1,25,000",
      tagline: "Complete ceremony coverage with a cinematic edge.",
      popular: false,
      deliverables: [
        "Traditional Photography (Complete coverage)",
        "Traditional Videography (2-3 hrs event-wise)",
        "Cinematography (Creative visual storytelling)",
        "Cinematic Highlights (7-10 min edited film)",
        "Teaser Trailer (1-minute 'Coming Soon' cut)",
        "1 Leather-bound Album (60 sheets, ~300 photos)",
        "2 Large Keepsake Frames (20\" x 30\")",
        "Digital Delivery of All Raw Photos"
      ],
      paymentTerms: "20% Advance • 60% Pre-Wedding • 20% Delivery"
    },
    {
      id: "signature-wedding",
      tier: "THE DIRECTOR'S CUT",
      title: "Signature Wedding",
      price: "₹1,65,000",
      tagline: "The ultimate masterpiece of your royal heritage.",
      popular: true, // Highlights this card
      deliverables: [
        "Premium Traditional Photography",
        "Extended Traditional Videography",
        "Masterclass Cinematography Direction",
        "Cinematic Highlights (7-10 min edited film)",
        "Teaser Trailer (1-minute 'Coming Soon' cut)",
        "1 Premium Leather-bound Album (60 sheets)",
        "2 Large Keepsake Frames (20\" x 30\")",
        "Priority Digital Delivery of All Raw Photos",
        "Signature Color Grading & Editing"
      ],
      paymentTerms: "20% Advance • 60% Pre-Wedding • 20% Delivery"
    },
    {
      id: "editorial-prewedding",
      tier: "THE COUTURE PRELUDE",
      title: "Editorial Pre-Wedding",
      price: "₹40,000",
      tagline: "High-fashion couples portraiture & storytelling.",
      popular: false,
      deliverables: [
        "Cinematic Love Story Film (3-5 mins)",
        "1-Minute Social Media Teaser",
        "High-Fashion Still Photography",
        "Multiple Outfit & Look Directives",
        "Signature 16-bit Color Grading",
        "Digital Master Vault Delivery"
      ],
      paymentTerms: "30% Advance Token required"
    }
  ];

  // 🥂 A LA CARTE & INDEPENDENT SESSIONS
  const aLaCarteServices = [
    {
      title: "1-Day Event Coverage",
      price: "₹25,000",
      desc: "For intimate functions and single-day ceremonies."
    },
    {
      title: "Fine-Art Maternity",
      price: "₹15,000",
      desc: "Editorial-style portraits celebrating motherhood."
    },
    {
      title: "4K Drone Coverage",
      price: "₹15,000",
      desc: "Aerial establishing shots & Baraat (Add-on or standalone)."
    }
  ];

  const directorialEdge = [
    {
      icon: <Camera className="w-5 h-5 text-[#C5A059] shrink-0" />,
      title: "Directorial Restraint & Pure Flow",
      desc: "Quiet discretion without demanding repeat takes or staged poses."
    },
    {
      icon: <Award className="w-5 h-5 text-[#C5A059] shrink-0" />,
      title: "Organic 16-Bit RAW Color Grading",
      desc: "Hand-graded in DaVinci Resolve ensuring true gold & skin warmth."
    },
    {
      icon: <Clock className="w-5 h-5 text-[#C5A059] shrink-0" />,
      title: "Milestone-Backed Delivery",
      desc: "Teasers in 7 days and master 4K films via PIN-secured Client Vault."
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-[#C5A059] shrink-0" />,
      title: "Premium Trust & Execution",
      desc: "100% word-of-mouth satisfaction across Uttar Pradesh and beyond."
    }
  ];

  const studioFaqs = [
    { q: "What is the advance booking token requirement?", a: "Dates are reserved strictly upon receipt of the advance token (20% for weddings). 60% is cleared before the event, and the final 20% on delivery." },
    { q: "How long are our raw wedding files stored in the studio vault?", a: "All raw footage and full-resolution still photos are safely maintained for 60 days in our digital repository for your selection." },
    { q: "Do you travel outside for destination weddings?", a: "Yes. Vicky Studio regularly travels across Uttar Pradesh, Jaipur, Varanasi, and destination circuits across India." },
    { q: "Who directs and color grades the final films?", a: "Principal Director Mr. Vicky personally directs the core crew on-site and color-grades every film to perfection." }
  ];

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulation for submission
    setTimeout(() => {
      alert(`✨ INQUIRY RESERVED!\nOur team will connect with ${inquiryData.name} shortly.`);
      setInquiryData({ name: '', phone: '', address: '', eventDate: '', serviceType: 'signature-wedding' });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleSelectPackage = (pkgId) => {
    setInquiryData(prev => ({ ...prev, serviceType: pkgId }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll Animation Setup
  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
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
    return () => { if (revealObserver) revealObserver.disconnect(); };
  }, []);

  return (
    <div ref={containerRef} className="bg-[#050505] text-white font-sans tracking-tight relative overflow-hidden min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 selection:bg-[#C5A059] selection:text-white">

      {/* 🔮 MASTER LUXURY TYPOGRAPHY & STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');

        .font-luxury-serif { font-family: 'Cormorant Garamond', serif; }
        .font-luxury-sans { font-family: 'Montserrat', sans-serif; }

        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-on-scroll.is-revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .input-luxury-field {
          background: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 0;
          transition: all 0.3s ease;
        }
        .input-luxury-field:focus { border-bottom-color: #C5A059; outline: none; }
        .input-luxury-field::placeholder { color: rgba(255,255,255,0.4); font-weight: 300; }
        select.input-luxury-field option { background: #0a0a0a; color: white; }
        
        .premium-border-wrap {
          background: linear-gradient(145deg, rgba(197,160,89,0.4) 0%, rgba(197,160,89,0.05) 50%, rgba(197,160,89,0.4) 100%);
          padding: 1px;
          border-radius: 4px;
        }
      `}</style>

      <div className="max-w-[95rem] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 space-y-24 sm:space-y-32">

        {/* =========================================================================
            1. HERO SECTION & MINIMAL RESERVATION FORM
        ========================================================================= */}
        <div ref={formRef} className="reveal-on-scroll pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

            <div className="lg:col-span-6 space-y-8 text-left pt-4">
              <span className="font-luxury-sans text-[10px] font-medium tracking-[0.3em] text-[#C5A059] uppercase block">
                Official Directory • Vicky Studio
              </span>

              <div className="space-y-4">
                <h1 className="font-luxury-serif text-5xl sm:text-6xl lg:text-[5rem] font-light text-white leading-[1.1]">
                  Curated Offerings <br />
                  <span className="italic text-gray-400">& Investment.</span>
                </h1>
                <p className="font-luxury-sans text-gray-400 text-sm tracking-wide max-w-md leading-relaxed font-light">
                  Capturing legacies with high-end cinema equipment, restrained direction, and archival-grade delivery. Review our transparent elite tariffs.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                <div>
                  <span className="font-luxury-serif text-3xl font-light text-white block">20%</span>
                  <span className="font-luxury-sans text-[9px] uppercase tracking-[0.2em] text-gray-500 block mt-2">Advance Token</span>
                </div>
                <div>
                  <span className="font-luxury-serif text-3xl font-light text-[#C5A059] block">60%</span>
                  <span className="font-luxury-sans text-[9px] uppercase tracking-[0.2em] text-gray-500 block mt-2">Before Event</span>
                </div>
                <div>
                  <span className="font-luxury-serif text-3xl font-light text-white block">20%</span>
                  <span className="font-luxury-sans text-[9px] uppercase tracking-[0.2em] text-gray-500 block mt-2">On Delivery</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 w-full">
              <div className="bg-[#0a0a0a] border border-white/5 p-8 sm:p-12 relative shadow-2xl">
                
                <div className="mb-10">
                  <h3 className="font-luxury-serif text-3xl font-light text-white">
                    Request <span className="italic text-[#C5A059]">Availability</span>
                  </h3>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-8 font-luxury-sans text-xs font-light">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2 text-left">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-gray-500">Client Full Name</label>
                      <input type="text" required placeholder="e.g. Anand Sharma" value={inquiryData.name} onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })} className="w-full input-luxury-field px-0 py-2" />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-gray-500">Phone / WhatsApp</label>
                      <input type="tel" required placeholder="+91 9219497519" value={inquiryData.phone} onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })} className="w-full input-luxury-field px-0 py-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2 text-left">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-gray-500">Event Location</label>
                      <input type="text" required placeholder="City or Venue" value={inquiryData.address} onChange={(e) => setInquiryData({ ...inquiryData, address: e.target.value })} className="w-full input-luxury-field px-0 py-2" />
                    </div>
                    <div className="space-y-2 text-left relative">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-gray-500">Event Date</label>
                      <input type="date" required value={inquiryData.eventDate} onChange={(e) => setInquiryData({ ...inquiryData, eventDate: e.target.value })} className="w-full input-luxury-field px-0 py-2 cursor-pointer" style={{ colorScheme: 'dark' }} />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-gray-500">Desired Collection</label>
                    <div className="relative">
                      <select required value={inquiryData.serviceType} onChange={(e) => setInquiryData({ ...inquiryData, serviceType: e.target.value })} className="w-full input-luxury-field px-0 py-2 appearance-none cursor-pointer">
                        {elitePackages.map((pkg) => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.title}
                          </option>
                        ))}
                        {/* 🚀 New Form Option for Custom / A La Carte */}
                        <option value="custom-alacarte">A La Carte / Independent Session</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-gray-500 text-xs">▼</div>
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-white text-black hover:bg-[#C5A059] hover:text-white font-luxury-sans font-medium tracking-[0.2em] uppercase py-4 mt-6 transition-all duration-500 cursor-pointer disabled:opacity-50 text-[10px]">
                    {isSubmitting ? "Locking Dates..." : "Reserve Priority Date"}
                  </button>
                </form>

              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            🌟 2. THE TARIFF COLLECTIONS (VERTICAL TICKET/PASSPORT STYLE)
        ========================================================================= */}
        <div className="space-y-16 reveal-on-scroll border-t border-white/10 pt-24 sm:pt-32">

          <div className="text-center space-y-8 max-w-3xl mx-auto mb-16">
            <h2 className="font-luxury-serif text-4xl sm:text-5xl font-light text-white tracking-tight">
              Elite <span className="italic text-[#C5A059]">Collections</span>
            </h2>
            <p className="font-luxury-sans text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              Transparent, high-tier production structures without the clutter. Only absolute cinematic excellence.
            </p>
          </div>

          {/* 🎯 VERTICAL TALL CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">
            {elitePackages.map((service, index) => {
              
              const CardContent = (
                <div className={`h-full bg-[#0a0a0a] flex flex-col relative group transition-colors duration-500 ${service.popular ? 'p-[2.5rem]' : 'p-10 border border-white/10 hover:border-white/20'}`}>
                  
                  <div className="text-center mb-10 pb-10 border-b border-white/5 space-y-6">
                    <span className="inline-block font-luxury-sans text-[9px] tracking-[0.3em] text-[#C5A059] uppercase">
                      {service.tier}
                    </span>
                    <h3 className="font-luxury-serif text-3xl font-light text-white leading-tight px-4">
                      {service.title}
                    </h3>
                    <div className="space-y-2 pt-2">
                      <span className="font-luxury-serif text-5xl font-normal text-white tracking-tight block">
                        {service.price}
                      </span>
                      <p className="font-luxury-sans text-[10px] text-gray-500 uppercase tracking-widest block max-w-[200px] mx-auto leading-relaxed">
                        {service.paymentTerms}
                      </p>
                    </div>
                  </div>

                  <div className="flex-grow space-y-4">
                    <ul className="space-y-5">
                      {service.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-4 text-xs text-gray-300 font-luxury-sans font-light leading-relaxed">
                          <span className="text-[#C5A059] mt-[2px] text-xs">◆</span>
                          <span className="opacity-80 group-hover:opacity-100 transition-opacity">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-10 mt-10">
                    <button 
                      onClick={() => handleSelectPackage(service.id)} 
                      className={`w-full py-4 text-center font-luxury-sans text-[10px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 border ${service.popular ? 'border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white' : 'border-white/20 text-white hover:border-white/50'}`}
                    >
                      <span>Reserve This Setup</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );

              return (
                <div key={service.id} className="w-full h-full reveal-on-scroll" style={{ transitionDelay: `${index * 0.1}s` }}>
                  {service.popular ? (
                    <div className="premium-border-wrap h-full relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C5A059] text-black px-4 py-1 text-[9px] uppercase tracking-[0.3em] font-medium font-luxury-sans z-10 shadow-lg">
                        Most Requested
                      </div>
                      {CardContent}
                    </div>
                  ) : (
                    <div className="h-full pt-3">
                      {CardContent}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* =========================================================================
              🚀 NEW: A LA CARTE / INDEPENDENT SESSIONS (Horizontal Layout)
          ========================================================================= */}
          <div className="max-w-7xl mx-auto pt-24 reveal-on-scroll">
            <div className="text-center mb-12">
              <span className="font-luxury-sans text-[10px] tracking-[0.3em] text-[#C5A059] uppercase block mb-3">Independent Modules</span>
              <h3 className="font-luxury-serif text-3xl font-light text-white">A La Carte & Add-ons</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aLaCarteServices.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSelectPackage('custom-alacarte')}
                  className="bg-[#0a0a0a] border border-white/10 p-8 flex flex-col justify-between group hover:border-[#C5A059]/50 transition-colors cursor-pointer shadow-lg"
                >
                  <div className="space-y-3 mb-8">
                    <h4 className="font-luxury-serif text-2xl text-white group-hover:text-[#C5A059] transition-colors">{item.title}</h4>
                    <p className="font-luxury-sans text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex items-end justify-between border-t border-white/5 pt-6">
                    <span className="font-luxury-serif text-3xl text-white font-light">{item.price}</span>
                    <ArrowRight size={16} className="text-gray-600 group-hover:text-[#C5A059] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* =========================================================================
            3. DIRECTOR EDGE & FAQs
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 border-t border-white/10 pt-24 sm:pt-32 reveal-on-scroll">
          
          <div className="space-y-10">
            <div>
              <span className="font-luxury-sans text-[10px] tracking-[0.3em] text-[#C5A059] uppercase block mb-3">The Distinction</span>
              <h2 className="font-luxury-serif text-4xl font-light text-white">Why Commission Us</h2>
            </div>
            <div className="space-y-6">
              {directorialEdge.map((item, i) => (
                <div key={i} className="flex gap-6 border-b border-white/5 pb-6 items-start">
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <h3 className="font-luxury-serif text-xl text-white mb-2">{item.title}</h3>
                    <p className="font-luxury-sans text-xs text-gray-400 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <span className="font-luxury-sans text-[10px] tracking-[0.3em] text-[#C5A059] uppercase block mb-3">Inquiries</span>
              <h2 className="font-luxury-serif text-4xl font-light text-white">Common Questions</h2>
            </div>
            <div className="space-y-2">
              {studioFaqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} onClick={() => setActiveFaq(isOpen ? null : idx)} className="border-b border-white/10 py-5 cursor-pointer group">
                    <div className="flex items-center justify-between gap-6">
                      <h4 className="font-luxury-serif text-lg text-gray-200 group-hover:text-white transition-colors">{faq.q}</h4>
                      <span className={`font-luxury-serif text-xl text-[#C5A059] transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
                    </div>
                    <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                      <p className="font-luxury-sans text-xs text-gray-400 font-light leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}