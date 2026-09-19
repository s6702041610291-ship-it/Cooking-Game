import React from 'react';
import { PlateSlot } from '../types';

interface PlatingAreaProps {
  plates: PlateSlot[];
  onPlateClick: (plateIndex: number) => void;
  onClearPlate: (e: React.MouseEvent, plateIndex: number) => void;
}

export const PlatingArea: React.FC<PlatingAreaProps> = ({
  plates,
  onPlateClick,
  onClearPlate,
}) => {
  return (
    <div className="w-full bg-[#fff9fa] rounded-2xl border-2 border-[#f4c2d7] p-3 sm:p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#f4c2d7]/50">
        <div className="flex items-center gap-2">
          <span className="text-lg text-amber-600">🍽️</span>
          <h2 className="text-sm sm:text-base font-bold text-[#5d4037] font-['Kanit']">
            จานจัดเสิร์ฟ
          </h2>
        </div>
      </div>

      {/* 4 Plates Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        {plates.map((plate) => {
          const hasFood = plate.item !== null;

          return (
            <div
              key={`plate-${plate.id}`}
              id={`plate-slot-${plate.id}`}
              onClick={() => onPlateClick(plate.id)}
              className={`h-36 sm:h-40 md:h-44 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-between p-2 sm:p-2.5 relative cursor-pointer select-none group ${
                hasFood
                  ? 'bg-linear-to-b from-white to-[#fff2f7] border-[#f4c2d7] shadow-md hover:scale-[1.02] active:scale-95'
                  : 'bg-white/80 border-dashed border-[#f4c2d7] hover:bg-white hover:border-[#e5a6c1]'
              }`}
            >
              {/* Plate Number & Clear Button */}
              <div className="w-full flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#8c6b5e] bg-[#fff0f5] px-2 py-0.5 rounded-full border border-[#f4c2d7]/50">
                  #{plate.id + 1}
                </span>

                {hasFood && (
                  <button
                    onClick={(e) => onClearPlate(e, plate.id)}
                    title="ทิ้งอาหาร"
                    className="w-5 h-5 rounded-full bg-red-100 hover:bg-red-200 text-red-600 text-[10px] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              {/* Plate Interior Graphic */}
              <div className="relative flex items-center justify-center my-auto">
                {/* Visual Plate Circle Rim */}
                <div
                  className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full border-4 flex items-center justify-center shadow-inner transition-transform group-hover:scale-105 ${
                    hasFood
                      ? 'border-[#fce4ec] bg-white ring-2 ring-[#f8bbd0]'
                      : 'border-dashed border-gray-200 bg-gray-50/60'
                  }`}
                >
                  {hasFood ? (
                    <div className="text-3xl sm:text-4xl filter drop-shadow-md animate-in zoom-in duration-200">
                      {plate.item?.cookedEmoji}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300 font-medium">ว่าง</span>
                  )}
                </div>
              </div>

              {/* Food Name */}
              <div className="w-full text-center">
                {hasFood && (
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#2d6a4f] leading-tight truncate">
                      {plate.item?.nameTh}
                    </div>
                    <div className="text-[10px] text-[#8c6b5e] font-serif italic truncate">
                      {plate.item?.nameEn}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
