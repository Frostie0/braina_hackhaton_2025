import { create } from 'zustand';

// Types pour les options du quiz
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Format = 'all' | 'multiple_choice' | 'true_false';
export type MaxQuestions = 'auto' | '10' | '15' | '20';
export type Language = string; // Simplement une chaîne pour la langue

interface QuizState {
  difficulty: Difficulty;
  format: Format;
  maxQuestions: MaxQuestions;
  language: Language;
  files: File[];
  error: string | null;
  isLoading: boolean;
}

interface QuizActions {
  setDifficulty: (diff: Difficulty) => void;
  setFormat: (format: Format) => void;
  setMaxQuestions: (max: MaxQuestions) => void;
  setLanguage: (lang: Language) => void;
  addFile: (file: File) => void;
  removeFile: (fileName: string) => void;
  validateAndGenerate: () => Promise<void>;
  setIsLoading: (loading: boolean) => void;
}

// Limite maximale de fichiers
const MAX_FILES = 8;

export const useQuizStore = create<QuizState & QuizActions>((set, get) => ({
  // Initial State
  difficulty: 'easy',
  format: 'multiple_choice',
  maxQuestions: 'auto',
  language: 'Français',
  files: [],
  error: null,
  isLoading: false,

  // Actions
  setDifficulty: (difficulty) => set({ difficulty }),
  setFormat: (format) => set({ format }),
  setMaxQuestions: (maxQuestions) => set({ maxQuestions }),
  setLanguage: (language) => set({ language }),
  setIsLoading: (isLoading) => set({ isLoading }),

  addFile: (file) => {
    const currentFiles = get().files;
    // Bloquer l'ajout si limite atteinte, mais ne pas afficher d'erreur
    if (currentFiles.length >= MAX_FILES) {
      return;
    }
    set((state) => ({
      files: [...state.files, file]
    }));
  },

  removeFile: (fileName) => {
    set((state) => ({
      files: state.files.filter(f => f.name !== fileName)
    }));
  },

  validateAndGenerate: async () => {
    const { files, language, difficulty, format, maxQuestions, setIsLoading } = get();

    // Réinitialisation de l'état d'erreur
    set({ error: null });

    // 1. Validation de la source (fichiers)
    if (files.length === 0) {
      set({ error: "Veuillez téléverser au moins un fichier pour générer le quiz." });
      return;
    }

    // 2. Vérification de la limite de fichiers (ne devrait pas arriver, mais par sécurité)
    if (files.length > MAX_FILES) {
      set({ error: `Vous ne pouvez téléverser que ${MAX_FILES} fichiers maximum.` });
      return;
    }

    // 3. Validation de la Langue
    if (!language || language === 'Sélectionner une langue') {
      set({ error: "Veuillez sélectionner une langue pour le quiz." });
      return;
    }

    // Si tout est valide, lancer la génération
    setIsLoading(true);
    console.log("Démarrage de la génération du Quiz avec les paramètres:", {
      difficulty, format, maxQuestions, language, fileCount: files.length
    });

    try {
      // Simulation d'un appel API de 3 secondes
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log("Quiz généré avec succès !");
      // Optionnel: Réinitialiser le formulaire ou rediriger
    } catch (err) {
      set({ error: "Erreur lors de la génération du quiz. Veuillez réessayer." });
    } finally {
      setIsLoading(false);
    }
  },
}));
