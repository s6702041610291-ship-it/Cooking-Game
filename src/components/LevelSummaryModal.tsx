import React, { useEffect } from 'react';

interface LevelSummaryModalProps {
  levelId: number;
  dayNumber: number;
  score: number;
  targetScore: number;
  starGoals: [number, number, number];
  coinsEarned: number;
  quizzesSolved: number;
  onNextDay: () => void;
  onRetry: () => void;
  onOpenMap: () => void;
  hasNextDay: boolean;
}

export const LevelSummaryModal: React.FC<LevelSummaryModalProps> = ({
  levelId,
  dayNumber,
  score,
  targetScore,
  starGoals,
  coinsEarned,
  quizzesSolved,
  onNextDay,
  onRetry,
  onOpenMap,
  hasNextDay,
}) => {
  const isPassed = score >= starGoals[0];
  const stars = score >= starGoals[2] ? 3 : score >= starGoals[1] ? 2 : score >= starGoals[0] ? 1 : 0;

  // Ensure total silence in this screen: cancel any ongoing speech or sounds
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in zoom-in-95 duration-200">
      <div className="bg-[#fff9fa] border-4 border-[#f4c2d7] rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl text-center relative overflow-hidden">
        {/* Ribbon Header */}
        <div className="mb-3">
          <div className="inline-flex items-center gap-1.5 bg-[#f4c2d7] text-[#5d4037] px-3.5 py-1 rounded-full font-bold text-xs sm:text-sm border border-[#e5a6c1] shadow-xs mb-1.5">
            <span>Lv.{levelId} - Day {dayNumber}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#5d4037] font-['Kanit']">
            {isPassed ? '🎉 ผ่านด่าน!' : '😿 ไม่ผ่าน'}
          </h2>
        </div>

        {/* Stars Display */}
        <div className="flex justify-center items-center gap-2 text-3xl sm:text-4xl text-amber-400 my-2">
          <i className={`fa-star ${stars >= 1 ? 'fa-solid scale-110 drop-shadow-md' : 'fa-regular text-gray-200'}`}></i>
          <i className={`fa-star ${stars >= 2 ? 'fa-solid scale-125 drop-shadow-md' : 'fa-regular text-gray-200'}`}></i>
          <i className={`fa-star ${stars >= 3 ? 'fa-solid scale-110 drop-shadow-md' : 'fa-regular text-gray-200'}`}></i>
        </div>

        {/* Score & Breakdown Card */}
        <div className="bg-white border-2 border-[#f4c2d7] rounded-2xl p-3.5 my-3 text-xs sm:text-sm space-y-2 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#f4c2d7]/40">
            <span className="text-[#8c6b5e]">คะแนน:</span>
            <span className="text-lg font-bold text-[#5d4037] font-['Kanit']">
              {score} / {targetScore}
            </span>
          </div>
          <div className="flex justify-between items-center text-[#7d5244]">
            <span>🪙 เหรียญ:</span>
            <span className="font-bold text-amber-700">+{coinsEarned}</span>
          </div>
          <div className="flex justify-between items-center text-[#7d5244]">
            <span>🧠 ควิซถูกต้อง:</span>
            <span className="font-bold text-pink-700">{quizzesSolved} ข้อ</span>
          </div>
        </div>

        {/* Actions - Completely silent without click sounds */}
        <div className="space-y-2">
          {isPassed && hasNextDay && (
            <button
              onClick={onNextDay}
              className="w-full py-2.5 bg-[#a8e6cf] hover:bg-[#8ee0c2] text-[#1b4332] font-bold rounded-2xl border-2 border-[#74c69d] shadow-sm transition-transform active:scale-95 cursor-pointer text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <span>วันถัดไป</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={onRetry}
              className="flex-1 py-2 bg-[#f4c2d7] hover:bg-[#eda9c4] text-[#5d4037] font-bold rounded-2xl border border-[#e5a6c1] shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5"
            >
              <i className="fa-solid fa-rotate-right"></i>
              <span>ลองใหม่</span>
            </button>

            <button
              onClick={onOpenMap}
              className="flex-1 py-2 bg-white hover:bg-pink-50 text-[#5d4037] font-bold rounded-2xl border border-[#f4c2d7] shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5"
            >
              <i className="fa-solid fa-map"></i>
              <span>แผนที่</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
