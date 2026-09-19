import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CustomerSlot,
  MenuItem,
  PlateSlot,
  PlayerStats,
  QuizQuestion,
  StoveSlot,
} from './types';
import {
  CUSTOMER_CHARACTERS,
  GAME_LEVELS,
  MENU_ITEMS,
  isDayUnlocked,
  getUnlockedLevel,
} from './data/gameData';
import { QUIZ_DATA } from './data/quizData';
import { audioManager } from './audio';
import { Navbar } from './components/Navbar';
import { SubBar } from './components/SubBar';
import { CustomerArea } from './components/CustomerArea';
import { StoveArea } from './components/StoveArea';
import { PlatingArea } from './components/PlatingArea';
import { IngredientsTray } from './components/IngredientsTray';
import { QuizModal } from './components/QuizModal';
import { KnowledgeHubModal } from './components/KnowledgeHubModal';
import { LevelMapModal } from './components/LevelMapModal';
import { ShopModal } from './components/ShopModal';
import { LevelSummaryModal } from './components/LevelSummaryModal';

const DEFAULT_PLAYER_STATS: PlayerStats = {
  coins: 80,
  unlockedLevel: 1,
  levelDayStars: {},
  levelDayHighScores: {},
  upgrades: {
    stoveSpeed: 0,
    customerPatience: 0,
    tipMaster: 0,
    plateHeater: 0,
  },
  boosters: {
    freezeTime: 2,
    healCustomers: 2,
    cleanStoves: 2,
  },
};

