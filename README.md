# Calcul Mental : Convertisseur Baht Thaïlandais en Euro 🇹🇭 ➔ 💶

Application d'entraînement au calcul mental pour convertir les **Bahts thaïlandais (THB)** en **Euros (€)** rapidement sans calculatrice, pensée pour les voyageurs en Thaïlande.

## La Méthode de Calcul Mental

L'astuce repose sur 3 étapes simples à réaliser de tête :
1. **Diviser par 10** : on retire le dernier zéro ou on décale la virgule d'un cran. *(Ex: 400 ฿ ➔ 40)*
2. **Diviser par 4** : faire la moitié de la moitié. *(Ex: 40 ➔ moitié 20 ➔ moitié 10 €)*
3. **Ajouter 5%** : prendre 10% (décaler la virgule) et prendre sa moitié, puis l'additionner. *(Ex: 10 € ➔ 10% = 1 € ➔ moitié = +0,50 € ➔ **10,50 €**)*

> **Pourquoi ça marche ?**
> Diviser par 10 puis par 4 équivaut à diviser par 40 (taux repère 1 € = 40 THB). Rajouter 5% ajuste le résultat au taux réel du marché (environ 1 € ≈ 38.10 THB).

---

## Fonctionnalités

- 🎯 **Génération successive d'exercices** avec des montants réalistes de la vie quotidienne en Thaïlande (street food, taxi, massages, hôtels, etc.).
- ⚙️ **Plage de référence configurable** : paramétrez la plage en Euros (par exemple 0 à 100 € maximum comme demandé) et le système génère les montants correspondants en Bahts thaïlandais (~40 ฿ à 3 800 ฿).
- ✍️ **Deux modes de réponse** :
  - **Saisie libre** : tapez votre estimation avec tolérance réaliste (Parfait, Très proche, Bonne approximation).
  - **3 Propositions (QCM)** : choisissez parmi 3 options dont 1 exacte et 2 pièges fréquents.
- 💡 **Décomposition pédagogique pas à pas** : visualisez les 3 étapes calculées en direct.
- 📱 **Pavé numérique tactile intégré** : optimisé pour une utilisation rapide à une main sur smartphone.
- 📊 **Statistiques de session** : calcul de la série (streak), taux de précision et nombre d'exercices.
- 🚀 **Déploiement GitHub automatique** : prêt pour **GitHub Pages** avec GitHub Actions inclus (`.github/workflows/deploy.yml`) et chemins relatifs préconfigurés (`base: './'`).

---

## Lancement local

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Compiler pour la production
npm run build
```

## Déploiement direct sur GitHub

```bash
git init
git add .
git commit -m "Initial commit - Convertisseur Baht en Euro"
git branch -M main
git remote add origin https://github.com/<VOTRE-PSEUDO>/<NOM-DU-REPO>.git
git push -u origin main
```

Ensuite sur GitHub :
1. Rendez-vous dans **Settings** ➔ **Pages**.
2. Dans **Source**, sélectionnez **GitHub Actions**.
3. Le site sera automatiquement compilé et déployé à l'adresse fournie par GitHub !
