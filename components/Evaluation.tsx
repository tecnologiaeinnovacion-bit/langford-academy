
import React, { useState } from 'react';
import { EvaluationQuestion } from '../types';

interface EvaluationProps {
  questions: EvaluationQuestion[];
  onComplete: (score: number) => void;
}

const Evaluation: React.FC<EvaluationProps> = ({ questions, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No hay preguntas configuradas para esta evaluación.
      </div>
    );
  }

  const handleAnswer = (optionIdx: number) => {
    setSelectedOption(optionIdx);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      const correctCount = newAnswers.reduce((acc, ans, i) =>
        ans === questions[i].correctAnswer ? acc + 1 : acc, 0
      );
      const score = Math.round((correctCount / questions.length) * 100);
      setShowResult(true);
      onComplete(score);
    }
  };

  if (showResult) {
    const score = Math.round((answers.reduce((acc, ans, i) => ans === questions[i].correctAnswer ? acc + 1 : acc, 0) / questions.length) * 100);
    return (
      <div className="p-10 text-center space-y-6">
        <div className={`text-6xl font-black ${score >= 70 ? 'text-green-500' : 'text-red-500'}`}>
          {score}%
        </div>
        <h3 className="text-2xl font-bold">
          {score >= 70 ? '¡Felicidades! Has aprobado.' : 'No has alcanzado el puntaje mínimo.'}
        </h3>
        <button onClick={() => { setCurrentIdx(0); setAnswers([]); setShowResult(false); setSelectedOption(null); }} className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold">
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Pregunta {currentIdx + 1} de {questions.length}</span>
        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>
      
      <h3 className="text-xl font-black text-gray-900 mb-8 leading-tight">{questions[currentIdx].question}</h3>
      
      <div className="space-y-4">
        {questions[currentIdx].options.map((opt, i) => {
          const isSelected = selectedOption === i;
          const isCorrect = i === questions[currentIdx].correctAnswer;
          return (
            <button 
              key={i} 
              onClick={() => handleAnswer(i)}
              className={`w-full p-5 text-left border-2 rounded-2xl transition-all font-bold text-gray-700 ${
                isSelected ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-100 hover:border-blue-900 hover:bg-blue-50'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selectedOption !== null && (
        <div className="mt-6 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-gray-600">
          <p className="font-bold mb-2">
            {selectedOption === questions[currentIdx].correctAnswer ? 'Respuesta correcta' : 'Respuesta incorrecta'}
          </p>
          <p>{questions[currentIdx].explanation || 'Revisa el contenido y vuelve a intentarlo si es necesario.'}</p>
          <button
            onClick={handleNext}
            className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-xl font-bold"
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
};

export default Evaluation;
