import React from 'react';
import { Flame, Target, Award, RotateCcw } from 'lucide-react';
import { UserStats } from '../types';

interface ScoreBoardProps {
  stats: UserStats;
  onReset: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ stats, onReset }) => {
  const successCount = stats.exactCount + stats.closeCount;
  const accuracyRate =
    stats.totalAttempts > 0
      ? Math.round((successCount / stats.totalAttempts) * 100)
      : 100;

  return (
    <div className="flex items-center justify-between gap-3 p-3 px-4 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-xs">
      {/* Streak */}
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${stats.streak > 0 ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400'}`}>
          <Flame className="w-4 h-4" />
        </div>
        <div>
          <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">Série en cours</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
            {stats.streak} <span className="text-[10px] text-zinc-400 font-normal">(record {stats.bestStreak})</span>
          </span>
        </div>
      </div>

      {/* Accuracy */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">Précision</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
            {stats.totalAttempts > 0 ? `${accuracyRate}%` : '—'}
          </span>
        </div>
      </div>

      {/* Completed Count */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Award className="w-4 h-4" />
        </div>
        <div>
          <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">Exercices</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
            {stats.totalAttempts}
          </span>
        </div>
      </div>

      {/* Reset button if attempts > 0 */}
      {stats.totalAttempts > 0 && (
        <button
          type="button"
          onClick={onReset}
          title="Réinitialiser les compteurs de session"
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
