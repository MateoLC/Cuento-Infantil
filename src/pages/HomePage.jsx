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
      {/* Main Map & Poster Container */}
      <div 
        style={{ display: selectedChapter ? 'none' : 'block' }}
        className="transition-opacity duration-500 w-full relative bg-[#F5EFE6]"
      >
        {/* Global Poster Background with Smooth Bottom Fade */}
        <div className="relative w-full overflow-hidden">
          <img 
            src="/assets/8.png" 
            alt="Mapa y Fondo Global de la Aventura de Sofía" 
            className="w-full h-auto block object-cover transform scale-[1.01]" 
          />
          
          {/* Bottom Gradient Transition to eliminate harsh image edge */}
          <div className="absolute bottom-0 left-0 w-full h-32 sm:h-48 md:h-64 bg-gradient-to-b from-transparent via-[#F5EFE6]/70 to-[#F5EFE6] pointer-events-none z-10"></div>

          {/* Overlays for interactive map */}
          <div className="absolute inset-0 w-full h-full z-20">
            <div id="historia" className="w-full h-[35%] relative">
              <HeroSection />
            </div>
            <div id="mapa" className="w-full h-[65%] relative">
              <JourneyMap onSelectChapter={handleSelectChapter} />
            </div>
          </div>
        </div>
      </div>

      {/* Subpages Quick Access Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-8">
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
              <div className="p-3 bg-[#78a130]/10 w-fit rounded-2xl text-[#1A311C] group-hover:bg-[#78a130] group-hover:text-white transition-colors mb-4">
                <BookOpen size={28} />
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
              <div className="p-3 bg-amber-100 w-fit rounded-2xl text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors mb-4">
                <Sparkles size={28} />
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
              <div className="p-3 bg-pink-100 w-fit rounded-2xl text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-colors mb-4">
                <HelpCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1A311C] mb-2 font-serif">Diviértete Aprendiendo</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans mb-4">
                Juega la trivia de la biodiversidad, obtén tus insignias en el pasaporte y descarga fichas para colorear.
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
              <div className="p-3 bg-[#1A311C]/10 w-fit rounded-2xl text-[#1A311C] group-hover:bg-[#1A311C] group-hover:text-white transition-colors mb-4">
                <Leaf size={28} />
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
