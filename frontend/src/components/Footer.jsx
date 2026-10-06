import React, { useEffect, useRef } from 'react';

export default function Footer() {
  const canvasRef = useRef(null);
  const footerRef = useRef(null);
  const points = useRef([]);

  // ==========================================
  // CUSTOM CANVAS GLOW ENGINE (Heatmap Trail)
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      if (footerRef.current && canvas) {
        canvas.width = footerRef.current.offsetWidth;
        canvas.height = footerRef.current.offsetHeight;
      }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < points.current.length; i++) {
        const p = points.current[i];

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);

        ctx.globalAlpha = Math.max(0, p.life);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.life -= 0.012;
      }

      points.current = points.current.filter((p) => p.life > 0);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colors = ['#ff3b00', '#ff8c00', '#00b894', '#00cec9', '#d63031'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomSize = Math.random() * 50 + 80;

    points.current.push({
      x,
      y,
      life: 1,
      color: randomColor,
      size: randomSize,
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-[#111111] overflow-hidden flex flex-col justify-between py-6 lg:py-8 px-6 lg:px-12 z-20 border-t border-white/10"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        .font-brutalist { font-family: 'Inter', sans-serif; }
        
        .canvas-blur {
          filter: blur(40px);
          opacity: 0.8;
        }
      `}</style>

      {/* 1. THE CANVAS BACKGROUND */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 canvas-blur"
      />

      {/* 2. TOP BAR: EMAIL & BACK TO TOP */}
      <div className="relative z-10 flex justify-between items-center w-full font-brutalist text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-bold">
        <a href="mailto:vickyphotographystudio4005@gmail.com" className="hover:text-[#C5A059] transition-colors duration-300">
          vickyphotographystudio4005@gmail.com
        </a>
        <button onClick={scrollToTop} className="hover:text-white transition-colors duration-300 flex items-center gap-1 cursor-pointer">
          Back to Top <span className="text-lg leading-none">↑</span>
        </button>
      </div>

      {/* 3. CENTER: HUGE LOGO */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 pointer-events-none select-none my-6 lg:my-8">
        <h2 className="text-white text-[11vw] sm:text-[4rem] lg:text-[5rem] leading-[0.85] tracking-tighter font-black font-brutalist text-center drop-shadow-2xl">
          Vicky Photography<br />
          <span className="italic font-light text-[9vw] sm:text-[3rem] lg:text-[4rem] text-gray-300">
            Studio
          </span>
          <span className="inline-block align-top text-[10px] lg:text-xs font-normal -ml-1 mt-1 text-[#C5A059]">®</span>
        </h2>
      </div>

      {/* 4. BOTTOM BAR: PORTALS, SOCIALS & AGENCY */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10 font-brutalist text-[9px] sm:text-[10px] text-gray-500 tracking-wide uppercase font-medium">

        {/* 🚀 LEFT: Secret Admin & Crew Portals + Copyright */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start gap-2">
          
          <div className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity duration-500">
            <button 
              onClick={() => window.location.href = '/admin-login'} 
              className="hover:text-[#C5A059] transition-colors"
            >
              System Admin
            </button>
            <span>•</span>
            <button 
              onClick={() => window.location.href = '/crew-login'} 
              className="hover:text-[#C5A059] transition-colors"
            >
              Crew Console
            </button>
          </div>
          
          <span>© {new Date().getFullYear()} Vicky Studio. All Rights Reserved.</span>
        </div>

        {/* CENTER: Clean Social Links */}
        <div className="w-full md:w-1/3 flex justify-center gap-8">
          <a 
            href="https://www.instagram.com/vickyphotographystudio/" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-[#C5A059] transition-colors"
          >
            Instagram
          </a>
          <a 
            href="mailto:vickyphotographystudio4005@gmail.com" 
            className="hover:text-[#C5A059] transition-colors"
          >
            Contact Us
          </a>
        </div>

        {/* RIGHT: Agency Tag (AUG) */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-end items-center gap-2">
          <span>Infrastructure by</span>
          <span className="w-1.5 h-1.5 bg-[#C5A059] inline-block"></span>
          <a href="#" className="hover:text-white transition-colors font-bold text-gray-300">
            AUG CONSULTANCY
          </a>
        </div>

      </div>
    </footer>
  );
}