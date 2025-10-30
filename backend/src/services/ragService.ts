import { GoogleGenAI } from '@google/genai';
import { getGeminiKey } from '../config/env';
import { ChatMessage, Source } from '../types';
import { storage } from '../utils/storage';
import { EmbeddingService } from './embeddingService';

let geminiClient: GoogleGenAI | null = null;

const getGeminiClient = (): GoogleGenAI => {
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: getGeminiKey(),
    });
  }
  return geminiClient;
};

export class RAGService {
  private static readonly TOP_K_CHUNKS = 5; // Increased for better context
  private static readonly SIMILARITY_THRESHOLD = 0.3; // Filter low-relevance chunks
  private static readonly GEMINI_MODEL = 'gemini-2.5-flash';

  /**
   * Process a chat query using RAG with enhanced retrieval
   */
  static async processQuery(
    query: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<{ response: string; sources: Source[] }> {
    // Check if there are any documents
    const allChunks = storage.getAllChunks();
    if (allChunks.length === 0) {
      return {
        response: "I don't have any documents to reference. Please upload some documents first.",
        sources: [],
      };
    }

    console.log(`[RAGService] Processing query: "${query}"`);
    console.log(`[RAGService] Total chunks available: ${allChunks.length}`);

    // Preprocess query for better matching
    const processedQuery = this.preprocessQuery(query);
    
    // Generate embedding for the query
    const queryEmbedding = await EmbeddingService.generateEmbedding(processedQuery);

    // Find most relevant chunks
    const relevantChunks = this.findRelevantChunks(queryEmbedding, allChunks);

    if (relevantChunks.length === 0) {
      return {
        response: "I couldn't find relevant information in the uploaded documents to answer your question. Please try rephrasing your question or upload more relevant documents.",
        sources: [],
      };
    }

    // Build context from relevant chunks
    const context = this.buildContext(relevantChunks);

    // Generate response using Gemini
    const response = await this.generateResponse(
      query,
      context,
      conversationHistory
    );

    // Build sources
    const sources = this.buildSources(relevantChunks);

    return { response, sources };
  }

  /**
   * Preprocess query to improve matching
   */
  private static preprocessQuery(query: string): string {
    // Expand common abbreviations and add context
    let processed = query.trim();
    
    // Add question context if it's very short
    if (processed.split(' ').length <= 3) {
      // For short queries, add context words to improve embedding
      processed = `What is ${processed}? Explain ${processed} in detail.`;
    }
    
    return processed;
  }

  /**
   * Find the most relevant chunks using cosine similarity with threshold filtering
   */
  private static findRelevantChunks(
    queryEmbedding: number[],
    allChunks: any[]
  ): any[] {
    // Calculate similarity for each chunk
    const chunksWithSimilarity = allChunks.map(chunk => ({
      ...chunk,
      similarity: EmbeddingService.cosineSimilarity(
        queryEmbedding,
        chunk.embedding
      ),
    }));

    // Sort by similarity (descending), filter by threshold, and take top K
    const relevantChunks = chunksWithSimilarity
      .filter(chunk => chunk.similarity >= this.SIMILARITY_THRESHOLD)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, this.TOP_K_CHUNKS);

    console.log(`[RAGService] Found ${relevantChunks.length} relevant chunks (threshold: ${this.SIMILARITY_THRESHOLD})`);
    if (relevantChunks.length > 0) {
      console.log(`[RAGService] Top similarity scores: ${relevantChunks.map(c => c.similarity.toFixed(3)).join(', ')}`);
    }

    return relevantChunks;
  }

  /**
   * Build context string from relevant chunks with enhanced metadata
   */
  private static buildContext(relevantChunks: any[]): string {
    if (relevantChunks.length === 0) {
      return 'No relevant context found in the uploaded documents.';
    }

    // Group chunks by document for better organization
    const chunksByDoc = new Map<string, any[]>();
    relevantChunks.forEach(chunk => {
      const docId = chunk.documentId;
      if (!chunksByDoc.has(docId)) {
        chunksByDoc.set(docId, []);
      }
      chunksByDoc.get(docId)!.push(chunk);
    });

    // Build context with document grouping
    const contextParts: string[] = [];
    
    chunksByDoc.forEach((chunks, docId) => {
      const document = storage.getDocument(docId);
      const docName = document?.originalName || 'Unknown Document';
      
      contextParts.push(`\n=== Document: ${docName} ===`);
      
      chunks.forEach((chunk, idx) => {
        const chunkNum = chunk.metadata.chunkIndex + 1;
        const totalChunks = chunk.metadata.totalChunks;
        const relevance = Math.round(chunk.similarity * 100);
        
        contextParts.push(
          `\n[Chunk ${chunkNum}/${totalChunks} - Relevance: ${relevance}%]\n${chunk.text}`
        );
      });
    });

    return contextParts.join('\n\n');
  }

  /**
   * Generate response using Google Gemini with enhanced prompting
   */
  private static async generateResponse(
    query: string,
    context: string,
    conversationHistory: ChatMessage[]
  ): Promise<string> {
    const systemInstruction = `You are an intelligent document analysis assistant. Your role is to:

1. **Comprehensively understand** the provided document context
2. **Answer questions accurately** based on the full context, not just keywords
3. **Synthesize information** from multiple chunks when needed
4. **Explain concepts clearly** even if they're technical
5. **Cite sources** by mentioning the document name
6. **Admit limitations** if the context lacks sufficient information

Guidelines:
- Read ALL provided chunks carefully before answering
- Connect related information across different chunks
- Provide detailed, informative answers
- Use examples from the documents when helpful
- If a term appears in the document title or metadata, check the actual content for its meaning
- For acronyms or abbreviations, look for their full forms in the context
- If you don't find the answer in the context, say "Based on the provided documents, I don't have enough information about [topic]."

Remember: You have access to the FULL document context, not just isolated keywords.`;

    try {
      // Build conversation history for Gemini
      const history: Array<{ role: string; parts: Array<{ text: string }> }> = [];
      
      // Add recent conversation history (last 5 messages)
      const recentHistory = conversationHistory.slice(-5);
      recentHistory.forEach(msg => {
        history.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      });

      // Create chat session with history
      const chat = getGeminiClient().chats.create({
        model: this.GEMINI_MODEL,
        history: history,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.4, // Lower temperature for more focused answers
          maxOutputTokens: 800, // Increased for more detailed responses
          topP: 0.95,
          topK: 40,
          thinkingConfig: {
            thinkingBudget: 0, // Disable thinking for faster responses
          },
        },
      });

      // Build enhanced prompt with query expansion hints
      const userPrompt = `Here is the relevant context from the uploaded documents:

${context}

---

Question: ${query}

Instructions: Analyze the full context above carefully. Look for direct answers, related concepts, definitions, and explanations. Provide a comprehensive answer based on what you find.`;

      const response = await chat.sendMessage({ message: userPrompt });

      return response.text || 'No response generated.';
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }

  /**
   * Build sources array from relevant chunks
   */
  private static buildSources(relevantChunks: any[]): Source[] {
    return relevantChunks.map(chunk => {
      const document = storage.getDocument(chunk.documentId);
      return {
        documentId: chunk.documentId,
        documentName: document?.originalName || 'Unknown Document',
        chunkId: chunk.id,
        text: chunk.text,
        similarity: chunk.similarity,
      };
    });
  }
}
