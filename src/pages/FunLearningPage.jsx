import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Award, 
  Palette, 
  CheckCircle2, 
  Trophy, 
  Grid, 
  Compass, 
  HelpCircle, 
  Layers, 
  Sparkles 
} from 'lucide-react';

const passportBadges = [
  { id: 'anfibio', title: 'Guardián del Agua', desc: 'Protegiste las fuentes hídricas y reconociste la importancia de las ranas.', icon: '🐸', unlocked: true },
  { id: 'serpiente', title: 'Amigo del Silencio', desc: 'Aprendiste a respetar a las serpientes como controladoras biológicas.', icon: '🐍', unlocked: true },
  { id: 'aves', title: 'Vigía del Viento', desc: 'Conociste por qué Colombia es el #1 en variedad de aves del mundo.', icon: '🦅', unlocked: true },
  { id: 'arboles', title: 'Protector del Bosque', desc: 'Sembraste conciencia para evitar la tala y reforestar tus comunidades.', icon: '🌳', unlocked: true },
  { id: 'mamiferos', title: 'Guardián del Páramo', desc: 'Defendiste el hábitat del Oso de Anteojos en las altas montañas.', icon: '🐻', unlocked: false },
  { id: 'ecologia', title: 'Héroe de Visión Verde', desc: 'Completaste el Decálogo Ambiental de Sofía.', icon: '🌱', unlocked: false }
];

const gamesList = [
  { id: 'sopa', label: 'Sopa de letras', path: '/diviertete-aprendiendo/index.html', icon: Grid, badge: '01' },
  { id: 'laberinto', label: 'Laberinto', path: '/diviertete-aprendiendo/laberinto.html', icon: Compass, badge: '02' },
  { id: 'crucigrama', label: 'Crucigrama', path: '/diviertete-aprendiendo/crucigrama.html', icon: HelpCircle, badge: '03' },
  { id: 'colorear', label: 'Colorear', path: '/diviertete-aprendiendo/colorear.html', icon: Palette, badge: '04' },
  { id: 'asociar', label: 'Asociar', path: '/diviertete-aprendiendo/asociar.html', icon: Layers, badge: '05' },
];

const FunLearningPage = () => {
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname.includes('/pasaporte')) return 'pasaporte';
    if (location.pathname.includes('/laberinto')) return 'laberinto';
    if (location.pathname.includes('/crucigrama')) return 'crucigrama';
    if (location.pathname.includes('/colorear')) return 'colorear';
    if (location.pathname.includes('/asociar')) return 'asociar';
    return 'sopa'; // Default game
  };

  const activeTab = getActiveTab();
  const activeGame = gamesList.find(g => g.id === activeTab) || gamesList[0];

  return (
    <div className="min-h-screen bg-[#153820] text-white py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#d9e9ad] bg-[#78a130]/20 px-4 py-1.5 rounded-full inline-block">
            Aprende Jugando
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-white uppercase tracking-tight">
            Diviértete Aprendiendo
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 font-sans">
            Explora las 5 actividades interactivas sobre la biodiversidad de Colombia y colecciona insignias.
          </p>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex justify-center items-center gap-1.5 sm:gap-3 border-b border-white/10 pb-4 overflow-x-auto">
          {gamesList.map((game) => {
            const IconComp = game.icon;
            const isActive = activeTab === game.id;
            const targetRoute = game.id === 'sopa' ? '/diviertete-aprendiendo' : `/diviertete-aprendiendo/${game.id}`;

            return (
              <Link
                key={game.id}
                to={targetRoute}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-[#6f913f] text-white shadow-lg scale-105'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20 border border-white/10'
                }`}
              >
                <span className="text-[10px] text-pink-300 font-black">{game.badge}</span>
                <IconComp size={16} />
                <span>{game.label}</span>
              </Link>
            );
          })}

          <Link
            to="/diviertete-aprendiendo/pasaporte"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
              activeTab === 'pasaporte'
                ? 'bg-amber-500 text-amber-950 shadow-lg scale-105'
                : 'bg-white/10 text-gray-200 hover:bg-white/20 border border-white/10'
            }`}
          >
            <Award size={16} />
            <span>Pasaporte</span>
          </Link>
        </div>

        {/* CONTENT AREA */}
        {activeTab !== 'pasaporte' ? (
          /* Native Interactive Games Container */
          <div className="bg-[#fffaf0] rounded-3xl border border-white/10 shadow-2xl overflow-hidden min-h-[750px] relative">
            <iframe
              src={activeGame.path}
              title={`Juego ${activeGame.label}`}
              className="w-full h-[800px] border-0 rounded-3xl"
              style={{ minHeight: '780px' }}
            />
          </div>
        ) : (
          /* PASAPORTE DEL EXPLORADOR */
          <div className="bg-white text-[#1A311C] p-6 sm:p-10 rounded-3xl border border-[#e5e4de] shadow-2xl space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold font-serif text-[#1A311C]">Pasaporte del Explorador de Sofía</h2>
                <p className="text-xs text-gray-500 font-sans mt-1">
                  Reúne tus insignias didácticas explorando los capítulos y completando los 5 juegos ecológicos.
                </p>
              </div>
              <div className="bg-[#F5EFE6] px-4 py-2 rounded-2xl flex items-center gap-2 border border-[#78a130]/30">
                <Trophy size={20} className="text-amber-500" />
                <span className="text-xs font-bold text-[#1A311C]">4 / 6 Insignias Desbloqueadas</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {passportBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-6 rounded-3xl border transition-all duration-300 flex items-start gap-4 ${
                    badge.unlocked 
                      ? 'bg-[#F5EFE6]/60 border-[#78a130]/40 shadow-sm' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-4xl p-3 bg-white rounded-2xl shadow-sm shrink-0">
                    {badge.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold font-serif text-[#1A311C]">{badge.title}</h4>
                      {badge.unlocked && <CheckCircle2 size={16} className="text-[#78a130]" />}
                    </div>
                    <p className="text-xs text-gray-600 font-sans leading-relaxed">{badge.desc}</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#78a130] block pt-1">
                      {badge.unlocked ? '¡Completado!' : 'Por Desbloquear'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FunLearningPage;
