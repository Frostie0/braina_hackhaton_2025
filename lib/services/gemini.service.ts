import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Service pour interagir avec l'API Gemini
 * Utilisé pour extraire du texte des images
 */

// Initialisation du client Gemini
const getGeminiClient = () => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not defined in environment variables');
    }

    return new GoogleGenerativeAI(apiKey);
};

/**
 * Convertit un fichier image en base64
 */
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Retirer le préfixe "data:image/...;base64,"
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Extrait le texte d'une image en utilisant Gemini Vision
 */
export const extractTextFromImage = async (file: File): Promise<string> => {
    try {
        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // Convertir l'image en base64
        const base64Image = await fileToBase64(file);

        // Préparer le prompt pour l'extraction de texte
        const prompt = `Extract ALL text content from this image. 
        If the image contains handwritten text, typed text, or any form of written content, extract it completely and accurately.
        If there are multiple sections, preserve their structure.
        If the image contains no text, respond with "NO_TEXT_FOUND".
        Return ONLY the extracted text without any additional commentary.`;

        // Générer le contenu avec l'image
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: file.type,
                    data: base64Image,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text().trim();

        // Si aucun texte trouvé, retourner une chaîne vide
        if (text === 'NO_TEXT_FOUND' || text === '') {
            console.warn(`No text found in image: ${file.name}`);
            return '';
        }

        return text;
    } catch (error: any) {
        console.error(`Error extracting text from ${file.name}:`, error);
        throw new Error(`Failed to extract text from ${file.name}: ${error.message}`);
    }
};

/**
 * Extrait le texte de plusieurs images en parallèle
 * Affiche la progression via un callback
 */
export const extractTextFromMultipleImages = async (
    files: File[],
    onProgress?: (current: number, total: number) => void
): Promise<Array<{ id: string; txt: string }>> => {
    const results: Array<{ id: string; txt: string }> = [];

    // Traiter chaque image séquentiellement pour mieux gérer la progression
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
            const text = await extractTextFromImage(file);

            // Ajouter le résultat uniquement si du texte a été trouvé
            if (text) {
                results.push({
                    id: `${file.name}-${Date.now()}-${i}`,
                    txt: text,
                });
            }

            // Notifier la progression
            if (onProgress) {
                onProgress(i + 1, files.length);
            }
        } catch (error) {
            console.error(`Skipping ${file.name} due to error:`, error);
            // Continuer avec les autres fichiers même en cas d'erreur
        }
    }

    if (results.length === 0) {
        throw new Error('No text could be extracted from any of the uploaded images');
    }

    return results;
};

/**
 * Vérifie si le fichier est une image valide
 */
export const isValidImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    return validTypes.includes(file.type);
};

/**
 * Filtre uniquement les images valides d'une liste de fichiers
 */
export const filterValidImages = (files: File[]): File[] => {
    return files.filter(isValidImageFile);
};
