import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative w-full h-full flex flex-col justify-start pt-8 md:pt-16">
      
      {/* Gradient Fade Overlay - Explicitly using var() to ensure it doesn't default to white */}
      <div className="absolute -top-10 left-0 w-full md:w-[70%] lg:w-[60%] h-[150%] bg-gradient-to-r from-[var(--color-nature-light)] via-[color-mix(in_srgb,var(--color-nature-light)_95%,transparent)] to-transparent [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 w-full px-6 md:px-12 flex justify-start">
        
        <div className="w-full md:w-[60%] lg:w-[50%] space-y-4 md:space-y-6 text-left flex flex-col items-start">
          <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] font-serif font-black text-nature-dark leading-[0.95] tracking-tighter uppercase drop-shadow-sm">
            EXPLORA, <span className="inline-block text-nature-accent -ml-2 -mr-2">❦</span><br/>
            DESCUBRE Y PROTEGE<br/>
            LA NATURALEZA
          </h1>
          
          <p className="text-[14px] md:text-[16px] text-nature-text font-sans font-medium leading-relaxed pt-1 max-w-[450px]">
            Acompaña a Sofía en una aventura increíble 
            para conocer nuestra biodiversidad y aprender 
            a cuidar el lugar que llamamos hogar.
          </p>
          
          <div className="flex flex-wrap gap-3 pt-4 justify-start">
            <button className="bg-nature-dark text-white px-5 py-3 rounded-lg text-xs font-bold tracking-widest hover:bg-nature-green transition-colors uppercase flex items-center gap-2 shadow-lg">
              CONOCE LA HISTORIA
            </button>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default HeroSection;
