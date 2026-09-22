import React, { useState } from 'react';
import { Lightbulb, Calculator, ArrowRight, Sparkles, Check, ChevronDown, ChevronUp, BookOpen, Landmark } from 'lucide-react';
import { computeSteps } from '../utils/thaiMath';

export const MethodExplanationSection: React.FC = () => {
  const [demoAmount, setDemoAmount] = useState<number>(400);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const steps = computeSteps(demoAmount);
  const diffCentimes = Math.round(Math.abs(steps.differenceWithReal) * 100);

  const quickExamples = [100, 250, 400, 800, 1200, 3000];

  return (
    <section 
      id="method-explanation-section"
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-sm transition-all"
    >
      {/* Section Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Espace Méthode : La Formule Mentale pas à pas
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-mono">
                A ➔ ÷10 ➔ ÷4 = B ➔ +5% ➔ -1%
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Comment convertir n'importe quel montant thaïlandais en euros de tête avec précision chirurgicale.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition shrink-0"
          title={isExpanded ? 'Réduire' : 'Déplier'}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="pt-5 space-y-6 animate-in fade-in duration-200">
          {/* Main Visual Steps of the Method */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Step 1: Chiffre A et ÷ 10 */}
            <div className="p-4 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-600 text-white font-mono">
                    Étape 1
                  </span>
                  <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
                    A ÷ 10
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  Chiffre A de départ
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  On prend notre <strong>chiffre A</strong> en Bahts et on le <strong>divise par 10</strong> en supprimant le zéro final (ou décalage de la virgule).
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-blue-200/60 dark:border-blue-900/40 text-[11px] font-mono text-blue-900 dark:text-blue-200 font-semibold">
                Ex: 400 ฿ ➔ 40
              </div>
            </div>

            {/* Step 2: ÷ 4 donne le Chiffre B */}
            <div className="p-4 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-600 text-white font-mono">
                    Étape 2
                  </span>
                  <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                    (A÷10) ÷ 4
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  Obtenir le Chiffre B
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  On <strong>divise par 4</strong> pour obtenir notre <strong>chiffre B</strong> en euros (base de 1 € = 40 ฿). De tête : couper en deux, puis recouper en deux.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-indigo-200/60 dark:border-indigo-900/40 text-[11px] font-mono text-indigo-900 dark:text-indigo-200 font-semibold">
                Ex: 40 ➔ moitié 20 ➔ 10 € (B)
              </div>
            </div>

            {/* Step 3: + 5% de B */}
            <div className="p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-600 text-white font-mono">
                    Étape 3
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    B + 5%
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  Ajouter 5% de B
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  On prend <strong>5 % du chiffre B</strong> qu'on ajoute. Astuce mentale : prendre 10% de B et le diviser par 2.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 text-[11px] font-mono text-emerald-900 dark:text-emerald-200 font-semibold">
                Ex: 10 € + 0,50 € = 10,50 €
              </div>
            </div>

            {/* Step 4: 1% du chiffre de départ A en centimes */}
            <div className="p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-600 text-white font-mono">
                    Étape 4
                  </span>
                  <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                    - 1% de A (centimes)
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  1% de A = des centimes à retirer
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  On prend <strong>1 % du chiffre A de départ</strong> (on décale la virgule de 2 rangs) : ce chiffre représente directement les <strong>centimes que l’on enlève</strong> pour la plage de 0 à 100 €.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-[11px] font-mono text-amber-900 dark:text-amber-200 font-semibold">
                Ex: 1% de 400 = 4 ➔ - 4 cts (-0,04 €) ➔ 10,46 €
              </div>
            </div>
          </div>

          {/* Interactive Calculator / Simulator Demo */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                  Simulateur interactif pas à pas
                </h3>
              </div>
              <span className="text-[11px] text-zinc-500">
                Entrez un chiffre A de départ pour voir la décomposition en direct :
              </span>
            </div>

            {/* Input & Quick pills */}
            <div className="flex items-center flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="method-input-a" className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Chiffre A :
                </label>
                <div className="relative">
                  <input
                    id="method-input-a"
                    type="number"
                    min="10"
                    step="10"
                    value={demoAmount}
                    onChange={(e) => setDemoAmount(Math.max(1, Number(e.target.value) || 0))}
                    className="w-32 px-3 py-1.5 text-base font-black font-mono rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-center"
                  />
                  <span className="absolute right-2 top-2 text-xs font-bold text-amber-600 dark:text-amber-400 pointer-events-none">
                    ฿
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-zinc-400">Exemples rapides :</span>
                {quickExamples.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setDemoAmount(val)}
                    className={`px-2 py-0.5 text-xs font-mono font-medium rounded-lg transition ${
                      demoAmount === val
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                        : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {val} ฿
                  </button>
                ))}
              </div>
            </div>

            {/* Step-by-Step Live Result Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block mb-0.5">1. A ÷ 10</span>
                <span className="font-bold text-sm font-mono text-blue-600 dark:text-blue-400">
                  {steps.step1Divide10}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">supprime le 0</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block mb-0.5">2. Chiffre B (÷ 4)</span>
                <span className="font-bold text-sm font-mono text-indigo-600 dark:text-indigo-400">
                  {steps.chiffreB.toFixed(2)} €
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">moitié ÷ 2</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block mb-0.5">3. B + 5%</span>
                <span className="font-bold text-sm font-mono text-emerald-600 dark:text-emerald-400">
                  {steps.step3FinalEuro.toFixed(2)} €
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">+{steps.plusFivePercent.toFixed(2)} €</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block mb-0.5">4. - 1% de A ({steps.onePercentCentimes} cts)</span>
                <span className="font-bold text-sm font-mono text-amber-600 dark:text-amber-400">
                  {steps.ultraPreciseEuro.toFixed(2)} €
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">-{steps.onePercentCentimes} cts (-{steps.minusOnePercent.toFixed(2)} €)</span>
              </div>
            </div>

            {/* Real Comparison Banner */}
            <div className="p-3.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">Taux officiel en dur (1 € = {steps.officialRate.toFixed(2)} ฿) : </span>
                  <strong className="text-zinc-900 dark:text-zinc-100 font-mono text-sm ml-1">
                    {steps.realEuroAmount.toFixed(2)} €
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-zinc-500">Écart avec la méthode :</span>
                <span className="font-bold font-mono px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {diffCentimes} centimes seulement !
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
