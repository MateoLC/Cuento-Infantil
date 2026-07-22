import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ChapterView from '../components/ChapterView';
import { BookOpen, Sparkles } from 'lucide-react';
import bookData from '../data/bookData.json';

const chapterMapHotspots = [
  { id: 'anfibios', title: '1. Anfibios', left: '15.5%', top: '26.6%', width: '13%', height: '4%' },
  { id: 'serpientes', title: '2. Serpientes', left: '71%', top: '26.8%', width: '13%', height: '4%' },
  { id: 'reptiles', title: '3. Reptiles', left: '15.5%', top: '50.3%', width: '13%', height: '4%' },
  { id: 'aves', title: '4. Aves', left: '71%', top: '50.8%', width: '13%', height: '4%' },
  { id: 'mamiferos', title: '5. Mamíferos', left: '15.5%', top: '72.3%', width: '13%', height: '4%' },
  { id: 'arboles', title: '6. Árboles', left: '71%', top: '78.3%', width: '13%', height: '4%' },
  { id: 'serhumano', title: '7. El Ser Humano', left: '15.5%', top: '94.8%', width: '13%', height: '4%' },
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
    <div className="min-h-screen bg-[#F5EFE6] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-[#78a130] bg-[#78a130]/10 px-4 py-1.5 rounded-full inline-block mb-3">
            Mapa Interactivo de Capítulos
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#1A311C] uppercase tracking-tight">
            Nuestros Capítulos
          </h1>
          <p className="mt-2 text-sm text-[#2a322c]/80 font-sans">
            Haz clic en los botones "VER MÁS" de cada capítulo para explorar su historia y acuarelas originales.
          </p>
        </div>

        {/* Main Map Poster Container */}
        <div className="bg-white p-3 sm:p-6 rounded-3xl border border-[#e5e4de] shadow-2xl overflow-hidden max-w-5xl mx-auto">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-amber-900/10">
            {/* Illustrated Map Poster Image */}
            <img 
              src="/assets/nuestros-capitulos.png" 
              alt="Nuestros Capítulos - Sofía Cuento Ecológico" 
              className="w-full h-auto block object-cover" 
            />

            {/* Interactive Hotspot Overlay Buttons for each Chapter */}
            {chapterMapHotspots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => navigate(`/capitulos/${spot.id}`)}
                className="absolute z-20 rounded-xl transition-all duration-300 group cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  left: spot.left,
                  top: spot.top,
                  width: spot.width,
                  height: spot.height,
                }}
                aria-label={`Ver Capítulo ${spot.title}`}
                title={`Explorar Capítulo: ${spot.title}`}
              >
                {/* Glowing ring on hover */}
                <div className="w-full h-full border-2 border-amber-500/0 group-hover:border-amber-500 rounded-xl bg-amber-500/0 group-hover:bg-amber-500/15 transition-all duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-[10px] sm:text-xs font-bold text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded-md shadow-md transition-opacity">
                    Leer
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Chapter Access Grid Footer */}
        <div className="max-w-5xl mx-auto pt-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-serif font-bold text-[#1A311C]">Acceso Rápido a los Capítulos</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {chapterMapHotspots.map((chap) => (
              <Link
                key={chap.id}
                to={`/capitulos/${chap.id}`}
                className="bg-white p-3 rounded-2xl border border-[#e5e4de] hover:border-[#78a130] text-center shadow-xs hover:shadow-md transition-all group"
              >
                <div className="text-xs font-bold text-[#1A311C] group-hover:text-[#78a130] transition-colors">
                  {chap.title}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Explorar</div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChaptersPage;
