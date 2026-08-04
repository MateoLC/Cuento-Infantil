import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';
import ChaptersPage from './pages/ChaptersPage';
import FunLearningPage from './pages/FunLearningPage';
import GreenVisionPage from './pages/GreenVisionPage';
import LeaderboardPage from './pages/LeaderboardPage';
import WhatsAppButton from './components/WhatsAppButton';
import ExplorerProfileModal from './components/ExplorerProfileModal';
import ScoreToast from './components/ScoreToast';
import PrivacyConsentBanner from './components/PrivacyConsentBanner';
import LegalPage from './pages/LegalPage';
import { usePrivacy } from './privacy/usePrivacy';

function App() {
  const { openPrivacyPreferences } = usePrivacy();

  return (
    <div className="min-h-screen bg-[#F5EFE6] relative flex flex-col justify-between font-sans">
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/libro/*" element={<BookPage />} />
          <Route path="/capitulos" element={<ChaptersPage />} />
          <Route path="/capitulos/:chapterId" element={<ChaptersPage />} />
          <Route path="/diviertete-aprendiendo/*" element={<FunLearningPage />} />
          <Route path="/clasificacion" element={<LeaderboardPage />} />
          <Route path="/vision-verde/*" element={<GreenVisionPage />} />
          <Route path="/privacidad" element={<LegalPage type="privacy" />} />
          <Route path="/terminos" element={<LegalPage type="terms" />} />
        </Routes>
      </div>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
      <ExplorerProfileModal />
      <ScoreToast />
      <PrivacyConsentBanner />

      {/* Global Footer */}
      <footer className="bg-[#1A311C] text-white py-12 px-6 border-t border-[#78a130]/20 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <span className="font-serif font-black text-2xl tracking-tight block">SOFÍA</span>
            <span className="text-xs text-[#78a130] uppercase font-bold tracking-widest block mt-1">
              Un Verdadero Cuento Ecológico sobre la Biodiversidad de Colombia
            </span>
          </div>

          <div className="text-xs text-gray-400 font-medium space-y-2">
            <p>© {new Date().getFullYear()} Sofía Cuento Ecológico. Todos los derechos reservados.</p>
            <p>Educación ambiental para la protección de nuestros ecosistemas.</p>
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-end" aria-label="Información legal">
              <Link to="/privacidad" className="text-[#d9e8c8] hover:text-white">Privacidad</Link>
              <Link to="/terminos" className="text-[#d9e8c8] hover:text-white">Términos</Link>
              <button type="button" onClick={openPrivacyPreferences} className="text-[#d9e8c8] hover:text-white">
                Configurar privacidad
              </button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
