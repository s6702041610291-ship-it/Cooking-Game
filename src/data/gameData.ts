import { CustomerCharacter, LevelConfig, MenuItem } from '../types';

export const CUSTOMER_CHARACTERS: CustomerCharacter[] = [
  {
    id: 'cat',
    nameTh: '🐱 น้องแมว (Mimi)',
    emoji: '🐱',
    personality: 'น่ารัก ขี้อ้อน ชอบของหวานและนม',
    voicePitch: 1.3,
  },
  {
    id: 'dog',
    nameTh: '🐶 น้องหมา (Lucky)',
    emoji: '🐶',
    personality: 'ร่าเริง อารมณ์ดี ชอบอาหารจานด่วน',
    voicePitch: 1.1,
  },
  {
    id: 'rabbit',
    nameTh: '🐰 น้องกระต่าย (Berry)',
    emoji: '🐰',
    personality: 'สุภาพ เรียบร้อย ชอบเครื่องดื่มอุ่นๆ',
    voicePitch: 1.4,
  },
  {
    id: 'bear',
    nameTh: '🐻 น้องหมี (Kuma)',
    emoji: '🐻',
    personality: 'ใจดี อดทนสูง ชอบกินจุและทานแพนเค้ก',
    voicePitch: 0.85,
  },
  {
    id: 'panda',
    nameTh: '🐼 น้องแพนด้า (Bao)',
    emoji: '🐼',
    personality: 'ชิลๆ สบายๆ ชอบจิบชาและทานของว่าง',
    voicePitch: 0.95,
  },
  {
    id: 'fox',
    nameTh: '🦊 น้องจิ้งจอก (Foxy)',
    emoji: '🦊',
    personality: 'ฉลาด ว่องไว ชอบของร้อนๆ ทันใจ',
    voicePitch: 1.2,
  },
];

