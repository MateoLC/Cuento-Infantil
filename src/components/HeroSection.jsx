import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative w-full h-full flex flex-col justify-center py-12 md:py-20">
      
      {/* Subtle backdrop gradient to enhance text legibility over the 8.png illustration */}
      <div className="absolute top-0 left-0 w-full md:w-[65%] lg:w-[55%] h-full bg-gradient-to-r from-[#F5EFE6]/90 via-[#F5EFE6]/70 to-transparent pointer-events-none rounded-r-3xl"></div>

      <div className="relative z-10 w-full px-6 md:px-12 flex justify-start">
        <div className="w-full md:w-[60%] lg:w-[50%] space-y-4 md:space-y-6 text-left flex flex-col items-start bg-white/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none p-6 md:p-0 rounded-3xl border border-white/40 md:border-none shadow-sm md:shadow-none">
          
          <span className="text-xs font-black uppercase tracking-widest text-[#78a130] bg-[#1A311C] text-white px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#78a130]" />
            <span>Un Verdadero Cuento Ecológico</span>
          </span>

          <h1 className="text-[2.2rem] md:text-[3.2rem] lg:text-[4.2rem] font-serif font-black text-[#1A311C] leading-[0.95] tracking-tighter uppercase drop-shadow-sm">
            EXPLORA, <span className="inline-block text-[#78a130] -ml-1 -mr-1">❦</span><br/>
            DESCUBRE Y PROTEGE<br/>
            LA NATURALEZA
          </h1>
          
          <p className="text-[14px] md:text-[16px] text-[#2a322c] font-sans font-medium leading-relaxed max-w-[460px] bg-white/60 p-3 rounded-2xl border border-white/50 backdrop-blur-xs">
            Acompaña a Sofía en una aventura mágica por Colombia para conocer nuestra fascinante biodiversidad y aprender a cuidar el planeta.
          </p>
          
          <div className="flex flex-wrap gap-3 pt-2 justify-start">
            <Link 
              to="/libro/lector"
              className="bg-[#1A311C] text-white px-6 py-3.5 rounded-2xl text-xs font-bold tracking-widest hover:bg-[#78a130] transition-all duration-300 uppercase flex items-center gap-2 shadow-xl hover:-translate-y-0.5"
            >
              <BookOpen size={16} className="text-[#78a130]" />
              <span>LEER EL LIBRO DIGITAL</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
