import React from 'react';
import { MethodSteps } from '../types';
import { Landmark, Sparkles, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';

interface StepExplainerProps {
  steps: MethodSteps;
  userAnswer?: number;
}

export const StepExplainer: React.FC<StepExplainerProps> = ({ steps, userAnswer }) => {
  const diffCentimes = Math.round(Math.abs(steps.differenceWithReal) * 100);

  return (
    <div className="w-full space-y-3.5">
      {/* 4 Step Breakdown (A ➔ ÷10 ➔ ÷4 = B ➔ +5% ➔ -1%) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Étapes de la méthode (A ➔ ÷10 ➔ ÷4 = B ➔ +5% ➔ -1%)
          </span>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
            A = {steps.rawBaht.toLocaleString('fr-FR')} ฿
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* Step 1 */}
          <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  1
                </span>
                A ÷ 10
              </span>
            </div>
            <div className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {steps.rawBaht} ➔ <span className="text-blue-600 dark:text-blue-400">{steps.step1Divide10}</span>
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              (On retire le 0)
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                  2
                </span>
                Chiffre B (÷ 4)
              </span>
            </div>
            <div className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {steps.step1Divide10} ÷ 4 = <span className="text-indigo-600 dark:text-indigo-400">{steps.chiffreB.toFixed(2)} €</span>
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              (Moitié ÷ 2)
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  3
                </span>
                + 5% de B
              </span>
            </div>
            <div className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
              +{steps.fivePercent.toFixed(2)} € ➔ <span className="underline font-black">{steps.step3FinalEuro.toFixed(2)} €</span>
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              (+ 10% ÷ 2)
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">
                  4
                </span>
                - 1% de A ({steps.onePercentCentimes} cts)
              </span>
            </div>
            <div className="font-mono text-sm font-bold text-amber-700 dark:text-amber-400">
              -{steps.onePercentCentimes} cts ➔ <span className="font-black">{steps.ultraPreciseEuro.toFixed(2)} €</span>
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              (1% de A = centimes retirés)
            </div>
          </div>
        </div>
      </div>

      {/* Official Real Rate Comparison (Demandé par l'utilisateur) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-300/70 dark:border-amber-700/50">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Comparaison avec le taux réel officiel du jour
            </span>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 border border-amber-300/80 dark:border-amber-700/60 text-zinc-700 dark:text-zinc-300">
            1 € = {steps.officialRate.toFixed(2)} ฿
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800">
            <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">Méthode mentale</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono text-sm">
              {steps.ultraPreciseEuro.toFixed(2)} €
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800">
            <span className="text-amber-700 dark:text-amber-400 block text-[10px] font-semibold">Montant réel officiel</span>
            <span className="font-bold text-amber-700 dark:text-amber-400 font-mono text-sm">
              {steps.realEuroAmount.toFixed(2)} €
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
            <span className="text-emerald-700 dark:text-emerald-400 block text-[10px] font-semibold">Écart réel</span>
            <span className="font-bold text-emerald-800 dark:text-emerald-300 font-mono text-sm">
              {diffCentimes === 0 ? '0 centime !' : `${Math.abs(steps.differenceWithReal).toFixed(2)} € (${diffCentimes} cts)`}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
          {diffCentimes <= 10
            ? `💡 L'écart est de seulement ${diffCentimes} centimes ! Pour un voyage en Thaïlande, la méthode mentale est redoutablement précise et immédiate.`
            : `💡 Écart de ${diffCentimes} centimes : parfait pour estimer vos dépenses en quelques secondes sans sortir votre calculatrice.`}
        </p>
      </div>
    </div>
  );
};
