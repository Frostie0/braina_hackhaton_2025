/**
 * Index de tous les services API
 * Permet d'importer facilement tous les services depuis un seul endroit
 */

export { authService } from './auth.service';
export { quizService } from './quiz.service';

// Export d'un objet contenant tous les services
export const apiServices = {
  auth: authService,
  quiz: quizService,
};

export default apiServices;
