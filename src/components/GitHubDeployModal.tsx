import React, { useState } from 'react';
import { X, Github, Copy, Check, ExternalLink, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const gitCommands = [
    'git init',
    'git add .',
    'git commit -m "Initial commit - Convertisseur Baht en Euro"',
    'git branch -M main',
    'git remote add origin https://github.com/VOTRE-PSEUDO/calcul-baht-euro.git',
    'git push -u origin main',
  ].join('\n');

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="github-deploy-modal"
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Déploiement GitHub Automatique
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                100% autonome, zéro serveur, prêt pour GitHub Pages
              </p>
            </div>
          </div>
          <button
            id="close-github-modal-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Status summary */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300">
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Prêt pour GitHub sans aucune complication
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-300">
              Le fichier de déploiement automatique <code>.github/workflows/deploy.yml</code> et le chemin relatif <code>base: './'</code> sont déjà préconfigurés. Dès que vous poussez le code sur GitHub, l'application est en ligne gratuitement !
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px]">
              Procédure en 2 étapes :
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  1. Pousser sur votre dépôt GitHub
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(gitCommands, 1)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedIndex === 1 ? 'Copié !' : 'Copier les commandes'}
                </button>
              </div>

              <pre className="p-3 rounded-lg bg-zinc-950 text-zinc-200 font-mono text-[11px] overflow-x-auto leading-relaxed">
                {gitCommands}
              </pre>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                2. Activer GitHub Pages (1 seul clic)
              </span>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-[11px]">
                Sur votre dépôt GitHub :
                <br />➔ Allez dans <strong>Settings</strong> ➔ <strong>Pages</strong>.
                <br />➔ Sous <em>Source</em>, sélectionnez <strong>GitHub Actions</strong>.
                <br />➔ C'est terminé ! Votre site est déployé automatiquement à chaque modification.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            id="close-github-modal-footer-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
