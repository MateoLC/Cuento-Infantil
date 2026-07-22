import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Sparkles, Building2 } from 'lucide-react';

const characters = [
  {
    name: 'Sofía',
    role: 'La Exploradora Ecológica',
    desc: 'Representa a la infancia curiosa y comprometida con el cuidado de los ecosistemas de Colombia. Guía nuestro viaje por la flora y fauna.',
    icon: '👧',
    tag: 'Protagonista'
  },
  {
    name: 'Oso de Anteojos',
    role: 'Representante de los Mamíferos',
    desc: 'Habitante del páramo y bosque andino. Símbolo de la conservación de nuestras fuentes de agua y biodiversidad de alta montaña.',
    icon: '🐻',
    tag: 'Mamíferos'
  },
  {
    name: 'Rana Dorada',
    role: 'Representante de los Anfibios',
    desc: 'Sensible bioindicador de la salud de nuestros bosques. Nos enseña la importancia del cuidado de las fuentes hídricas.',
    icon: '🐸',
    tag: 'Anfibios'
  },
  {
    name: 'Talla X y Toche',
    role: 'Representantes de las Serpientes',
    desc: 'Reinas del silencio y valiosas controladoras biológicas que protegen los cultivos y el equilibrio de los ecosistemas.',
    icon: '🐍',
    tag: 'Serpientes'
  },
  {
    name: 'Chulo o Guala',
    role: 'Representante de las Aves',
    desc: 'El limpiador de los campos, fundamental para mantener la higiene ecológica de nuestros paisajes naturales.',
    icon: '🦅',
    tag: 'Aves'
  },
  {
    name: 'El Árbol Solitario',
    role: 'El Gran Anfitrión',
    desc: 'Refugio de los últimos sobrevivientes, símbolo del último aliento de la flora que clama por la reforestación.',
    icon: '🌳',
    tag: 'Árboles'
  }
];

