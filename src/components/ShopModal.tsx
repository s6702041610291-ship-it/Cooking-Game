import React from 'react';
import { PlayerStats } from '../types';
import { audioManager } from '../audio';

interface ShopModalProps {
  playerStats: PlayerStats;
  onUpgrade: (upgradeKey: keyof PlayerStats['upgrades'], cost: number) => void;
  onBuyBooster: (boosterKey: keyof PlayerStats['boosters'], cost: number) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  playerStats,
  onUpgrade,
  onBuyBooster,
  onClose,
}) => {
  const upgradesList = [
    {
      key: 'stoveSpeed' as const,
      nameTh: '♨️ เร่งความเร็วเตา',
      descTh: 'ทำอาหารสุกเร็วขึ้น +20%',
      level: playerStats.upgrades.stoveSpeed,
      maxLevel: 3,
      cost: (playerStats.upgrades.stoveSpeed + 1) * 80,
    },
    {
      key: 'customerPatience' as const,
      nameTh: '💖 บรรยากาศผ่อนคลาย',
      descTh: 'ลูกค้ารอนานขึ้น +25%',
      level: playerStats.upgrades.customerPatience,
      maxLevel: 3,
      cost: (playerStats.upgrades.customerPatience + 1) * 75,
    },
    {
      key: 'tipMaster' as const,
      nameTh: '📢 เพิ่มเหรียญทิป',
      descTh: 'เพิ่มทิปเมื่อกดฟังเสียง +50%',
      level: playerStats.upgrades.tipMaster,
      maxLevel: 3,
      cost: (playerStats.upgrades.tipMaster + 1) * 60,
    },
    {
      key: 'plateHeater' as const,
      nameTh: '🍽️ จานอุ่นร้อน',
      descTh: 'เพิ่มคะแนนเมื่อเสิร์ฟจากจาน +20%',
      level: playerStats.upgrades.plateHeater,
      maxLevel: 3,
      cost: (playerStats.upgrades.plateHeater + 1) * 70,
    },
  ];

  const boostersList = [
    {
      key: 'freezeTime' as const,
      icon: '❄️',
      nameTh: 'หยุดเวลา 10 วิ',
      descTh: 'แช่แข็งเวลาชั่วคราว',
      count: playerStats.boosters.freezeTime,
      cost: 40,
    },
    {
      key: 'healCustomers' as const,
      icon: '💖',
      nameTh: 'ฮีลลูกค้า',
      descTh: 'ฟื้นฟูความอดทนลูกค้า +40%',
      count: playerStats.boosters.healCustomers,
      cost: 40,
    },
    {
      key: 'cleanStoves' as const,
      icon: '🧹',
      nameTh: 'ล้างเตาทันใจ',
      descTh: 'ล้างเตาไหม้ทั้งหมดทันที',
      count: playerStats.boosters.cleanStoves,
      cost: 30,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#fff9fa] border-4 border-[#f4c2d7] rounded-3xl max-w-3xl w-full h-[88vh] max-h-[720px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#fff0f5] border-b-2 border-[#f4c2d7] p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <h2 className="text-base sm:text-lg font-bold text-[#5d4037] font-['Kanit'] leading-tight">
              ร้านค้าอัปเกรด
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full text-amber-900 font-bold text-xs sm:text-sm">
              <span>🪙</span>
              <span>{playerStats.coins}</span>
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-white">
          {/* Section 1: Permanent Upgrades */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#5d4037] font-['Kanit'] mb-3 flex items-center gap-2">
              <span>✨ อัปเกรดถาวร</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {upgradesList.map((item) => {
                const isMax = item.level >= item.maxLevel;
                const canAfford = playerStats.coins >= item.cost;

                return (
                  <div
                    key={item.key}
                    className="p-3.5 rounded-xl border-2 border-[#f4c2d7] bg-[#fff9fa] flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#5d4037]">
                          {item.nameTh}
                        </h4>
                        <span className="text-[10px] bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full font-bold">
                          Lv. {item.level}/{item.maxLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8c6b5e] mb-3">{item.descTh}</p>
                    </div>

                    <button
                      disabled={isMax || !canAfford}
                      onClick={() => {
                        if (!isMax && canAfford) {
                          audioManager.playServe();
                          onUpgrade(item.key, item.cost);
                        }
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isMax
                          ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                          : canAfford
                          ? 'bg-[#a8e6cf] hover:bg-[#8ee0c2] text-[#1b4332] border border-[#74c69d] cursor-pointer shadow-xs active:scale-95'
                          : 'bg-amber-50 text-amber-800 border border-amber-200 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {isMax ? (
                        <span>สูงสุด (MAX)</span>
                      ) : (
                        <>
                          <span>อัปเกรด (🪙 {item.cost})</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Consumable Boosters */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#5d4037] font-['Kanit'] mb-3 flex items-center gap-2">
              <span>🎒 ไอเทมเสริม</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {boostersList.map((item) => {
                const canAfford = playerStats.coins >= item.cost;

                return (
                  <div
                    key={item.key}
                    className="p-3.5 rounded-xl border-2 border-[#f4c2d7] bg-[#fff9fa] flex flex-col justify-between shadow-xs text-center"
                  >
                    <div>
                      <div className="text-3xl mb-1">{item.icon}</div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#5d4037] mb-0.5">
                        {item.nameTh}
                      </h4>
                      <p className="text-[10px] text-[#8c6b5e] mb-2">{item.descTh}</p>
                      <div className="text-xs text-pink-700 font-bold mb-3">
                        มี: {item.count}
                      </div>
                    </div>

                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        if (canAfford) {
                          audioManager.playServe();
                          onBuyBooster(item.key, item.cost);
                        }
                      }}
                      className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        canAfford
                          ? 'bg-[#f4c2d7] hover:bg-[#eda9c4] text-[#5d4037] border border-[#e5a6c1] cursor-pointer shadow-xs active:scale-95'
                          : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <span>ซื้อ (🪙 {item.cost})</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#fff0f5] border-t border-[#f4c2d7] p-3 text-center">
          <button
            onClick={() => {
              audioManager.playClick();
              onClose();
            }}
            className="px-6 py-2 bg-[#f4c2d7] hover:bg-[#eda9c4] text-[#5d4037] font-bold rounded-full border border-[#e5a6c1] shadow-xs cursor-pointer text-xs sm:text-sm"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
