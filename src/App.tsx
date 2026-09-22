import React, { useState, useEffect, useRef } from 'react';
import {
  Calculator,
  Sliders,
  BookOpen,
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Github,
  RotateCcw,
  Smartphone,
  Eye,
  EyeOff,
  Coins,
  ChevronRight,
  Lightbulb,
  Landmark,
  CornerDownLeft,
} from 'lucide-react';
import {
  Question,
  RangeSettings,
  InputMode,
  EvaluationResult,
  UserStats,
} from './types';
import {
  generateQuestion,
  evaluateAnswer,
  euroToBaht,
  OFFICIAL_EUR_TO_THB_RATE,
} from './utils/thaiMath';
import { MethodGuideModal } from './components/MethodGuideModal';
import { RangeSettingsModal } from './components/RangeSettingsModal';
import { GitHubDeployModal } from './components/GitHubDeployModal';
import { StepExplainer } from './components/StepExplainer';
import { Keypad } from './components/Keypad';
import { ScoreBoard } from './components/ScoreBoard';
import { MethodExplanationSection } from './components/MethodExplanationSection';

const DEFAULT_RANGE: RangeSettings = {
  minEuro: 1,
  maxEuro: 100, // User requested reference: 0 - 100 € maximum
  minBaht: euroToBaht(1),
  maxBaht: euroToBaht(100), // ~3800 THB
  roundNumbersOnly: true,
};

const DEFAULT_STATS: UserStats = {
  totalAttempts: 0,
  exactCount: 0,
  closeCount: 0,
  streak: 0,
  bestStreak: 0,
};

