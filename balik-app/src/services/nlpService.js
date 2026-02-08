
import { pipeline, env } from '@xenova/transformers';

// FORCE remote model loading to fix "unexpected token <" (HTML 404) error
env.allowLocalModels = false;
env.useBrowserCache = true; // Enabled for fast subsequent loads

/**
 * Singleton class for handling NLP operations using Transformers.js
 * Uses 'Xenova/all-MiniLM-L6-v2' which produces 384-dimensional vectors.
 */
class NLPService {
    static instance = null;
    static modelName = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';

    constructor() {
        this.extractor = null;
        this.initializationPromise = null;
    }

    static getInstance() {
        if (!NLPService.instance) {
            NLPService.instance = new NLPService();
        }
        return NLPService.instance;
    }

    async init() {
        if (this.extractor) return;

        if (this.initializationPromise) {
            await this.initializationPromise;
            return;
        }

        this.initializationPromise = (async () => {
            console.log('NLPService: Loading model...');
            try {
                this.extractor = await pipeline('feature-extraction', NLPService.modelName);
                console.log('NLPService: Model loaded successfully');
            } catch (error) {
                console.error('NLPService: Failed to load model', error);
                throw error;
            }
        })();

        await this.initializationPromise;
    }

    /**
     * Generates a 384-dimensional embedding vector for the given text.
     * @param {string} text - The input text (e.g., item title + description)
     * @returns {Promise<number[]>} - array of numbers
     */
    async generateEmbedding(text) {
        await this.init();

        if (!text || typeof text !== 'string') return null;

        // Clean text
        const cleanText = text.trim().replace(/\s+/g, ' ');
        if (!cleanText) return null;

        try {
            // Generate embedding
            // pooling='mean' and normalize=true are standard for semantic similarity
            const output = await this.extractor(cleanText, { pooling: 'mean', normalize: true });

            // Convert Tensor to standard array
            return Array.from(output.data);
        } catch (error) {
            console.error('NLPService: Error generating embedding', error);
            return null;
        }
    }

    /**
     * Compute cosine similarity locally (helper for client-side matching if needed)
     */
    cosineSimilarity(vecA, vecB) {
        if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        if (normA === 0 || normB === 0) return 0;

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}

export const nlpService = NLPService.getInstance();
