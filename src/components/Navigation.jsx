import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Flower2, 
  ChevronDown, 
  BookOpen, 
  Map, 
  Sparkles, 
  Leaf, 
  HelpCircle, 
  Award, 
  Palette, 
  CheckCircle2, 
  Newspaper, 
  Mail, 
  Menu, 
  X,
  Book,
  Compass,
  ShoppingBag
} from 'lucide-react';

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
      { label: 'Libro Físico y Proyecto', path: '/libro', icon: ShoppingBag, desc: 'Iniciativa educativa y adquisición' },
      { label: 'Sinopsis y Personajes', path: '/libro/personajes', icon: Sparkles, desc: 'Sofía y la fauna de Colombia' }
    ]
  },
  {
    title: 'CAPÍTULOS',
    path: '/capitulos',
    subpages: [
      { label: '1. Anfibios', path: '/capitulos/anfibios', icon: Leaf, desc: 'Guardianes del agua' },
      { label: '2. Serpientes', path: '/capitulos/serpientes', icon: Leaf, desc: 'Reinas del silencio' },
      { label: '3. Reptiles', path: '/capitulos/reptiles', icon: Leaf, desc: 'Maestros del sol' },
      { label: '4. Aves', path: '/capitulos/aves', icon: Leaf, desc: 'Joyas del viento' },
      { label: '5. Mamíferos', path: '/capitulos/mamiferos', icon: Leaf, desc: 'Espíritus del bosque' },
      { label: '6. Árboles', path: '/capitulos/arboles', icon: Leaf, desc: 'Pulmones de la tierra' },
      { label: '7. Ser Humano', path: '/capitulos/serhumano', icon: Leaf, desc: 'Armonía y naturaleza' }
    ]
  },
  {
    title: 'DIVIÉRTETE APRENDIENDO',
    path: '/diviertete-aprendiendo',
    subpages: [
      { label: '1. Sopa de letras', path: '/diviertete-aprendiendo', icon: HelpCircle, desc: 'Encuentra las palabras escondidas' },
      { label: '2. Laberinto', path: '/diviertete-aprendiendo/laberinto', icon: Compass, desc: 'Guía el camino por el humedal' },
      { label: '3. Crucigrama', path: '/diviertete-aprendiendo/crucigrama', icon: Book, desc: 'Reto de conocimientos ecológicos' },
      { label: '4. Colorear', path: '/diviertete-aprendiendo/colorear', icon: Palette, desc: 'Pinta la biodiversidad de Colombia' },
      { label: '5. Asociar', path: '/diviertete-aprendiendo/asociar', icon: Award, desc: 'Relaciona especies y conceptos' }
    ]
  },
  {
    title: 'VISIÓN VERDE',
    path: '/vision-verde',
    subpages: [
      { label: 'Nuestra Misión', path: '/vision-verde/mision', icon: Leaf, desc: 'Biodiversidad y conservación' },
      { label: 'Decálogo Ambiental', path: '/vision-verde/decalogo', icon: CheckCircle2, desc: '10 compromisos por el planeta' },
      { label: 'Noticias y Eco-Novedades', path: '/vision-verde/noticias', icon: Newspaper, desc: 'Novedades y eventos ambientales' },
      { label: 'Contacto Ecológico', path: '/vision-verde/contacto', icon: Mail, desc: 'Únete al club ecológico' }
    ]
  }
];

const Navigation = () => {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);

  const isActive = (itemPath) => {
    if (itemPath === '/') return location.pathname === '/';
    return location.pathname.startsWith(itemPath);
  };

  return (
    <nav className="w-full bg-[#F5EFE6] sticky top-0 z-50 border-b border-[#e5e4de] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center group">
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
            const active = isActive(item.path);
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
                            <div className="p-2 bg-[#78a130]/10 rounded-lg group-hover/sub:bg-[#78a130] group-hover/sub:text-white transition-colors text-[#1A311C]">
                              <IconComp size={16} />
                            </div>
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
        <div className="lg:hidden bg-[#F5EFE6] border-b border-[#e5e4de] px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-300">
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
                        <sub.icon size={14} className="text-[#78a130]" />
                        <span>{sub.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="pt-2">
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