export default function App() {
  // Persistence for range settings and stats
  const [rangeSettings, setRangeSettings] = useState<RangeSettings>(() => {
    try {
      const saved = localStorage.getItem('thb_range_settings');
      return saved ? JSON.parse(saved) : DEFAULT_RANGE;
    } catch {
      return DEFAULT_RANGE;
    }
  });

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('thb_stats');
      return saved ? JSON.parse(saved) : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isGitHubOpen, setIsGitHubOpen] = useState<boolean>(false);

  // Gameplay state
  const [inputMode, setInputMode] = useState<InputMode>('choices'); // Default to 3 choices for maximum initial ergonomic speed
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() =>
    generateQuestion(rangeSettings)
  );
  const [manualInput, setManualInput] = useState<string>('');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showVirtualKeypad, setShowVirtualKeypad] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const questionCardRef = useRef<HTMLDivElement>(null);

  // Save to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem('thb_range_settings', JSON.stringify(rangeSettings));
    } catch {
      // ignore
    }
  }, [rangeSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('thb_stats', JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Focus input on new question if in manual mode
  useEffect(() => {
    if (inputMode === 'manual' && !evaluation && !showVirtualKeypad) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [currentQuestion, inputMode, evaluation, showVirtualKeypad]);

  // Handle new question generation
  const handleNextQuestion = () => {
    setEvaluation(null);
    setManualInput('');
    setSelectedChoice(null);
    setShowHint(false);
    setCurrentQuestion(generateQuestion(rangeSettings));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit answer logic
  const handleValidateAnswer = (answerNum: number) => {
    if (evaluation) return; // already submitted

    const result = evaluateAnswer(answerNum, currentQuestion.steps);
    setEvaluation(result);

    // Keep page scrolled to top so user sees the result immediately without jumping to the bottom
    window.scrollTo({ top: 0, behavior: 'smooth' });
    questionCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const isSuccess =
      result.accuracy === 'exact' ||
      result.accuracy === 'very_close' ||
      result.accuracy === 'acceptable';
    const isExact = result.accuracy === 'exact';
    const isClose = result.accuracy === 'very_close';

    setStats((prev) => {
      const newStreak = isSuccess ? prev.streak + 1 : 0;
      return {
        totalAttempts: prev.totalAttempts + 1,
        exactCount: isExact ? prev.exactCount + 1 : prev.exactCount,
        closeCount: isClose ? prev.closeCount + 1 : prev.closeCount,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
      };
    });
  };

  const handleManualSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualInput.trim()) return;

    // replace comma with dot
    const cleanNum = Number(manualInput.replace(',', '.').trim());
    if (isNaN(cleanNum) || cleanNum < 0) return;

    handleValidateAnswer(cleanNum);
  };

  const handleChoiceClick = (choiceVal: number) => {
    if (evaluation) return;
    setSelectedChoice(choiceVal);
    handleValidateAnswer(choiceVal);
  };

  // Keyboard ergonomics: 1, 2, 3 or A, B, C for choices; Space/Enter for Next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If modal is open, don't intercept keys
      if (isGuideOpen || isSettingsOpen || isGitHubOpen) return;

      // When answer is validated, Space or Enter moves to next question
      if (evaluation) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleNextQuestion();
        }
        return;
      }

      // When answering in choices mode: keys 1, 2, 3 or a, b, c
      if (inputMode === 'choices' && !evaluation) {
        if (e.key === '1' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          if (currentQuestion.choices[0] !== undefined) {
            handleChoiceClick(currentQuestion.choices[0]);
          }
        } else if (e.key === '2' || e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          if (currentQuestion.choices[1] !== undefined) {
            handleChoiceClick(currentQuestion.choices[1]);
          }
        } else if (e.key === '3' || e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          if (currentQuestion.choices[2] !== undefined) {
            handleChoiceClick(currentQuestion.choices[2]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [evaluation, inputMode, currentQuestion, isGuideOpen, isSettingsOpen, isGitHubOpen]);

  // Keypad inputs
  const handleKeypadDigit = (digit: string) => {
    if (digit === '.' && manualInput.includes('.')) return;
    setManualInput((prev) => prev + digit);
  };

  const handleKeypadDelete = () => {
    setManualInput((prev) => prev.slice(0, -1));
  };

  const handleKeypadClear = () => {
    setManualInput('');
  };

  // Reset stats
  const handleResetStats = () => {
    if (window.confirm('Voulez-vous réinitialiser vos statistiques de session ?')) {
      setStats(DEFAULT_STATS);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white antialiased">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & Concept */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Baht ➔ Euro
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  ÷10 ➔ ÷4 ➔ +5%
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  <Landmark className="w-3 h-3 text-amber-600" />
                  Cours officiel : 1 € = {OFFICIAL_EUR_TO_THB_RATE.toFixed(2)} ฿
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
                Entraînement rapide & intuitif au calcul mental en Thaïlande
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Method Guide */}
            <button
              id="open-guide-btn"
              type="button"
              onClick={() => {
                const el = document.getElementById('method-explanation-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setIsGuideOpen(true);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
              title="Espace méthode : A ➔ ÷10 ➔ ÷4 (B) ➔ +5% ➔ -1%"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Méthode</span>
            </button>

            {/* Range settings */}
            <button
              id="open-settings-btn"
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              title="Configurer la plage de montants"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Plage</span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono">
                {rangeSettings.maxEuro}€
              </span>
            </button>

            {/* GitHub Deploy */}
            <button
              id="open-github-btn"
              type="button"
              onClick={() => setIsGitHubOpen(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition flex items-center gap-1.5 shadow-2xs"
              title="Déploiement GitHub automatique"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden md:inline">GitHub</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl w-full mx-auto p-4 sm:p-6 space-y-4 flex-1 flex flex-col justify-center">
        {/* Ergonomic Top Status Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Exercices :</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="font-semibold text-zinc-800 dark:text-zinc-200 hover:text-blue-600 underline decoration-dotted"
            >
              {rangeSettings.minBaht.toLocaleString('fr-FR')} ฿ à {rangeSettings.maxBaht.toLocaleString('fr-FR')} ฿
              <span className="text-zinc-400 font-normal ml-1">
                (max {rangeSettings.maxEuro} €)
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const el = document.getElementById('method-explanation-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setIsGuideOpen(true);
                }
              }}
              className="text-[11px] text-amber-700 dark:text-amber-400 font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              A ➔ ÷10 ➔ ÷4 = B ➔ +5% ➔ -1%
            </button>
          </div>
        </div>

        {/* The Main Game Card */}
        <div 
          ref={questionCardRef}
          id="question-card"
          className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-sm transition-all"
        >
          {/* Compact Top-Right Button to jump immediately to next exercise */}
          <button
            id="top-right-next-btn"
            type="button"
            onClick={handleNextQuestion}
            className={`absolute top-3.5 right-3.5 sm:top-4 sm:right-4 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all shadow-2xs active:scale-95 cursor-pointer z-10 ${
              evaluation
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/25 ring-2 ring-blue-500/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-zinc-700/80'
            }`}
            title="Passer à l'exercice suivant (Entrée ou Espace)"
          >
            <span>{evaluation ? 'Suivant' : 'Passer'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Context tag and Title removed per user request for direct clarity */}

          {/* Amount in Thai Baht to convert */}
          <div className="text-center space-y-1 mb-5 pt-3 sm:pt-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">
                {currentQuestion.bahtAmount.toLocaleString('fr-FR')}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
                ฿
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Astuce : A ÷ 10 ({currentQuestion.steps.step1Divide10}) ➔ ÷ 4 ({currentQuestion.steps.chiffreB}€) ➔ +5% ➔ -{currentQuestion.steps.onePercentCentimes} cts
            </p>
          </div>

          {/* Mode Switcher: 3 Choix (QCM) vs Saisie Libre */}
          <div className="flex justify-center mb-5">
            <div className="p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
              <button
                id="mode-choices-btn"
                type="button"
                onClick={() => setInputMode('choices')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                  inputMode === 'choices'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>3 Propositions (QCM)</span>
              </button>
              <button
                id="mode-manual-btn"
                type="button"
                onClick={() => setInputMode('manual')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                  inputMode === 'manual'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-blue-500" />
                <span>Saisie libre</span>
              </button>
            </div>
          </div>

          {/* INTERACTION SECTION: Either Choice Buttons OR Manual Input */}
          {!evaluation ? (
            <div>
              {inputMode === 'choices' ? (
                /* 3 Propositions (QCM ergonomique avec raccourcis clavier) */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1 px-1">
                    <span className="font-semibold uppercase tracking-wider text-[11px]">
                      Sélectionnez votre estimation :
                    </span>
                    <span className="hidden sm:inline text-[11px]">
                      Raccourcis : touches <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px] border">1</kbd> <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px] border">2</kbd> <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px] border">3</kbd>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentQuestion.choices.map((choice, index) => {
                      const hotkey = index + 1;
                      return (
                        <button
                          key={index}
                          id={`choice-btn-${index}`}
                          type="button"
                          onClick={() => handleChoiceClick(choice)}
                          className="relative py-4 px-4 rounded-2xl text-center border-2 border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/70 dark:bg-zinc-800/50 hover:border-blue-500 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 active:scale-98 transition shadow-2xs group flex flex-col items-center justify-center min-h-[84px]"
                        >
                          <span className="absolute top-2 left-2.5 w-5 h-5 rounded-md bg-zinc-200/80 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[11px] font-bold flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                            {hotkey}
                          </span>
                          <span className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 font-mono">
                            {choice.toFixed(2)} €
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setInputMode('manual')}
                      className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline"
                    >
                      Préférer taper une estimation libre au clavier
                    </button>
                  </div>
                </div>
              ) : (
                /* Manual Input (Saisie libre ergonomique avec validation directe) */
                <div className="space-y-4">
                  <form onSubmit={handleManualSubmit} className="space-y-3">
                    <div className="max-w-xs mx-auto relative">
                      <input
                        ref={inputRef}
                        id="manual-euro-input"
                        type="text"
                        inputMode="decimal"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        placeholder="Ex: 2.50 ou 25"
                        className="w-full text-center py-3.5 px-4 text-2xl font-black rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 outline-none font-mono transition"
                      />
                      <span className="absolute right-4 top-4 text-lg font-bold text-zinc-400">
                        €
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                      <button
                        id="validate-manual-btn"
                        type="submit"
                        disabled={!manualInput.trim()}
                        className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Valider mon calcul (Entrée ↵)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowVirtualKeypad(!showVirtualKeypad)}
                        className={`p-3 rounded-xl border transition ${
                          showVirtualKeypad
                            ? 'bg-zinc-200 dark:bg-zinc-700 border-zinc-400 text-zinc-900 dark:text-zinc-100'
                            : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                        }`}
                        title="Afficher/Masquer le pavé tactile"
                      >
                        <Smartphone className="w-4 h-4" />
                      </button>
                    </div>
                  </form>

                  {/* Optional on-screen virtual keypad */}
                  {showVirtualKeypad && (
                    <div className="pt-2 animate-in fade-in duration-200">
                      <Keypad
                        onDigit={handleKeypadDigit}
                        onDelete={handleKeypadDelete}
                        onClear={handleKeypadClear}
                        onSubmit={handleManualSubmit}
                      />
                    </div>
                  )}

                  {/* Fallback help: switch to 3 choices if stuck */}
                  <div className="flex items-center justify-center gap-4 text-xs text-zinc-500 pt-1">
                    <button
                      type="button"
                      onClick={() => setInputMode('choices')}
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Un doute ? Passer aux 3 propositions
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setShowHint(!showHint)}
                      className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline flex items-center gap-1"
                    >
                      {showHint ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {showHint ? 'Masquer l’indice' : 'Voir les étapes en avance'}
                    </button>
                  </div>

                  {/* Hint visible if requested */}
                  {showHint && (
                    <div className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                      <StepExplainer steps={currentQuestion.steps} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* EVALUATION & FEEDBACK SECTION (Ergonomique & Taux réel en dur) */
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Status Header with clear visual feedback */}
              <div
                className={`p-4 rounded-2xl border text-center space-y-2 ${
                  evaluation.accuracy === 'exact'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                    : evaluation.accuracy === 'very_close'
                    ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 text-blue-950 dark:text-blue-100'
                    : evaluation.accuracy === 'acceptable'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
                }`}
              >
                <div className="flex items-center justify-center gap-2 font-bold text-sm sm:text-base">
                  {evaluation.accuracy === 'exact' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : evaluation.accuracy === 'very_close' ? (
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : evaluation.accuracy === 'acceptable' ? (
                    <Check className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  )}
                  <span>{evaluation.feedbackMessage}</span>
                </div>

                {/* Synthesis Grid: Votre réponse / Méthode mentale / Taux réel officiel */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1 max-w-md mx-auto">
                  <div className="p-2 rounded-lg bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">Votre réponse</span>
                    <span className="font-bold font-mono text-sm text-zinc-900 dark:text-zinc-100">
                      {evaluation.userValue.toFixed(2)} €
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-blue-600 dark:text-blue-400 block text-[10px] font-semibold">Méthode mentale</span>
                    <span className="font-bold font-mono text-sm text-blue-700 dark:text-blue-300">
                      {evaluation.exactMentalValue.toFixed(2)} €
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-amber-600 dark:text-amber-400 block text-[10px] font-semibold">Taux réel officiel</span>
                    <span className="font-bold font-mono text-sm text-amber-700 dark:text-amber-400">
                      {evaluation.realEuroValue.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              {/* Step Explainer & Real Rate Comparison */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                <StepExplainer steps={currentQuestion.steps} userAnswer={evaluation.userValue} />
              </div>

              {/* High-Contrast Ergonomic Next Question Button */}
              <div className="flex flex-col items-center gap-1.5 pt-1">
                <button
                  id="next-question-btn"
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto min-w-[260px] py-4 px-6 rounded-2xl text-base font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white active:scale-98 transition flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
                >
                  <span>Exercice suivant</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-white/20 dark:bg-zinc-900/20 font-normal">
                    Espace ou Entrée ↵
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Score & Session Stats */}
        <ScoreBoard stats={stats} onReset={handleResetStats} />

        {/* Dedicated Mental Math Method Space (A ➔ ÷10 ➔ ÷4 = B ➔ +5% ➔ -1%) */}
        <MethodExplanationSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 px-4 py-3 bg-white/50 dark:bg-zinc-900/50 text-[11px] text-zinc-500 dark:text-zinc-400">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <span>
            Calcul mental Baht thaïlandais (THB) ➔ Euro (€) • Formule : A ➔ ÷10 ➔ ÷4 (B) ➔ +5% ➔ -1% • Taux de référence : 1 € = {OFFICIAL_EUR_TO_THB_RATE.toFixed(2)} ฿
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGitHubOpen(true)}
              className="hover:underline text-zinc-700 dark:text-zinc-300 font-medium"
            >
              Export & Déploiement GitHub
            </button>
            <span>•</span>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:underline text-zinc-700 dark:text-zinc-300 font-medium"
            >
              Comment ça marche ?
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MethodGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <RangeSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={rangeSettings}
        onSave={(newRange) => {
          setRangeSettings(newRange);
          // generate new question with new range
          setEvaluation(null);
          setManualInput('');
          setSelectedChoice(null);
          setCurrentQuestion(generateQuestion(newRange));
        }}
      />

      <GitHubDeployModal
        isOpen={isGitHubOpen}
        onClose={() => setIsGitHubOpen(false)}
      />
    </div>
  );
}
