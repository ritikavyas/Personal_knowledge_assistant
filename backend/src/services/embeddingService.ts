import { GoogleGenAI } from '@google/genai';
import { getGeminiKey, useMockEmbeddings } from '../config/env';

let geminiClient: GoogleGenAI | null = null;

const getGeminiClient = (): GoogleGenAI => {
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: getGeminiKey(),
    });
  }
  return geminiClient;
};

export class EmbeddingService {
  private static readonly EMBEDDING_MODEL = 'text-embedding-004';

  /**
   * Generate embedding for a single text using Gemini
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    try {
      // If running in mock mode, return deterministic pseudo-embeddings for local testing
      if (useMockEmbeddings()) {
        const seed = text.length;
        // Create a small fixed-size embedding
        const len = 16;
        const emb: number[] = Array.from({ length: len }, (_, i) => ((seed + i * 13) % 100) / 100);
        return emb;
      }
      const result = await getGeminiClient().models.embedContent({
        model: this.EMBEDDING_MODEL,
        contents: text,
      });

      if (!result.embeddings || !result.embeddings[0]?.values) {
        throw new Error('Invalid embedding response from Gemini API');
      }

      return result.embeddings[0].values;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  /**
   * Generate embeddings for multiple texts using Gemini
   * Processes in parallel batches for better performance
   */
  static async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const BATCH_SIZE = 50; // Process 50 chunks at a time
    const allEmbeddings: number[][] = [];

    try {
      // Process in batches
      for (let i = 0; i < texts.length; i += BATCH_SIZE) {
        const batch = texts.slice(i, i + BATCH_SIZE);
        console.log(`[EmbeddingService] Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(texts.length / BATCH_SIZE)} (${batch.length} texts)`);
        
        // Process each text in the batch with Promise.all
        if (useMockEmbeddings()) {
          // Generate simple deterministic embeddings for each text in the batch
          const batchEmbeddings = batch.map(text => {
            const seed = text.length;
            const len = 16;
            return Array.from({ length: len }, (_, i) => ((seed + i * 13) % 100) / 100);
          });
          allEmbeddings.push(...batchEmbeddings);
        } else {
          const batchPromises = batch.map(text => 
            getGeminiClient().models.embedContent({
              model: this.EMBEDDING_MODEL,
              contents: text,
            })
          );

          const results = await Promise.all(batchPromises);
          const batchEmbeddings = results.map(result => {
            if (!result.embeddings || !result.embeddings[0]?.values) {
              throw new Error('Invalid embedding response from Gemini API');
            }
            return result.embeddings[0].values;
          });
          allEmbeddings.push(...batchEmbeddings);
        }
      }

      return allEmbeddings;
    } catch (error: any) {
      console.error('Error generating embeddings:', error);
      console.error('Error details:', error.message);
      throw new Error(`Failed to generate embeddings: ${error.message}`);
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      magnitudeA += vecA[i] * vecA[i];
      magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }
}
