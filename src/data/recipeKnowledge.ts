export interface KnowledgeTopic {
  id: string;
  titleTh: string;
  titleEn: string;
  icon: string;
  color: string;
  definitionTh: string;
  exampleEn: string;
  exampleTh: string;
  cafeExample: string;
  quickTip: string;
}

export const PARTS_OF_SPEECH_KNOWLEDGE: KnowledgeTopic[] = [
  {
    id: 'noun',
    titleTh: '1. Noun (คำนาม)',
    titleEn: 'Noun',
    icon: '🍞',
    color: '#ffb3ba',
    definitionTh: 'คำที่ใช้เรียกชื่อ คน, สัตว์, สิ่งของ, สถานที่ หรือแนวคิด',
    exampleEn: 'coffee, bread, chef, kitchen, cat',
    exampleTh: 'กาแฟ, ขนมปัง, เชฟ, ห้องครัว, น้องแมว',
    cafeExample: 'The "chef" baked fresh "bread" in the "cafe". (chef, bread, cafe เป็นคำนาม)',
    quickTip: '💡 จำง่ายๆ: นามคือสิ่งที่หยิบจับได้ หรือเรียกชื่อสิ่งต่างๆ ได้เสมอ',
  },
  {
    id: 'pronoun',
    titleTh: '2. Pronoun (คำสรรพนาม)',
    titleEn: 'Pronoun',
    icon: '🐾',
    color: '#ffdfba',
    definitionTh: 'คำที่ใช้เรียกแทนคำนาม เพื่อจะได้ไม่ต้องเอ่ยชื่อซ้ำๆ',
    exampleEn: 'I, you, he, she, it, we, they, me, him, them',
    exampleTh: 'ฉัน, คุณ, เขา, เธอ, มัน, พวกเรา, พวกเขา',
    cafeExample: 'Lucky likes burger. "He" eats "it" happily. (He แทน Lucky, it แทน burger)',
    quickTip: '💡 จำง่ายๆ: คำแทนตัว เช่น I / You / We / They / He / She / It',
  },
  {
    id: 'verb',
    titleTh: '3. Verb (คำกริยา)',
    titleEn: 'Verb',
    icon: '♨️',
    color: '#ffffba',
    definitionTh: 'คำที่แสดงอาการ การกระทำ หรือสภาวะของประธานในประโยค',
    exampleEn: 'cook, bake, fry, pour, drink, is, are, love',
    exampleTh: 'ปรุง, อบ, ทอด, ริน, ดื่ม, เป็น/อยู่/คือ, รัก',
    cafeExample: 'The chef "fries" the golden eggs carefully. (fries คือการกระทำ)',
    quickTip: '💡 จำง่ายๆ: ถ้าขยับร่างกายได้ หรือบอกว่ากำลังเป็นอะไรอยู่ นั่นคือ Verb!',
  },
  {
    id: 'adjective',
    titleTh: '4. Adjective (คำคุณศัพท์)',
    titleEn: 'Adjective',
    icon: '✨',
    color: '#baffc9',
    definitionTh: 'คำที่ใช้ขยายคำนามหรือสรรพนาม เพื่อบอกลักษณะ สี ขนาด รสชาติ',
    exampleEn: 'delicious, sweet, hot, crispy, fluffy, cute',
    exampleTh: 'อร่อย, หวาน, ร้อน, กรอบ, นุ่มฟู, น่ารัก',
    cafeExample: 'Enjoy this "hot" coffee and "crispy" fries. (hot ขยาย coffee, crispy ขยาย fries)',
    quickTip: '💡 จำง่ายๆ: อยู่หน้านาม หรือหลัง Verb to be เสมอเพื่อบอกว่า "เป็นอย่างไร"',
  },
  {
    id: 'adverb',
    titleTh: '5. Adverb (คำกริยาวิเศษณ์)',
    titleEn: 'Adverb',
    icon: '⚡',
    color: '#bae1ff',
    definitionTh: 'คำที่ใช้ขยายคำกริยา คุณศัพท์ หรือกริยาวิเศษณ์ด้วยกันเอง มักลงท้ายด้วย -ly',
    exampleEn: 'quickly, quietly, happily, very, always, well',
    exampleTh: 'อย่างรวดเร็ว, อย่างเงียบๆ, อย่างมีความสุข, มาก, สม่ำเสมอ',
    cafeExample: 'The panda eats his ramen "slowly". (slowly ขยายกริยา eats ว่ากินช้าๆ)',
    quickTip: '💡 จำง่ายๆ: มักตอบคำถามว่า ทำกิริยานั้น "อย่างไร (How)?" เช่น cooked quickly',
  },
  {
    id: 'preposition',
    titleTh: '6. Preposition (คำบุพบท)',
    titleEn: 'Preposition',
    icon: '🍽️',
    color: '#e8c5ff',
    definitionTh: 'คำที่ใช้เชื่อมบอกตำแหน่ง ทิศทาง เวลา หรือความสัมพันธ์ของคำนาม',
    exampleEn: 'in, on, at, under, with, between, behind',
    exampleTh: 'ใน, บน, ที่, ใต้, กับ/ด้วย, ระหว่าง, ด้านหลัง',
    cafeExample: 'The pancake is "on" the plate "with" maple syrup. (on บอกตำแหน่ง, with บอกสิ่งที่มาคู่กัน)',
    quickTip: '💡 จำง่ายๆ: คำบอกพิกัด เช่น บน (on) ใน (in) ใต้ (under) ที่ (at)',
  },
  {
    id: 'conjunction',
    titleTh: '7. Conjunction (คำสันธาน)',
    titleEn: 'Conjunction',
    icon: '🎀',
    color: '#f4c2d7',
    definitionTh: 'คำที่ใช้เชื่อมคำ วลี หรือประโยคเข้าด้วยกันอย่างสละสลวย',
    exampleEn: 'and, but, or, because, so, although, while',
    exampleTh: 'และ, แต่, หรือ, เพราะว่า, ดังนั้น, แม้ว่า',
    cafeExample: 'I want tea "and" cookies, "but" they are still baking. (and กับ but เชื่อมประโยค)',
    quickTip: '💡 จำง่ายๆ: ตัวสะพานเชื่อมประโยค (FANBOYS: For, And, Nor, But, Or, Yet, So)',
  },
  {
    id: 'interjection',
    titleTh: '8. Interjection (คำอุทาน)',
    titleEn: 'Interjection',
    icon: '🎉',
    color: '#ffd1dc',
    definitionTh: 'คำเปล่งเสียงออกมาตามอารมณ์ความรู้สึก มักมีเครื่องหมายอัศเจรีย์ (!)',
    exampleEn: 'Wow!, Yummy!, Oh!, Oops!, Bravo!, Yay!',
    exampleTh: 'ว้าว!, อร่อยจัง!, โอ๊ะ!, อุ๊ย!, ไชโย!',
    cafeExample: '"Yummy!" This chocolate cake is heavenly! (Yummy! อุทานแสดงความอร่อย)',
    quickTip: '💡 จำง่ายๆ: คำสั้นๆ แสดงอารมณ์ มักมีเครื่องหมายตกใจ ! ติดอยู่เสมอ',
  },
];