export default function App() {
  // Navigation Screens
  const [currentScreen, setCurrentScreen] = useState<'kitchen' | 'map' | 'knowledge' | 'shop'>('kitchen');

  // Audio State
  const [isBgmActive, setIsBgmActive] = useState(false);
  const [isSfxActive, setIsSfxActive] = useState(true);

  // Player Stats with local persistence
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem('cozy_cafe_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        const stars = parsed.levelDayStars || {};
        const calculatedUnlockedLevel = getUnlockedLevel(stars);
        return {
          ...DEFAULT_PLAYER_STATS,
          ...parsed,
          unlockedLevel: calculatedUnlockedLevel,
        };
      }
    } catch {
      // fallback
    }
    return DEFAULT_PLAYER_STATS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('cozy_cafe_stats', JSON.stringify(playerStats));
    } catch {
      // ignore
    }
  }, [playerStats]);

  // Current Level & Day selection
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [currentDayNumber, setCurrentDayNumber] = useState<number>(1);

  // Active level & day config
  const currentLevel = GAME_LEVELS.find((lvl) => lvl.id === currentLevelId) || GAME_LEVELS[0];
  const currentDay =
    currentLevel.days.find((d) => d.dayNumber === currentDayNumber) || currentLevel.days[0];

  // Synchronous config ref to completely prevent stale closure issues in async timeouts/intervals
  const activeConfigRef = useRef({
    levelId: 1,
    dayNumber: 1,
    availableItemIds: [...GAME_LEVELS[0].days[0].availableItemIds],
    patienceMultiplier: 1 + playerStats.upgrades.customerPatience * 0.25,
    sessionId: 1,
  });

  // Track active timeouts to cancel old level/day timers upon reset
  const timeoutsRef = useRef<number[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const safeSetTimeout = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter((t) => t !== id);
      fn();
    }, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  // Update patience upgrade in active config ref
  useEffect(() => {
    activeConfigRef.current.patienceMultiplier = 1 + playerStats.upgrades.customerPatience * 0.25;
  }, [playerStats.upgrades.customerPatience]);

  // Game Loop State
  const [score, setScore] = useState<number>(0);
  const [coinsEarnedInDay, setCoinsEarnedInDay] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(currentDay.durationSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTimeFrozen, setIsTimeFrozen] = useState<boolean>(false);
  const [freezeDuration, setFreezeDuration] = useState<number>(0);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [quizzesSolvedInDay, setQuizzesSolvedInDay] = useState<number>(0);
  const [floatingToast, setFloatingToast] = useState<string | null>(null);

  // Stoves (3 Slots)
  const [stoves, setStoves] = useState<StoveSlot[]>([
    { id: 0, status: 'empty', item: null, cookProgress: 0, burnProgress: 0 },
    { id: 1, status: 'empty', item: null, cookProgress: 0, burnProgress: 0 },
    { id: 2, status: 'empty', item: null, cookProgress: 0, burnProgress: 0 },
  ]);

  // Plates (4 Slots)
  const [plates, setPlates] = useState<PlateSlot[]>([
    { id: 0, item: null },
    { id: 1, item: null },
    { id: 2, item: null },
    { id: 3, item: null },
  ]);

  // Customers (3 Slots)
  const [customers, setCustomers] = useState<(CustomerSlot | null)[]>([null, null, null]);

  // Quiz Engine State
  const [secondsUntilNextQuiz, setSecondsUntilNextQuiz] = useState<number>(60);
  const [activeQuizQuestion, setActiveQuizQuestion] = useState<QuizQuestion | null>(null);
  const lastQuizIndexRef = useRef<number>(-1);

  // Show Toast
  const showToast = useCallback((msg: string) => {
    setFloatingToast(msg);
    setTimeout(() => {
      setFloatingToast((prev) => (prev === msg ? null : prev));
    }, 2200);
  }, []);

  // Helper to spawn a new customer in a specific slot (ALWAYS uses fresh level items from activeConfigRef)
  const spawnCustomer = useCallback((slotIndex: number, expectedSessionId?: number) => {
    // If a specific session ID was requested, discard if the level or day has restarted
    if (expectedSessionId !== undefined && expectedSessionId !== activeConfigRef.current.sessionId) {
      return;
    }

    const { availableItemIds, patienceMultiplier } = activeConfigRef.current;
    if (!availableItemIds || availableItemIds.length === 0) return;

    const char = CUSTOMER_CHARACTERS[Math.floor(Math.random() * CUSTOMER_CHARACTERS.length)];
    const randomItemId = availableItemIds[Math.floor(Math.random() * availableItemIds.length)];
    const orderItem = MENU_ITEMS[randomItemId];
    if (!orderItem) return;

    // Base patience 26-32s + upgrade bonus (25% per level)
    const basePatience = 28 + Math.floor(Math.random() * 6);
    const totalPatience = Math.round(basePatience * patienceMultiplier);

    const newSlot: CustomerSlot = {
      id: `${Date.now()}-${slotIndex}-${Math.random().toString(36).slice(2, 6)}`,
      customer: char,
      order: orderItem,
      patience: 100,
      maxPatience: totalPatience,
      timeRemaining: totalPatience,
      listenedBonus: false,
      state: 'waiting',
    };

    setCustomers((prev) => {
      const next = [...prev];
      next[slotIndex] = newSlot;
      return next;
    });
  }, []);

  // Reset/Start Day
  const startDay = useCallback(
    (levelId: number, dayNumber: number) => {
      // Validate that level and day are unlocked (Level 1 Day 1 is always allowed)
      if (
        !(levelId === 1 && dayNumber === 1) &&
        !isDayUnlocked(levelId, dayNumber, playerStats.levelDayStars)
      ) {
        showToast('🔒 ด่านนี้ยังถูกล็อกอยู่ ต้องผ่านด่านก่อนหน้าก่อนนะ');
        return;
      }

      // 1. Clear any pending timeouts from previous level or day
      clearAllTimeouts();

      const lvl = GAME_LEVELS.find((l) => l.id === levelId) || GAME_LEVELS[0];
      const day = lvl.days.find((d) => d.dayNumber === dayNumber) || lvl.days[0];

      // 2. Synchronously update active config ref BEFORE spawning any customers
      const nextSessionId = activeConfigRef.current.sessionId + 1;
      activeConfigRef.current = {
        levelId,
        dayNumber,
        availableItemIds: [...day.availableItemIds],
        patienceMultiplier: 1 + playerStats.upgrades.customerPatience * 0.25,
        sessionId: nextSessionId,
      };

      setCurrentLevelId(levelId);
      setCurrentDayNumber(dayNumber);
      setScore(0);
      setCoinsEarnedInDay(0);
      setQuizzesSolvedInDay(0);
      setTimeRemaining(day.durationSeconds);
      setIsPaused(false);
      setIsTimeFrozen(false);
      setFreezeDuration(0);
      setShowSummary(false);
      setActiveQuizQuestion(null);
      setSecondsUntilNextQuiz(60);

      // Clear Stoves
      setStoves([
        { id: 0, status: 'empty', item: null, cookProgress: 0, burnProgress: 0 },
        { id: 1, status: 'empty', item: null, cookProgress: 0, burnProgress: 0 },
        { id: 2, status: 'empty', item: null, cookProgress: 0, burnProgress: 0 },
      ]);

      // Clear Plates
      setPlates([
        { id: 0, item: null },
        { id: 1, item: null },
        { id: 2, item: null },
        { id: 3, item: null },
      ]);

      // Clear Customers & Spawn initial customers strictly matching this level's items
      setCustomers([null, null, null]);
      safeSetTimeout(() => {
        spawnCustomer(0, nextSessionId);
      }, 300);
      safeSetTimeout(() => {
        spawnCustomer(1, nextSessionId);
      }, 1400);
      safeSetTimeout(() => {
        spawnCustomer(2, nextSessionId);
      }, 2600);
    },
    [clearAllTimeouts, playerStats.levelDayStars, playerStats.upgrades.customerPatience, safeSetTimeout, spawnCustomer]
  );

  // Initial setup on mount
  useEffect(() => {
    startDay(1, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Main Ticking Loop (Every 200ms for smooth cooking/patience)
  useEffect(() => {
    if (isPaused || showSummary || activeQuizQuestion !== null) return;

    const interval = setInterval(() => {
      // 1. Time Remaining & Freeze
      if (!isTimeFrozen) {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Day Ended
            setShowSummary(true);
            return 0;
          }
          return prev - 0.2;
        });
      } else {
        setFreezeDuration((prev) => {
          if (prev <= 0.2) {
            setIsTimeFrozen(false);
            return 0;
          }
          return prev - 0.2;
        });
      }

      // 2. Quiz Countdown (60 seconds countdown)
      setSecondsUntilNextQuiz((prev) => {
        if (prev <= 0.2) {
          // Trigger Auto-Pause Quiz!
          triggerQuiz();
          return 60;
        }
        return prev - 0.2;
      });

      // 3. Stove Progress
      setStoves((prevStoves) =>
        prevStoves.map((stove) => {
          if (stove.status === 'cooking' && stove.item) {
            // Cooking speed boost (20% faster per level)
            const speedMultiplier = 1 + playerStats.upgrades.stoveSpeed * 0.2;
            const cookStep = (0.2 / (stove.item.cookTime / speedMultiplier)) * 100;
            const nextProgress = stove.cookProgress + cookStep;

            if (nextProgress >= 100) {
              audioManager.playReady();
              return {
                ...stove,
                status: 'cooked',
                cookProgress: 100,
                burnProgress: 0,
              };
            }
            return {
              ...stove,
              cookProgress: nextProgress,
            };
          }

          if (stove.status === 'cooked' && stove.item) {
            if (stove.item.burnTime >= 900) {
              return stove; // drinks don't burn
            }
            const burnStep = (0.2 / stove.item.burnTime) * 100;
            const nextBurn = stove.burnProgress + burnStep;

            if (nextBurn >= 100) {
              audioManager.playBurnt();
              return {
                ...stove,
                status: 'burnt',
                burnProgress: 100,
              };
            }
            return {
              ...stove,
              burnProgress: nextBurn,
            };
          }

          return stove;
        })
      );

      // 4. Customer Patience Progress
      setCustomers((prevCustomers) =>
        prevCustomers.map((slot, idx) => {
          if (!slot) return null;
          if (slot.state !== 'waiting') return slot;

          const nextTime = slot.timeRemaining - 0.2;
          const nextPatience = (nextTime / slot.maxPatience) * 100;

          if (nextTime <= 0) {
            // Customer is disappointed and leaves
            audioManager.playBurnt();
            const currentSession = activeConfigRef.current.sessionId;
            safeSetTimeout(() => {
              spawnCustomer(idx, currentSession);
            }, 3000);
            return null;
          }

          return {
            ...slot,
            timeRemaining: nextTime,
            patience: nextPatience,
          };
        })
      );
    }, 200);

    return () => clearInterval(interval);
  }, [
    isPaused,
    showSummary,
    activeQuizQuestion,
    isTimeFrozen,
    playerStats.upgrades.stoveSpeed,
    spawnCustomer,
  ]);

  // Handle Level End & Stars
  useEffect(() => {
    if (showSummary) {
      const dayKey = `${currentLevelId}-${currentDayNumber}`;
      const stars =
        score >= currentDay.starGoals[2]
          ? 3
          : score >= currentDay.starGoals[1]
          ? 2
          : score >= currentDay.starGoals[0]
          ? 1
          : 0;

      const currentHighest = playerStats.levelDayHighScores[dayKey] || 0;
      const currentHighestStars = playerStats.levelDayStars[dayKey] || 0;

      const updatedStars = {
        ...playerStats.levelDayStars,
        [dayKey]: Math.max(currentHighestStars, stars),
      };
      const nextUnlockedLevel = getUnlockedLevel(updatedStars);

      setPlayerStats((prev) => ({
        ...prev,
        coins: prev.coins + coinsEarnedInDay,
        unlockedLevel: nextUnlockedLevel,
        levelDayStars: updatedStars,
        levelDayHighScores: {
          ...prev.levelDayHighScores,
          [dayKey]: Math.max(currentHighest, score),
        },
      }));

      // No sound in summary screen as requested ("ไม่ต้องมีเสียงในหน้านี้")
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      clearAllTimeouts();
    }
  }, [showSummary, coinsEarnedInDay, currentDay.starGoals, currentDayNumber, currentLevelId, playerStats.levelDayHighScores, playerStats.levelDayStars, playerStats.unlockedLevel, score, clearAllTimeouts]);

  // Trigger Auto-Pause Quiz
  const triggerQuiz = useCallback(() => {
    let nextIndex = Math.floor(Math.random() * QUIZ_DATA.length);
    if (nextIndex === lastQuizIndexRef.current) {
      nextIndex = (nextIndex + 1) % QUIZ_DATA.length;
    }
    lastQuizIndexRef.current = nextIndex;
    setActiveQuizQuestion(QUIZ_DATA[nextIndex]);
  }, []);

  // Answer Quiz
  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 100);
      setCoinsEarnedInDay((prev) => prev + 25);
      setTimeRemaining((prev) => prev + 10);
      setQuizzesSolvedInDay((prev) => prev + 1);
      showToast('🎉 ตอบถูก! +100 คะแนน / +25 เหรียญ / +10 วินาที!');
    } else {
      showToast('💡 เรียนรู้ทบทวนเพื่อจำให้แม่นขึ้นนะ!');
    }
  };

  // Close Quiz
  const handleCloseQuiz = () => {
    setActiveQuizQuestion(null);
    setSecondsUntilNextQuiz(60);
  };

  // Select Ingredient -> Put on Stove or Plate
  const handleSelectIngredient = (item: MenuItem) => {
    audioManager.playClick();

    // Check if there is an empty stove
    const emptyStove = stoves.find((s) => s.status === 'empty');

    if (emptyStove) {
      audioManager.playSizzle();
      setStoves((prev) =>
        prev.map((s) =>
          s.id === emptyStove.id
            ? {
                ...s,
                status: 'cooking',
                item,
                cookProgress: 0,
                burnProgress: 0,
              }
            : s
        )
      );
    } else {
      // Stoves are full
      showToast('⚠️ เตาปรุงทั้ง 3 ช่องเต็มอยู่จ้า! กรุณารออาหารสุกก่อน');
    }
  };

  // Click on Stove
  const handleStoveClick = (stoveId: number) => {
    const stove = stoves[stoveId];
    if (!stove) return;

    if (stove.status === 'cooked' && stove.item) {
      // Find an empty plate
      const emptyPlate = plates.find((p) => p.item === null);
      if (emptyPlate) {
        audioManager.playServe();
        // Move to plate
        setPlates((prev) =>
          prev.map((p) => (p.id === emptyPlate.id ? { ...p, item: stove.item } : p))
        );
        // Clear stove
        setStoves((prev) =>
          prev.map((s) =>
            s.id === stoveId
              ? { id: stoveId, status: 'empty', item: null, cookProgress: 0, burnProgress: 0 }
              : s
          )
        );
        showToast(`🍽️ ตัก ${stove.item.nameTh} วางบนจาน ${emptyPlate.id + 1} แล้ว!`);
      } else {
        showToast('⚠️ จานทั้ง 4 ใบเต็มหมดแล้ว! โปรดเสิร์ฟลูกค้าก่อน');
      }
    } else if (stove.status === 'burnt') {
      // Clear burnt stove
      audioManager.playClick();
      setStoves((prev) =>
        prev.map((s) =>
          s.id === stoveId
            ? { id: stoveId, status: 'empty', item: null, cookProgress: 0, burnProgress: 0 }
            : s
        )
      );
      showToast('🗑️ ทำความสะอาดเตาเรียบร้อย พร้อมใช้งานใหม่');
    }
  };

  // Click Plate -> Serve to customer if match
  const handlePlateClick = (plateId: number) => {
    const plate = plates[plateId];
    if (!plate || !plate.item) return;

    // Find customer that wants this item
    const matchingIndex = customers.findIndex(
      (c) => c !== null && c.state === 'waiting' && c.order.id === plate.item?.id
    );

    if (matchingIndex !== -1) {
      // Serve customer!
      serveCustomer(matchingIndex, plateId);
    } else {
      showToast('💡 ยังไม่มีลูกค้าสั่งเมนูนี้บนจาน ลองสังเกตออเดอร์ดูนะ');
    }
  };

  // Serve Customer
  const serveCustomer = (customerIndex: number, plateId: number) => {
    const customer = customers[customerIndex];
    const plate = plates[plateId];
    if (!customer || !plate || !plate.item) return;

    audioManager.playServe();

    // Calculate score & coins with upgrades
    const plateHeaterBonus = 1 + playerStats.upgrades.plateHeater * 0.2;
    const earnedScore = Math.round(plate.item.score * plateHeaterBonus);
    const earnedCoins = plate.item.coins;

    setScore((prev) => prev + earnedScore);
    setCoinsEarnedInDay((prev) => prev + earnedCoins);

    // Clear plate
    setPlates((prev) => prev.map((p) => (p.id === plateId ? { ...p, item: null } : p)));

    // Mark customer as served
    setCustomers((prev) =>
      prev.map((c, idx) => (idx === customerIndex && c ? { ...c, state: 'served' } : c))
    );

    showToast(`✨ เสิร์ฟสำเร็จ! +${earnedScore} Pts (+${earnedCoins} เหรียญ)`);

    // Spawn new customer after short delay
    const currentSession = activeConfigRef.current.sessionId;
    safeSetTimeout(() => {
      spawnCustomer(customerIndex, currentSession);
    }, 1800);
  };

  // Clear food from plate
  const handleClearPlate = (e: React.MouseEvent, plateId: number) => {
    e.stopPropagation();
    audioManager.playClick();
    setPlates((prev) => prev.map((p) => (p.id === plateId ? { ...p, item: null } : p)));
    showToast('🗑️ ทิ้งอาหารบนจานเรียบร้อย');
  };

  // Customer Click
  const handleCustomerClick = (slotIndex: number) => {
    const customer = customers[slotIndex];
    if (!customer || customer.state !== 'waiting') return;

    // Check if any plate has this item
    const matchingPlate = plates.find((p) => p.item?.id === customer.order.id);
    if (matchingPlate) {
      serveCustomer(slotIndex, matchingPlate.id);
    } else {
      showToast(`🐱 ${customer.customer.nameTh} กำลังรอ "${customer.order.nameTh}" อยู่นะ`);
    }
  };

  // Listen to customer speech bonus
  const handleListenSpeech = (slotIndex: number) => {
    const customer = customers[slotIndex];
    if (!customer || customer.listenedBonus) return;

    audioManager.playServe();

    // Bonus coins: base 20 + upgrade bonus (50% per level)
    const tipMultiplier = 1 + playerStats.upgrades.tipMaster * 0.5;
    const bonusCoins = Math.round(20 * tipMultiplier);

    setPlayerStats((prev) => ({ ...prev, coins: prev.coins + bonusCoins }));
    setCoinsEarnedInDay((prev) => prev + bonusCoins);
    setScore((prev) => prev + 25);

    setCustomers((prev) =>
      prev.map((c, idx) => (idx === slotIndex && c ? { ...c, listenedBonus: true } : c))
    );

    showToast(`📢 ฟังออเดอร์ภาษาอังกฤษรับทิปพิเศษ +${bonusCoins} เหรียญ!`);
  };

  // Boosters
  const handleUseFreeze = () => {
    if (playerStats.boosters.freezeTime <= 0 || isTimeFrozen) return;
    setPlayerStats((prev) => ({
      ...prev,
      boosters: { ...prev.boosters, freezeTime: prev.boosters.freezeTime - 1 },
    }));
    setIsTimeFrozen(true);
    setFreezeDuration(10);
    showToast('❄️ แช่แข็งเวลา 10 วินาที!');
  };

  const handleUseHeal = () => {
    if (playerStats.boosters.healCustomers <= 0) return;
    setPlayerStats((prev) => ({
      ...prev,
      boosters: { ...prev.boosters, healCustomers: prev.boosters.healCustomers - 1 },
    }));
    setCustomers((prev) =>
      prev.map((c) =>
        c ? { ...c, timeRemaining: Math.min(c.maxPatience, c.timeRemaining + c.maxPatience * 0.4) } : null
      )
    );
    showToast('💖 ฟื้นฟูความอดทนลูกค้าทุกคน +40%!');
  };

  const handleUseClean = () => {
    if (playerStats.boosters.cleanStoves <= 0) return;
    setPlayerStats((prev) => ({
      ...prev,
      boosters: { ...prev.boosters, cleanStoves: prev.boosters.cleanStoves - 1 },
    }));
    setStoves((prev) =>
      prev.map((s) =>
        s.status === 'burnt'
          ? { id: s.id, status: 'empty', item: null, cookProgress: 0, burnProgress: 0 }
          : s
      )
    );
    showToast('🧹 ล้างเตาที่ไหม้ทั้งหมดสะอาดเอี่ยม!');
  };

  // Upgrades
  const handleUpgrade = (upgradeKey: keyof PlayerStats['upgrades'], cost: number) => {
    setPlayerStats((prev) => ({
      ...prev,
      coins: prev.coins - cost,
      upgrades: {
        ...prev.upgrades,
        [upgradeKey]: prev.upgrades[upgradeKey] + 1,
      },
    }));
    showToast('🎉 อัปเกรดสำเร็จ!');
  };

  const handleBuyBooster = (boosterKey: keyof PlayerStats['boosters'], cost: number) => {
    setPlayerStats((prev) => ({
      ...prev,
      coins: prev.coins - cost,
      boosters: {
        ...prev.boosters,
        [boosterKey]: prev.boosters[boosterKey] + 1,
      },
    }));
    showToast('🛍️ ซื้อไอเทมสำเร็จ เพิ่มลงในกระเป๋าแล้ว!');
  };

  const handleResetProgress = () => {
    const freshStats: PlayerStats = {
      ...DEFAULT_PLAYER_STATS,
      coins: 80,
      unlockedLevel: 1,
      levelDayStars: {},
      levelDayHighScores: {},
    };
    setPlayerStats(freshStats);
    try {
      localStorage.setItem('cozy_cafe_stats', JSON.stringify(freshStats));
    } catch {
      // ignore
    }
    startDay(1, 1);
    showToast('🔄 รีเซ็ตความคืบหน้าเรียบร้อย เริ่มต้นที่ Level 1 Day 1');
  };

  return (
    <div className="min-h-screen bg-[#fff9e6] text-[#5d4037] flex flex-col selection:bg-[#f4c2d7] selection:text-[#5d4037]">
      {/* Top Navbar */}
      <Navbar
        coins={playerStats.coins}
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        isBgmActive={isBgmActive}
        setIsBgmActive={setIsBgmActive}
        isSfxActive={isSfxActive}
        setIsSfxActive={setIsSfxActive}
        isPlaying={!isPaused && !showSummary}
      />

      {/* Sub Bar with score, timer, goals, boosters */}
      <SubBar
        levelId={currentLevelId}
        dayNumber={currentDayNumber}
        score={score}
        targetScore={currentDay.starGoals[0]}
        starGoals={currentDay.starGoals}
        timeRemaining={Math.max(0, Math.ceil(timeRemaining))}
        isPaused={isPaused}
        secondsUntilNextQuiz={Math.max(0, Math.ceil(secondsUntilNextQuiz))}
        freezeBoosterCount={playerStats.boosters.freezeTime}
        healBoosterCount={playerStats.boosters.healCustomers}
        cleanBoosterCount={playerStats.boosters.cleanStoves}
        onUseFreeze={handleUseFreeze}
        onUseHeal={handleUseHeal}
        onUseClean={handleUseClean}
        isTimeFrozen={isTimeFrozen}
      />

      {/* Main Kitchen Playing Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Customer Tables (3 Slots) */}
        <CustomerArea
          customerSlots={customers}
          levelId={currentLevelId}
          dayNumber={currentDayNumber}
          levelTitle={currentLevel.titleTh}
          onListenSpeech={handleListenSpeech}
          onCustomerClick={handleCustomerClick}
        />

        {/* Middle Workstations: Stoves (3 Slots) & Plating (4 Slots) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Stoves (3 Slots) - 5 Columns */}
          <div className="lg:col-span-5 flex flex-col">
            <StoveArea stoves={stoves} onStoveClick={handleStoveClick} />
          </div>

          {/* Plating (4 Slots) - 7 Columns */}
          <div className="lg:col-span-7 flex flex-col">
            <PlatingArea
              plates={plates}
              onPlateClick={handlePlateClick}
              onClearPlate={handleClearPlate}
            />
          </div>
        </div>

        {/* Lower Workstation: Fresh Ingredients Pantry (Full Width, Roomy & Balanced) */}
        <div className="w-full">
          <IngredientsTray
            availableItemIds={currentDay.availableItemIds}
            onSelectIngredient={handleSelectIngredient}
          />
        </div>
      </main>

      {/* Floating Notification Toast */}
      {floatingToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 border-2 border-[#f4c2d7] px-4 py-2 rounded-full shadow-lg text-xs sm:text-sm font-bold text-[#5d4037] flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-150">
          <span>{floatingToast}</span>
        </div>
      )}

      {/* Auto-Pause Quiz Modal */}
      {activeQuizQuestion && (
        <QuizModal
          question={activeQuizQuestion}
          onAnswer={handleQuizAnswer}
          onClose={handleCloseQuiz}
        />
      )}

      {/* Recipe Knowledge Hub Modal */}
      {currentScreen === 'knowledge' && (
        <KnowledgeHubModal onClose={() => setCurrentScreen('kitchen')} />
      )}

      {/* Level Map Modal */}
      {currentScreen === 'map' && (
        <LevelMapModal
          playerStats={playerStats}
          currentLevelId={currentLevelId}
          currentDayNumber={currentDayNumber}
          onSelectDay={(lvl, day) => {
            startDay(lvl, day);
            setCurrentScreen('kitchen');
          }}
          onClose={() => setCurrentScreen('kitchen')}
          onResetProgress={handleResetProgress}
        />
      )}

      {/* Shop Modal */}
      {currentScreen === 'shop' && (
        <ShopModal
          playerStats={playerStats}
          onUpgrade={handleUpgrade}
          onBuyBooster={handleBuyBooster}
          onClose={() => setCurrentScreen('kitchen')}
        />
      )}

      {/* Level Summary Modal */}
      {showSummary && (
        <LevelSummaryModal
          levelId={currentLevelId}
          dayNumber={currentDayNumber}
          score={score}
          targetScore={currentDay.starGoals[0]}
          starGoals={currentDay.starGoals}
          coinsEarned={coinsEarnedInDay}
          quizzesSolved={quizzesSolvedInDay}
          onNextDay={() => {
            if (currentDayNumber < 3) {
              startDay(currentLevelId, currentDayNumber + 1);
            } else if (currentLevelId < 3) {
              startDay(currentLevelId + 1, 1);
            } else {
              startDay(1, 1);
            }
          }}
          onRetry={() => {
            startDay(currentLevelId, currentDayNumber);
          }}
          onOpenMap={() => {
            setShowSummary(false);
            setCurrentScreen('map');
          }}
          hasNextDay={currentDayNumber < 3 || currentLevelId < 3}
        />
      )}
    </div>
  );
}
