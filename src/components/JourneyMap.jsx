import React from 'react';

// Hotspots para la imagen vertical, ajustados para cubrir cada ilustración y su botón "VER MÁS"
const hotspots = [
  { id: 'anfibios', left: '18%', top: '22%', width: '10%', height: '3.5%' },
  { id: 'serpientes', left: '71%', top: '27.5%', width: '10%', height: '3.5%' },
  { id: 'reptiles', left: '18%', top: '43%', width: '10%', height: '3.5%' },
  { id: 'aves', left: '71%', top: '53%', width: '10%', height: '3.5%' },
  { id: 'mamiferos', left: '18%', top: '67%', width: '10%', height: '3.5%' },
  { id: 'arboles', left: '71%', top: '79%', width: '10%', height: '3.5%' },
  { id: 'serhumano', left: '18%', top: '95.5%', width: '10%', height: '3.5%' },
];

const JourneyMap = ({ onSelectChapter }) => {
  return (
    <section id="capitulos" className="relative w-full h-full">
      {/* Interactive Overlays (Hotspots) over the global background */}
      {hotspots.map((spot, index) => (
        <button
          key={spot.id}
          onClick={() => onSelectChapter(spot.id)}
          className="absolute z-10 rounded-xl transition-all duration-300 group cursor-pointer" 
          style={{
            left: spot.left,
            top: spot.top,
            width: spot.width,
            height: spot.height,
          }}
          aria-label={`Ver Capítulo ${index + 1}`}
        >
          {/* Efecto de borde al pasar el cursor (opcional) */}
          <div className="absolute inset-[-4px] border-2 border-white/0 group-hover:border-white/60 rounded-[14px] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        </button>
      ))}
    </section>
  );
};

export default JourneyMap;
