import React from 'react';
import { useLocation } from 'react-router-dom';

const FunLearningPage = () => {
  const location = useLocation();

  const getGamePath = () => {
    let basePath = '/diviertete-aprendiendo/sopa.html';
    if (location.pathname.includes('/memoria')) basePath = '/diviertete-aprendiendo/memoria.html';
    else if (location.pathname.includes('/laberinto')) basePath = '/diviertete-aprendiendo/laberinto.html';
    else if (location.pathname.includes('/crucigrama')) basePath = '/diviertete-aprendiendo/crucigrama.html';
    else if (location.pathname.includes('/colorear')) basePath = '/diviertete-aprendiendo/colorear.html';
    else if (location.pathname.includes('/asociar')) basePath = '/diviertete-aprendiendo/asociar.html';
    return basePath + (location.search || '');
  };

  const gamePath = getGamePath();

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] bg-[#153820] flex flex-col">
      <iframe
        key={gamePath}
        src={gamePath}
        title="Diviértete Aprendiendo - Juegos Ecológicos"
        className="w-full min-h-[calc(100vh-5rem)] border-0 block flex-1"
      />
    </div>
  );
};

export default FunLearningPage;
