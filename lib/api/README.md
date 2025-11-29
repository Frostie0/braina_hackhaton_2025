# Configuration API

Cette documentation explique comment configurer les appels API dans l'application Braina.

## 📁 Structure des fichiers

```
lib/api/
├── axios.config.ts      # Configuration Axios avec intercepteurs
├── endpoints.ts         # Endpoints API centralisés
├── types.ts            # Types TypeScript pour les API
└── services/
    ├── index.ts        # Export centralisé des services
    ├── auth.service.ts # Service d'authentification
    └── quiz.service.ts # Service Quiz
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec :

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=Braina
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### Installation d'Axios

Si Axios n'est pas encore installé :

```bash
npm install axios
```

## 🚀 Utilisation

### Exemple d'authentification

```typescript
import { authService } from '@/lib/api/services';

// Login
const handleLogin = async () => {
  try {
    const tokens = await authService.login({
      email: 'user@example.com',
      password: 'password123'
    });
    console.log('Connecté :', tokens);
  } catch (error) {
    console.error('Erreur de connexion:', error);
  }
};
```

### Exemple Quiz

```typescript
import { quizService } from '@/lib/api/services';

// Récupérer les quiz
const fetchQuizzes = async () => {
  try {
    const quizzes = await quizService.getMyQuizzes();
    console.log('Mes quiz:', quizzes);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

## 🔐 Authentification

Le système gère automatiquement :
- ✅ Ajout du token Bearer dans les headers
- ✅ Rafraîchissement automatique du token
- ✅ Redirection vers /login si non authentifié
- ✅ Stockage sécurisé dans localStorage

## 📝 Ajouter un nouveau service

1. Créer un fichier dans `lib/api/services/`
2. Importer les types et endpoints nécessaires
3. Exporter le service dans `services/index.ts`

Exemple :

```typescript
// lib/api/services/flashcard.service.ts
import axiosInstance from '../axios.config';
import { API_ENDPOINTS } from '../endpoints';
import type { Flashcard, ApiResponse } from '../types';

export const flashcardService = {
  async getFlashcards(): Promise<Flashcard[]> {
    const response = await axiosInstance.get<ApiResponse<Flashcard[]>>(
      API_ENDPOINTS.FLASHCARDS.LIST
    );
    return response.data.data;
  },
};
```

## 🛠️ Endpoints disponibles

Tous les endpoints sont définis dans `lib/api/endpoints.ts` :

- **AUTH** : Login, Register, Logout, etc.
- **USERS** : Gestion des utilisateurs
- **QUIZ** : CRUD Quiz
- **FLASHCARDS** : CRUD Flashcards
- **GENERATE** : Génération de contenu AI
- **UPLOADS** : Gestion des fichiers
- **LEADERBOARDS** : Classements
- **NOTIFICATIONS** : Notifications
- **STATS** : Statistiques
- **FOLDERS** : Dossiers
- **SETTINGS** : Paramètres

## 🔍 Logs de développement

En mode développement, les requêtes et réponses sont automatiquement loguées dans la console :

```
📤 API Request: POST /auth/login
📥 API Response: /auth/login 200
```

## ⚠️ Gestion des erreurs

Les erreurs sont automatiquement gérées par les intercepteurs Axios. Utilisez try/catch pour gérer les erreurs spécifiques :

```typescript
try {
  await quizService.createQuiz(quizData);
} catch (error) {
  if (error.response?.status === 422) {
    // Erreur de validation
    console.log(error.response.data.errors);
  }
}
```