export const MENU_ITEMS: Record<string, MenuItem> = {
  // Level 1 Items
  sandwich: {
    id: 'sandwich',
    nameTh: 'แซนด์วิชปิ้ง',
    nameEn: 'Toasted Sandwich',
    category: 'cook',
    rawEmoji: '🍞',
    cookedEmoji: '🥪',
    rawNameTh: 'ขนมปังสด',
    cookedNameTh: 'แซนด์วิช',
    cookTime: 5,
    burnTime: 7,
    score: 60,
    coins: 15,
    speechPhraseEn: 'Can I have one delicious Toasted Sandwich, please?',
    descriptionTh: 'ขนมปังสดนำไปปิ้งจนเหลืองกรอบหอมกรุ่น',
  },
  fried_egg: {
    id: 'fried_egg',
    nameTh: 'ไข่ดาว',
    nameEn: 'Fried Egg',
    category: 'cook',
    rawEmoji: '🥚',
    cookedEmoji: '🍳',
    rawNameTh: 'ไข่สด',
    cookedNameTh: 'ไข่ดาว',
    cookTime: 4,
    burnTime: 6,
    score: 50,
    coins: 12,
    speechPhraseEn: 'A sunny-side-up Fried Egg for me, thank you!',
    descriptionTh: 'ไข่ไก่สดทอดสุกกำลังดี ไข่แดงเยิ้มหอมมัน',
  },
  hot_coffee: {
    id: 'hot_coffee',
    nameTh: 'กาแฟร้อน',
    nameEn: 'Hot Coffee',
    category: 'drink',
    rawEmoji: '☕',
    cookedEmoji: '☕',
    rawNameTh: 'เมล็ดกาแฟ',
    cookedNameTh: 'กาแฟร้อน',
    cookTime: 4,
    burnTime: 999, // drinks don't burn easily
    score: 45,
    coins: 10,
    speechPhraseEn: 'I would like a cup of fresh Hot Coffee, please!',
    descriptionTh: 'กาแฟคั่วบดชงสดใหม่ หอมอบอวลทั่วทั้งคาเฟ่',
  },
  pancake: {
    id: 'pancake',
    nameTh: 'แพนเค้กเนย',
    nameEn: 'Butter Pancake',
    category: 'cook',
    rawEmoji: '🥞',
    cookedEmoji: '🥞',
    rawNameTh: 'แป้งแพนเค้ก',
    cookedNameTh: 'แพนเค้กเนย',
    cookTime: 6,
    burnTime: 7,
    score: 80,
    coins: 20,
    speechPhraseEn: 'Sweet Butter Pancake with syrup, please!',
    descriptionTh: 'แป้งแพนเค้กนุ่มฟูราดเนยและน้ำเชื่อมหวานฉ่ำ',
  },
  hot_tea: {
    id: 'hot_tea',
    nameTh: 'ชาชงร้อน',
    nameEn: 'Hot Tea',
    category: 'drink',
    rawEmoji: '🍵',
    cookedEmoji: '🍵',
    rawNameTh: 'ใบชาสด',
    cookedNameTh: 'ชาชงร้อน',
    cookTime: 4,
    burnTime: 999,
    score: 50,
    coins: 12,
    speechPhraseEn: 'A comforting cup of Hot Tea for me!',
    descriptionTh: 'ชาเขียวหอมกรุ่น ละมุนลิ้นช่วยให้ผ่อนคลาย',
  },

  // Level 2 Items
  burger: {
    id: 'burger',
    nameTh: 'เบอร์เกอร์เนื้อ',
    nameEn: 'Beef Burger',
    category: 'cook',
    rawEmoji: '🥩',
    cookedEmoji: '🍔',
    rawNameTh: 'เนื้อดิบ',
    cookedNameTh: 'เบอร์เกอร์',
    cookTime: 6,
    burnTime: 7,
    score: 90,
    coins: 25,
    speechPhraseEn: 'One juicy Beef Burger with crispy buns, please!',
    descriptionTh: 'เนื้อเบอร์เกอร์ย่างร้อนๆ ชุ่มฉ่ำ ประกบขนมปังนุ่ม',
  },
  fries: {
    id: 'fries',
    nameTh: 'เฟรนช์ฟรายส์',
    nameEn: 'French Fries',
    category: 'cook',
    rawEmoji: '🥔',
    cookedEmoji: '🍟',
    rawNameTh: 'มันฝรั่งสด',
    cookedNameTh: 'เฟรนช์ฟรายส์',
    cookTime: 5,
    burnTime: 6,
    score: 65,
    coins: 18,
    speechPhraseEn: 'Crispy French Fries with a pinch of salt, thank you!',
    descriptionTh: 'มันฝรั่งแท่งทอดสีเหลืองทอง กรอบนอกนุ่มใน',
  },
  soda: {
    id: 'soda',
    nameTh: 'น้ำอัดลมซ่า',
    nameEn: 'Sparkling Soda',
    category: 'drink',
    rawEmoji: '🥤',
    cookedEmoji: '🥤',
    rawNameTh: 'น้ำเชื่อมโซดา',
    cookedNameTh: 'น้ำอัดลม',
    cookTime: 3,
    burnTime: 999,
    score: 45,
    coins: 12,
    speechPhraseEn: 'A cold Sparkling Soda with ice, please!',
    descriptionTh: 'น้ำอัดลมเย็นสดชื่น ดื่มคู่กับของทอดเข้ากันสุดๆ',
  },
  cheeseburger: {
    id: 'cheeseburger',
    nameTh: 'ชีสเบอร์เกอร์',
    nameEn: 'Cheese Burger',
    category: 'cook',
    rawEmoji: '🧀',
    cookedEmoji: '🍔',
    rawNameTh: 'เนื้อชีสสด',
    cookedNameTh: 'ชีสเบอร์เกอร์',
    cookTime: 7,
    burnTime: 7,
    score: 110,
    coins: 30,
    speechPhraseEn: 'A deluxe Cheese Burger with melting cheese, please!',
    descriptionTh: 'เบอร์เกอร์เนื้อเข้มข้นโปะเชดด้าชีสเยิ้มๆ',
  },
  chicken_nuggets: {
    id: 'chicken_nuggets',
    nameTh: 'นักเก็ตไก่กรอบ',
    nameEn: 'Crispy Nuggets',
    category: 'cook',
    rawEmoji: '🍗',
    cookedEmoji: '🍗',
    rawNameTh: 'ไก่บดสด',
    cookedNameTh: 'นักเก็ตไก่',
    cookTime: 5,
    burnTime: 6,
    score: 75,
    coins: 20,
    speechPhraseEn: 'Crispy chicken nuggets with honey mustard, please!',
    descriptionTh: 'นักเก็ตไก่สูตรพิเศษชุบเกล็ดขนมปังทอดกรอบ',
  },

  // Level 3 Items
  chicken_soup: {
    id: 'chicken_soup',
    nameTh: 'ซุปไก่กระเทียม',
    nameEn: 'Garlic Chicken Soup',
    category: 'cook',
    rawEmoji: '🍗',
    cookedEmoji: '🍲',
    rawNameTh: 'ไก่สดปรุงรส',
    cookedNameTh: 'ซุปไก่',
    cookTime: 7,
    burnTime: 8,
    score: 110,
    coins: 30,
    speechPhraseEn: 'A bowl of warm Garlic Chicken Soup, please!',
    descriptionTh: 'ซุปไก่เคี่ยวเครื่องเทศและกระเทียมเจียวหอมละมุน',
  },
  boba_tea: {
    id: 'boba_tea',
    nameTh: 'ชานมไข่มุก',
    nameEn: 'Boba Milk Tea',
    category: 'drink',
    rawEmoji: '🧋',
    cookedEmoji: '🧋',
    rawNameTh: 'ชาและไข่มุก',
    cookedNameTh: 'ชานมไข่มุก',
    cookTime: 4,
    burnTime: 999,
    score: 60,
    coins: 16,
    speechPhraseEn: 'Sweet Boba Milk Tea with chewy tapioca, please!',
    descriptionTh: 'ชานมไต้หวันแท้พร้อมไข่มุกเหนียวนุ่มเคี้ยวเพลิน',
  },
  ramen: {
    id: 'ramen',
    nameTh: 'ราเมงหมูชาชู',
    nameEn: 'Chashu Ramen',
    category: 'cook',
    rawEmoji: '🍜',
    cookedEmoji: '🍜',
    rawNameTh: 'เส้นราเมงดิบ',
    cookedNameTh: 'ราเมงร้อน',
    cookTime: 8,
    burnTime: 8,
    score: 130,
    coins: 35,
    speechPhraseEn: 'A steaming bowl of Chashu Ramen with noodles, please!',
    descriptionTh: 'เส้นราเมงเหนียวนุ่มในน้ำซุปกระดูกหมูเข้มข้น',
  },
  gyoza: {
    id: 'gyoza',
    nameTh: 'เกี๊ยวซ่ากระทะร้อน',
    nameEn: 'Pan-fried Gyoza',
    category: 'cook',
    rawEmoji: '🥟',
    cookedEmoji: '🥟',
    rawNameTh: 'เกี๊ยวซ่าดิบ',
    cookedNameTh: 'เกี๊ยวซ่าสุก',
    cookTime: 6,
    burnTime: 7,
    score: 85,
    coins: 22,
    speechPhraseEn: 'Crispy pan-fried Gyoza with dipping sauce, please!',
    descriptionTh: 'เกี๊ยวซ่าแป้งบางกรอบไส้หมูผักสไตล์ญี่ปุ่น',
  },
};

