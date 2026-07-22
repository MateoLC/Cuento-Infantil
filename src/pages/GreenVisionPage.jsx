import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, CheckCircle2, Newspaper, Mail, Heart, Send, Shield, Globe2, SunMedium } from 'lucide-react';

const decalogoRules = [
  { id: 1, title: 'Respetar cada fuente de agua', desc: 'Evitar el vertimiento de basura, químicos y aceites en quebradas, ríos y mares.', icon: '💧' },
  { id: 2, title: 'Proteger la flora nativa', desc: 'No talar ni arrancar árboles o plantas endémicas en páramos y bosques.', icon: '🌳' },
  { id: 3, title: 'No promover el tráfico de fauna', desc: 'Los animales silvestres deben vivir libres en sus ecosistemas naturales.', icon: '🦜' },
  { id: 4, title: 'Reducir, reutilizar y reciclar', desc: 'Separar los residuos correctamente para disminuir el impacto ambiental.', icon: '♻️' },
  { id: 5, title: 'Valorar la biodiversidad local', desc: 'Aprender sobre las especies únicas de Colombia para defender su existencia.', icon: '🇨🇴' },
  { id: 6, title: 'Ahorro inteligente de energía', desc: 'Aprovechar la luz natural y apagar aparatos que no estén en uso.', icon: '💡' },
  { id: 7, title: 'Fomentar la reforestación', desc: 'Sembrar árboles y plantas nativas que alimenten a polinizadores y aves.', icon: '🌱' },
  { id: 8, title: 'Evitar incendios forestales', desc: 'No hacer fogatas en reservas naturales ni dejar vidrios expuestos al sol.', icon: '🔥' },
  { id: 9, title: 'Educación y transmisión ecológica', desc: 'Compartir el cuento de Sofía con amigos, colegios y vecinos.', icon: '📚' },
  { id: 10, title: 'Vivir en armonía con la tierra', desc: 'Entender que el ser humano es un integrante más de la red de la vida.', icon: '🌍' }
];

const newsArticles = [
  {
    title: 'Colombia consolida su liderazgo en la conservación de anfibios',
    date: '15 de Julio, 2026',
    desc: 'Investigaciones en los Andes y el Tolima destacan nuevos hallazgos de ranas cristal y especies indicadoras.',
    tag: 'Biodiversidad'
  },
  {
    title: 'Restauración del hábitat del Oso de Anteojos en los páramos',
    date: '2 de Julio, 2026',
    desc: 'Comunidades locales y escuelas se unen para proteger el corredor biológico de alta montaña.',
    tag: 'Conservación'
  },
  {
    title: 'Campañas educativas de las Serpientes como aliadas de la agricultura',
    date: '20 de Junio, 2026',
    desc: 'Talleres ecológicos enseñan a los agricultores la importancia de las serpientes para el control biológico de roedores.',
    tag: 'Educación'
  }
];

