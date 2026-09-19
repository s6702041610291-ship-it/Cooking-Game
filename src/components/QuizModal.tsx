import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { audioManager } from '../audio';

interface QuizModalProps {
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  question,
  onAnswer,
  onClose,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedChoice(index);
    setHasAnswered(true);
    const isCorrect = index === question.correctIndex;

    if (isCorrect) {
      audioManager.playQuizCorrect();
    } else {
      audioManager.playQuizWrong();
    }
    onAnswer(isCorrect);
  };

  const isCorrect = selectedChoice === question.correctIndex;

  // Highlight the target word in the sentence
  const renderSentence = () => {
    const parts = question.sentence.split(new RegExp(`(${question.targetWord})`, 'gi'));
    return parts.map((part, i) => {
      if (part.toLowerCase() === question.targetWord.toLowerCase()) {
        return (
          <span
            key={i}
            className="bg-[#fce4ec] text-[#ad1457] px-2 py-0.5 rounded-md font-bold underline decoration-pink-400 decoration-2 text-base sm:text-lg"
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fff9fa] border-4 border-[#f4c2d7] rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Ribbon Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-1.5 bg-[#f4c2d7] text-[#5d4037] px-3.5 py-1 rounded-full font-bold text-xs sm:text-sm border border-[#e5a6c1] shadow-xs mb-1.5">
            <span>⏰ ควิซภาษาอังกฤษ</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#5d4037] font-['Kanit']">
            Parts of Speech
          </h2>
        </div>

        {/* English Sentence Card */}
        <div className="bg-white rounded-2xl border-2 border-[#f4c2d7] p-3 sm:p-4 mb-3 text-center shadow-xs">
          <div className="text-base sm:text-lg font-medium text-[#5d4037] italic font-['Playfair_Display'] leading-relaxed my-1">
            "{renderSentence()}"
          </div>
          <div className="text-xs sm:text-sm font-bold text-[#5d4037] mt-2 pt-2 border-t border-dashed border-[#f4c2d7]/60">
            {question.questionTh}
          </div>
        </div>

        {/* 4 Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {question.choices.map((choice, idx) => {
            let choiceStyle = 'bg-white border-[#f4c2d7] hover:bg-[#fff0f5] hover:border-[#e5a6c1] text-[#5d4037]';

            if (hasAnswered) {
              if (idx === question.correctIndex) {
                choiceStyle = 'bg-[#d8f3dc] border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-300';
              } else if (idx === selectedChoice) {
                choiceStyle = 'bg-red-100 border-red-400 text-red-900 line-through';
              } else {
                choiceStyle = 'bg-gray-50 border-gray-200 text-gray-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                id={`quiz-choice-${idx}`}
                disabled={hasAnswered}
                onClick={() => handleSelect(idx)}
                className={`p-2.5 rounded-xl border-2 text-xs sm:text-sm font-medium transition-all text-left flex items-center justify-between cursor-pointer ${choiceStyle}`}
              >
                <span>{choice}</span>
                {hasAnswered && idx === question.correctIndex && (
                  <span className="text-emerald-600 font-bold ml-1">✓ ถูก</span>
                )}
                {hasAnswered && idx === selectedChoice && idx !== question.correctIndex && (
                  <span className="text-red-500 font-bold ml-1">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Rewards */}
        {hasAnswered && (
          <div
            className={`p-3 rounded-xl border mb-3 animate-in slide-in-from-bottom-2 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
              <span>{isCorrect ? '🎉 ถูกต้อง!' : '💡 คำอธิบาย:'}</span>
              {isCorrect && (
                <span className="bg-emerald-200 text-emerald-900 text-[10px] px-2 py-0.5 rounded-full font-black">
                  +100 Pts / +25 Coins / +10s
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed">{question.explanationTh}</p>
          </div>
        )}

        {/* Close / Resume Button */}
        {hasAnswered && (
          <button
            id="quiz-resume-btn"
            onClick={() => {
              audioManager.playClick();
              onClose();
            }}
            className="w-full py-2.5 bg-[#a8e6cf] hover:bg-[#8ee0c2] text-[#1b4332] font-bold rounded-2xl border-2 border-[#74c69d] shadow-sm transition-transform active:scale-95 cursor-pointer text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-play"></i>
            <span>เล่นต่อ</span>
          </button>
        )}
      </div>
    </div>
  );
};
