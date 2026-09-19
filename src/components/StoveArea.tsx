import React from 'react';
import { StoveSlot } from '../types';

interface StoveAreaProps {
  stoves: StoveSlot[];
  onStoveClick: (stoveIndex: number) => void;
}

export const StoveArea: React.FC<StoveAreaProps> = ({ stoves, onStoveClick }) => {
  return (
    <div className="w-full bg-[#fff9fa] rounded-2xl border-2 border-[#f4c2d7] p-3 sm:p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#f4c2d7]/50">
        <div className="flex items-center gap-2">
          <span className="text-lg text-rose-500">♨️</span>
          <h2 className="text-sm sm:text-base font-bold text-[#5d4037] font-['Kanit']">
            เตาปรุงอาหาร
          </h2>
        </div>
      </div>

      {/* 3 Stoves Grid */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
        {stoves.map((stove) => {
          if (stove.status === 'empty') {
            return (
              <div
                key={`stove-${stove.id}`}
                id={`stove-slot-${stove.id}`}
                onClick={() => onStoveClick(stove.id)}
                className="h-36 sm:h-40 md:h-44 rounded-2xl border-2 border-dashed border-[#f4c2d7] bg-white/80 flex flex-col items-center justify-center text-[#a88274] transition-all hover:bg-white hover:border-[#e5a6c1] hover:shadow-xs cursor-pointer group p-2 text-center"
              >
                <div className="text-2xl sm:text-3xl mb-1 text-gray-300 group-hover:scale-110 transition-transform">
                  ♨️
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#7d5244]">เตาว่าง</span>
              </div>
            );
          }

          if (stove.status === 'cooking' && stove.item) {
            return (
              <div
                key={`stove-${stove.id}`}
                id={`stove-slot-${stove.id}`}
                onClick={() => onStoveClick(stove.id)}
                className="h-36 sm:h-40 md:h-44 rounded-2xl border-2 border-amber-300 bg-amber-50/60 flex flex-col items-center justify-between p-2 sm:p-2.5 transition-all relative overflow-hidden shadow-sm"
              >
                <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                  <span className="animate-spin text-[10px]">🌀</span>
                  <span>กำลังปรุง</span>
                </div>

                <div className="flex flex-col items-center my-auto relative">
                  <div className="text-3xl sm:text-4xl animate-bounce filter drop-shadow-xs">
                    {stove.item.rawEmoji}
                  </div>
                  <span className="text-xs font-bold text-[#5d4037] mt-1">
                    {stove.item.rawNameTh}
                  </span>
                </div>

                <div className="w-full">
                  <div className="w-full h-2 bg-amber-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-amber-400 to-emerald-400 transition-all duration-200 rounded-full"
                      style={{ width: `${stove.cookProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          }

          if (stove.status === 'cooked' && stove.item) {
            const isBurningWarning = stove.burnProgress > 50;
            return (
              <div
                key={`stove-${stove.id}`}
                id={`stove-slot-${stove.id}`}
                onClick={() => onStoveClick(stove.id)}
                className={`h-36 sm:h-40 md:h-44 rounded-2xl border-2 bg-white flex flex-col items-center justify-between p-2 sm:p-2.5 transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 ${
                  isBurningWarning
                    ? 'border-red-400 bg-red-50/50 animate-pulse'
                    : 'border-emerald-400 bg-emerald-50/40'
                }`}
              >
                <div
                  className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isBurningWarning
                      ? 'bg-red-200 text-red-900 animate-bounce'
                      : 'bg-emerald-200 text-emerald-950'
                  }`}
                >
                  <span>{isBurningWarning ? '⚠️ ระวังไหม้' : '✨ สุกแล้ว'}</span>
                </div>

                <div className="flex flex-col items-center my-auto">
                  <div className="text-3xl sm:text-4xl filter drop-shadow-md">
                    {stove.item.cookedEmoji}
                  </div>
                  <span className="text-xs font-bold text-[#2d6a4f] text-center mt-1">
                    {stove.item.nameTh}
                  </span>
                </div>

                {/* Burn indicator bar */}
                <div className="w-full">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 transition-all duration-200 rounded-full"
                      style={{ width: `${stove.burnProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          }

          if (stove.status === 'burnt') {
            return (
              <div
                key={`stove-${stove.id}`}
                id={`stove-slot-${stove.id}`}
                onClick={() => onStoveClick(stove.id)}
                className="h-36 sm:h-40 md:h-44 rounded-2xl border-2 border-red-500 bg-red-100 flex flex-col items-center justify-between p-2 sm:p-2.5 transition-all cursor-pointer shadow-inner animate-pulse"
              >
                <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span>🔥 ไหม้</span>
                </div>

                <div className="flex flex-col items-center my-auto text-center">
                  <div className="text-2xl sm:text-3xl filter grayscale contrast-200">💨</div>
                </div>

                <button className="w-full py-1 bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs">
                  <i className="fa-solid fa-trash-can text-[10px]"></i>
                  <span>ล้างเตา</span>
                </button>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
