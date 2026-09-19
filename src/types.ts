export type PartOfSpeech =
  | 'Noun'
  | 'Pronoun'
  | 'Verb'
  | 'Adjective'
  | 'Adverb'
  | 'Preposition'
  | 'Conjunction'
  | 'Interjection';

export interface QuizQuestion {
  id: number;
  sentence: string;
  targetWord: string;
  questionTh: string;
  choices: string[];
  correctIndex: number;
  explanationTh: string;
  partOfSpeech: PartOfSpeech;
}

export type DishCategory = 'cook' | 'drink' | 'instant';

export interface MenuItem {
  id: string;
  nameTh: string;
  nameEn: string;
  category: DishCategory;
  rawEmoji: string;
  cookedEmoji: string;
  rawNameTh: string;
  cookedNameTh: string;
  cookTime: number; // in seconds
  burnTime: number; // in seconds after cooked
  score: number;
  coins: number;
  speechPhraseEn: string;
  descriptionTh: string;
}

export interface CustomerCharacter {
  id: string;
  nameTh: string;
  emoji: string;
  personality: string;
  voicePitch: number;
}

export interface CustomerSlot {
  id: string;
  customer: CustomerCharacter;
  order: MenuItem;
  patience: number; // 0 to 100
  maxPatience: number; // total seconds
  timeRemaining: number;
  listenedBonus: boolean;
  state: 'waiting' | 'served' | 'angry';
}

export interface StoveSlot {
  id: number;
  status: 'empty' | 'cooking' | 'cooked' | 'burnt';
  item: MenuItem | null;
  cookProgress: number; // 0 to 100%
  burnProgress: number; // 0 to 100%
}

export interface PlateSlot {
  id: number;
  item: MenuItem | null;
}

export interface DayConfig {
  dayNumber: number;
  durationSeconds: number;
  starGoals: [number, number, number]; // [1-star, 2-star, 3-star]
  availableItemIds: string[];
}

export interface LevelConfig {
  id: number;
  titleTh: string;
  titleEn: string;
  icon: string;
  descriptionTh: string;
  days: DayConfig[];
}

export interface ShopUpgrade {
  id: string;
  nameTh: string;
  nameEn: string;
  descriptionTh: string;
  icon: string;
  currentLevel: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  effectDescription: string;
}

export interface PlayerStats {
  coins: number;
  unlockedLevel: number; // 1, 2, 3
  levelDayStars: Record<string, number>; // key: "1-1", value: 1..3
  levelDayHighScores: Record<string, number>;
  upgrades: {
    stoveSpeed: number; // 0..3
    customerPatience: number; // 0..3
    tipMaster: number; // 0..3
    plateHeater: number; // 0..3
  };
  boosters: {
    freezeTime: number;
    healCustomers: number;
    cleanStoves: number;
  };
}
