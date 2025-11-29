# 🧠 Braina - Plateforme d'Apprentissage Intelligente

**Braina** est une application web moderne de génération de quiz et de révision interactive, construite avec Next.js 16, React 19 et TypeScript. Elle permet aux utilisateurs de transformer leurs documents en contenus éducatifs interactifs (quiz, flashcards) et de suivre leur progression.

![Next.js](https://img.shields.io/badge/Next.js-16.0.5-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat&logo=typescript)
![License](https://img.shields.io/badge/License-Open%20Source-green?style=flat)

---

## ✨ Fonctionnalités

### 🎯 Modes de Jeu Multi-Formats
- **Mode Quiz** : Questions à choix multiples et vrai/faux avec feedback instantané
- **Mode Flashcards** : Cartes mémoire interactives avec animation de retournement
- **Mode Multijoueur** : (À venir) Défis en temps réel entre utilisateurs

### 📚 Gestion de Quiz
- **Création dynamique** : Génération de quiz à partir de documents
- **Bibliothèque personnelle** : Dashboard avec tous vos quiz créés
- **Détails complets** : Vue détaillée avec questions, flashcards et résumés markdown
- **Partage facile** : Copie de lien en un clic
- **Suppression sécurisée** : Modal de confirmation avant suppression

### ⚙️ Configuration Flexible
- Choix du nombre de questions par session (5, 8, 10, 15, 20)
- Option de mélange aléatoire des questions
- Personnalisation du mode de jeu avant chaque session

### 📊 Suivi de Progression
- Score de maîtrise en temps réel
- Historique de performances
- Statistiques détaillées par quiz

### 🎨 Design Moderne
- Interface sombre élégante
- Animations fluides avec Framer Motion
- Responsive (Mobile, Tablette, Desktop)
- Modales interactives et réutilisables

---

## 🗂️ Structure des Routes

```
/                           # Page d'accueil avec présentation
/dashboard                  # Tableau de bord utilisateur
/generate-quiz              # Génération de quiz
/questions                  # Bibliothèque de questions
/quiz/[id]                  # Détails d'un quiz spécifique
/play/[mode]/[id]          # Interface de jeu (quiz, flashcards, multiplayer)
  ├─ ?questions=10         # Paramètre : nombre de questions
  └─ ?shuffle=true         # Paramètre : mélange activé
```

### Routes Dynamiques
- **`/quiz/[id]`** : Affiche les détails d'un quiz (questions, flashcards, notes, statistiques)
- **`/play/[mode]/[id]`** : Lance une session de jeu
  - `mode` : `quiz` | `flashcards` | `multiplayer`
  - `id` : Identifiant du quiz

---

## 🛠️ Stack Technique

### Core
- **Framework** : [Next.js 16](https://nextjs.org/) avec App Router
- **Langage** : [TypeScript 5](https://www.typescriptlang.org/)
- **UI Library** : [React 19](https://react.dev/)

### Styling & UI
- **CSS Framework** : [TailwindCSS 4](https://tailwindcss.com/)
- **Animations** : [Framer Motion 12](https://www.framer.com/motion/)
- **Icônes** : [Lucide React](https://lucide.dev/)

### State & Data
- **State Management** : [Zustand 5](https://zustand-demo.pmnd.rs/)
- **HTTP Client** : [Axios 1.13](https://axios-http.com/)
- **Markdown** : [React Markdown](https://github.com/remarkjs/react-markdown) + [Remark GFM](https://github.com/remarkjs/remark-gfm)

### Utilities
- **Class Utilities** : [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge), [class-variance-authority](https://cva.style/docs)

---

## 📦 Installation

### Prérequis
- **Node.js** : Version 20.x ou supérieure
- **npm** : Version 10.x ou supérieure (ou yarn/pnpm)

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/Frostie0/braina_hackhaton_2025.git
   cd braina_hackhaton_2025
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** (optionnel)
   ```bash
   cp .env.example .env.local
   ```
   Modifier `.env.local` selon vos besoins :
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

5. **Ouvrir l'application**
   Accédez à [http://localhost:3000](http://localhost:3000) dans votre navigateur

---

## 🚀 Scripts Disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement

# Production
npm run build        # Compile l'application pour la production
npm start            # Lance le serveur de production

# Code Quality
npm run lint         # Vérifie le code avec ESLint
```

---

## 🌐 Déploiement sur Vercel

### Déploiement Automatique (Recommandé)

1. **Push sur GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connecter à Vercel**
   - Visitez [vercel.com](https://vercel.com)
   - Importez votre repository GitHub
   - Vercel détectera automatiquement Next.js
   - Cliquez sur "Deploy"

3. **Configuration**
   - Variables d'environnement : Ajoutez `NEXT_PUBLIC_APP_URL` dans les settings Vercel
   - Domain : Configurez un domaine personnalisé si désiré

### Déploiement Manuel

```bash
# Installation de Vercel CLI
npm i -g vercel

# Déploiement
vercel

# Déploiement en production
vercel --prod
```

**URL de Production** : L'application sera accessible sur `https://votre-projet.vercel.app`

---

## 📁 Architecture du Projet

```
braina-frontend-2025/
├── app/                          # Application Next.js (App Router)
│   ├── (pages)/                  # Pages de l'application
│   │   ├── dashboard/            # Dashboard utilisateur
│   │   ├── flashcard/            # Écran Flashcards
│   │   ├── generate-quiz/        # Génération de quiz
│   │   ├── play/[mode]/[id]/     # Interface de jeu dynamique
│   │   ├── questions/            # Bibliothèque de questions
│   │   └── quiz/                 # Pages quiz
│   │       ├── [id]/             # Détails du quiz
│   │       ├── page.tsx          # Liste des quiz
│   │       └── QuizScreen.tsx    # Composant de jeu quiz
│   ├── layout.tsx                # Layout racine
│   └── page.tsx                  # Page d'accueil
├── components/                   # Composants réutilisables
│   ├── pages/                    # Composants de page (Client Components)
│   └── ui/                       # Composants UI
│       ├── ConfirmationModal.tsx # Modal de confirmation
│       ├── GamePreferencesModal.tsx # Configuration de jeu
│       ├── ModeSelectionModal.tsx   # Sélection du mode
│       ├── QuizFlatList.tsx      # Liste horizontale de quiz
│       └── QuizSlideCard.tsx     # Carte de quiz
├── lib/                          # Utilitaires et données
│   ├── colors.ts                 # Palette de couleurs
│   ├── data/                     # Données mockées
│   │   ├── quiz.ts               # Données des quiz
│   │   └── quiz-summary.ts       # Résumés markdown
│   └── store/                    # Stores Zustand
│       └── authStore.ts          # Store d'authentification
├── public/                       # Assets statiques
├── tailwind.config.ts            # Configuration Tailwind
├── tsconfig.json                 # Configuration TypeScript
└── package.json                  # Dépendances et scripts
```

---

## 🎨 Composants Principaux

### Modales
- **ConfirmationModal** : Confirmation d'actions (suppression, etc.) avec variantes (danger, info, warning)
- **ModeSelectionModal** : Sélection du mode de jeu (Quiz, Flashcards, Multijoueur)
- **GamePreferencesModal** : Configuration pré-jeu (nombre de questions, mélange)

### Écrans de Jeu
- **QuizScreen** : Interface de quiz avec questions à choix multiples
- **FlashcardScreen** : Interface de flashcards avec animation flip
- **PlayScreen** : Orchestrateur qui charge les données et redirige vers le bon composant

### Composants UI
- **QuizSlideCard** : Carte de quiz avec progression et statistiques
- **QuizFlatList** : Liste horizontale scrollable de quiz avec tri

---

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env.local` à la racine :

```env
# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API (à configurer ultérieurement)
# NEXT_PUBLIC_API_URL=https://api.example.com
```

### Tailwind CSS

La configuration Tailwind personnalisée se trouve dans `tailwind.config.ts` et inclut :
- Thème sombre par défaut
- Palette de couleurs personnalisée
- Animations personnalisées
- Support de Tailwind Typography pour le markdown

---

## 🤝 Contribution

Ce projet est **open source** ! Les contributions sont les bienvenues.

### Comment Contribuer

1. **Fork le projet**
2. **Créer une branche** (`git checkout -b feature/AmazingFeature`)
3. **Commit vos changements** (`git commit -m 'Add some AmazingFeature'`)
4. **Push sur la branche** (`git push origin feature/AmazingFeature`)
5. **Ouvrir une Pull Request**

### Guidelines
- Suivre les conventions de code TypeScript et React
- Ajouter des tests si nécessaire
- Mettre à jour la documentation

---

## 📝 License

Ce projet est **open source** et disponible sous licence MIT.

---

## 👥 Auteurs

- **Frostie0** - [GitHub](https://github.com/Frostie0)

---

## 🙏 Remerciements

- [Next.js Team](https://nextjs.org/) pour le framework
- [Vercel](https://vercel.com/) pour l'hébergement
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [Framer Motion](https://www.framer.com/motion/) pour les animations
- La communauté open source !

---

## 📞 Support

Pour toute question ou problème :
- **Issues** : [GitHub Issues](https://github.com/Frostie0/braina_hackhaton_2025/issues)
- **Discussions** : [GitHub Discussions](https://github.com/Frostie0/braina_hackhaton_2025/discussions)

---

**Fait avec ❤️ pour l'apprentissage interactif**
