import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Sparkles, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import bookData from '../data/bookData.json';

const ChapterView = ({ chapterId, onClose }) => {
  const [chapter, setChapter] = useState(null);
  const bookRef = useRef(null);
  const navigate = useNavigate();
  const whatsappUrl = "https://wa.me/573134536499?text=Me%20interesa%20adquirir%20el%20libro%20fisico%20completo%20de%20Sofia%20Cuento%20Ecologico";

  useEffect(() => {
    const data = bookData.find(c => c.id === chapterId);
    setChapter(data);
    // Disable body scroll when open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [chapterId]);

  if (!chapter) return null;

  // Limit display to the first 4 pages as requested
  const samplePages = chapter.images ? chapter.images.slice(0, 4) : [];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-0 w-full h-full bg-[#fcfbf7]/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="absolute top-4 left-4 right-4 md:top-6 md:left-8 md:right-8 z-[110] flex items-center justify-between pointer-events-auto">
          {/* Floating Back Button */}
          <button 
            onClick={onClose}
            className="bg-white border border-[#2a322c]/10 text-[#1b321c] px-5 py-2.5 rounded-full shadow-lg hover:bg-[#254b2a] hover:text-white transition-all duration-300 flex items-center gap-2 group font-sans font-bold text-xs uppercase tracking-widest cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Volver a Capítulos</span>
          </button>

          {/* Sample Badge Indicator */}
          <div className="bg-[#78a130]/15 text-[#1A311C] border border-[#78a130]/30 px-4 py-2 rounded-full font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm">
            <Sparkles size={14} className="text-[#78a130]" />
            <span>Muestra Gratuita (4 Primeras Páginas)</span>
          </div>
        </div>

        {/* Flipbook Container */}
        <div className="w-[100vw] h-[100vh] flex items-center justify-center p-0 m-0 relative z-[105]">
          {samplePages.length > 0 ? (
            <HTMLFlipBook 
              width={2000} 
              height={1600} 
              size="stretch"
              minWidth={300}
              maxWidth={5000}
              minHeight={400}
              maxHeight={5000}
              maxShadowOpacity={0.5}
              showCover={false}
              mobileScrollSupport={true}
              className="flipbook-container w-full h-full"
              ref={bookRef}
            >
              {/* 4 Sample Pages */}
              {samplePages.map((img, idx) => (
                <div key={idx} className="page shadow-2xl bg-white flex items-center justify-center overflow-hidden">
                  <img 
                    src={img} 
                    alt={`Página Muestra ${idx + 1}`} 
                    className="w-full h-full object-fill select-none" 
                    draggable="false"
                  />
                </div>
              ))}

              {/* Conversion Callout Page 5 */}
              <div className="page shadow-2xl bg-gradient-to-br from-[#1A311C] to-[#254b2a] text-white p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
                <div className="p-4 bg-white/10 rounded-full text-amber-400">
                  <BookOpen size={48} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-[#78a130] bg-[#78a130]/20 px-4 py-1.5 rounded-full">
                  Muestra Gratuita Completada
                </span>
                <h3 className="text-2xl sm:text-4xl font-serif font-black text-white leading-tight uppercase">
                  ¡Antójate del cuento completo en edición impresa!
                </h3>
                <p className="text-xs sm:text-sm text-gray-200 font-sans leading-relaxed max-w-md">
                  Has disfrutado de las 4 primeras páginas de este capítulo. Adquiere el libro físico impreso a todo color para descubrir la historia completa y todas las acuarelas originales.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] text-white px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-[#20bd5a] transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <ShoppingBag size={16} />
                    <span>Comprar Libro Físico</span>
                  </a>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/libro');
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <span>Ver Proyecto Físico</span>
                  </button>
                </div>
              </div>

              {/* Backing Spread Page 6 (for dual page layout stability) */}
              <div className="page shadow-2xl bg-[#1A311C] text-white p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-white/10 rounded-full text-[#78a130]">
                  <Sparkles size={36} />
                </div>
                <h4 className="text-xl font-serif font-bold text-white uppercase">
                  Sofía: Un Verdadero Cuento Ecológico
                </h4>
                <p className="text-xs text-gray-300 font-sans max-w-xs">
                  Una iniciativa de educación ambiental para formar guardianes de nuestra biodiversidad.
                </p>
              </div>

            </HTMLFlipBook>
          ) : (
            <div className="text-[#2a322c] font-sans">No hay imágenes disponibles para este capítulo.</div>
          )}
        </div>

        {/* Navigation Hints */}
        <div className="absolute bottom-6 text-[#2a322c]/50 font-sans text-xs font-medium uppercase tracking-widest pointer-events-none z-[110]">
          Muestra limitada a 4 páginas • Pasa de página para adquirir el libro completo
        </div>

      </motion.div>
    </AnimatePresence>
  );
};

export default ChapterView;
