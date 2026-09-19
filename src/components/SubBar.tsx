import React from 'react';
import { audioManager } from '../audio';

interface SubBarProps {
  levelId: number;
  dayNumber: number;
  score: number;
  targetScore: number;
  starGoals: [number, number, number];
  timeRemaining: number;
  isPaused: boolean;
  secondsUntilNextQuiz: number;
  freezeBoosterCount: number;
  healBoosterCount: number;
  cleanBoosterCount: number;
  onUseFreeze: () => void;
  onUseHeal: () => void;
  onUseClean: () => void;
  isTimeFrozen: boolean;
}

export const SubBar: React.FC<SubBarProps> = ({
  levelId,
  dayNumber,
  score,
  targetScore,
  starGoals,
  timeRemaining,
  isPaused,
  secondsUntilNextQuiz,
  freezeBoosterCount,
  healBoosterCount,
  cleanBoosterCount,
  onUseFreeze,
  onUseHeal,
  onUseClean,
  isTimeFrozen,
}) => {
  // Determine stars earned so far
  const currentStars = score >= starGoals[2] ? 3 : score >= starGoals[1] ? 2 : score >= starGoals[0] ? 1 : 0;

  return (
    <div className="w-full bg-[#fffcf5] border-b border-[#f4c2d7]/70 py-2.5 px-3 sm:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Level, Day & Target Goal */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-[#f4c2d7] text-[#5d4037] font-bold px-3 py-1 rounded-full text-xs sm:text-sm border border-[#e5a6c1] shadow-xs">
            Lv.{levelId} - Day {dayNumber}
          </div>
          <div className="bg-white px-3 py-1 rounded-full text-xs sm:text-sm text-[#7d5244] border border-[#f4c2d7]/60 flex items-center gap-1.5 shadow-xs">
            <span>เป้า:</span>
            <span className="font-bold text-[#5d4037]">{targetScore}</span>
            <div className="flex gap-0.5 text-xs ml-1 text-amber-400">
              <i className={`fa-star ${currentStars >= 1 ? 'fa-solid' : 'fa-regular text-gray-300'}`}></i>
              <i className={`fa-star ${currentStars >= 2 ? 'fa-solid' : 'fa-regular text-gray-300'}`}></i>
              <i className={`fa-star ${currentStars >= 3 ? 'fa-solid' : 'fa-regular text-gray-300'}`}></i>
            </div>
          </div>
        </div>

        {/* Center Score & Time */}
        <div className="flex items-center gap-4 sm:gap-8 justify-center">
          {/* Score Counter */}
          <div className="text-center">
            <div className="text-[10px] sm:text-xs text-[#8c6b5e] uppercase tracking-wider font-semibold">
              คะแนน
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#5d4037] font-['Kanit'] leading-tight">
              {score}
            </div>
          </div>

          {/* Time Remaining */}
          <div className="text-center">
            <div className="text-[10px] sm:text-xs text-[#8c6b5e] uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
              <span>เวลา</span>
              {isTimeFrozen && (
                <span className="bg-blue-100 text-blue-700 text-[10px] px-1 rounded font-bold animate-pulse">
                  หยุด!
                </span>
              )}
            </div>
            <div
              className={`text-xl sm:text-2xl font-black font-['Kanit'] leading-tight flex items-center justify-center gap-1 ${
                timeRemaining <= 15 ? 'text-red-600 animate-pulse' : 'text-[#5d4037]'
              }`}
            >
              <span>{timeRemaining}s</span>
            </div>
          </div>

          {/* Quiz Countdown badge */}
          <div className="hidden md:flex flex-col items-center bg-[#fdf2f7] px-2.5 py-0.5 rounded-lg border border-[#f4c2d7]/50 text-xs text-[#7d5244]">
            <span className="text-[10px] font-medium text-pink-700">🧠 ควิซ:</span>
            <span className="font-bold text-pink-900 font-['Kanit']">{secondsUntilNextQuiz}s</span>
          </div>
        </div>

        {/* Boosters Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Freeze Time */}
          <button
            id="booster-freeze-btn"
            onClick={() => {
              if (freezeBoosterCount > 0 && !isPaused && !isTimeFrozen) {
                audioManager.playBooster();
                onUseFreeze();
              }
            }}
            disabled={freezeBoosterCount <= 0 || isPaused || isTimeFrozen}
            className={`px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer shadow-xs ${
              freezeBoosterCount > 0 && !isTimeFrozen
                ? 'bg-[#d8f3dc] text-[#1b4332] border-[#b7e4c7] hover:bg-[#b7e4c7] active:scale-95'
                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
            }`}
            title="หยุดเวลา 10 วินาที"
          >
            <span>❄️ หยุดเวลา</span>
            <span className="bg-white/80 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {freezeBoosterCount}
            </span>
          </button>

          {/* Heal Customers */}
          <button
            id="booster-heal-btn"
            onClick={() => {
              if (healBoosterCount > 0 && !isPaused) {
                audioManager.playBooster();
                onUseHeal();
              }
            }}
            disabled={healBoosterCount <= 0 || isPaused}
            className={`px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer shadow-xs ${
              healBoosterCount > 0
                ? 'bg-[#ffd6e0] text-[#780016] border-[#ffccd5] hover:bg-[#ffb3c1] active:scale-95'
                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
            }`}
            title="เพิ่มความอดทนลูกค้า +40%"
          >
            <span>💖 ฮีล</span>
            <span className="bg-white/80 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {healBoosterCount}
            </span>
          </button>

          {/* Clean Burnt Stove */}
          <button
            id="booster-clean-btn"
            onClick={() => {
              if (cleanBoosterCount > 0 && !isPaused) {
                audioManager.playBooster();
                onUseClean();
              }
            }}
            disabled={cleanBoosterCount <= 0 || isPaused}
            className={`px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer shadow-xs ${
              cleanBoosterCount > 0
                ? 'bg-[#fff3b0] text-[#544700] border-[#ffe699] hover:bg-[#ffe699] active:scale-95'
                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
            }`}
            title="ล้างเตาไหม้ทั้งหมด"
          >
            <span>🧹 ล้างเตา</span>
            <span className="bg-white/80 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {cleanBoosterCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
