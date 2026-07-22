import React from 'react';
import { useLocation } from 'react-router-dom';

const FunLearningPage = () => {
  const location = useLocation();

  const getGamePath = () => {
    if (location.pathname.includes('/laberinto')) return '/diviertete-aprendiendo/laberinto.html';
    if (location.pathname.includes('/crucigrama')) return '/diviertete-aprendiendo/crucigrama.html';
    if (location.pathname.includes('/colorear')) return '/diviertete-aprendiendo/colorear.html';
    if (location.pathname.includes('/asociar')) return '/diviertete-aprendiendo/asociar.html';
    return '/diviertete-aprendiendo/index.html'; // Default
  };

  const gamePath = getGamePath();

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] h-[calc(100vh-5rem)] bg-[#153820] flex flex-col overflow-hidden">
      <iframe
        src={gamePath}
        title="Diviértete Aprendiendo - Juegos Ecológicos"
        className="w-full h-full border-0 block flex-1"
      />
    </div>
  );
};

export default FunLearningPage;
