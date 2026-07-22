import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ChapterView from '../components/ChapterView';
import { BookOpen, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import bookData from '../data/bookData.json';

const chapterDetailsMeta = [
  { id: 'anfibios', title: '1. Anfibios', subtitle: 'Guardianes del agua y de la humedad', color: 'from-emerald-600 to-green-800', badge: '791 especies en Colombia', icon: '🐸' },
  { id: 'serpientes', title: '2. Serpientes', subtitle: 'Reinas del silencio y controladoras biológicas', color: 'from-amber-600 to-yellow-800', badge: '270 especies en Colombia', icon: '🐍' },
  { id: 'reptiles', title: '3. Reptiles', subtitle: 'Maestros del sol y sobrevivientes milenarios', color: 'from-orange-600 to-amber-800', badge: '3er lugar mundial', icon: '🦎' },
  { id: 'aves', title: '4. Aves', subtitle: 'Joyas del viento y polinización celeste', color: 'from-sky-600 to-blue-800', badge: '#1 en el mundo en especies', icon: '🦅' },
  { id: 'mamiferos', title: '5. Mamíferos', subtitle: 'Espíritus del bosque y alta montaña', color: 'from-amber-800 to-stone-900', badge: '4to lugar mundial', icon: '🐻' },
  { id: 'arboles', title: '6. Árboles', subtitle: 'Pulmones de la tierra y refugio vital', color: 'from-green-700 to-emerald-900', badge: 'Más de 300 especies nativas', icon: '🌳' },
  { id: 'serhumano', title: '7. Ser Humano', subtitle: 'Reflexión, arrepentimiento y conservación', color: 'from-teal-700 to-slate-900', badge: 'Compromiso ecológico', icon: '🧒' },
];

const ChaptersPage = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/capitulos');
  };

  // If URL has a chapterId parameter, show the Flipbook detail view
  if (chapterId) {
    return (
      <ChapterView 
        chapterId={chapterId} 
        onClose={handleClose} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#78a130] bg-[#78a130]/10 px-4 py-1.5 rounded-full inline-block mb-3">
            Subpáginas por Especie y Reino
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#1A311C] uppercase tracking-tight">
            Los 7 Capítulos de la Naturaleza
          </h1>
          <p className="mt-3 text-sm text-[#2a322c]/80 font-sans">
            Selecciona un capítulo para abrir su libro interactivo de acuarelas y relatos de nuestra fauna colombiana.
          </p>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chapterDetailsMeta.map((chap) => {
            const data = bookData.find(c => c.id === chap.id);
            const pageCount = data?.images?.length || 0;

            return (
              <div
                key={chap.id}
                className="bg-white rounded-3xl border border-[#e5e4de] shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Top Gradient Banner */}
                  <div className={`h-32 bg-gradient-to-r ${chap.color} p-6 flex justify-between items-start text-white relative overflow-hidden`}>
                    <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform">{chap.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                      {chap.badge}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold font-serif text-[#1A311C] mb-1">
                      {chap.title}
                    </h3>
                    <p className="text-xs font-bold text-[#78a130] mb-3">
                      {chap.subtitle}
                    </p>
                    <p className="text-xs text-gray-600 font-sans leading-relaxed line-clamp-3">
                      {data?.content ? data.content.substring(0, 160) + '...' : 'Descubre los detalles de este capítulo biológico en Colombia.'}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-gray-100">
                  <span className="text-[11px] font-medium text-gray-400 font-sans">
                    {pageCount} Páginas ilustradas
                  </span>
                  <Link
                    to={`/capitulos/${chap.id}`}
                    className="bg-[#1A311C] text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase hover:bg-[#78a130] transition-colors flex items-center gap-2 group-hover:translate-x-0.5"
                  >
                    <BookOpen size={14} />
                    <span>Leer Capítulo</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default ChaptersPage;