const GreenVisionPage = () => {
  const location = useLocation();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const getSubpage = () => {
    if (location.pathname.includes('/decalogo')) return 'decalogo';
    if (location.pathname.includes('/noticias')) return 'noticias';
    if (location.pathname.includes('/contacto')) return 'contacto';
    return 'mision'; // Default
  };

  const activeSubpage = getSubpage();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
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
            to="/vision-verde/noticias"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              activeSubpage === 'noticias'
                ? 'bg-[#1A311C] text-white shadow-lg scale-105'
                : 'bg-white/80 text-[#2a322c] hover:bg-white border border-[#e5e4de]'
            }`}
          >
            <Newspaper size={18} className={activeSubpage === 'noticias' ? 'text-[#78a130]' : 'text-gray-500'} />
            <span>Noticias y Novedades</span>
          </Link>

          <Link
            to="/vision-verde/contacto"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              activeSubpage === 'contacto'
                ? 'bg-[#1A311C] text-white shadow-lg scale-105'
                : 'bg-white/80 text-[#2a322c] hover:bg-white border border-[#e5e4de]'
            }`}
          >
            <Mail size={18} className={activeSubpage === 'contacto' ? 'text-[#78a130]' : 'text-gray-500'} />
            <span>Contacto Ecológico</span>
          </Link>
        </div>

        {/* SUBPAGE 1: NUESTRA MISIÓN */}
        {activeSubpage === 'mision' && (
          <div className="space-y-8">
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e5e4de] shadow-xl space-y-6">
              <div className="flex items-center gap-3 text-[#78a130]">
                <Globe2 size={32} />
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A311C]">
                  Colombia: Megadiversidad en Riesgo
                </h2>
              </div>
              <p className="text-sm font-sans text-gray-700 leading-relaxed">
                A pesar de ocupar apenas el 1% de la superficie terrestre, Colombia sostiene la décima parte de todas las especies de seres vivos del planeta. Ocupamos el primer puesto del mundo en variedad de aves, anfibios y orquídeas.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                <div className="p-5 bg-[#F5EFE6] rounded-2xl text-center space-y-1">
                  <span className="text-3xl font-serif font-black text-[#1A311C]">#1</span>
                  <span className="text-xs font-bold text-[#78a130] uppercase block">Aves & Anfibios</span>
                  <span className="text-[11px] text-gray-500">Más de 791 especies de anfibios reportadas.</span>
                </div>
                <div className="p-5 bg-[#F5EFE6] rounded-2xl text-center space-y-1">
                  <span className="text-3xl font-serif font-black text-[#1A311C]">#2</span>
                  <span className="text-xs font-bold text-[#78a130] uppercase block">Plantas & Peces</span>
                  <span className="text-[11px] text-gray-500">Impresionante variedad en valles y ríos.</span>
                </div>
                <div className="p-5 bg-[#F5EFE6] rounded-2xl text-center space-y-1">
                  <span className="text-3xl font-serif font-black text-[#1A311C]">#3</span>
                  <span className="text-xs font-bold text-[#78a130] uppercase block">Reptiles & Mariposas</span>
                  <span className="text-[11px] text-gray-500">270 especies de serpientes y reptiles.</span>
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

        {/* SUBPAGE 3: NOTICIAS */}
        {activeSubpage === 'noticias' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsArticles.map((art, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-[#e5e4de] shadow-md flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <span className="text-[#78a130] bg-[#78a130]/10 px-2.5 py-1 rounded-full">{art.tag}</span>
                    <span>{art.date}</span>
                  </div>
                  <h3 className="text-lg font-bold font-serif text-[#1A311C] leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-gray-600 font-sans leading-relaxed">
                    {art.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUBPAGE 4: CONTACTO ECOLÓGICO */}
        {activeSubpage === 'contacto' && (
          <div className="bg-white p-8 rounded-3xl border border-[#e5e4de] shadow-xl max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-serif font-bold text-[#1A311C]">Únete al Club Ecológico de Sofía</h2>
              <p className="text-xs text-gray-500 font-sans">
                Envíanos tu mensaje o consulta para organizar talleres en tu colegio o comunidad.
              </p>
            </div>

            {!formSubmitted ? (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A311C] mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sofía López"
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm font-sans focus:outline-none focus:border-[#78a130]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A311C] mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm font-sans focus:outline-none focus:border-[#78a130]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A311C] mb-1">Mensaje o Ciudad</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="¿Cómo te gustaría colaborar con el proyecto de Sofía?"
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm font-sans focus:outline-none focus:border-[#78a130]"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#1A311C] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#78a130] transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Send size={16} />
                  <span>Enviar Mensaje Ecológico</span>
                </button>
              </form>
            ) : (
              <div className="p-6 bg-green-50 rounded-2xl border border-green-200 text-center space-y-3">
                <CheckCircle2 size={40} className="text-green-600 mx-auto" />
                <h3 className="text-xl font-bold font-serif text-green-900">¡Mensaje Enviado con Éxito!</h3>
                <p className="text-xs text-green-800 font-sans">
                  Gracias por sumarte a la red de guardianes de la naturaleza de Sofía. Nos pondremos en contacto muy pronto.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default GreenVisionPage;
