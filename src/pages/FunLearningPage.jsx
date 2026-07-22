import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HelpCircle, Award, Palette, CheckCircle2, RotateCcw, Download, Sparkles, Star, Trophy, ArrowRight } from 'lucide-react';

const quizQuestions = [
  {
    id: 1,
    question: "¿Qué puesto ocupa Colombia en el mundo por su biodiversidad de aves y anfibios?",
    options: ["Tercer Lugar", "Primer Lugar", "Décimo Lugar", "Segundo Lugar"],
    correct: 1,
    explanation: "¡Correcto! Colombia es el país número 1 en el planeta en variedad de aves, anfibios y orquídeas."
  },
  {
    id: 2,
    question: "¿Cuál es la función ecológica principal de la Rana Dorada y los anfibios?",
    options: [
      "Indicadores de la calidad del agua y control de insectos",
      "Producir miel para los árboles",
      "Cantar durante el día para calentar el ambiente",
      "Limpiar la arena de los desiertos"
    ],
    correct: 0,
    explanation: "¡Excelente! Los anfibios son bioindicadores muy sensibles que nos avisan sobre la contaminación del agua y controlan plagas."
  },
  {
    id: 3,
    question: "¿Qué porcentaje de serpientes en Colombia representan un verdadero riesgo venenoso?",
    options: ["100%", "Solo el 18% (48 especies)", "El 50%", "Casi todas"],
    correct: 1,
    explanation: "¡Así es! Solo un pequeño porcentaje son venenosas; la inmensa mayoría son inofensivas y muy útiles como controladoras de roedores."
  },
  {
    id: 4,
    question: "¿Qué es un régimen bimodal en el clima de Colombia?",
    options: [
      "Tener cuatro estaciones marcadas con nieve",
      "Tener solo dos temporadas: secas y lluviosas",
      "Un clima que cambia cada hora",
      "Un día de sol y un día de lluvia"
    ],
    correct: 1,
    explanation: "¡Correcto! Al estar cerca del ecuador, Colombia cuenta con dos temporadas climáticas principales (secas y lluviosas)."
  }
];

const passportBadges = [
  { id: 'anfibio', title: 'Guardián del Agua', desc: 'Protegiste las fuentes hídricas y reconociste la importancia de las ranas.', icon: '🐸', unlocked: true },
  { id: 'serpiente', title: 'Amigo del Silencio', desc: 'Aprendiste a respetar a las serpientes como controladoras biológicas.', icon: '🐍', unlocked: true },
  { id: 'aves', title: 'Vigía del Viento', desc: 'Conociste por qué Colombia es el #1 en variedad de aves del mundo.', icon: '🦅', unlocked: true },
  { id: 'arboles', title: 'Protector del Bosque', desc: 'Sembraste conciencia para evitar la tala y reforestar tus comunidades.', icon: '🌳', unlocked: true },
  { id: 'mamiferos', title: 'Guardián del Páramo', desc: 'Defendiste el hábitat del Oso de Anteojos en las altas montañas.', icon: '🐻', unlocked: false },
  { id: 'ecologia', title: 'Héroe de Visión Verde', desc: 'Completaste el Decálogo Ambiental de Sofía.', icon: '🌱', unlocked: false }
];

