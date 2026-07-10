import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import JourneyMap from './components/JourneyMap';
import ChapterView from './components/ChapterView';

function App() {
  const [selectedChapter, setSelectedChapter] = useState(null);

  const handleSelectChapter = (chapterId) => {
    setSelectedChapter(chapterId);
  };

  const handleCloseChapter = () => {
    setSelectedChapter(null);
  };

  return (
    <div className="min-h-screen bg-nature-light relative">
      <Navigation />
      
      {/* Main Map View */}
      <div 
        style={{ display: selectedChapter ? 'none' : 'block' }}
        className="transition-opacity duration-500 w-full relative bg-nature-light"
      >
        {/* Global Poster Background */}
        <img 
          src="/assets/8.png" 
          alt="Mapa y Fondo Global" 
          className="w-full h-auto block" 
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-[35%] relative">
            <HeroSection />
          </div>
          <div className="w-full h-[65%] relative">
            <JourneyMap onSelectChapter={handleSelectChapter} />
          </div>
        </div>
      </div>

      {/* Chapter Detail View */}
      {selectedChapter && (
        <ChapterView 
          chapterId={selectedChapter} 
          onClose={handleCloseChapter} 
        />
      )}
    </div>
  );
}

export default App;
