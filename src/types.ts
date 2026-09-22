export type InputMode = 'manual' | 'choices';

export interface MethodSteps {
  rawBaht: number;
  chiffreA: number;      // Chiffre A de départ (ex: 400 ฿)
  step1Divide10: number; // A / 10 (ex: 40)
  step2Divide4: number;  // Chiffre B = (A / 10) / 4 (ex: 10.00 €)
  chiffreB: number;      // Alias explicite pour le chiffre B
  step2Half1: number;    // Première moitié (A / 10) / 2
  step2Half2: number;    // Seconde moitié (half1 / 2)
  tenPercent: number;    // 10% du chiffre B
  fivePercent: number;   // 5% du chiffre B (10% / 2)
  plusFivePercent: number; // 5% à ajouter
  step3FinalEuro: number; // chiffre B + 5% (ex: 10.50 €)
  onePercentOfA: number;  // 1% du chiffre A (ex: pour 400 ฿ -> 4)
  onePercentCentimes: number; // ce sont des centimes à retirer (ex: 4 cts)
  minusOnePercent: number; // conversion en euros à soustraire (ex: 0.04 €)
  ultraPreciseEuro: number; // (B + 5%) - centimes (ex: 10.46 €)
  roundedEuro: number;    // Arrondi pour l'entraînement mental standard
  realEuroAmount: number; // Cours officiel du jour
  differenceWithReal: number; // Écart avec le cours officiel
  officialRate: number;   // 1 € = 38.30 ฿
}

export interface Question {
  id: string;
  bahtAmount: number;
  steps: MethodSteps;
  choices: number[]; // 3 different options in euros
  correctChoiceIndex: number;
  contextTag?: string; // e.g. "Pad Thaï", "Massage 1h", "Course Grab"
}

export interface RangeSettings {
  minEuro: number;      // e.g. 1
  maxEuro: number;      // e.g. 100 (user specified example: 0 to 100 €)
  minBaht: number;      // derived, e.g. 40 THB
  maxBaht: number;      // derived, e.g. 3800 THB
  roundNumbersOnly: boolean; // Prefer round numbers like 50, 100, 200, 500 for easier mental calculation
}

export type AccuracyLevel = 'exact' | 'very_close' | 'acceptable' | 'wrong';

export interface EvaluationResult {
  accuracy: AccuracyLevel;
  userValue: number;
  exactMentalValue: number;
  realEuroValue: number;
  absoluteDiffFromMental: number;
  absoluteDiffFromReal: number;
  percentageDiff: number;
  feedbackMessage: string;
}

export interface HistoryItem {
  id: string;
  baht: number;
  userAnswer: number;
  exactEuro: number;
  accuracy: AccuracyLevel;
  timestamp: number;
  mode: InputMode;
}

export interface UserStats {
  totalAttempts: number;
  exactCount: number;
  closeCount: number;
  streak: number;
  bestStreak: number;
}
