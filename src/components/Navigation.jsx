import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Leaf,
  CheckCircle2,
  Menu,
  X,
  Compass,
  ShoppingBag,
  Image as ImageIcon,
  Trophy,
  UsersRound
} from 'lucide-react';
import { useExplorer } from '../leaderboard/useExplorer';
import { usePrivacy } from '../privacy/usePrivacy';

const menuItems = [
  {
    title: 'INICIO',
    path: '/',
    subpages: []
  },
  {
    title: 'LIBRO',
    path: '/libro',
    subpages: [
      { label: 'Libro Físico y Proyecto', path: '/libro', imgSrc: '/assets/submenus/icon-libro-fisico.webp', desc: 'Iniciativa educativa y adquisición' },
      { label: 'Sinopsis y Personajes', path: '/libro/personajes', imgSrc: '/assets/submenus/icon-sinopsis-personajes.webp', desc: 'Sofía y la fauna de Colombia' }
    ]
  },
  {
    title: 'CAPÍTULOS',
    path: '/capitulos',
    subpages: [
      { label: '1. Anfibios', path: '/capitulos/anfibios', imgSrc: '/assets/capitulos/icon-01-anfibios.webp', desc: 'Guardianes del agua' },
      { label: '2. Serpientes', path: '/capitulos/serpientes', imgSrc: '/assets/capitulos/icon-02-serpientes.webp', desc: 'Reinas del silencio' },
      { label: '3. Reptiles', path: '/capitulos/reptiles', imgSrc: '/assets/capitulos/icon-03-reptiles.webp', desc: 'Maestros del sol' },
      { label: '4. Aves', path: '/capitulos/aves', imgSrc: '/assets/capitulos/icon-04-aves.webp', desc: 'Joyas del viento' },
      { label: '5. Mamíferos', path: '/capitulos/mamiferos', imgSrc: '/assets/capitulos/icon-05-mamiferos.webp', desc: 'Espíritus del bosque' },
      { label: '6. Árboles', path: '/capitulos/arboles', imgSrc: '/assets/capitulos/icon-06-arboles.webp', desc: 'Pulmones de la tierra' },
      { label: '7. Ser Humano', path: '/capitulos/serhumano', imgSrc: '/assets/capitulos/icon-07-ser-humano.webp', desc: 'Armonía y naturaleza' }
    ]
  },
  {
    title: 'DIVIÉRTETE APRENDIENDO',
    path: '/diviertete-aprendiendo',
    subpages: [
      { label: '1. Sopa de letras', path: '/diviertete-aprendiendo', imgSrc: '/assets/submenus/icon-sopa-letras.webp', desc: 'Encuentra las palabras escondidas' },
      { label: '2. Laberinto', path: '/diviertete-aprendiendo/laberinto', imgSrc: '/assets/submenus/icon-laberinto.webp', desc: 'Guía el camino por el humedal' },
      { label: '3. Crucigrama', path: '/diviertete-aprendiendo/crucigrama', imgSrc: '/assets/submenus/icon-crucigrama.webp', desc: 'Reto de conocimientos ecológicos' },
      { label: '4. Colorear', path: '/diviertete-aprendiendo/colorear', imgSrc: '/assets/submenus/icon-colorear.webp', desc: 'Pinta la biodiversidad de Colombia' },
      { label: '5. Asociar', path: '/diviertete-aprendiendo/asociar', imgSrc: '/assets/submenus/icon-asociar.webp', desc: 'Relaciona especies y conceptos' },
      { label: '6. Memoria', path: '/diviertete-aprendiendo/memoria', imgSrc: '/assets/submenus/icon-memoria.webp', desc: 'Encuentra las parejas de fauna' },
      { label: '7. Clasificación', path: '/clasificacion', imgSrc: '/assets/submenus/icon-clasificacion.webp', desc: 'Puntos y posiciones públicas' }
    ]
  },
  {
    title: 'VISIÓN VERDE',
    path: '/vision-verde',
    subpages: [
      { label: 'Nuestra Misión', path: '/vision-verde/mision', icon: Leaf, desc: 'Biodiversidad y conservación' },
      { label: 'Decálogo Ambiental', path: '/vision-verde/decalogo', icon: CheckCircle2, desc: '10 compromisos por el planeta' },
      { label: 'Misión y Visión', path: '/vision-verde/mision-vision', icon: Compass, desc: 'Propósito y futuro ecológico' },
      { label: 'Galería Ecológica', path: '/vision-verde/galeria', icon: ImageIcon, desc: 'Fotos e ilustraciones ecológicas' }
    ]
  }
];

