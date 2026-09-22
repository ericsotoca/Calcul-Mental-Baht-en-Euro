import { MethodSteps, Question, RangeSettings, EvaluationResult, AccuracyLevel } from '../types';

// Taux de change officiel fixé en dur dans le logiciel pour aujourd'hui et les prochaines sessions
// Cours officiel de référence : 1 EUR = 38.30 THB (ou 1 THB = 0.02611 EUR)
export const OFFICIAL_EUR_TO_THB_RATE = 38.30;
export const OFFICIAL_THB_TO_EUR_RATE = 1 / OFFICIAL_EUR_TO_THB_RATE;

// The mental calculation factor:
// 1 THB -> /10 -> /4 -> * 1.05 = (1/40) * 1.05 = 0.02625 EUR
// Inverse: 1 EUR = ~38.095 THB
export const THB_TO_EUR_FACTOR = 0.02625;
export const EUR_TO_THB_FACTOR = 1 / THB_TO_EUR_FACTOR; // ~38.095

export function euroToBaht(euro: number): number {
  return Math.round(euro * EUR_TO_THB_FACTOR);
}

export function bahtToEuro(baht: number): number {
  return Number((baht * THB_TO_EUR_FACTOR).toFixed(2));
}

export function bahtToOfficialRealEuro(baht: number): number {
  return Number((baht / OFFICIAL_EUR_TO_THB_RATE).toFixed(2));
}

export function computeSteps(baht: number): MethodSteps {
  const chiffreA = baht;
  const step1 = chiffreA / 10;
  const step2Half1 = step1 / 2;
  const chiffreB = step1 / 4;
  const step2Half2 = chiffreB;
  const tenPercent = chiffreB / 10;
  const fivePercent = tenPercent / 2;
  const step3 = chiffreB + fivePercent;
  
  // 1% du chiffre de départ A = des centimes que l'on enlève !
  // Ex: pour A = 400 ฿ ➔ 1% = 4 ➔ ce sont 4 centimes qu'on enlève (0,04 €)
  // Ex: pour A = 1800 ฿ ➔ 1% = 18 ➔ ce sont 18 centimes qu'on enlève (0,18 €)
  const onePercentOfA = Number((chiffreA * 0.01).toFixed(2));
  const onePercentCentimes = Math.round(chiffreA * 0.01);
  const minusOnePercent = Number((onePercentCentimes / 100).toFixed(2));
  const ultraPrecise = Number((step3 - minusOnePercent).toFixed(2));
  const realEuro = bahtToOfficialRealEuro(baht);
  const diffWithReal = Number((ultraPrecise - realEuro).toFixed(2));

  return {
    rawBaht: baht,
    chiffreA,
    chiffreB: Number(chiffreB.toFixed(2)),
    step1Divide10: Number(step1.toFixed(2)),
    step2Divide4: Number(chiffreB.toFixed(2)),
    step2Half1: Number(step2Half1.toFixed(2)),
    step2Half2: Number(step2Half2.toFixed(2)),
    tenPercent: Number(tenPercent.toFixed(2)),
    fivePercent: Number(fivePercent.toFixed(2)),
    plusFivePercent: Number(fivePercent.toFixed(2)),
    step3FinalEuro: Number(step3.toFixed(2)),
    onePercentOfA,
    onePercentCentimes,
    minusOnePercent,
    ultraPreciseEuro: ultraPrecise,
    roundedEuro: ultraPrecise, // Le résultat final de la méthode mentale complète (A ➔ ÷10 ➔ ÷4 = B ➔ +5% ➔ -1%)
    realEuroAmount: realEuro,
    differenceWithReal: diffWithReal,
    officialRate: OFFICIAL_EUR_TO_THB_RATE,
  };
}

