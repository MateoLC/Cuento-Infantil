import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { BookOpen, Sparkles, Download, ArrowLeft, ShieldCheck, Heart, UserCheck, FileText } from 'lucide-react';
import bookData from '../data/bookData.json';

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

  // Determine active subpage tab based on URL path
  const getSubpage = () => {
    if (location.pathname.includes('/lector')) return 'lector';
    if (location.pathname.includes('/personajes')) return 'personajes';
    if (location.pathname.includes('/descargas')) return 'descargas';
    return 'lector'; // Default
  };

  const activeSubpage = getSubpage();

  // Extract all pages from all chapters into a flat list for full book reader
  const allBookPages = bookData.reduce((acc, chapter) => {
    if (chapter.images && chapter.images.length > 0) {
      return [...acc, ...chapter.images];
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-[#F5EFE6] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-[#78a130] bg-[#78a130]/10 px-4 py-1.5 rounded-full inline-block mb-3">
            El Libro Completo
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#1A311C] uppercase tracking-tight">
            Sofía: Un Verdadero Cuento Ecológico
          </h1>
          <p className="mt-2 text-sm text-[#2a322c]/80 font-sans">
            Explora las subpáginas dedicadas al lector digital, los personajes y el material descargable.
          </p>
        </div>

        {/* Subpages Navigation Tabs */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-10 border-b border-[#e5e4de] pb-4 overflow-x-auto">
          <Link
            to="/libro/lector"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              activeSubpage === 'lector'
                ? 'bg-[#1A311C] text-white shadow-lg scale-105'
                : 'bg-white/80 text-[#2a322c] hover:bg-white border border-[#e5e4de]'
            }`}
          >
            <BookOpen size={18} className={activeSubpage === 'lector' ? 'text-[#78a130]' : 'text-gray-500'} />
            <span>Lector Digital</span>
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

          <Link
            to="/libro/descargas"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              activeSubpage === 'descargas'
                ? 'bg-[#1A311C] text-white shadow-lg scale-105'
                : 'bg-white/80 text-[#2a322c] hover:bg-white border border-[#e5e4de]'
            }`}
          >
            <Download size={18} className={activeSubpage === 'descargas' ? 'text-pink-400' : 'text-gray-500'} />
            <span>Descargas PDF</span>
          </Link>
        </div>

        {/* SUBPAGE 1: LECTOR DIGITAL */}
        {activeSubpage === 'lector' && (
          <div className="bg-white p-4 sm:p-8 rounded-3xl border border-[#e5e4de] shadow-xl text-center">
            <div className="mb-4">
              <h2 className="text-2xl font-bold font-serif text-[#1A311C]">Visor Interactivo en Flipbook</h2>
              <p className="text-xs text-gray-500 font-sans mt-1">
                Haz clic o arrastra las páginas para explorar todo el cuento en formato digital.
              </p>
            </div>

            <div className="w-full h-[650px] flex items-center justify-center bg-[#F5EFE6]/50 rounded-2xl p-4 overflow-hidden border border-gray-100">
              {allBookPages.length > 0 ? (
                <HTMLFlipBook
                  width={600}
                  height={800}
                  size="stretch"
                  minWidth={300}
                  maxWidth={1200}
                  minHeight={400}
                  maxHeight={1400}
                  maxShadowOpacity={0.4}
                  showCover={true}
                  mobileScrollSupport={true}
                  className="flipbook-container w-full h-full shadow-2xl"
                >
                  {allBookPages.map((img, idx) => (
                    <div key={idx} className="page shadow-lg bg-white flex items-center justify-center">
                      <img 
                        src={img} 
                        alt={`Página del Libro ${idx + 1}`} 
                        className="w-full h-full object-contain select-none"
                      />
                    </div>
                  ))}
                </HTMLFlipBook>
              ) : (
                <div className="text-gray-500">Cargando páginas del libro...</div>
              )}
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
                <h2 className="text-2xl sm:text-3xl font-serif font-black">
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

        {/* SUBPAGE 3: DESCARGAS PDF */}
        {activeSubpage === 'descargas' && (
          <div className="bg-white p-8 rounded-3xl border border-[#e5e4de] shadow-xl max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="p-4 bg-[#78a130]/10 text-[#1A311C] w-fit rounded-full mx-auto">
                <FileText size={40} />
              </div>
              <h2 className="text-2xl font-bold font-serif text-[#1A311C]">
                Libro Digital en PDF de Alta Resolución
              </h2>
              <p className="text-xs text-gray-600 font-sans max-w-md mx-auto">
                Descarga el archivo completo "Libro ecología pliegos b.pdf" listo para leer en cualquier dispositivo o imprimir en formato pliegos.
              </p>
            </div>

            <div className="bg-[#F5EFE6] p-6 rounded-2xl border border-dashed border-[#78a130] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl font-bold text-xs uppercase">
                  PDF (12.5 MB)
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A311C]">Libro Ecología Pliegos B.pdf</h4>
                  <p className="text-[11px] text-gray-500">Versión oficial del cuento y sus 7 capítulos completas</p>
                </div>
              </div>

              <a
                href="/Libro ecologia pliegos b.pdf"
                download="Libro ecologia pliegos b.pdf"
                className="w-full sm:w-auto bg-[#1A311C] text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase hover:bg-[#78a130] transition-colors flex items-center justify-center gap-2 shadow-md shrink-0"
              >
                <Download size={16} />
                <span>Descargar PDF</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 bg-gray-50 rounded-2xl flex items-start gap-3">
                <ShieldCheck size={20} className="text-[#78a130] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-[#1A311C]">Uso Educativo Gratuito</span>
                  <span className="text-gray-500">Ideal para colegios, talleres ecológicos y lectura familiar.</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl flex items-start gap-3">
                <Heart size={20} className="text-pink-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-[#1A311C]">Ilustraciones Originales</span>
                  <span className="text-gray-500">Incluye todas las acuarelas y fichas de especies colombianas.</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookPage;