const Navigation = () => {
  const location = useLocation();
  const { player, openProfile } = useExplorer();
  const { explorerCount } = usePrivacy();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);

  const isActive = (itemPath) => {
    if (itemPath === '/') return location.pathname === '/';
    return location.pathname.startsWith(itemPath);
  };

  const formattedExplorerCount = explorerCount === null
    ? '—'
    : new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 1 }).format(explorerCount);

  return (
    <nav className="w-full bg-[#e6f2d6] sticky top-0 z-50 border-b border-[#c8e0a8] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center group -ml-1 sm:-ml-2 md:-ml-3">
          <div className="flex flex-col text-left">
            <span className="text-[#1A311C] font-serif font-black text-2xl tracking-tight leading-none">SOFÍA</span>
            <span className="text-[#2a322c] font-sans font-bold text-[9px] uppercase tracking-wider leading-tight mt-0.5">
              UN VERDADERO<br/>CUENTO ECOLÓGICO
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-1 xl:gap-2 items-center">
          {menuItems.map((item, idx) => {
            const active = isActive(item.path)
              || (item.path === '/diviertete-aprendiendo' && location.pathname === '/clasificacion');
            const hasSubpages = item.subpages && item.subpages.length > 0;
            const isHovered = activeDropdown === idx && hasSubpages;

            return (
              <div 
                key={item.title}
                className="relative py-4"
                onMouseEnter={() => hasSubpages && setActiveDropdown(idx)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] xl:text-[12px] font-sans font-bold tracking-wider uppercase transition-all duration-200 ${
                    active 
                      ? 'text-[#1A311C] bg-[#78a130]/15' 
                      : 'text-[#2a322c] hover:text-[#1A311C] hover:bg-black/5'
                  }`}
                >
                  <span>{item.title}</span>
                  {hasSubpages && (
                    <ChevronDown 
                      size={14} 
                      className={`transition-transform duration-200 ${isHovered ? 'rotate-180 text-[#78a130]' : 'opacity-60'}`} 
                    />
                  )}
                </Link>

                {/* Active Indicator Bar */}
                {active && (
                  <div className="absolute bottom-1 left-3 right-3 h-[3px] bg-[#78a130] rounded-full animate-pulse" />
                )}

                {/* Subpages Dropdown */}
                {isHovered && hasSubpages && (
                  <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-xl border border-[#e5e4de] p-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#78a130] px-3 py-1 mb-1 border-b border-gray-100">
                      Subpáginas de {item.title}
                    </div>
                    <div className="flex flex-col gap-1">
                      {item.subpages.map((sub) => {
                        const IconComp = sub.icon;
                        return (
                          <Link
                            key={sub.label}
                            to={sub.path}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F5EFE6] transition-colors group/sub"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {sub.imgSrc ? (
                              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                <img src={sub.imgSrc} alt="" className="w-7 h-7 object-contain" decoding="async" />
                              </div>
                            ) : (
                              <div className="p-2 bg-[#78a130]/10 rounded-lg group-hover/sub:bg-[#78a130] group-hover/sub:text-white transition-colors text-[#1A311C]">
                                <IconComp size={16} />
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-[#1A311C] group-hover/sub:text-[#78a130] transition-colors">
                                {sub.label}
                              </span>
                              <span className="text-[10px] text-gray-500 leading-tight">
                                {sub.desc}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <div
            className="hidden h-10 min-w-[68px] items-center justify-center gap-2 rounded-md border border-[#9db585] bg-white/35 px-2.5 text-[#1A311C] min-[1180px]:flex"
            aria-label={`${explorerCount ?? 0} exploradores han visitado el sitio`}
            title={`${explorerCount ?? 0} exploradores`}
          >
            <UsersRound size={18} aria-hidden="true" />
            <strong className="text-xs tabular-nums">{formattedExplorerCount}</strong>
          </div>
          <button
            type="button"
            onClick={openProfile}
            className="grid h-10 w-10 place-items-center rounded-md border border-[#9db585] text-[#1A311C] hover:bg-white/60"
            aria-label={player ? `Pasaporte de ${player.displayName}` : 'Crear pasaporte del explorador'}
            title={player ? `${player.displayName}: ${player.points || 0} puntos` : 'Crear pasaporte'}
          >
            <Trophy size={18} />
          </button>
          <Link
            to="/libro"
            className="bg-[#1A311C] text-white px-4 py-2.5 rounded-xl text-[11px] font-bold tracking-wider uppercase hover:bg-[#78a130] transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <ShoppingBag size={15} className="text-[#78a130]" />
            <span>LIBRO FÍSICO</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 text-[#1A311C] hover:bg-black/5 rounded-xl transition-colors"
          aria-label="Menú principal"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#e6f2d6] border-b border-[#c8e0a8] px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-300">
          {menuItems.map((item, idx) => {
            const hasSubpages = item.subpages && item.subpages.length > 0;
            const isExpanded = expandedMobileCategory === idx;

            if (!hasSubpages) {
              return (
                <div key={item.title} className="bg-white/70 rounded-xl border border-black/5 overflow-hidden">
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex justify-between items-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#1A311C]"
                  >
                    <span>{item.title}</span>
                  </Link>
                </div>
              );
            }

            return (
              <div key={item.title} className="bg-[#ffffff]/70 rounded-xl border border-black/5 overflow-hidden">
                <button
                  onClick={() => setExpandedMobileCategory(isExpanded ? null : idx)}
                  className="w-full flex justify-between items-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#1A311C]"
                >
                  <span>{item.title}</span>
                  <ChevronDown className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#78a130]' : ''}`} size={16} />
                </button>

                {isExpanded && (
                  <div className="bg-white px-3 py-2 border-t border-gray-100 space-y-1">
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-xs font-bold text-[#78a130] hover:bg-gray-50 rounded-lg"
                    >
                      Ir a {item.title} Principal
                    </Link>
                    {item.subpages.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-[#F5EFE6] rounded-lg"
                      >
                        {sub.imgSrc ? (
                          <img src={sub.imgSrc} alt="" className="w-5 h-5 object-contain shrink-0" decoding="async" />
                        ) : (
                          <sub.icon size={14} className="text-[#78a130]" />
                        )}
                        <span>{sub.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="pt-2">
            <div className="mb-2 flex w-full items-center justify-center gap-2 rounded-md border border-[#8daa75] bg-white/45 py-3 text-xs font-bold text-[#1A311C]">
              <UsersRound size={17} aria-hidden="true" />
              <span>{formattedExplorerCount} exploradores</span>
            </div>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); openProfile(); }}
              className="mb-2 flex w-full items-center justify-center gap-2 rounded-md border border-[#8daa75] bg-white/70 py-3 text-xs font-bold uppercase tracking-wider text-[#1A311C]"
            >
              <Trophy size={16} />
              <span>{player ? `${player.displayName}: ${player.points || 0} puntos` : 'Crear pasaporte'}</span>
            </button>
            <Link
              to="/libro"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-[#1A311C] text-[#ffffff] py-3 rounded-xl text-xs font-bold tracking-wider uppercase flex justify-center items-center gap-2"
            >
              <ShoppingBag size={16} className="text-[#78a130]" />
              <span>COMPRAR LIBRO FÍSICO</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