const THAI_CONTEXTS: { name: string; minThb: number; maxThb: number }[] = [
  { name: 'Brochette street food (Moo Ping)', minThb: 20, maxThb: 60 },
  { name: 'Bouteille d’eau au 7-Eleven', minThb: 10, maxThb: 30 },
  { name: 'Pad Thaï sur un marché de rue', minThb: 40, maxThb: 90 },
  { name: 'Smoothie mangue fraîche', minThb: 50, maxThb: 100 },
  { name: 'Plat de riz sauté (Khao Pad)', minThb: 60, maxThb: 120 },
  { name: 'Mangue Sticky Rice (Khao Niew Mamuang)', minThb: 80, maxThb: 150 },
  { name: 'Trajet court en Songthaew ou Tuk-tuk', minThb: 40, maxThb: 150 },
  { name: 'Massage thaï traditionnel (1 heure)', minThb: 250, maxThb: 400 },
  { name: 'Course de taxi-meter à Bangkok', minThb: 150, maxThb: 350 },
  { name: 'T-shirt souvenir ou pantalon éléphant', minThb: 120, maxThb: 250 },
  { name: 'Entrée dans un grand temple (Wat)', minThb: 100, maxThb: 500 },
  { name: 'Dîner restaurant de fruits de mer pour deux', minThb: 600, maxThb: 1400 },
  { name: 'Trajet en bateau rapide (Speedboat île)', minThb: 500, maxThb: 1200 },
  { name: 'Nuit en guesthouse / hôtel cosy', minThb: 700, maxThb: 2200 },
  { name: 'Location de scooter pour la journée', minThb: 200, maxThb: 350 },
  { name: 'Excursion journée snorkeling', minThb: 1500, maxThb: 3500 },
  { name: 'Nuit en hôtel de charme 4 étoiles', minThb: 2500, maxThb: 5000 },
];

export function getContextForBaht(baht: number): string {
  const matches = THAI_CONTEXTS.filter((c) => baht >= c.minThb && baht <= c.maxThb);
  if (matches.length > 0) {
    const picked = matches[Math.floor(Math.random() * matches.length)];
    return picked.name;
  }
  if (baht < 100) return 'Achats de rue / 7-Eleven';
  if (baht < 500) return 'Repas & petits transports';
  if (baht < 1500) return 'Loisirs & souvenirs';
  return 'Hôtel ou grande activité';
}

// Generate realistic numbers convenient for mental calculation
export function generateBahtNumber(minBaht: number, maxBaht: number, roundNumbersOnly: boolean): number {
  const safeMin = Math.max(10, minBaht);
  const safeMax = Math.max(safeMin + 20, maxBaht);

  let possibleSteps: number[];
  if (safeMax <= 200) {
    possibleSteps = [10, 20, 25, 40, 50];
  } else if (safeMax <= 800) {
    possibleSteps = [20, 40, 50, 60, 80, 100, 120, 150, 200];
  } else if (safeMax <= 2000) {
    possibleSteps = [50, 100, 120, 160, 200, 240, 250, 300, 400, 500];
  } else {
    possibleSteps = [100, 200, 240, 300, 400, 500, 600, 800, 1000];
  }

  const step = possibleSteps[Math.floor(Math.random() * possibleSteps.length)];

  if (roundNumbersOnly) {
    // Generate a multiple of the step
    const minMultiplier = Math.max(1, Math.ceil(safeMin / step));
    const maxMultiplier = Math.floor(safeMax / step);
    if (maxMultiplier >= minMultiplier) {
      const mult = Math.floor(Math.random() * (maxMultiplier - minMultiplier + 1)) + minMultiplier;
      return mult * step;
    }
  }

  // Fallback random between min and max rounded to nearest 10
  const randomRaw = Math.floor(Math.random() * (safeMax - safeMin)) + safeMin;
  return Math.round(randomRaw / 10) * 10;
}