const FunLearningPage = () => {
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const getSubpage = () => {
    if (location.pathname.includes('/pasaporte')) return 'pasaporte';
    if (location.pathname.includes('/talleres')) return 'talleres';
    return 'trivia'; // Default
  };

  const activeSubpage = getSubpage();

  const handleSelectOption = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-pink-600 bg-pink-100 px-4 py-1.5 rounded-full inline-block mb-3">
            Aprende Jugando
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#1A311C] uppercase tracking-tight">
            Diviértete Aprendiendo
          </h1>
          <p className="mt-2 text-sm text-[#2a322c]/80 font-sans">
            Desafía tus conocimientos ecológicos, colecciona insignias en tu pasaporte y descarga actividades.
          </p>
        </div>

        {/* Subpages Tabs */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-10 border-b border-[#e5e4de] pb-4 overflow-x-auto">
          <Link
            to="/diviertete-aprendiendo/trivia"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              activeSubpage === 'trivia'
                ? 'bg-pink-600 text-white shadow-lg scale-105'
                : 'bg-white/80 text-[#2a322c] hover:bg-white border border-[#e5e4de]'
            }`}
          >
            <HelpCircle size={18} />
            <span>Trivia Ecológica</span>
          </Link>

          <Link
            to="/diviertete-aprendiendo/pasaporte"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              activeSubpage === 'pasaporte'
                ? 'bg-pink-600 text-white shadow-lg scale-105'
                : 'bg-white/80 text-[#2a322c] hover:bg-white border border-[#e5e4de]'
            }`}
          >
            <Award size={18} />
            <span>Pasaporte del Explorador</span>
          </Link>

          <Link
            to="/diviertete-aprendiendo/talleres"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              activeSubpage === 'talleres'
                ? 'bg-pink-600 text-white shadow-lg scale-105'
                : 'bg-white/80 text-[#2a322c] hover:bg-white border border-[#e5e4de]'
            }`}
          >
            <Palette size={18} />
            <span>Coloreables y Talleres</span>
          </Link>
        </div>

        {/* SUBPAGE 1: TRIVIA ECOLÓGICA */}
        {activeSubpage === 'trivia' && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#e5e4de] shadow-xl max-w-3xl mx-auto">
            {!quizFinished ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400 border-b pb-3">
                  <span>Pregunta {currentQuestion + 1} de {quizQuestions.length}</span>
                  <span className="text-pink-600 font-black">Puntos: {score}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#1A311C]">
                  {quizQuestions[currentQuestion].question}
                </h3>

                <div className="space-y-3">
                  {quizQuestions[currentQuestion].options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === quizQuestions[currentQuestion].correct;
                    let btnStyle = "bg-[#F5EFE6] border-transparent text-[#1A311C] hover:bg-pink-50";

                    if (selectedAnswer !== null) {
                      if (isCorrect) btnStyle = "bg-green-100 border-green-500 text-green-900 font-bold";
                      else if (isSelected) btnStyle = "bg-red-100 border-red-500 text-red-900 font-bold";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left p-4 rounded-2xl border text-sm font-sans transition-all duration-200 flex justify-between items-center ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {selectedAnswer !== null && isCorrect && <CheckCircle2 size={20} className="text-green-600" />}
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <div className="p-4 bg-pink-50 rounded-2xl border border-pink-200 text-xs font-sans text-pink-900 space-y-3 animate-in fade-in">
                    <p>{quizQuestions[currentQuestion].explanation}</p>
                    <button
                      onClick={handleNextQuestion}
                      className="bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-pink-700 transition-colors flex items-center gap-2 ml-auto"
                    >
                      <span>Siguiente Pregunta</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
                  🏆
                </div>
                <h3 className="text-3xl font-bold font-serif text-[#1A311C]">
                  ¡Felicidades Explorador!
                </h3>
                <p className="text-sm font-sans text-gray-600">
                  Respondiste correctamente <strong className="text-pink-600">{score} de {quizQuestions.length}</strong> preguntas sobre la fauna y flora de Colombia.
                </p>

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    onClick={resetQuiz}
                    className="bg-[#1A311C] text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-[#78a130] transition-colors flex items-center gap-2 shadow-md"
                  >
                    <RotateCcw size={16} />
                    <span>Volver a Jugar</span>
                  </button>

                  <Link
                    to="/diviertete-aprendiendo/pasaporte"
                    className="bg-pink-600 text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-pink-700 transition-colors flex items-center gap-2 shadow-md"
                  >
                    <Award size={16} />
                    <span>Ver Insignias</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBPAGE 2: PASAPORTE DEL EXPLORADOR */}
        {activeSubpage === 'pasaporte' && (
          <div className="bg-white p-8 rounded-3xl border border-[#e5e4de] shadow-xl space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold font-serif text-[#1A311C]">Pasaporte del Explorador de Sofía</h2>
                <p className="text-xs text-gray-500 font-sans mt-1">
                  Reúne tus insignias didácticas explorando los capítulos y completando las actividades.
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

        {/* SUBPAGE 3: COLOREABLES Y TALLERES */}
        {activeSubpage === 'talleres' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#e5e4de] shadow-md space-y-4">
              <div className="text-4xl p-3 bg-pink-100 w-fit rounded-2xl">🎨</div>
              <h3 className="text-xl font-bold font-serif text-[#1A311C]">Fichas de Colorear: Anfibios</h3>
              <p className="text-xs text-gray-600 font-sans">
                Ilustraciones en blanco y negro para pintar la Rana Dorada y especies acuáticas.
              </p>
              <button className="w-full bg-[#1A311C] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#78a130] transition-colors flex items-center justify-center gap-2">
                <Download size={14} />
                <span>Descargar Ficha PDF</span>
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#e5e4de] shadow-md space-y-4">
              <div className="text-4xl p-3 bg-amber-100 w-fit rounded-2xl">🌱</div>
              <h3 className="text-xl font-bold font-serif text-[#1A311C]">Taller: Huerto en Casa</h3>
              <p className="text-xs text-gray-600 font-sans">
                Guía didáctica paso a paso para germinar semillas y sembrar en tu propio hogar.
              </p>
              <button className="w-full bg-[#1A311C] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#78a130] transition-colors flex items-center justify-center gap-2">
                <Download size={14} />
                <span>Descargar Guía</span>
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#e5e4de] shadow-md space-y-4">
              <div className="text-4xl p-3 bg-[#78a130]/10 w-fit rounded-2xl">🦅</div>
              <h3 className="text-xl font-bold font-serif text-[#1A311C]">Plegables Origami Aves</h3>
              <p className="text-xs text-gray-600 font-sans">
                Aprende a construir las aves más hermosas de Colombia en papel de colores.
              </p>
              <button className="w-full bg-[#1A311C] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#78a130] transition-colors flex items-center justify-center gap-2">
                <Download size={14} />
                <span>Descargar Plantilla</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FunLearningPage;
