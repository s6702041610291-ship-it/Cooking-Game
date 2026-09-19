import React from 'react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data/gameData';

interface IngredientsTrayProps {
  availableItemIds: string[];
  onSelectIngredient: (item: MenuItem) => void;
}

export const IngredientsTray: React.FC<IngredientsTrayProps> = ({
  availableItemIds,
  onSelectIngredient,
}) => {
  return (
    <div className="w-full bg-[#fff9fa] rounded-2xl border-2 border-[#f4c2d7] p-3 sm:p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#f4c2d7]/50 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧺</span>
          <h2 className="text-base sm:text-lg font-bold text-[#5d4037] font-['Kanit'] leading-tight">
            วัตถุดิบ
          </h2>
        </div>
      </div>

      {/* Ingredients Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        {availableItemIds.map((itemId) => {
          const item = MENU_ITEMS[itemId];
          if (!item) return null;

          return (
            <button
              key={item.id}
              id={`ingredient-${item.id}`}
              onClick={() => onSelectIngredient(item)}
              className="group rounded-2xl border-2 border-[#f4c2d7] bg-white p-2.5 sm:p-3 flex flex-col items-center justify-between transition-all duration-200 hover:border-[#e5a6c1] hover:bg-[#fff5f8] hover:shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer text-center relative overflow-hidden"
            >
              {/* Big raw emoji icon */}
              <div className="text-3xl sm:text-4xl my-1 filter drop-shadow-xs group-hover:scale-110 transition-transform duration-200">
                {item.rawEmoji}
              </div>

              {/* Raw Ingredient Name */}
              <div className="w-full">
                <div className="text-xs sm:text-sm font-bold text-[#5d4037] leading-tight">
                  {item.rawNameTh}
                </div>

                {/* Target outcome preview */}
                <div className="mt-1 pt-1 border-t border-dashed border-[#f4c2d7]/60 flex items-center justify-center gap-1 text-[10px] text-[#7d5244]">
                  <span>→</span>
                  <span>{item.cookedEmoji}</span>
                  <span className="font-semibold text-[#2d6a4f] truncate">{item.nameTh}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