const BookPage = () => {
  const location = useLocation();
  const whatsappUrl = "https://wa.me/573134536499?text=Me%20interesa%20adquirir%20el%20libro%20fisico%20y%20conocer%20la%20estrategia%20educativa";

  // Determine active subpage tab based on URL path
  const getSubpage = () => {
    if (location.pathname.includes('/personajes')) return 'personajes';
    return 'fisico'; // Default is Adquirir Libro Físico
  };

  const activeSubpage = getSubpage();

  return (
    <div className="min-h-screen bg-[#F5EFE6] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-[#78a130] bg-[#78a130]/10 px-4 py-1.5 rounded-full inline-block mb-3">
            Iniciativa Nacional de Educación Ambiental
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#1A311C] uppercase tracking-tight">
            Adquiere el Libro Físico
          </h1>
          <p className="mt-2 text-sm text-[#2a322c]/80 font-sans">
            Lleva el libro impreso a tu hogar, colegio o patrocina entregas a niños de toda Colombia.
          </p>
        </div>

        {/* Subpages Navigation Tabs */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-10 border-b border-[#e5e4de] pb-4 overflow-x-auto">
          <Link
            to="/libro"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              activeSubpage === 'fisico'
                ? 'bg-[#1A311C] text-white shadow-lg scale-105'
                : 'bg-white/80 text-[#2a322c] hover:bg-white border border-[#e5e4de]'
            }`}
          >
            <ShoppingBag size={18} className={activeSubpage === 'fisico' ? 'text-[#78a130]' : 'text-gray-500'} />
            <span>Libro Físico y Proyecto</span>
          </Link>

          <Link
            to="/libro/personajes"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              activeSubpage === 'personajes'
                ? 'bg-[#1A311C] text-white shadow-lg scale-105'
                : 'bg-white/80 text-[#2a322c] hover:bg-white border border-[#e5e4de]'
            }`}
          >
            <Sparkles size={18} className={activeSubpage === 'personajes' ? 'text-amber-400' : 'text-gray-500'} />
            <span>Sinopsis y Personajes</span>
          </Link>
        </div>

        {/* SUBPAGE 1: LIBRO FÍSICO Y PROYECTO EDUCACIONAL */}
        {activeSubpage === 'fisico' && (
          <div className="space-y-8">
            
            {/* Main Poster Image Display */}
            <div className="bg-white p-4 sm:p-8 rounded-3xl border border-[#e5e4de] shadow-2xl overflow-hidden">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-8">
                <img 
                  src="/assets/libro-fisico.png" 
                  alt="Sofía Un Verdadero Cuento Ecológico - Libro Físico e Iniciativa Nacional" 
                  className="w-full h-auto block object-cover" 
                />
              </div>

              {/* Call to Action Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F5EFE6] p-6 sm:p-8 rounded-3xl border border-[#78a130]/30">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#78a130] bg-[#1A311C] text-white px-3 py-1 rounded-full">
                    Edición Impresa de Lujo
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#1A311C]">
                    Adquiere tu Ejemplar Físico
                  </h3>
                  <p className="text-xs text-gray-700 font-sans leading-relaxed">
                    Obtén el libro impreso a todo color en papel de alta calidad con las ilustraciones originales completas de las acuarelas de nuestra fauna colombiana.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-[#20bd5a] transition-all shadow-md hover:scale-105"
                  >
                    <span>Comprar Libro Físico por WhatsApp</span>
                  </a>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-white bg-[#78a130] px-3 py-1 rounded-full">
                    Responsabilidad Social y Empresarial
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#1A311C]">
                    Patrocina la Educación de un Niño
                  </h3>
                  <p className="text-xs text-gray-700 font-sans leading-relaxed">
                    Una empresa que educa deja huella para siempre. Apoya la donación y entrega de libros a escuelas e instituciones de bajos recursos en Colombia.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#1A311C] text-white px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-[#78a130] transition-all shadow-md hover:scale-105"
                  >
                    <Building2 size={18} className="text-[#78a130]" />
                    <span>Patrocinar Entregas Empresariales</span>
                  </a>
                </div>
              </div>
            </div>

            {/* ODS Contribution Badges */}
            <div className="bg-white p-8 rounded-3xl border border-[#e5e4de] shadow-md space-y-4">
              <h3 className="text-xl font-serif font-bold text-[#1A311C] text-center">
                Contribución a los Objetivos de Desarrollo Sostenible (ODS)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center">
                  <span className="text-2xl font-serif font-black text-red-600 block">ODS 4</span>
                  <span className="text-xs font-bold text-red-900 block mt-1">Educación de Calidad</span>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-center">
                  <span className="text-2xl font-serif font-black text-green-700 block">ODS 13</span>
                  <span className="text-xs font-bold text-green-900 block mt-1">Acción por el Clima</span>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <span className="text-2xl font-serif font-black text-emerald-700 block">ODS 15</span>
                  <span className="text-xs font-bold text-emerald-900 block mt-1">Vida de Ecosistemas</span>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
                  <span className="text-2xl font-serif font-black text-blue-700 block">ODS 17</span>
                  <span className="text-xs font-bold text-blue-900 block mt-1">Alianzas Ecosistémicas</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* SUBPAGE 2: SINOPSIS Y PERSONAJES */}
        {activeSubpage === 'personajes' && (
          <div className="space-y-8">
            {/* Overview Banner */}
            <div className="bg-gradient-to-br from-[#1A311C] to-[#2b4728] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-5xl shrink-0">
                📖
              </div>
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#78a130] bg-[#78a130]/20 px-3 py-1 rounded-full">
                  Sinopsis General
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">
                  Una asamblea de sobrevivientes buscando salvar el planeta
                </h2>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">
                  Bajo el último árbol en pie sobre un paisaje desértico, el último ser humano y los últimos representantes de la fauna colombiana se reúnen para relatar sus historias de adaptación y concienciar al mundo sobre la fragilidad de nuestra megadiversidad.
                </p>
              </div>
            </div>

            {/* Character Cards */}
            <div>
              <h3 className="text-2xl font-bold font-serif text-[#1A311C] mb-6">
                Personajes y Guardianes de la Fauna
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((char) => (
                  <div 
                    key={char.name}
                    className="bg-white p-6 rounded-3xl border border-[#e5e4de] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-4xl p-3 bg-[#F5EFE6] rounded-2xl">{char.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#78a130] bg-[#78a130]/10 px-3 py-1 rounded-full">
                          {char.tag}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold font-serif text-[#1A311C] mb-1">{char.name}</h4>
                      <div className="text-xs font-bold text-[#78a130] mb-3">{char.role}</div>
                      <p className="text-xs text-gray-600 font-sans leading-relaxed">
                        {char.desc}
                      </p>
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
};

export default BookPage;
