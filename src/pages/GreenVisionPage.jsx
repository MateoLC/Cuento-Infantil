import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, CheckCircle2, Compass, Globe2, Target, Sparkles, Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const decalogoRules = [
  { id: 1, title: 'Respetar cada fuente de agua', desc: 'Evitar el vertimiento de aguas residuales, basuras en humedales, quebradas y ríos', icon: '💧' },
  { id: 2, title: 'Proteger la flora nativa', desc: 'No talar ni arrancar árboles o plantas endémicas en páramos y bosques.', icon: '🌳' },
  { id: 3, title: 'No promover el tráfico de fauna', desc: 'No debes recibir o comprar ningún animal silvestre todos deben ser libres como el ser humano respeta su libertad', icon: '🦜' },
  { id: 4, title: 'Reducir, reutilizar y reciclar', desc: 'Separar los residuos correctamente para disminuir el impacto ambiental y asi apoyaras los emprendimientos de reciclaje que hay en región o inicia uno', icon: '♻️' },
  { id: 5, title: 'Valorar la biodiversidad local', desc: 'Aprende sobre la biodiversidad que te rodea, entre mas sepas de ella te resultará mas fácil protegerla', icon: '🇨🇴' },
  { id: 6, title: 'Ahorro inteligente de energía', desc: 'Aprovechar la luz natural y apagar aparatos que no estén en uso.', icon: '💡' },
  { id: 7, title: 'Fomentar la reforestación', desc: 'Sembrar árboles y plantas nativas en nacimientos de agua, áreas abiertas tambien vigilar que crezcan sanos y fuertes', icon: '🌱' },
  { id: 8, title: 'Evitar incendios forestales', desc: 'No hacer fogatas en reservas naturales ni cerca a fuentes de agua', icon: '🔥' },
  { id: 9, title: 'Educación y transmisión ecológica', desc: 'Comparte toda la información que has aprendido de Sofia, habla con tus amigos, compañeros, vecinos y familiares acerca de la importancia de conocer la biodiversidad que te rodea para protegerla', icon: '📚' },
  { id: 10, title: 'Vivir en armonía con la tierra', desc: 'Entender que el ser humano es un integrante más de la red de la vida.', icon: '🌍' }
];

const galleryPhotos = [
  { id: 1, src: '/assets/galeria/Gemini_Generated_Image_78fjs178fjs178fj.webp', title: 'Galería Ecológica 1' },
  { id: 2, src: '/assets/galeria/input_file_1.webp', title: 'Galería Ecológica 2' },
  { id: 3, src: '/assets/galeria/input_file_2.webp', title: 'Galería Ecológica 3' },
  { id: 4, src: '/assets/galeria/input_file_3.webp', title: 'Galería Ecológica 4' },
  { id: 5, src: '/assets/galeria/input_file_4.webp', title: 'Galería Ecológica 5' },
  { id: 7, src: '/assets/galeria/input_file_6.webp', title: 'Galería Ecológica 7' },
  { id: 8, src: '/assets/galeria/input_file_7.webp', title: 'Galería Ecológica 8' },
  { id: 9, src: '/assets/galeria/input_file_8.webp', title: 'Galería Ecológica 9' },
  { id: 10, src: '/assets/galeria/input_file_9.webp', title: 'Galería Ecológica 10' },
];

