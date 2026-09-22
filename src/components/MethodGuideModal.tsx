import React, { useState } from 'react';
import { X, BookOpen, Calculator, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { computeSteps } from '../utils/thaiMath';

interface MethodGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodGuideModal: React.FC<MethodGuideModalProps> = ({ isOpen, onClose }) => {
  const [testAmount, setTestAmount] = useState<number>(600);
  const steps = computeSteps(testAmount);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="method-guide-modal"
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                La Méthode Secrète : Baht en Euro
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                L’astuce mnémotechnique en 3 étapes de calcul mental
              </p>
            </div>
          </div>
          <button
            id="close-guide-modal-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick formula banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/60 dark:border-amber-800/40">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  La règle d’or : <span className="text-amber-700 dark:text-amber-400">A ➔ ÷ 10 ➔ ÷ 4 (Chiffre B) ➔ + 5% ➔ - 1%</span>
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                  On prend notre <strong>chiffre A</strong> de départ en Bahts, on le divise par 10 puis par 4 pour obtenir le <strong>chiffre B</strong> en Euros. On ajoute 5% du chiffre B, puis on retranche ~1% pour coller au centime près au cours réel officiel (1 € = 38,30 ฿).
                </p>
              </div>
            </div>
          </div>

          {/* Detailed 4 Steps */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  Étape 1 : Diviser par 10 le Chiffre A de départ
                </h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Le geste le plus facile : <strong>supprime un zéro</strong> à la fin du montant A en Bahts, ou décale la virgule d’un rang vers la gauche.
              </p>
              <div className="mt-2 text-xs font-mono bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                Exemple : A = 400 ฿ ➔ A ÷ 10 = 40
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  Étape 2 : Diviser par 4 ➔ On obtient le Chiffre B
                </h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Pour diviser par 4 facilement de tête, coupe le nombre en deux, puis recoupe la moitié en deux. Vous obtenez le <strong>chiffre B</strong> en euros.
              </p>
              <div className="mt-2 text-xs font-mono bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                Exemple : 40 ➔ moitié 20 ➔ moitié 10 € (Chiffre B)
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  Étape 3 : Ajouter 5% du Chiffre B
                </h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Pour ajouter 5% sans calculatrice : prends 10% du chiffre B (décale la virgule) et divise-le par deux. Ajoute ce bonus au chiffre B.
              </p>
              <div className="mt-2 text-xs font-mono bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                Exemple pour 10 € : 10% = 1,00 € ➔ la moitié = +0,50 € ➔ <strong>10,50 €</strong>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  Étape 4 : 1% du chiffre de départ A = des centimes que l'on enlève
                </h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Prenez 1 % du <strong>chiffre A de départ</strong> (en décalant la virgule de 2 rangs) : ce chiffre représente directement le nombre de <strong>centimes à enlever</strong>. Valable avec une précision chirurgicale sur toute la plage de 0 à 100 €.
              </p>
              <div className="mt-2 text-xs font-mono bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                Exemple : A = 400 ฿ ➔ 1% = 4 ➔ on enlève 4 centimes (-0,04 €) ➔ 10,50 € - 0,04 € = <strong>10,46 €</strong> (cours réel : 10,44 € !)
              </div>
            </div>
          </div>

          {/* Interactive simulator demo */}
          <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-700/50 bg-amber-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Démonstrateur interactif
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Teste n’importe quel montant :
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="interactive-demo-input"
                type="number"
                min="10"
                step="10"
                value={testAmount}
                onChange={(e) => setTestAmount(Math.max(1, Number(e.target.value) || 0))}
                className="w-36 px-3 py-1.5 text-sm font-semibold rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              />
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">฿ Bahts</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-400 block text-[10px]">1. A ÷ 10</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  {steps.step1Divide10}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-400 block text-[10px]">2. Chiffre B (÷ 4)</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  {steps.chiffreB.toFixed(2)} €
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                <span className="text-emerald-700 dark:text-emerald-400 block text-[10px]">
                  3. + 5% (+{steps.fivePercent.toFixed(2)} €)
                </span>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                  {steps.step3FinalEuro.toFixed(2)} €
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
                <span className="text-amber-700 dark:text-amber-400 block text-[10px]">
                  4. - 1% de A ({steps.onePercentCentimes} cts)
                </span>
                <span className="font-bold text-amber-800 dark:text-amber-300 text-sm">
                  {steps.ultraPreciseEuro.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            id="close-guide-footer-btn"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition"
          >
            J'ai compris, m'entraîner !
          </button>
        </div>
      </div>
    </div>
  );
};
