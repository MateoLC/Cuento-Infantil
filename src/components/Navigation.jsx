import React from 'react';
import { Search, Book, Flower2 } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="w-full py-4 px-6 md:px-12 bg-nature-light sticky top-0 z-50 flex justify-between items-center border-b border-[#e5e4de]">
      {/* Logo Area */}
      <div className="flex items-center gap-2">
        <Flower2 size={32} className="text-pink-500" strokeWidth={2.5} fill="#ec4899" fillOpacity="0.2" />
        <div className="flex flex-col">
          <span className="text-nature-dark font-serif font-black text-3xl tracking-tight leading-none">SOFÍA</span>
          <span className="text-nature-text font-sans font-semibold text-[10px] uppercase tracking-wider leading-tight mt-1">UN VERDADERO<br/>CUENTO ECOLÓGICO</span>
        </div>
      </div>
      
      {/* Center Links */}
      <div className="hidden xl:flex gap-8 items-center text-[11px] font-sans font-bold uppercase tracking-widest text-nature-text">
        <a href="#" className="flex flex-col items-center gap-1 group">
          <span className="group-hover:text-nature-green transition-colors">INICIO</span>
          <div className="w-6 h-[2px] bg-nature-accent rounded-full"></div>
        </a>
        <a href="#" className="hover:text-nature-green transition-colors">SOBRE SOFÍA</a>
        <a href="#" className="hover:text-nature-green transition-colors flex items-center gap-1">
          CAPÍTULOS
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
        <a href="#" className="hover:text-nature-green transition-colors flex items-center gap-1">
          RECURSOS
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
        <a href="#" className="hover:text-nature-green transition-colors">ACTIVIDADES</a>
        <a href="#" className="hover:text-nature-green transition-colors">NOTICIAS</a>
        <a href="#" className="hover:text-nature-green transition-colors">CONTACTO</a>
      </div>

      {/* Right Area */}
      <div className="flex items-center gap-4">
        <button className="hidden md:flex bg-nature-dark text-white px-5 py-2.5 rounded-md text-[11px] font-bold tracking-widest hover:bg-nature-green transition-colors items-center gap-2 shadow-md">
          <Book size={14} className="text-nature-accent" />
          <span>PASAPORTE DEL EXPLORADOR</span>
        </button>
        <button className="p-2.5 bg-transparent border border-nature-text/20 rounded-full hover:bg-nature-text/5 transition-colors">
          <Search size={16} className="text-nature-text" />
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
