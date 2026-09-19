import React from 'react';
import { GAME_LEVELS, isDayUnlocked, isLevelUnlocked } from '../data/gameData';
import { PlayerStats } from '../types';
import { audioManager } from '../audio';

interface LevelMapModalProps {
  playerStats: PlayerStats;
  currentLevelId: number;
  currentDayNumber: number;
  onSelectDay: (levelId: number, dayNumber: number) => void;
  onClose: () => void;
  onResetProgress?: () => void;
}

export const LevelMapModal: React.FC<LevelMapModalProps> = ({
  playerStats,
  currentLevelId,
  currentDayNumber,
  onSelectDay,
  onClose,
  onResetProgress,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#fff9fa] border-4 border-[#f4c2d7] rounded-3xl max-w-4xl w-full h-[88vh] max-h-[720px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#fff0f5] border-b-2 border-[#f4c2d7] p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#5d4037] font-['Kanit'] leading-tight">
                แผนที่ด่าน
              </h2>
              <p className="text-[11px] text-[#8c6b5e]">
                ปลดล็อกทีละด่านตามลำดับความคืบหน้า (ผ่าน 1⭐ เพื่อปลดล็อกด่านถัดไป)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioManager.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white hover:bg-pink-100 border border-[#f4c2d7] text-[#5d4037] flex items-center justify-center font-bold text-sm cursor-pointer shadow-xs"
          >
            ✕
          </button>
        </div>

        {/* Level List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-white">
          {GAME_LEVELS.map((level) => {
            const isLevelOpen = isLevelUnlocked(level.id, playerStats.levelDayStars);

            return (
              <div
                key={level.id}
                className={`rounded-2xl border-2 p-4 sm:p-5 transition-all ${
                  isLevelOpen
                    ? 'border-[#f4c2d7] bg-[#fff9fa] shadow-sm'
                    : 'border-gray-200 bg-gray-50/70 opacity-75'
                }`}
              >
                {/* Level Title Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-[#f4c2d7]/50">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{level.icon}</span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#5d4037] font-['Kanit'] flex items-center gap-2">
                        <span>{level.titleTh}</span>
                        {!isLevelOpen && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                            🔒 ล็อก (ต้องผ่าน Level {level.id - 1} Day 3 ก่อน)
                          </span>
                        )}
                        {isLevelOpen && (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                            🔓 ปลดล็อกแล้ว
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-[#8c6b5e]">{level.descriptionTh}</p>
                    </div>
                  </div>
                </div>

                {/* Days inside level */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {level.days.map((day) => {
                    const dayKey = `${level.id}-${day.dayNumber}`;
                    const stars = playerStats.levelDayStars[dayKey] || 0;
                    const highScore = playerStats.levelDayHighScores[dayKey] || 0;
                    const isDayOpen = isDayUnlocked(level.id, day.dayNumber, playerStats.levelDayStars);
                    const isCurrent =
                      isDayOpen && level.id === currentLevelId && day.dayNumber === currentDayNumber;

                    return (
                      <div
                        key={day.dayNumber}
                        className={`p-3 rounded-xl border-2 flex flex-col justify-between transition-all ${
                          isDayOpen
                            ? isCurrent
                              ? 'border-[#a8e6cf] bg-[#f0fdf4] ring-2 ring-[#a8e6cf]'
                              : 'border-[#f4c2d7] bg-white hover:border-[#e5a6c1]'
                            : 'border-gray-200 bg-gray-100/70 opacity-70'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs sm:text-sm font-bold text-[#5d4037] flex items-center gap-1.5">
                              <span>Day {day.dayNumber}</span>
                              {!isDayOpen && (
                                <span className="text-xs text-gray-400">🔒</span>
                              )}
                            </span>
                            {/* Stars */}
                            <div className="flex gap-0.5 text-xs text-amber-400">
                              <i className={`fa-star ${stars >= 1 ? 'fa-solid' : 'fa-regular text-gray-300'}`}></i>
                              <i className={`fa-star ${stars >= 2 ? 'fa-solid' : 'fa-regular text-gray-300'}`}></i>
                              <i className={`fa-star ${stars >= 3 ? 'fa-solid' : 'fa-regular text-gray-300'}`}></i>
                            </div>
                          </div>

                          <div className="text-[11px] text-[#8c6b5e] space-y-0.5 my-2">
                            <div>⏱️ {day.durationSeconds}s</div>
                            <div>🎯 1⭐: {day.starGoals[0]} Pts</div>
                            <div>🏆 สูงสุด: {highScore > 0 ? `${highScore} Pts` : '-'}</div>
                            {!isDayOpen && (
                              <div className="text-[10px] text-amber-800 font-semibold mt-1">
                                {!isLevelOpen
                                  ? `🔒 ผ่าน Lv.${level.id - 1} Day 3 ก่อน`
                                  : `🔒 ผ่าน Day ${day.dayNumber - 1} ก่อน`}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Play button */}
                        <button
                          disabled={!isDayOpen}
                          onClick={() => {
                            if (isDayOpen) {
                              audioManager.playClick();
                              onSelectDay(level.id, day.dayNumber);
                              onClose();
                            }
                          }}
                          className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                            isDayOpen
                              ? isCurrent
                                ? 'bg-[#a8e6cf] text-[#1b4332] border border-[#74c69d] cursor-pointer'
                                : 'bg-[#fff0f5] hover:bg-[#f4c2d7] text-[#5d4037] border border-[#f4c2d7] cursor-pointer active:scale-95'
                              : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                          }`}
                        >
                          {isDayOpen ? (
                            <>
                              <i className="fa-solid fa-play text-[10px]"></i>
                              <span>{isCurrent ? 'กำลังเล่น' : 'เล่น'}</span>
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-lock text-[10px]"></i>
                              <span>ล็อก</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-[#fff0f5] border-t border-[#f4c2d7] p-3 flex items-center justify-between">
          {onResetProgress ? (
            <button
              onClick={() => {
                if (window.confirm('คุณต้องการรีเซ็ตความคืบหน้าเพื่อเริ่มเล่นตั้งแต่ Level 1 Day 1 ใหม่หรือไม่?')) {
                  onResetProgress();
                }
              }}
              className="text-[11px] text-gray-500 hover:text-red-600 underline cursor-pointer"
            >
              🔄 รีเซ็ตด่านเริ่มต้นใหม่
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => {
              audioManager.playClick();
              onClose();
            }}
            className="px-6 py-2 bg-[#f4c2d7] hover:bg-[#eda9c4] text-[#5d4037] font-bold rounded-full border border-[#e5a6c1] shadow-xs cursor-pointer text-xs sm:text-sm"
          >
            กลับสู่ครัว
          </button>
        </div>
      </div>
    </div>
  );
};

