import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative w-full h-full flex flex-col justify-start pt-6 md:pt-10 lg:pt-14">
      
      {/* Softer lateral gradient overlay with vertical mask fade to eliminate horizontal edge lines */}
      <div className="absolute -top-10 left-0 w-full md:w-[50%] lg:w-[45%] h-[160%] bg-gradient-to-r from-[#F5EFE6]/85 via-[#F5EFE6]/45 to-transparent [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 w-full px-6 md:px-12 flex justify-start">
        
        <div className="w-full md:w-[60%] lg:w-[50%] space-y-4 md:space-y-6 text-left flex flex-col items-start">
          <h1 className="text-[2.2rem] sm:text-[3rem] md:text-[3.8rem] lg:text-[4.3rem] font-serif font-black text-[#1A311C] leading-[0.95] tracking-tighter uppercase drop-shadow-sm">
            SOFÍA <span className="inline-block text-[#78a130] -ml-2 -mr-2">❦</span><br/>
            UN VERDADERO<br/>
            CUENTO ECOLÓGICO
          </h1>
          
          <p className="text-[13px] md:text-[15px] text-[#2a322c] font-sans font-bold leading-relaxed pt-1 max-w-[480px] uppercase tracking-wide drop-shadow-xs">
            Este cuento no es tan cuento, aunque muchos piensen que es puro cuento, y que algún día puede pasar.
          </p>
          
          {/* Shifted button downwards with extra top padding */}
          <div className="flex flex-wrap gap-3 pt-6 md:pt-10 justify-start">
            <Link 
              to="/libro"
              className="bg-[#1A311C] text-white px-6 py-3.5 rounded-xl text-xs font-bold tracking-widest hover:bg-[#78a130] transition-all duration-300 uppercase flex items-center gap-2 shadow-xl hover:-translate-y-0.5"
            >
              <ShoppingBag size={16} className="text-[#78a130]" />
              <span>ADQUIRIR LIBRO FÍSICO</span>
            </Link>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default HeroSection;
