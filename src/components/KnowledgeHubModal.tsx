import React, { useState } from 'react';
import { PARTS_OF_SPEECH_KNOWLEDGE } from '../data/recipeKnowledge';
import { MENU_ITEMS } from '../data/gameData';
import { audioManager } from '../audio';

interface KnowledgeHubModalProps {
  onClose: () => void;
}

export const KnowledgeHubModal: React.FC<KnowledgeHubModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'grammar' | 'recipes'>('grammar');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('noun');

  const selectedTopic =
    PARTS_OF_SPEECH_KNOWLEDGE.find((t) => t.id === selectedTopicId) || PARTS_OF_SPEECH_KNOWLEDGE[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#fff9fa] border-4 border-[#f4c2d7] rounded-3xl max-w-3xl w-full h-[88vh] max-h-[720px] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#fff0f5] border-b-2 border-[#f4c2d7] p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h2 className="text-base sm:text-lg font-bold text-[#5d4037] font-['Kanit'] leading-tight">
              คลังความรู้
            </h2>
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

        {/* Tab switcher */}
        <div className="flex border-b border-[#f4c2d7] bg-[#fff5f8] px-4 pt-2 gap-2">
          <button
            onClick={() => {
              audioManager.playClick();
              setActiveTab('grammar');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl border-t-2 border-x-2 transition-all cursor-pointer ${
              activeTab === 'grammar'
                ? 'bg-white border-[#f4c2d7] text-[#5d4037] border-b-white -mb-px shadow-xs'
                : 'border-transparent text-[#8c6b5e] hover:text-[#5d4037]'
            }`}
          >
            📚 Parts of Speech
          </button>
          <button
            onClick={() => {
              audioManager.playClick();
              setActiveTab('recipes');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl border-t-2 border-x-2 transition-all cursor-pointer ${
              activeTab === 'recipes'
                ? 'bg-white border-[#f4c2d7] text-[#5d4037] border-b-white -mb-px shadow-xs'
                : 'border-transparent text-[#8c6b5e] hover:text-[#5d4037]'
            }`}
          >
            🍳 เมนูอาหาร
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
          {activeTab === 'grammar' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Selector List */}
              <div className="md:col-span-5 flex flex-col gap-1.5 border-r border-[#f4c2d7]/40 pr-2">
                <span className="text-xs font-bold text-[#8c6b5e] mb-1 uppercase tracking-wider">
                  เลือกหมวดหมู่คำ:
                </span>
                {PARTS_OF_SPEECH_KNOWLEDGE.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      audioManager.playClick();
                      setSelectedTopicId(item.id);
                    }}
                    className={`p-2 rounded-xl text-left text-xs font-bold flex items-center justify-between border transition-all cursor-pointer ${
                      selectedTopicId === item.id
                        ? 'bg-[#f4c2d7] text-[#5d4037] border-[#e5a6c1] shadow-xs'
                        : 'bg-[#fffcfd] hover:bg-[#fff0f5] text-[#7d5244] border-[#f4c2d7]/40'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.titleTh}</span>
                    </span>
                    <span className="text-[10px] text-[#8c6b5e] font-normal">{item.titleEn}</span>
                  </button>
                ))}
              </div>

              {/* Right Topic Detail */}
              <div className="md:col-span-7 flex flex-col gap-3">
                <div className="bg-[#fff9fa] border-2 border-[#f4c2d7] rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#f4c2d7]/50">
                    <span className="text-3xl">{selectedTopic.icon}</span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#5d4037] font-['Kanit']">
                        {selectedTopic.titleTh}
                      </h3>
                      <span className="text-xs text-[#8c6b5e] font-semibold">
                        Part of Speech: {selectedTopic.titleEn}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    {/* Definition */}
                    <div>
                      <span className="font-bold text-[#5d4037]">📌 ความหมายและการใช้งาน:</span>
                      <p className="text-[#6d4c41] mt-0.5 leading-relaxed">
                        {selectedTopic.definitionTh}
                      </p>
                    </div>

                    {/* Word Examples */}
                    <div className="bg-white p-2.5 rounded-xl border border-[#f4c2d7]/60">
                      <span className="font-bold text-[#5d4037]">✨ ตัวอย่างคำศัพท์:</span>
                      <div className="text-emerald-700 font-semibold font-mono text-xs mt-0.5">
                        {selectedTopic.exampleEn}
                      </div>
                      <div className="text-[11px] text-[#8c6b5e] mt-0.5">
                        {selectedTopic.exampleTh}
                      </div>
                    </div>

                    {/* Cafe Context Sentence */}
                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-3 rounded-xl">
                      <span className="font-bold text-[#166534] flex items-center gap-1">
                        <span>☕ ตัวอย่างประโยคในคาเฟ่:</span>
                      </span>
                      <p className="text-emerald-900 font-medium mt-1 italic font-['Playfair_Display'] text-sm sm:text-base">
                        "{selectedTopic.cafeExample}"
                      </p>
                    </div>

                    {/* Quick Mnemonic Tip */}
                    <div className="bg-[#fffbeb] border border-[#fde68a] p-2.5 rounded-xl text-amber-900 font-semibold text-xs">
                      {selectedTopic.quickTip}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Recipes Guide */
            <div className="space-y-3">
              <div className="text-xs text-[#8c6b5e] font-medium mb-2">
                สูตรอาหารและเวลาในการปรุงบนเตา 3 ช่อง (จัดการเวลาให้ดี อย่าให้อาหารไหม้นะ!)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(MENU_ITEMS).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border-2 border-[#f4c2d7] bg-[#fff9fa] flex items-center gap-3 shadow-xs"
                  >
                    <div className="text-3xl filter drop-shadow-xs">{item.cookedEmoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-[#5d4037]">
                          {item.nameTh}
                        </h4>
                        <span className="text-[10px] bg-[#f4c2d7] text-[#5d4037] px-2 py-0.5 rounded-full font-bold">
                          +{item.score} Pts
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8c6b5e] italic font-serif">
                        "{item.nameEn}"
                      </div>
                      <div className="text-[10px] text-[#7d5244] mt-1 flex items-center gap-2">
                        <span>⏱️ ปรุง {item.cookTime}s</span>
                        {item.category === 'cook' && <span>🔥 ไหม้ใน {item.burnTime}s</span>}
                        <span>🪙 {item.coins} เหรียญ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            ปิดหน้าต่างคลังความรู้
          </button>
        </div>
      </div>
    </div>
  );
};
