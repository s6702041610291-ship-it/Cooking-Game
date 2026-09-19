import React, { useState } from 'react';
import { CustomerSlot } from '../types';
import { audioManager } from '../audio';

interface CustomerAreaProps {
  customerSlots: (CustomerSlot | null)[];
  levelId?: number;
  dayNumber?: number;
  levelTitle?: string;
  onListenSpeech: (slotIndex: number) => void;
  onCustomerClick: (slotIndex: number) => void;
}

export const CustomerArea: React.FC<CustomerAreaProps> = ({
  customerSlots,
  levelId = 1,
  dayNumber = 1,
  levelTitle,
  onListenSpeech,
  onCustomerClick,
}) => {
  const [speakingSlot, setSpeakingSlot] = useState<number | null>(null);

  const handleSpeech = (e: React.MouseEvent, index: number, slot: CustomerSlot) => {
    e.stopPropagation();
    setSpeakingSlot(index);
    audioManager.speakOrder(slot.order.speechPhraseEn, slot.customer.voicePitch, () => {
      setSpeakingSlot(null);
    });
    onListenSpeech(index);
  };

  return (
    <div className="w-full bg-[#fff9fa] rounded-2xl border-2 border-[#f4c2d7] p-3 sm:p-4 shadow-sm mb-4">
      {/* Header of Customer Section */}
      <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-[#f4c2d7]/50">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐱🐶🐰</span>
          <h2 className="text-sm sm:text-base font-bold text-[#5d4037] font-['Kanit']">
            ลูกค้า
          </h2>
          <span className="bg-[#fff0f5] border border-[#f4c2d7] text-[#7d5244] text-[11px] font-bold px-2 py-0.5 rounded-full">
            Lv.{levelId} - Day {dayNumber}
          </span>
        </div>
      </div>

      {/* 3 Customer Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {customerSlots.map((slot, index) => {
          if (!slot) {
            return (
              <div
                key={`empty-customer-${index}`}
                id={`customer-slot-${index}`}
                className="h-40 sm:h-44 rounded-xl border-2 border-dashed border-[#f4c2d7]/60 bg-white/60 flex flex-col items-center justify-center text-[#a88274] gap-1"
              >
                <div className="w-10 h-10 rounded-full bg-[#fff5f8] border border-[#f4c2d7] flex items-center justify-center text-lg text-gray-300">
                  🪑
                </div>
                <span className="text-xs font-medium">โต๊ะว่าง</span>
              </div>
            );
          }

          const isCritical = slot.patience < 25;
          const isSpeaking = speakingSlot === index;

          // Patience color
          const getBarColor = () => {
            if (slot.patience > 60) return 'bg-[#a8e6cf]'; // Mint
            if (slot.patience > 30) return 'bg-[#ffd166]'; // Yellow
            return 'bg-[#ff6b6b]'; // Red
          };

          return (
            <div
              key={slot.id}
              id={`customer-slot-${index}`}
              onClick={() => onCustomerClick(index)}
              className={`h-40 sm:h-44 rounded-xl border-2 transition-all duration-200 bg-white p-3 flex flex-col justify-between relative shadow-sm cursor-pointer hover:shadow-md ${
                isCritical
                  ? 'border-red-400 animate-pulse bg-red-50/20'
                  : 'border-[#f4c2d7] hover:border-[#e5a6c1]'
              }`}
            >
              {/* Top Row: Customer info + Listen Button */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="text-2xl sm:text-3xl filter drop-shadow-xs">
                    {slot.customer.emoji}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#5d4037] leading-tight">
                    {slot.customer.nameTh}
                  </h3>
                </div>

                {/* Speech Button */}
                <button
                  id={`listen-speech-btn-${index}`}
                  onClick={(e) => handleSpeech(e, index, slot)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all border shadow-2xs active:scale-95 cursor-pointer ${
                    isSpeaking
                      ? 'bg-pink-300 text-pink-950 border-pink-400 scale-105 animate-bounce'
                      : slot.listenedBonus
                      ? 'bg-[#f4c2d7]/50 text-[#5d4037] border-[#f4c2d7]'
                      : 'bg-[#f4c2d7] text-[#5d4037] border-[#e5a6c1] hover:bg-[#eda9c4]'
                  }`}
                  title="ฟังคำสั่งภาษาอังกฤษ"
                >
                  <i className="fa-solid fa-volume-high text-[11px]"></i>
                  <span>ฟัง</span>
                  {!slot.listenedBonus && (
                    <span className="bg-amber-100 text-amber-900 text-[9px] px-1 rounded-full font-extrabold ml-0.5">
                      +20
                    </span>
                  )}
                </button>
              </div>

              {/* Middle Row: Order Detail */}
              <div className="bg-[#fff9fa] rounded-lg border border-[#f4c2d7]/50 p-1.5 text-center my-1 relative">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-lg">{slot.order.cookedEmoji}</span>
                  <span className="text-xs sm:text-sm font-bold text-[#2d6a4f]">
                    {slot.order.nameTh}
                  </span>
                  <span className="text-[11px] text-[#8c6b5e] font-serif italic">
                    ({slot.order.nameEn})
                  </span>
                </div>

                {slot.state === 'served' && (
                  <div className="absolute inset-0 bg-white/90 rounded-lg flex items-center justify-center text-green-700 font-bold text-xs">
                    ✨ เสิร์ฟแล้ว!
                  </div>
                )}
              </div>

              {/* Bottom: Patience Bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-[#8c6b5e] mb-0.5 font-medium">
                  <span className="flex items-center gap-1">
                    <span>ความอดทน</span>
                    {isCritical && <span>💦</span>}
                  </span>
                  <span>{Math.ceil(slot.timeRemaining)}s</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${getBarColor()}`}
                    style={{ width: `${Math.max(0, Math.min(100, slot.patience))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
