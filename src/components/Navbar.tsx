import React from 'react';
import { audioManager } from '../audio';

interface NavbarProps {
  coins: number;
  currentScreen: 'kitchen' | 'map' | 'knowledge' | 'shop';
  setCurrentScreen: (screen: 'kitchen' | 'map' | 'knowledge' | 'shop') => void;
  isBgmActive: boolean;
  setIsBgmActive: (active: boolean) => void;
  isSfxActive: boolean;
  setIsSfxActive: (active: boolean) => void;
  isPlaying: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  coins,
  currentScreen,
  setCurrentScreen,
  isBgmActive,
  setIsBgmActive,
  isSfxActive,
  setIsSfxActive,
}) => {
  const handleBgmToggle = () => {
    audioManager.playClick();
    const state = audioManager.toggleBgm();
    setIsBgmActive(state);
  };

  const handleSfxToggle = () => {
    const state = audioManager.toggleSfx();
    setIsSfxActive(state);
    if (state) audioManager.playClick();
  };

  const navItems: { id: 'kitchen' | 'map' | 'knowledge' | 'shop'; label: string; icon: string }[] = [
    { id: 'kitchen', label: 'ครัว', icon: 'fa-solid fa-house' },
    { id: 'map', label: 'แผนที่', icon: 'fa-solid fa-map-location-dot' },
    { id: 'knowledge', label: 'ความรู้', icon: 'fa-solid fa-book-open' },
    { id: 'shop', label: 'ร้านค้า', icon: 'fa-solid fa-store' },
  ];

  return (
    <header className="w-full bg-[#fff5f8] border-b-2 border-[#f4c2d7] shadow-sm px-3 sm:px-6 py-2 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  audioManager.playClick();
                  setCurrentScreen(item.id);
                }}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer border ${
                  isActive
                    ? 'bg-[#f4c2d7] text-[#5d4037] border-[#e5a6c1] shadow-inner font-bold'
                    : 'bg-white text-[#7d5244] border-[#f4c2d7]/50 hover:bg-[#fff0f5]'
                }`}
              >
                <i className={`${item.icon} text-xs sm:text-sm`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center Title / Branding */}
        <div className="flex items-center gap-1.5 sm:gap-2 order-first sm:order-none w-full sm:w-auto justify-center">
          <div className="flex items-center gap-1.5 bg-white/90 px-4 py-1 rounded-full border border-[#f4c2d7] shadow-sm">
            <span className="text-lg">🎀</span>
            <h1 className="text-base sm:text-lg font-bold text-[#5d4037] tracking-wide font-['Kanit']">
              Cozy English Cafe
            </h1>
            <span className="text-lg">🍓</span>
          </div>
        </div>

        {/* Right Status & Toggles */}
        <div className="flex items-center gap-2">
          {/* Coin Badge */}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-amber-900 font-bold text-xs sm:text-sm shadow-sm">
            <span className="text-base">🪙</span>
            <span>{coins}</span>
          </div>

          {/* BGM Toggle */}
          <button
            id="toggle-bgm-btn"
            onClick={handleBgmToggle}
            title={isBgmActive ? 'ปิดเสียงเพลง BGM' : 'เปิดเสียงเพลง BGM'}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              isBgmActive
                ? 'bg-[#a8e6cf] text-[#2c5d4b] border-[#81c784] shadow-sm animate-pulse'
                : 'bg-white text-gray-400 border-[#f4c2d7]'
            }`}
          >
            <i className={`fa-solid ${isBgmActive ? 'fa-music' : 'fa-music-slash'} text-xs sm:text-sm`}></i>
          </button>

          {/* SFX Toggle */}
          <button
            id="toggle-sfx-btn"
            onClick={handleSfxToggle}
            title={isSfxActive ? 'ปิดเสียงเอฟเฟกต์ SFX' : 'เปิดเสียงเอฟเฟกต์ SFX'}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              isSfxActive
                ? 'bg-[#f4c2d7] text-[#5d4037] border-[#e5a6c1] shadow-sm'
                : 'bg-white text-gray-400 border-[#f4c2d7]'
            }`}
          >
            <i className={`fa-solid ${isSfxActive ? 'fa-volume-high' : 'fa-volume-xmark'} text-xs sm:text-sm`}></i>
          </button>
        </div>
      </div>
    </header>
  );
};