export const GAME_LEVELS: LevelConfig[] = [
  {
    id: 1,
    titleTh: 'Level 1: เบเกอรี่และเครื่องดื่ม',
    titleEn: 'Bakery & Drink 🥐',
    icon: '🥐',
    descriptionTh: 'เปิดร้านวันแรก เสิร์ฟแซนด์วิช ไข่ดาว กาแฟร้อน และแพนเค้กแสนอร่อย',
    days: [
      {
        dayNumber: 1,
        durationSeconds: 75,
        starGoals: [150, 250, 380],
        availableItemIds: ['sandwich', 'fried_egg', 'hot_coffee'],
      },
      {
        dayNumber: 2,
        durationSeconds: 85,
        starGoals: [220, 380, 520],
        availableItemIds: ['sandwich', 'fried_egg', 'hot_coffee', 'pancake'],
      },
      {
        dayNumber: 3,
        durationSeconds: 90,
        starGoals: [300, 500, 700],
        availableItemIds: ['sandwich', 'fried_egg', 'hot_coffee', 'pancake', 'hot_tea'],
      },
    ],
  },
  {
    id: 2,
    titleTh: 'Level 2: ฟาสต์ฟู้ดและน้ำอัดลม',
    titleEn: 'Fast Food & Drinks 🍔',
    icon: '🍔',
    descriptionTh: 'เพิ่มความเร็วด้วยเบอร์เกอร์เนื้อชุ่มฉ่ำ เฟรนช์ฟรายส์กรอบ และชีสเบอร์เกอร์',
    days: [
      {
        dayNumber: 1,
        durationSeconds: 80,
        starGoals: [250, 400, 580],
        availableItemIds: ['burger', 'fries', 'soda'],
      },
      {
        dayNumber: 2,
        durationSeconds: 90,
        starGoals: [350, 550, 750],
        availableItemIds: ['burger', 'fries', 'soda', 'cheeseburger'],
      },
      {
        dayNumber: 3,
        durationSeconds: 100,
        starGoals: [450, 700, 950],
        availableItemIds: ['burger', 'fries', 'soda', 'cheeseburger', 'chicken_nuggets'],
      },
    ],
  },
  {
    id: 3,
    titleTh: 'Level 3: เอเชียนกูร์เมต์รสเลิศ',
    titleEn: 'Asian Gourmet 🍲',
    icon: '🍲',
    descriptionTh: 'อาหารจานร้อนสุดประณีต ซุปไก่กระเทียม ชานมไข่มุก ราเมง และเกี๊ยวซ่า',
    days: [
      {
        dayNumber: 1,
        durationSeconds: 85,
        starGoals: [300, 500, 720],
        availableItemIds: ['chicken_soup', 'boba_tea', 'ramen'],
      },
      {
        dayNumber: 2,
        durationSeconds: 100,
        starGoals: [450, 700, 980],
        availableItemIds: ['chicken_soup', 'boba_tea', 'ramen', 'gyoza'],
      },
      {
        dayNumber: 3,
        durationSeconds: 120,
        starGoals: [600, 900, 1200],
        availableItemIds: ['chicken_soup', 'boba_tea', 'ramen', 'gyoza'],
      },
    ],
  },
];

export function isLevelUnlocked(
  levelId: number,
  levelDayStars: Record<string, number> = {}
): boolean {
  if (levelId <= 1) return true;
  if (levelId === 2) {
    return (levelDayStars['1-3'] || 0) >= 1;
  }
  if (levelId === 3) {
    return (levelDayStars['2-3'] || 0) >= 1;
  }
  return false;
}

export function isDayUnlocked(
  levelId: number,
  dayNumber: number,
  levelDayStars: Record<string, number> = {}
): boolean {
  if (!isLevelUnlocked(levelId, levelDayStars)) return false;
  if (dayNumber <= 1) return true;
  return (levelDayStars[`${levelId}-${dayNumber - 1}`] || 0) >= 1;
}

export function getUnlockedLevel(levelDayStars: Record<string, number> = {}): number {
  if ((levelDayStars['2-3'] || 0) >= 1) return 3;
  if ((levelDayStars['1-3'] || 0) >= 1) return 2;
  return 1;
}