const GreenVisionPage = () => {
  const location = useLocation();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  const getSubpage = () => {
    if (location.pathname.includes('/decalogo')) return 'decalogo';
    if (location.pathname.includes('/mision-vision') || location.pathname.includes('/noticias')) return 'mision-vision';
    if (location.pathname.includes('/galeria') || location.pathname.includes('/contacto')) return 'galeria';
    return 'mision'; // Default
  };

  const activeSubpage = getSubpage();

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev === 0 ? galleryPhotos.length - 1 : prev - 1));
    }
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev === galleryPhotos.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-[#78a130] bg-[#78a130]/10 px-4 py-1.5 rounded-full inline-block mb-3">
            Compromiso Ambiental
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#1A311C] uppercase tracking-tight">
            Visión Verde
          </h1>
          <p className="mt-2 text-sm text-[#2a322c]/80 font-sans">
            Nuestra visión por un planeta sostenible y las 10 reglas de Sofía para cuidar la naturaleza.
          </p>
        </div>

        {/* Subpages Navigation Tabs */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-10 border-b border-[#e5e4de] pb-4 overflow-x-auto">
          <Link
            to="/vision-verde/mision"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              activeSubpage === 'mision'
                ? 'bg-[#1A311C] text-white shadow-lg scale-105'
                : 'bg-white/80 text-[#2a322c] hover:bg-white border border-[#e5e4de]'
            }`}
          >
            <Leaf size={18} className={activeSubpage === 'mision' ? 'text-[#78a130]' : 'text-gray-500'} />
            <span>Nuestra Misión</span>
          </Link>

          <Link
            to="/vision-verde/decalogo"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              activeSubpage === 'decalogo'
                ? 'bg-[#1A311C] text-white shadow-lg scale-105'
                : 'bg-white/80 text-[#2a322c] hover:bg-white border border-[#e5e4de]'
            }`}
          >
            <CheckCircle2 size={18} className={activeSubpage === 'decalogo' ? 'text-[#78a130]' : 'text-gray-500'} />
            <span>Decálogo Ambiental</span>
          </Link>

          <Link
            to="/vision-verde/mision-vision"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              activeSubpage === 'mision-vision'
                ? 'bg-[#1A311C] text-white shadow-lg scale-105'
                : 'bg-white/80 text-[#2a322c] hover:bg-white border border-[#e5e4de]'
            }`}
          >
            <Compass size={18} className={activeSubpage === 'mision-vision' ? 'text-[#78a130]' : 'text-gray-500'} />
            <span>Misión y Visión</span>
          </Link>

          <Link
            to="/vision-verde/galeria"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              activeSubpage === 'galeria'
                ? 'bg-[#1A311C] text-white shadow-lg scale-105'
                : 'bg-white/80 text-[#2a322c] hover:bg-white border border-[#e5e4de]'
            }`}
          >
            <ImageIcon size={18} className={activeSubpage === 'galeria' ? 'text-[#78a130]' : 'text-gray-500'} />
            <span>Galería Ecológica</span>
          </Link>
        </div>

        {/* SUBPAGE 1: NUESTRA MISIÓN */}
        {activeSubpage === 'mision' && (
          <div className="space-y-8">
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e5e4de] shadow-xl space-y-6">
              <div className="flex items-center gap-3 text-[#78a130]">
                <Globe2 size={32} />
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A311C]">
                  ¿SABES EN QUÉ LUGAR VIVES?
                </h2>
              </div>
              <p className="text-sm font-sans text-gray-700 leading-relaxed">
                Colombia es un país extraordinario ubicado cerca del ecuador, en la zona tropical, y por esta razón su clima es muy diferente al de las regiones templadas, en donde existen cuatro estaciones y en donde los días son más largos o más cortos dependiendo de la época del año. En nuestro territorio solo existen temporadas secas y lluviosas, lo que llamamos régimen bimodal, y las horas del día prácticamente son las mismas a lo largo de todo el año.
              </p>
              <p className="text-sm font-sans text-gray-700 leading-relaxed">
                En Colombia, los pisos térmicos —que son las zonas situadas en un mismo rango altitudinal (Altura Sobre el Nivel del Mar), con una temperatura similar— están distribuidos desde el nivel del mar hasta los picos glaciares, y también tienen una contribución importante a nuestra biodiversidad. En cada uno, la temperatura, la topografía y la composición de los suelos ha creado diferentes ambientes, así como diferentes comunidades de flora y fauna, y han dado lugar a tipos muy distintos de ecosistemas.
              </p>

              {/* Mapa Ilustrado de Colombia */}
              <div className="pt-6 flex flex-col items-center">
                <div className="w-full max-w-2xl bg-[#FBF8F3] p-4 sm:p-6 rounded-3xl border border-[#e5e4de]/80 shadow-inner flex flex-col items-center gap-3">
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src="/assets/mapa-colombia.png"
                      alt="Mapa ilustrado de los ecosistemas y pisos térmicos de Colombia"
                      className="w-full max-w-lg h-auto object-contain drop-shadow-md hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                  <span className="text-xs text-[#1A311C]/70 font-sans font-medium italic text-center">
                    Mapa de los ecosistemas, la topografía y los pisos térmicos de Colombia
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SUBPAGE 2: DECÁLOGO AMBIENTAL */}
        {activeSubpage === 'decalogo' && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto mb-6">
              <h2 className="text-2xl font-serif font-bold text-[#1A311C]">
                Las 10 Reglas de Sofía por la Naturaleza
              </h2>
              <p className="text-xs text-gray-600 font-sans mt-1">
                Compromisos diarios para transformar nuestra relación con el medio ambiente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {decalogoRules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white p-6 rounded-3xl border border-[#e5e4de] shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4"
                >
                  <div className="text-3xl p-3 bg-[#F5EFE6] rounded-2xl shrink-0">
                    {rule.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#78a130]">
                      Regla #{rule.id}
                    </span>
                    <h3 className="text-lg font-bold font-serif text-[#1A311C] mb-1">
                      {rule.title}
                    </h3>
                    <p className="text-xs text-gray-600 font-sans leading-relaxed">
                      {rule.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBPAGE 3: MISIÓN Y VISIÓN */}
        {activeSubpage === 'mision-vision' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Misión Card */}
              <div className="bg-white p-8 rounded-3xl border border-[#e5e4de] shadow-xl space-y-4 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300">
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-[#78a130]/10 text-[#78a130] rounded-2xl flex items-center justify-center">
                    <Target size={30} />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#78a130]">Propósito Fundamental</span>
                    <h3 className="text-2xl font-serif font-black text-[#1A311C] mt-1">Nuestra Misión</h3>
                  </div>
                  <p className="text-sm font-sans text-gray-700 leading-relaxed">
                    Formar niños y jóvenes lideres del ambiente, con conocimiento sobre su entorno natural, que lo compone y como interactúan sus diversos componentes bióticos y abióticos, con capacidad de discernir que actividades afectan y de que forma el equilibrio natural de su entorno. Y capaces de proponer y ejecutar estrategias que eviten, mitiguen o corrijan los diversos impactos negativos de las diferentes practicas humanas, en su entorno. Todo a través de la enseñanza vivencial, didáctica y entretenida de la verdadera educación ambiental.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e4de]/60 text-xs text-gray-500 font-sans italic">
                  "Sembrando amor por la naturaleza en las nuevas generaciones."
                </div>
              </div>

              {/* Visión Card */}
              <div className="bg-white p-8 rounded-3xl border border-[#e5e4de] shadow-xl space-y-4 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300">
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-[#1A311C]/10 text-[#1A311C] rounded-2xl flex items-center justify-center">
                    <Sparkles size={30} />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#1A311C]">Futuro Sostenible</span>
                    <h3 className="text-2xl font-serif font-black text-[#1A311C] mt-1">Nuestra Visión</h3>
                  </div>
                  <p className="text-sm font-sans text-gray-700 leading-relaxed">
                    Consolidar una generación de jóvenes y adultos, líderes ambientales, sensibles, inspirados por el conocimiento científico de su biodiversidad local y los diferentes entornos naturales, y así preserven la funcionalidad y el equilibrio de los ecosistemas del futuro, generando diversas estrategias para su protección y conservación.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e4de]/60 text-xs text-gray-500 font-sans italic">
                  "Un futuro donde la humanidad y la vida silvestre convivan en completa armonía."
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBPAGE 4: GALERÍA ECOLÓGICA */}
        {activeSubpage === 'galeria' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#1A311C]">
                Galería Ecológica
              </h2>
            </div>

            {/* Dynamic Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {galleryPhotos.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className="group relative bg-white rounded-3xl border border-[#e5e4de] shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden aspect-[4/3] bg-[#FBF8F3]">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#1A311C]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white/90 text-[#1A311C] p-3 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <Maximize2 size={20} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lightbox Modal */}
            {selectedPhotoIndex !== null && (
              <div
                className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setSelectedPhotoIndex(null)}
              >
                <div
                  className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedPhotoIndex(null)}
                    className="absolute -top-12 right-0 text-white hover:text-[#78a130] p-2 rounded-full transition-colors"
                  >
                    <X size={28} />
                  </button>

                  {/* Previous photo button */}
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-2 sm:-left-12 text-white bg-black/40 hover:bg-[#78a130] p-3 rounded-full transition-all"
                  >
                    <ChevronLeft size={28} />
                  </button>

                  {/* Photo Display */}
                  <img
                    src={galleryPhotos[selectedPhotoIndex].src}
                    alt={galleryPhotos[selectedPhotoIndex].title}
                    className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
                  />

                  {/* Next photo button */}
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-2 sm:-right-12 text-white bg-black/40 hover:bg-[#78a130] p-3 rounded-full transition-all"
                  >
                    <ChevronRight size={28} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default GreenVisionPage;
