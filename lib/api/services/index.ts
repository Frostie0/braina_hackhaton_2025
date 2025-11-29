/**
 * Index de tous les services API
 * Permet d'importer facilement tous les services depuis un seul endroit
 */

import authService from './auth.service';
import quizService from './quiz.service';

// Re-export pour utilisation directe
export { authService, quizService };

// Export d'un objet contenant tous les services
export const apiServices = {
  auth: authService,
  quiz: quizService,
};

export default apiServices;
