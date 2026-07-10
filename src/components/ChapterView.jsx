import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import bookData from '../data/bookData.json';

const ChapterView = ({ chapterId, onClose }) => {
  const [chapter, setChapter] = useState(null);
  const bookRef = useRef(null);

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

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-0 w-full h-full bg-[#fcfbf7]/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Floating Back Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 md:top-8 md:left-8 z-[110] bg-white border border-[#2a322c]/10 text-[#1b321c] px-5 py-2.5 rounded-full shadow-lg hover:bg-[#254b2a] hover:text-white transition-all duration-300 flex items-center gap-2 group font-sans font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Volver al Mapa</span>
        </button>

        {/* Removed extra title to maximize flipbook space */}

        {/* Flipbook Container */}
        <div className="w-[100vw] h-[100vh] flex items-center justify-center p-0 m-0 relative z-[105]">
          {chapter.images && chapter.images.length > 0 ? (
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
              {chapter.images.map((img, idx) => (
                <div key={idx} className="page shadow-2xl bg-white flex items-center justify-center overflow-hidden">
                  <img 
                    src={img} 
                    alt={`Página ${idx + 1}`} 
                    className="w-full h-full object-fill select-none" 
                    draggable="false"
                  />
                </div>
              ))}
            </HTMLFlipBook>
          ) : (
            <div className="text-[#2a322c] font-sans">No hay imágenes disponibles para este capítulo.</div>
          )}
        </div>

        {/* Navigation Hints */}
        <div className="absolute bottom-6 text-[#2a322c]/50 font-sans text-xs font-medium uppercase tracking-widest pointer-events-none">
          Arrastra las esquinas o haz clic para pasar de página
        </div>

      </motion.div>
    </AnimatePresence>
  );
};

export default ChapterView;
