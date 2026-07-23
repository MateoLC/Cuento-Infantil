import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import JourneyMap from '../components/JourneyMap';
import ChapterView from '../components/ChapterView';
import { BookOpen, HelpCircle, Leaf, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const HomePage = () => {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const navigate = useNavigate();

  const handleSelectChapter = (chapterId) => {
    navigate(`/capitulos/${chapterId}`);
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      {/* Main Map & Poster Container - Full First Viewport */}
      <div 
        style={{ display: selectedChapter ? 'none' : 'block' }}
        className="transition-opacity duration-500 w-full relative bg-[#F5EFE6]"
      >
        {/* Global Poster Background */}
        <div className="relative w-full min-h-[auto] md:min-h-[calc(100vh-5rem)] overflow-hidden bg-[#F5EFE6]">
          <img 
            src="/assets/8.png" 
            alt="Mapa y Fondo Global de la Aventura de Sofía" 
            className="w-full h-auto md:absolute md:inset-0 md:w-full md:h-full object-contain md:object-cover object-center md:object-top" 
          />
          
          {/* Soft & Seamless Bottom Blend Gradient */}
          <div className="absolute bottom-0 left-0 w-full h-10 md:h-20 bg-gradient-to-b from-transparent to-[#F5EFE6] pointer-events-none z-10"></div>

          {/* Overlays for interactive map */}
          <div className="relative md:absolute md:inset-0 z-20 w-full min-h-full flex flex-col justify-between">
            <div id="historia" className="w-full relative">
              <HeroSection />
            </div>
            <div id="mapa" className="w-full relative pb-4">
              <JourneyMap onSelectChapter={handleSelectChapter} />
            </div>
          </div>
        </div>
      </div>

      {/* Subpages Quick Access Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#78a130] bg-[#78a130]/10 px-4 py-1.5 rounded-full inline-block mb-3">
            Explora las Subpáginas
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-[#1A311C] uppercase tracking-tight">
            Descubre todo el Universo de Sofía
          </h2>
          <p className="mt-3 text-base text-[#2a322c]/80 font-sans">
            Acompaña a Sofía a través de nuestras experiencias didácticas e interactivas diseñadas para inspirar a niños y familias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Libro Digital */}
          <Link 
            to="/libro" 
            className="group bg-white p-6 rounded-3xl border border-[#e5e4de] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300">
                <img src="/assets/iconos/icon-libro-digital.webp" alt="Libro Digital" className="w-14 h-14 object-contain" />
              </div>
              <h3 className="text-xl font-bold text-[#1A311C] mb-2 font-serif">Libro Digital</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans mb-4">
                Accede al lector flipbook interactivo, conoce a los personajes y descarga la versión completa en PDF.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#78a130] group-hover:translate-x-1 transition-transform">
              <span>Ver Libro y Subpáginas</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 2: Capítulos */}
          <Link 
            to="/capitulos" 
            className="group bg-white p-6 rounded-3xl border border-[#e5e4de] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300">
                <img src="/assets/iconos/icon-capitulos-naturaleza.webp" alt="Capítulos de la Naturaleza" className="w-14 h-14 object-contain" />
              </div>
              <h3 className="text-xl font-bold text-[#1A311C] mb-2 font-serif">Capítulos de la Naturaleza</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans mb-4">
                7 reinos biológicos: Anfibios, Serpientes, Reptiles, Aves, Mamíferos, Árboles y el Ser Humano.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
              <span>Explorar Capítulos</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 3: Diviértete Aprendiendo */}
          <Link 
            to="/diviertete-aprendiendo" 
            className="group bg-white p-6 rounded-3xl border border-[#e5e4de] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300">
                <img src="/assets/iconos/icon-diviertete-aprendiendo.webp" alt="Diviértete Aprendiendo" className="w-14 h-14 object-contain" />
              </div>
              <h3 className="text-xl font-bold text-[#1A311C] mb-2 font-serif">Diviértete Aprendiendo</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans mb-4">
                Explora las 5 actividades interactivas sobre la biodiversidad de Colombia y colecciona insignias.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-pink-600 group-hover:translate-x-1 transition-transform">
              <span>Jugar e Interactuar</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 4: Visión Verde */}
          <Link 
            to="/vision-verde" 
            className="group bg-white p-6 rounded-3xl border border-[#e5e4de] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300">
                <img src="/assets/iconos/icon-vision-verde.webp" alt="Visión Verde" className="w-14 h-14 object-contain" />
              </div>
              <h3 className="text-xl font-bold text-[#1A311C] mb-2 font-serif">Visión Verde</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans mb-4">
                Descubre el Decálogo Ambiental de Sofía, nuestra misión por Colombia y cómo unirte al club ecológico.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1A311C] group-hover:translate-x-1 transition-transform">
              <span>Conocer Decálogo y Misión</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