// Generate 3 unique choices (1 correct and 2 plausible distractors)
export function generateThreeChoices(steps: MethodSteps): { choices: number[]; correctIndex: number } {
  const exact = steps.roundedEuro;
  const forgot5Percent = Number(steps.step2Divide4.toFixed(2));
  const added10Percent = Number((steps.step2Divide4 * 1.1).toFixed(2));
  
  // Plausible alternatives:
  const distractorsCandidates: number[] = [
    forgot5Percent,
    added10Percent,
    Number((steps.step2Divide4 * 0.95).toFixed(2)),
    Number((exact + (exact > 10 ? 2 : 0.75)).toFixed(2)),
    Number((exact - (exact > 10 ? 2 : 0.75)).toFixed(2)),
    Number((exact * 1.15).toFixed(2)),
    Number((exact * 0.85).toFixed(2)),
  ];

  // Filter out any identical to exact, ensure positive and distinct
  const uniqueDistractors: number[] = [];
  for (const val of distractorsCandidates) {
    if (val > 0 && Math.abs(val - exact) > 0.15 && !uniqueDistractors.some((d) => Math.abs(d - val) < 0.1)) {
      uniqueDistractors.push(val);
    }
  }

  // Ensure we have at least 2 distractors
  while (uniqueDistractors.length < 2) {
    const offset = (uniqueDistractors.length + 1) * (exact > 20 ? 3 : 1);
    const candidate = Number((exact + offset).toFixed(2));
    if (!uniqueDistractors.includes(candidate) && Math.abs(candidate - exact) > 0.1) {
      uniqueDistractors.push(candidate);
    }
  }

  // Pick 2 distractors
  const chosenDistractors = uniqueDistractors.slice(0, 2);

  // Form array of 3 choices and shuffle
  const allChoices = [exact, chosenDistractors[0], chosenDistractors[1]];
  
  // Sort or shuffle nicely
  const shuffled = [...allChoices].sort(() => Math.random() - 0.5);
  const correctIndex = shuffled.findIndex((val) => val === exact);

  return {
    choices: shuffled,
    correctIndex,
  };
}

export function generateQuestion(settings: RangeSettings): Question {
  const baht = generateBahtNumber(settings.minBaht, settings.maxBaht, settings.roundNumbersOnly);
  const steps = computeSteps(baht);
  const { choices, correctIndex } = generateThreeChoices(steps);
  const contextTag = getContextForBaht(baht);

  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    bahtAmount: baht,
    steps,
    choices,
    correctChoiceIndex: correctIndex,
    contextTag,
  };
}

export function evaluateAnswer(userAnswer: number, steps: MethodSteps): EvaluationResult {
  const exactMental = steps.roundedEuro;
  const realEuro = steps.realEuroAmount;
  const absoluteDiffFromMental = Math.abs(userAnswer - exactMental);
  const absoluteDiffFromReal = Math.abs(userAnswer - realEuro);
  const percentageDiff = exactMental > 0 ? (absoluteDiffFromMental / exactMental) * 100 : 0;

  let accuracy: AccuracyLevel;
  let feedbackMessage: string;

  // In real-world mental math on the street, within 2% or 0.25€ is essentially exact
  if (percentageDiff <= 2.5 || absoluteDiffFromMental <= 0.25) {
    accuracy = 'exact';
    feedbackMessage = 'Excellent ! Résultat mental impeccable.';
  } else if (percentageDiff <= 6 || absoluteDiffFromMental <= 0.75) {
    accuracy = 'very_close';
    feedbackMessage = 'Très proche ! En situation réelle en Thaïlande, c’est parfait.';
  } else if (percentageDiff <= 12 || absoluteDiffFromMental <= 1.5) {
    accuracy = 'acceptable';
    feedbackMessage = 'Bonne approximation, le compte est bon à quelques centimes près.';
  } else {
    accuracy = 'wrong';
    feedbackMessage = 'Écart important. Pense bien à diviser par 10 puis par 4 (+5%).';
  }

  return {
    accuracy,
    userValue: userAnswer,
    exactMentalValue: exactMental,
    realEuroValue: realEuro,
    absoluteDiffFromMental: Number(absoluteDiffFromMental.toFixed(2)),
    absoluteDiffFromReal: Number(absoluteDiffFromReal.toFixed(2)),
    percentageDiff: Number(percentageDiff.toFixed(1)),
    feedbackMessage,
  };
}
