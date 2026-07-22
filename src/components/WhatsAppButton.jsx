import React from 'react';

const WhatsAppButton = () => {
  const whatsappUrl = "https://wa.me/573134536499?text=Me%20interesa%20el%20libro%20y%20la%20estrategia%20educativa";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 bg-[#25D366] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all duration-300 animate-bounce"
      style={{ animationDuration: '3s' }}
      aria-label="Contactar por WhatsApp"
    >
      {/* Official WhatsApp SVG Icon */}
      <svg 
        width="26" 
        height="26" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="w-6 h-6 fill-current"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>

      <span className="hidden sm:inline font-sans font-bold text-xs tracking-wider uppercase">
        ¡Escríbenos!
      </span>

      {/* Pulse ring effect */}
      <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-50 animate-ping pointer-events-none"></span>
    </a>
  );
};

export default WhatsAppButton;
