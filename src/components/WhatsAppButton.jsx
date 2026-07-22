import React from 'react';

const WhatsAppButton = () => {
  const whatsappUrl = "https://wa.me/573134536499?text=Me%20interesa%20el%20libro%20y%20la%20estrategia%20educativa";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all duration-500 ease-in-out"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
    >
      {/* Official WhatsApp Logo SVG */}
      <svg 
        viewBox="0 0 32 32" 
        className="w-8 h-8 sm:w-9 sm:h-9 fill-current drop-shadow-sm"
      >
        <path 
          d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 8.135-2.135c2.373 1.3 5.063 1.985 7.865 1.985 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.333c-2.484 0-4.912-0.665-7.042-1.925l-0.505-0.298-5.239 1.374 1.398-5.204-0.328-0.521c-1.38-2.193-2.117-4.733-2.117-7.292 0-7.625 6.208-13.833 13.833-13.833s13.833 6.208 13.833 13.833-6.208 13.833-13.833 13.833zM22.951 19.349c-0.38-0.19-2.25-1.11-2.598-1.236-0.348-0.126-0.602-0.19-0.855 0.19s-0.981 1.236-1.203 1.489c-0.222 0.253-0.444 0.285-0.824 0.095s-1.604-0.591-3.056-1.885c-1.129-1.008-1.892-2.253-2.114-2.633s-0.023-0.586 0.167-0.775c0.171-0.171 0.38-0.444 0.57-0.665s0.253-0.38 0.38-0.633c0.126-0.253 0.063-0.475-0.032-0.665s-0.855-2.059-1.171-2.82c-0.308-0.741-0.621-0.641-0.855-0.653-0.222-0.011-0.475-0.011-0.728-0.011s-0.665 0.095-1.013 0.475c-0.348 0.38-1.33 1.3-1.33 3.168s1.361 3.673 1.551 3.926c0.19 0.253 2.678 4.089 6.488 5.733 0.906 0.391 1.613 0.625 2.164 0.8 0.91 0.289 1.738 0.248 2.393 0.15 0.731-0.109 2.25-0.919 2.566-1.806s0.316-1.646 0.222-1.806c-0.095-0.159-0.348-0.253-0.728-0.444z" 
          fill="#ffffff"
        />
      </svg>

      {/* Very slow & subtle pulse aura (4s duration) */}
      <span 
        className="absolute -inset-1 rounded-full bg-[#25D366] opacity-20 pointer-events-none animate-ping"
        style={{ animationDuration: '4s', animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)' }}
      ></span>
    </a>
  );
};

export default WhatsAppButton;
