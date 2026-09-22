import React, { useState } from 'react';
import { X, Sliders, Check, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { RangeSettings } from '../types';
import { euroToBaht } from '../utils/thaiMath';

interface RangeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: RangeSettings;
  onSave: (newSettings: RangeSettings) => void;
}

const PRESETS = [
  {
    title: 'Petites dépenses & Street food',
    desc: 'Brochettes, 7-Eleven, cafés, tuk-tuks',
    minEuro: 1,
    maxEuro: 20,
    emoji: '🍡',
  },
  {
    title: 'Repas & Marchés de nuit',
    desc: 'Restaurants, massages 1h, courses taxi',
    minEuro: 1,
    maxEuro: 50,
    emoji: '🍜',
  },
  {
    title: 'Plage standard (Recommandée)',
    desc: 'Votre configuration de référence 0 - 100 €',
    minEuro: 1,
    maxEuro: 100,
    emoji: '⭐',
  },
  {
    title: 'Activités & Excursions',
    desc: 'Journées bateau, shopping, guesthouses',
    minEuro: 5,
    maxEuro: 250,
    emoji: '🏝️',
  },
  {
    title: 'Grands montants & Hôtels',
    desc: 'Hôtels 4*, vols internes, gros achats',
    minEuro: 10,
    maxEuro: 500,
    emoji: '🏨',
  },
];

export const RangeSettingsModal: React.FC<RangeSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [minEuro, setMinEuro] = useState<number>(settings.minEuro);
  const [maxEuro, setMaxEuro] = useState<number>(settings.maxEuro);
  const [roundOnly, setRoundOnly] = useState<boolean>(settings.roundNumbersOnly);

  if (!isOpen) return null;

  const calculatedMinBaht = euroToBaht(Math.max(1, minEuro));
  const calculatedMaxBaht = euroToBaht(Math.max(minEuro + 1, maxEuro));

  const handlePresetSelect = (presetMin: number, presetMax: number) => {
    setMinEuro(presetMin);
    setMaxEuro(presetMax);
  };

  const handleSave = () => {
    const validMin = Math.max(1, Math.min(minEuro, maxEuro - 1));
    const validMax = Math.max(validMin + 1, maxEuro);
    const minBaht = euroToBaht(validMin);
    const maxBaht = euroToBaht(validMax);

    onSave({
      minEuro: validMin,
      maxEuro: validMax,
      minBaht,
      maxBaht,
      roundNumbersOnly: roundOnly,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="range-settings-modal"
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Plage de Référence des Exercices
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Définissez la fourchette en Euros, convertie en Bahts thaïlandais
              </p>
            </div>
          </div>
          <button
            id="close-range-modal-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Equivalent Live Banner */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400 block mb-1">
              Équivalence active générée pour les questions :
            </span>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Plage en Euros (€) :</span>
                <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {minEuro} € ➔ {maxEuro} €
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400 hidden sm:block" />
              <div>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Plage réelle en Bahts (฿) :</span>
                <p className="text-base font-bold text-blue-700 dark:text-blue-300">
                  {calculatedMinBaht.toLocaleString('fr-FR')} ฿ ➔ {calculatedMaxBaht.toLocaleString('fr-FR')} ฿
                </p>
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-3">
              Choix rapide de la fourchette
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESETS.map((preset, index) => {
                const isSelected = minEuro === preset.minEuro && maxEuro === preset.maxEuro;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handlePresetSelect(preset.minEuro, preset.maxEuro)}
                    className={`p-3 rounded-xl text-left border transition flex items-start gap-3 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{preset.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs truncate">{preset.title}</span>
                        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 ml-1">
                          max {preset.maxEuro} €
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                        {preset.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Min / Max Euros inputs */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/20 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block">
              Personnaliser précisément la plage (€)
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
                  Minimum (€)
                </label>
                <div className="relative">
                  <input
                    id="min-euro-input"
                    type="number"
                    min="1"
                    max={maxEuro - 1}
                    value={minEuro}
                    onChange={(e) => setMinEuro(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-sm font-semibold rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-zinc-400">€</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
                  Maximum (€)
                </label>
                <div className="relative">
                  <input
                    id="max-euro-input"
                    type="number"
                    min={minEuro + 1}
                    max="2000"
                    value={maxEuro}
                    onChange={(e) => setMaxEuro(Math.max(minEuro + 1, Number(e.target.value) || 10))}
                    className="w-full px-3 py-2 text-sm font-semibold rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-zinc-400">€</span>
                </div>
              </div>
            </div>

            {/* Slider for quick visual control */}
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>1 €</span>
                <span>Plafond : {maxEuro} €</span>
                <span>500 €+</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={maxEuro}
                onChange={(e) => setMaxEuro(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Round numbers toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Favoriser les nombres ronds en Bahts
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Génère des montants comme 60, 120, 200, 400, 1 000 ฿ pour un calcul mental réaliste
              </p>
            </div>
            <input
              id="round-numbers-toggle"
              type="checkbox"
              checked={roundOnly}
              onChange={(e) => setRoundOnly(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
          >
            Annuler
          </button>
          <button
            id="save-range-btn"
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-4 h-4" />
            Appliquer cette plage
          </button>
        </div>
      </div>
    </div>
  );
};
